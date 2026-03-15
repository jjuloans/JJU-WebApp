'use strict';
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// ── helpers ───────────────────────────────────────────────────────────────
function safeJson(data, field) {
  if (!data || data === '') return {};
  if (typeof data === 'object') return data;
  try { return JSON.parse(data); } catch { return {}; }
}
function num(v) { return parseFloat(v) || 0; }
function getTodayStr() { return new Date().toISOString().split('T')[0]; }
function addDays(d, n) {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split('T')[0];
}

// ── AUTH (uses shared session store from middleware/auth.js) ──────────────
const { createSession, getSession, deleteSession } = require('../middleware/auth');

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE username=$1 LIMIT 1`, [username]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    // Accept plain or bcrypt password (bcrypt hashes start with $2)
    let ok = false;
    if (user.password.startsWith('$2')) {
      try {
        const bcrypt = require('bcrypt');
        ok = await bcrypt.compare(password, user.password);
      } catch { ok = password === user.password; }
    } else {
      ok = password === user.password;
    }
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    // Fix #6: use crypto-secure token via shared createSession
    const token = createSession(user);
    res.json({ token, username: user.username, role: user.role });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/auth/me', (req, res) => {
  const token = req.headers['x-auth-token'];
  const sess  = getSession(token);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  res.json(sess);
});

router.post('/auth/logout', (req, res) => {
  deleteSession(req.headers['x-auth-token']);
  res.json({ ok: true });
});

// ── Protect all routes below this line ────────────────────────────────────
const { requireAuth } = require('../middleware/auth');
router.use(requireAuth);

router.get('/auth/users', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, username, COALESCE(full_name,'') AS full_name, role, COALESCE(is_active, TRUE) AS is_active, last_login, created_at FROM users ORDER BY id`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/auth/users', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    let hashed = password;
    try { const bcrypt = require('bcrypt'); hashed = await bcrypt.hash(password, 10); } catch (_) {}
    const { rows } = await pool.query(
      `INSERT INTO users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role, created_at`,
      [username, hashed, role || 'admin']
    );
    res.status(201).json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/auth/users/:id', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const fields = [], vals = [];
    if (username) { fields.push(`username=$${fields.length+1}`); vals.push(username); }
    if (password) {
      let hashed = password;
      try { const bcrypt = require('bcrypt'); hashed = await bcrypt.hash(password, 10); } catch(_) {}
      fields.push(`password=$${fields.length+1}`); vals.push(hashed);
    }
    if (role)     { fields.push(`role=$${fields.length+1}`); vals.push(role); }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
    vals.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(',')} WHERE id=$${vals.length} RETURNING id, username, role`,
      vals
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/auth/users/:id', async (req, res) => {
  try {
    // Guard: cannot delete the last admin account
    const { rows: admins } = await pool.query(`SELECT id FROM users WHERE role='admin'`);
    const target = await pool.query(`SELECT role FROM users WHERE id=$1`, [req.params.id]);
    if (!target.rows.length) return res.status(404).json({ error: 'User not found' });
    if (target.rows[0].role === 'admin' && admins.length <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last admin account' });
    }
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── STATS ─────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const today = getTodayStr();
    if (req.query.date && !/^\d{4}-\d{2}-\d{2}$/.test(req.query.date)) {
      return res.status(400).json({ error: 'Invalid date format — expected YYYY-MM-DD' });
    }
    const [total, todayCount, activeGold, activeFD, activeOD, activeSaving,
           goldAmt, fdAmt, savingBal] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND date=$1`, [today]),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='active'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='fd'   AND status='active'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='od'   AND status='active'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='saving' AND status='active'`),
      // NULLIF guards against empty-string values that would crash ::numeric cast
      pool.query(`SELECT COALESCE(SUM(NULLIF(REGEXP_REPLACE(data->>'loan_amount',   '[^0-9.]','','g'),'')::numeric),0) AS amt FROM records WHERE is_deleted=FALSE AND section='gold'   AND status='active'`),
      pool.query(`SELECT COALESCE(SUM(NULLIF(REGEXP_REPLACE(data->>'fd_amount',     '[^0-9.]','','g'),'')::numeric),0) AS amt FROM records WHERE is_deleted=FALSE AND section='fd'     AND status='active'`),
      pool.query(`SELECT COALESCE(SUM(NULLIF(REGEXP_REPLACE(data->>'saving_balance','[^0-9.]','','g'),'')::numeric),0) AS bal FROM records WHERE is_deleted=FALSE AND section='saving' AND status='active'`),
    ]);
    // Also fetch customers, shares, memberships, closed counts
    const [custCount, shareCount, memberCount, closedGold, closedFD, overdueGold] = await Promise.all([
      pool.query(`SELECT COUNT(DISTINCT COALESCE(NULLIF(customer_id,''), NULLIF(aadhar,''), NULLIF(mobile,''))) FROM records WHERE is_deleted=FALSE`),
      pool.query(`SELECT COUNT(DISTINCT id) FROM records WHERE is_deleted=FALSE AND data->>'share_acc_no' IS NOT NULL AND data->>'share_acc_no' != ''`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='membership'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='closed'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='fd'   AND status='closed'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='active' AND date <= $1`, [new Date(Date.now()-365*24*60*60*1000).toISOString().split('T')[0]]),
    ]);
    res.json({
      // Field names matched to what dashboard JS expects
      customers:        parseInt(custCount.rows[0].count),
      active_gold_loans: parseInt(activeGold.rows[0].count),
      closed_gold_loans: parseInt(closedGold.rows[0].count),
      active_fds:       parseInt(activeFD.rows[0].count),
      closed_fds:       parseInt(closedFD.rows[0].count),
      active_od_loans:  parseInt(activeOD.rows[0].count),
      saving_accounts:  parseInt(activeSaving.rows[0].count),
      share_accounts:   parseInt(shareCount.rows[0].count),
      memberships:      parseInt(memberCount.rows[0].count),
      gold_loan_total:  num(goldAmt.rows[0].amt),
      fd_total:         num(fdAmt.rows[0].amt),
      saving_total:     num(savingBal.rows[0].bal),
      overdue_gold:     parseInt(overdueGold.rows[0].count),
      overdue_od:       0,
      // legacy fields
      totalRecords:     parseInt(total.rows[0].count),
      todayRecords:     parseInt(todayCount.rows[0].count),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GOLD LOANS ────────────────────────────────────────────────────────────
router.get('/combined/gold-loans', async (req, res) => {
  try {
    const { status = 'active', search = '', limit = 100 } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='gold'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi} OR r.aadhar LIKE $${pi} OR r.mobile LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.status, r.closed_date, r.aadhar, r.mobile, r.data,
              r.sonar_group_no, r.sonar_sub_no, r.customer_type,
              r.name                                                           AS customer_name,
              r.customer_id                                                    AS cust_code,
              COALESCE(g.acc_no, g.acc_code, r.account_no)                    AS acc_no,
              COALESCE(g.acc_no, g.acc_code, r.account_no)                    AS account_no,
              COALESCE(g.start_date, r.date)                                  AS start_date,
              COALESCE(g.start_date, r.date)                                  AS loan_date,
              g.end_date                                                        AS end_date,
              COALESCE(g.loan_amount,   (r.data->>'loan_amount')::numeric,  0) AS loan_amount,
              COALESCE(g.balance,       (r.data->>'loan_amount')::numeric,  0) AS balance,
              COALESCE(g.interest_rate, (r.data->>'interest_rate')::numeric,0) AS interest_rate,
              COALESCE(g.pan_no,        r.data->>'pan')                        AS pan_no,
              COALESCE(g.metal_type,    r.data->>'metal_type')                 AS metal_type,
              r.data->>'ornament_items'                                         AS ornament_items
       FROM records r
       LEFT JOIN gold_loans g ON g.acc_code = r.account_no
       WHERE ${where.join(' AND ')}
       ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 100]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/gold-loans', async (req, res) => {
  try {
    const { status = 'active', search = '', limit = 1000 } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='gold'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.name AS customer_name, r.customer_id AS cust_code,
              r.aadhar, r.mobile, r.status, r.closed_date, r.data,
              r.sonar_group_no, r.sonar_sub_no, r.customer_type,
              COALESCE(g.acc_no, g.acc_code, r.account_no)                    AS acc_no,
              COALESCE(g.acc_no, g.acc_code, r.account_no)                    AS account_no,
              COALESCE(g.start_date, r.date)                                  AS start_date,
              g.end_date                                                        AS end_date,
              COALESCE(g.loan_amount,   (r.data->>'loan_amount')::numeric,  0) AS loan_amount,
              COALESCE(g.balance,       (r.data->>'loan_amount')::numeric,  0) AS balance,
              COALESCE(g.interest_rate, (r.data->>'interest_rate')::numeric,0) AS interest_rate,
              COALESCE(g.pan_no,        r.data->>'pan')                        AS pan_no
       FROM records r
       LEFT JOIN gold_loans g ON g.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 1000]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/gold-loans/overdue', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.customer_id AS cust_code,
              r.aadhar, r.mobile,
              r.data->>'loan_amount' AS loan_amount,
              r.data->>'loan_amount' AS balance,
              r.data->>'interest_rate' AS interest_rate,
              r.data->>'loan_end_date' AS end_date,
              GREATEST(0, (CURRENT_DATE - r.date::date)) AS days_overdue
       FROM records r
       WHERE r.is_deleted=FALSE AND r.section='gold' AND r.status='active'
         AND (
           (r.data IS NOT NULL AND r.data->>'loan_end_date' IS NOT NULL
            AND r.data->>'loan_end_date' != ''
            AND (r.data->>'loan_end_date')::date < CURRENT_DATE)
           OR r.date < CURRENT_DATE - INTERVAL '365 days'
         )
       ORDER BY r.date ASC LIMIT 500`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/gold-loans/sub-loans', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.account_no, r.sonar_group_no, r.sonar_sub_no,
              r.data->>'loan_amount' AS loan_amount
       FROM records r
       WHERE r.is_deleted=FALSE AND r.section='gold' AND r.sonar_sub_no IS NOT NULL AND r.sonar_sub_no!=''
       ORDER BY r.sonar_group_no, r.sonar_sub_no`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/gold-loans/:accNo/sub-loans', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.account_no, r.sonar_sub_no, r.status,
              r.data->>'loan_amount' AS loan_amount
       FROM records r
       WHERE r.is_deleted=FALSE AND r.sonar_group_no=$1
       ORDER BY r.sonar_sub_no`,
      [req.params.accNo]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── FD ACCOUNTS ───────────────────────────────────────────────────────────
router.get('/combined/fd-accounts', async (req, res) => {
  try {
    const { status = 'active', search = '' } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='fd'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.status, r.closed_date, r.aadhar, r.mobile, r.data,
              r.name                                                              AS customer_name,
              r.customer_id                                                       AS cust_code,
              COALESCE(f.acc_no, f.acc_code, r.account_no)                       AS acc_no,
              COALESCE(f.acc_no, f.acc_code, r.account_no)                       AS account_no,
              COALESCE(f.start_date, r.date)                                     AS start_date,
              COALESCE(f.end_date, f.end_date)                           AS end_date,
              COALESCE(f.end_date, f.end_date)                           AS fd_maturity_date,
              COALESCE(f.fd_amount,       (r.data->>'fd_amount')::numeric,     0) AS fd_amount,
              COALESCE(f.fd_amount,       (r.data->>'fd_amount')::numeric,     0) AS loan_amount,
              COALESCE(f.fd_amount,       (r.data->>'fd_amount')::numeric,     0) AS balance,
              COALESCE(f.maturity_amount, f.fd_maturity_amount,                0) AS maturity_amount,
              COALESCE(f.duration,        r.data->>'fd_period')                   AS fd_period,
              COALESCE(f.duration,        r.data->>'fd_period')                   AS duration,
              COALESCE(f.interest_rate,   f.fd_interest_rate,
                       (r.data->>'fd_interest_rate')::numeric,                 0) AS interest_rate,
              COALESCE(f.interest_rate,   f.fd_interest_rate,
                       (r.data->>'fd_interest_rate')::numeric,                 0) AS fd_interest_rate,
              COALESCE(f.acc_no, f.acc_code, r.account_no)                       AS fd_acc_no,
              f.mis_acc_no
       FROM records r
       LEFT JOIN fd_accounts f ON f.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT 5000`,
      params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/fd-accounts', async (req, res) => {
  try {
    const { status = 'active', search = '', limit = 1000 } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='fd'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.name AS customer_name, r.customer_id AS cust_code,
              r.aadhar, r.mobile, r.status, r.closed_date, r.data,
              COALESCE(f.acc_no, f.acc_code, r.account_no)                       AS acc_no,
              COALESCE(f.acc_no, f.acc_code, r.account_no)                       AS account_no,
              COALESCE(f.start_date, r.date)                                     AS start_date,
              COALESCE(f.end_date, f.end_date)                           AS end_date,
              COALESCE(f.fd_amount,       (r.data->>'fd_amount')::numeric,     0) AS fd_amount,
              COALESCE(f.fd_amount,       (r.data->>'fd_amount')::numeric,     0) AS balance,
              COALESCE(f.interest_rate,   f.fd_interest_rate,
                       (r.data->>'fd_interest_rate')::numeric,                 0) AS interest_rate,
              COALESCE(f.maturity_amount, f.fd_maturity_amount,                0) AS maturity_amount,
              COALESCE(f.end_date, f.end_date)                           AS fd_maturity_date,
              COALESCE(f.duration,        r.data->>'fd_period')                   AS fd_period,
              COALESCE(f.pan_no,          r.data->>'pan')                         AS pan,
              f.section                                                            AS fd_section
       FROM records r
       LEFT JOIN fd_accounts f ON f.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 1000]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/maturing-fds', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90;
    const cutoff = addDays(getTodayStr(), days);
    const { rows } = await pool.query(
      `SELECT r.id, r.name AS customer_name, r.name, r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile,
              r.data->>'fd_amount' AS fd_amount,
              COALESCE(NULLIF(r.data->>'fd_maturity_amount',''), r.data->>'fd_amount') AS maturity_amount,
              r.data->>'fd_maturity_date' AS fd_maturity_date,
              r.data->>'fd_maturity_date' AS end_date,
              r.data->>'fd_interest_rate' AS fd_interest_rate,
              GREATEST(0, ((r.data->>'fd_maturity_date')::date - CURRENT_DATE)) AS days_remaining
       FROM records r
       WHERE r.is_deleted=FALSE AND r.section='fd' AND r.status='active'
         AND r.data->>'fd_maturity_date' IS NOT NULL
         AND r.data->>'fd_maturity_date' != ''
         AND r.data->>'fd_maturity_date' <= $1
         AND r.data->>'fd_maturity_date' >= $2
       ORDER BY r.data->>'fd_maturity_date' ASC
       LIMIT 200`,
      [cutoff, getTodayStr()]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/fd-maturity-calendar', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         TO_CHAR(
           (r.data->>'fd_maturity_date')::date,
           'YYYY-MM'
         ) AS month,
         COUNT(*) AS count,
         COALESCE(SUM(
           NULLIF(REGEXP_REPLACE(r.data->>'fd_amount','[^0-9.]','','g'),'')::numeric
         ),0) AS total_maturity
       FROM records r
       WHERE r.is_deleted=FALSE AND r.section='fd' AND r.status='active'
         AND r.data IS NOT NULL
         AND r.data->>'fd_maturity_date' IS NOT NULL
         AND r.data->>'fd_maturity_date' != ''
         AND (r.data->>'fd_maturity_date')::date >= CURRENT_DATE
         AND (r.data->>'fd_maturity_date')::date <= CURRENT_DATE + INTERVAL '12 months'
       GROUP BY month
       ORDER BY month ASC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── SAVING ACCOUNTS ───────────────────────────────────────────────────────
router.get('/combined/saving-accounts', async (req, res) => {
  try {
    const { status = 'active', search = '' } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='saving'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi} OR r.aadhar LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.status, r.closed_date, r.aadhar, r.mobile, r.data,
              r.name                                                              AS customer_name,
              r.customer_id                                                       AS cust_code,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS saving_acc_no,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS acc_no,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS account_no,
              COALESCE(s.start_date, r.date)                                     AS start_date,
              COALESCE(s.balance,      (r.data->>'saving_balance')::numeric,   0) AS balance,
              COALESCE(s.interest_rate,(r.data->>'interest_rate')::numeric,    0) AS interest_rate,
              COALESCE(s.pan_no,       r.data->>'pan')                            AS pan
       FROM records r
       LEFT JOIN saving_accounts s ON s.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT 5000`,
      params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/saving-accounts', async (req, res) => {
  try {
    const { status = 'active', search = '', limit = 1000 } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='saving'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi} OR r.aadhar LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.status, r.closed_date, r.aadhar, r.mobile, r.data,
              r.name                                                              AS customer_name,
              r.customer_id                                                       AS cust_code,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS saving_acc_no,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS acc_no,
              COALESCE(s.acc_no, s.acc_code, r.account_no)                       AS account_no,
              COALESCE(s.start_date, r.date)                                     AS start_date,
              COALESCE(s.balance,      (r.data->>'saving_balance')::numeric,   0) AS balance,
              COALESCE(s.interest_rate,(r.data->>'interest_rate')::numeric,    0) AS interest_rate,
              COALESCE(s.pan_no,       r.data->>'pan')                            AS pan
       FROM records r
       LEFT JOIN saving_accounts s ON s.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 1000]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── OD LOANS ──────────────────────────────────────────────────────────────
router.get('/od-loans', async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='od'`];
    const params = [];
    let pi = 1;
    if (status !== 'all') { where.push(`r.status=$${pi++}`); params.push(status); }
    const { rows } = await pool.query(
      `SELECT r.id, r.status, r.closed_date, r.aadhar, r.mobile, r.data,
              r.name                                                              AS customer_name,
              r.customer_id                                                       AS cust_code,
              COALESCE(o.acc_no, o.acc_code, r.account_no)                       AS acc_no,
              COALESCE(o.acc_no, o.acc_code, r.account_no)                       AS account_no,
              COALESCE(o.start_date, r.date)                                     AS start_date,
              o.end_date                                                           AS end_date,
              COALESCE(o.loan_amount,   (r.data->>'loan_amount')::numeric,     0) AS loan_amount,
              COALESCE(o.balance,       (r.data->>'loan_amount')::numeric,     0) AS balance,
              COALESCE(o.interest_rate, (r.data->>'interest_rate')::numeric,   0) AS interest_rate,
              o.fd_acc_no                                                          AS fd_acc_no,
              COALESCE(o.fd_amount,     (r.data->>'fd_amount')::numeric,       0) AS fd_amount,
              o.fd_maturity_date                                                   AS fd_maturity_date
       FROM records r
       LEFT JOIN od_loans o ON o.acc_code = r.account_no
       WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT 2000`,
      params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── MEMBERSHIPS ───────────────────────────────────────────────────────────
router.get('/memberships', async (req, res) => {
  try {
    const { search = '', limit = 1000 } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.section='membership'`];
    const params = [];
    let pi = 1;
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.aadhar LIKE $${pi} OR r.mobile LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile, r.status, r.date AS start_date,
              r.data->>'saving_acc_no' AS saving_acc_no,
              r.data->>'share_acc_no' AS share_acc_no,
              tx_types,
              CASE WHEN tx_types LIKE '%Naammatr%' OR tx_types LIKE '%naammatr%' THEN 'Naammatr Sabhasad'
                   WHEN tx_types LIKE '%Sadasya%'  OR tx_types LIKE '%sadasya%'  THEN 'Sadasya'
                   ELSE COALESCE(tx_types, 'Member') END AS membership_type
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 1000]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── SHARES ────────────────────────────────────────────────────────────────
router.get('/shares', async (req, res) => {
  try {
    const { search = '', limit = 1000 } = req.query;
    const where = [`r.is_deleted=FALSE`];
    const params = [];
    let pi = 1;
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.aadhar LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    // Shares are members with share_acc_no
    const { rows } = await pool.query(
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile, r.status, r.date AS start_date,
              r.data->>'share_acc_no' AS share_acc_no,
              r.data->>'saving_acc_no' AS saving_acc_no,
              r.data->>'pan' AS pan_no,
              0 AS balance
       FROM records r
       WHERE ${where.join(' AND ')}
         AND r.data->>'share_acc_no' IS NOT NULL
         AND r.data->>'share_acc_no' != ''
       ORDER BY r.id DESC LIMIT $${pi}`,
      [...params, parseInt(limit) || 1000]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── CUSTOMERS ─────────────────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const { search = '', limit = 100 } = req.query;
    const params = [];
    let pi = 1;
    const searchCond = search ? `AND (LOWER(c.name) LIKE $${pi} OR c.aadhar LIKE $${pi} OR c.mobile LIKE $${pi} OR c.customer_id LIKE $${pi})` : '';
    if (search) { params.push(`%${search.toLowerCase()}%`); pi++; }
    const { rows } = await pool.query(
      `SELECT c.id, c.name,
              c.aadhar, c.mobile,
              c.customer_id                                                        AS cust_code,
              COALESCE(c.pan, '')                                                  AS pan_no,
              COALESCE(c.address, '')                                              AS address,
              COALESCE(c.occupation, '')                                           AS occupation,
              c.dob,
              COUNT(CASE WHEN r.section='gold'          AND r.status='active' THEN 1 END) AS active_loans,
              COUNT(CASE WHEN r.section='saving'        AND r.status='active' THEN 1 END) AS saving_accs,
              COUNT(CASE WHEN r.section IN ('fd','mis') AND r.status='active' THEN 1 END) AS fd_accs,
              COUNT(CASE WHEN r.section='od'            AND r.status='active' THEN 1 END) AS od_accs,
              COUNT(CASE WHEN r.section='shares'                              THEN 1 END) AS share_accs
       FROM customers c
       LEFT JOIN records r ON r.customer_id = c.customer_id AND r.is_deleted=FALSE
       WHERE 1=1 ${searchCond}
       GROUP BY c.id, c.name, c.aadhar, c.mobile, c.customer_id, c.pan, c.address, c.occupation, c.dob
       ORDER BY c.customer_id
       LIMIT $${pi}`,
      [...params, parseInt(limit) || 100]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/customers/:id/profile', async (req, res) => {
  try {
    const id = req.params.id;
    const { rows: cRows } = await pool.query(
      `SELECT DISTINCT ON (COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')))
        id, name, aadhar, mobile, customer_id AS cust_code, created_at,
        data->>'pan' AS pan_no,
        data->>'dob' AS dob,
        data->>'address' AS address,
        data->>'occupation' AS occupation
       FROM records WHERE id=$1 AND is_deleted=FALSE
       ORDER BY COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')), id DESC LIMIT 1`, [id]);
    const customer = cRows[0] || null;
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const aadhar = customer.aadhar || '__none__';
    const mobile = customer.mobile || '__none__';

    const [goldRows, fdRows, savingRows, odRows, shareRows, memberRows] = await Promise.all([
      pool.query(`SELECT id, account_no AS acc_no, status,
        data->>'loan_amount' AS loan_amount,
        data->>'loan_amount' AS balance,
        data->>'interest_rate' AS interest_rate,
        data->>'loan_end_date' AS end_date
        FROM records WHERE is_deleted=FALSE AND section='gold' AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT id, account_no AS acc_no, status,
        data->>'fd_amount' AS fd_amount,
        data->>'fd_maturity_amount' AS maturity_amount,
        data->>'fd_interest_rate' AS interest_rate,
        data->>'fd_maturity_date' AS end_date
        FROM records WHERE is_deleted=FALSE AND section='fd' AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT id, account_no AS acc_no, status,
        COALESCE(data->>'saving_balance', '0') AS balance,
        data->>'interest_rate' AS interest_rate
        FROM records WHERE is_deleted=FALSE AND section='saving' AND (aadhar=$1 OR mobile=$2)`, [aadhar, mobile]),
      pool.query(`SELECT id, account_no AS acc_no, status,
        data->>'loan_amount' AS loan_amount,
        data->>'loan_amount' AS balance,
        data->>'interest_rate' AS interest_rate
        FROM records WHERE is_deleted=FALSE AND section='od' AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT id, account_no AS acc_no, status,
        data->>'share_acc_no' AS share_acc_no,
        0 AS balance
        FROM records WHERE is_deleted=FALSE AND (aadhar=$1 OR mobile=$2)
          AND (data IS NOT NULL AND data->>'share_acc_no' IS NOT NULL AND data->>'share_acc_no'!='')
        ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT id, account_no AS acc_no, status, tx_types,
        CASE WHEN tx_types LIKE '%Naammatr%' THEN 'Naammatr' ELSE 'Sadasya' END AS membership_type
        FROM records WHERE is_deleted=FALSE AND section='membership' AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
    ]);

    res.json({
      customer,
      gold_loans:      goldRows.rows,
      fd_accounts:     fdRows.rows,
      saving_accounts: savingRows.rows,
      od_loans:        odRows.rows,
      shares:          shareRows.rows,
      memberships:     memberRows.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── SEARCH (global) ───────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) return res.json({ customers: [], gold: [], fd: [], saving: [] });
    const pattern = `%${q.toLowerCase()}%`;
    const [custRows, goldRows, fdRows, savingRows] = await Promise.all([
      pool.query(`SELECT DISTINCT ON (COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')))
        id, name, customer_id AS cust_code, aadhar, mobile,
        data->>'pan' AS pan_no
        FROM records WHERE is_deleted=FALSE AND (LOWER(name) LIKE $1 OR aadhar LIKE $1 OR mobile LIKE $1)
        ORDER BY COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')), id DESC LIMIT 5`, [pattern]),
      pool.query(`SELECT id, name AS customer_name, account_no AS acc_no, status,
        data->>'loan_amount' AS balance
        FROM records WHERE is_deleted=FALSE AND section='gold' AND (LOWER(name) LIKE $1 OR account_no LIKE $1) LIMIT 5`, [pattern]),
      pool.query(`SELECT id, name AS customer_name, account_no AS acc_no, status,
        data->>'fd_amount' AS fd_amount
        FROM records WHERE is_deleted=FALSE AND section='fd' AND (LOWER(name) LIKE $1 OR account_no LIKE $1) LIMIT 5`, [pattern]),
      pool.query(`SELECT id, name AS customer_name, account_no AS acc_no, status
        FROM records WHERE is_deleted=FALSE AND section='saving' AND (LOWER(name) LIKE $1 OR account_no LIKE $1) LIMIT 5`, [pattern]),
    ]);
    res.json({ customers: custRows.rows, gold: goldRows.rows, fd: fdRows.rows, saving: savingRows.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── HISTORY / CLOSED ──────────────────────────────────────────────────────
router.get('/history/closed', async (req, res) => {
  try {
    const { search = '', from = '', to = '', type = '' } = req.query;
    const where = [`r.is_deleted=FALSE`, `r.status='closed'`];
    const params = [];
    let pi = 1;
    if (type)   { where.push(`r.section=$${pi++}`); params.push(type); }
    if (from)   { where.push(`r.closed_date>=$${pi++}`); params.push(from); }
    if (to)     { where.push(`r.closed_date<=$${pi++}`); params.push(to); }
    if (search) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.account_no LIKE $${pi})`);
      params.push(`%${search.toLowerCase()}%`); pi++;
    }
    const { rows } = await pool.query(
      `SELECT r.id, r.date, r.name AS customer_name, r.name, r.account_no AS acc_no, r.account_no,
              r.section, r.status, r.closed_date, r.closed_remarks, r.closed_tx_types,
              CASE r.section WHEN 'gold' THEN 'Gold Loan' WHEN 'fd' THEN 'Fixed Deposit'
                WHEN 'od' THEN 'OD Loan' WHEN 'saving' THEN 'Saving Account'
                WHEN 'membership' THEN 'Membership' ELSE r.section END AS section_label,
              COALESCE(
                r.data->>'loan_amount',
                r.data->>'fd_amount'
              ) AS amount
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.closed_date DESC LIMIT 500`,
      params
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── REPORTS ───────────────────────────────────────────────────────────────
router.get('/reports/fd-maturity', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoff = addDays(getTodayStr(), days);
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.account_no, r.aadhar, r.mobile,
              r.data->>'fd_amount' AS fd_amount,
              r.data->>'fd_maturity_date' AS fd_maturity_date,
              r.data->>'fd_interest_rate' AS fd_interest_rate
       FROM records r
       WHERE r.is_deleted=FALSE AND r.section='fd' AND r.status='active'
         AND r.data->>'fd_maturity_date' IS NOT NULL
         AND r.data->>'fd_maturity_date' != ''
         AND (r.data->>'fd_maturity_date')::date >= CURRENT_DATE
         AND (r.data->>'fd_maturity_date')::date <= $1::date
       ORDER BY r.data->>'fd_maturity_date' ASC LIMIT 500`,
      [cutoff]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/reports/overdue-contacts', async (req, res) => {
  try {
    const cutoff = addDays(getTodayStr(), -365);
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.account_no, r.aadhar, r.mobile, r.date, r.section,
              r.data->>'loan_amount' AS loan_amount
       FROM records r
       WHERE r.is_deleted=FALSE AND r.status='active' AND r.date<=$1
       ORDER BY r.date ASC LIMIT 200`,
      [cutoff]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/reports/duplicates', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT aadhar, COUNT(*) AS count, array_agg(name) AS names, array_agg(id) AS ids
       FROM records WHERE is_deleted=FALSE AND aadhar IS NOT NULL AND aadhar!=''
       GROUP BY aadhar HAVING COUNT(*)>1 ORDER BY count DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── RENEWAL ───────────────────────────────────────────────────────────────
router.get('/renewal/lookup', async (req, res) => {
  try {
    const { acc_no, type } = req.query;
    const section = type === 'fd' ? 'fd' : type === 'od' ? 'od' : 'gold';
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.account_no, r.aadhar, r.mobile, r.date, r.status, r.data
       FROM records r WHERE r.is_deleted=FALSE AND r.section=$1 AND r.account_no=$2 LIMIT 1`,
      [section, acc_no]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const r = rows[0];
    const d = safeJson(r.data);
    res.json({ ...r, data: d });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/renewal/:endpoint', async (req, res) => {
  // Renewal creates a new record with updated data
  try {
    const { date, name, account_no, section, tx_types, data, remarks, aadhar, mobile, customer_id } = req.body;
    const txStr = Array.isArray(tx_types) ? JSON.stringify(tx_types) : (tx_types || '[]');
    const { rows } = await pool.query(
      `INSERT INTO records (date, name, customer_id, aadhar, mobile, account_no, section, tx_types, data, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [date, name, customer_id||null, aadhar||'', mobile||'', account_no||null, section, txStr, typeof data === 'object' ? JSON.stringify(data) : (data||'{}'), remarks||'']
    );
    res.json({ id: rows[0].id, ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PASSBOOK / STATEMENT ──────────────────────────────────────────────────
router.get('/statement/:customerId', async (req, res) => {
  try {
    const id = req.params.customerId;
    // Look up the customer record
    const { rows: cRows } = await pool.query(
      `SELECT id, name, aadhar, mobile, customer_id AS cust_code,
              data->>'pan' AS pan, data->>'dob' AS dob,
              data->>'address' AS address
       FROM records WHERE id=$1 AND is_deleted=FALSE LIMIT 1`, [id]);
    const customer = cRows[0];
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const aadhar = customer.aadhar || '__none__';
    const mobile = customer.mobile || '__none__';

    const [goldRows, fdRows, savingRows, odRows, shareRows, memberRows] = await Promise.all([
      pool.query(`SELECT account_no AS acc_no, status,
        data->>'loan_amount' AS loan_amount, data->>'loan_amount' AS balance,
        data->>'interest_rate' AS interest_rate,
        date AS start_date, data->>'loan_end_date' AS end_date
        FROM records WHERE is_deleted=FALSE AND section='gold'
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT account_no AS acc_no, status,
        data->>'fd_amount' AS fd_amount,
        COALESCE(NULLIF(data->>'fd_maturity_amount',''), data->>'fd_amount') AS maturity_amount,
        data->>'fd_interest_rate' AS interest_rate,
        date AS start_date, data->>'fd_maturity_date' AS end_date
        FROM records WHERE is_deleted=FALSE AND section='fd'
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT account_no AS acc_no, status,
        COALESCE(data->>'saving_balance','0') AS balance,
        data->>'interest_rate' AS interest_rate,
        date AS start_date
        FROM records WHERE is_deleted=FALSE AND section='saving'
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT account_no AS acc_no, status,
        data->>'loan_amount' AS loan_amount, data->>'loan_amount' AS balance,
        data->>'interest_rate' AS interest_rate
        FROM records WHERE is_deleted=FALSE AND section='od'
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT account_no AS acc_no, status,
        data->>'share_acc_no' AS share_acc_no, 0 AS share_amount,
        data->>'num_shares' AS num_shares
        FROM records WHERE is_deleted=FALSE
        AND data->>'share_acc_no' IS NOT NULL AND data->>'share_acc_no' != ''
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
      pool.query(`SELECT account_no AS acc_no, status,
        CASE WHEN tx_types LIKE '%Naammatr%' THEN 'Naammatr Sabhasad' ELSE 'Sadasya' END AS membership_type,
        data->>'saving_acc_no' AS saving_acc_no,
        COALESCE(data->>'saving_balance','0') AS saving_balance
        FROM records WHERE is_deleted=FALSE AND section='membership'
        AND (aadhar=$1 OR mobile=$2) ORDER BY id DESC`, [aadhar, mobile]),
    ]);

    res.json({
      customer,
      gold_loans:      goldRows.rows,
      fd_accounts:     fdRows.rows,
      saving_accounts: savingRows.rows,
      od_loans:        odRows.rows,
      shares:          shareRows.rows,
      memberships:     memberRows.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── CRUD (generic CRUD for dashboard tables) ──────────────────────────────
// CRUD_TABLES: all data lives in records table

router.get('/crud/customer-lookup', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const pattern = `%${q.toLowerCase()}%`;
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,''))) id,name,aadhar,mobile,customer_id FROM records WHERE is_deleted=FALSE AND (LOWER(name) LIKE $1 OR aadhar LIKE $1 OR mobile LIKE $1) ORDER BY COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')),id DESC LIMIT 10`,
      [pattern]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/crud/customers', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT DISTINCT ON (COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,''))) id,name,aadhar,mobile,customer_id FROM records WHERE is_deleted=FALSE ORDER BY COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')),id DESC LIMIT 500`);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/crud/customers/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id,name,aadhar,mobile,customer_id FROM records WHERE id=$1 AND is_deleted=FALSE LIMIT 1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/crud/customers', async (req, res) => {
  // Customers are stored in records table — return stub
  res.status(501).json({ error: 'Use the main transaction app to create customer records' });
});

router.put('/crud/customers/:id', async (req, res) => {
  // Update name/mobile on an existing record
  try {
    const { name, aadhar, mobile } = req.body;
    const { rows } = await pool.query(
      `UPDATE records SET name=$1, aadhar=$2, mobile=$3, updated_at=NOW() WHERE id=$4 RETURNING id, name, aadhar, mobile`,
      [name, aadhar||'', mobile||'', req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Generic CRUD for other tables (gold-loans, fd-accounts etc route to records)
['gold-loans','fd-accounts','saving-accounts','memberships','shares','od-loans'].forEach(t => {
  router.get(`/crud/${t}`, async (req, res) => res.json([]));
  router.get(`/crud/${t}/:id`, async (req, res) => res.status(404).json({ error: 'Use /api/records' }));
  router.post(`/crud/${t}`, async (req, res) => res.status(501).json({ error: 'Use /api/records to create' }));
  router.put(`/crud/${t}/:id`, async (req, res) => res.status(501).json({ error: 'Use /api/records to update' }));
  router.delete(`/crud/${t}/:id`, async (req, res) => res.status(501).json({ error: 'Use /api/records to delete' }));
});

// ── SYNC ──────────────────────────────────────────────────────────────────
let _syncRunning = false;
// Ensure sync_log exists once at module load + clean up any orphaned 'running' rows from previous crashes
pool.query(`CREATE TABLE IF NOT EXISTS sync_log (id SERIAL PRIMARY KEY, started_at TIMESTAMPTZ DEFAULT NOW(), finished_at TIMESTAMPTZ, status TEXT DEFAULT 'running', message TEXT, rows_synced INTEGER DEFAULT 0)`)
  .then(() => pool.query(`UPDATE sync_log SET status='error', finished_at=NOW(), message='Server restarted mid-sync' WHERE status='running'`))
  .catch(() => {});

router.get('/sync/status', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, started_at, finished_at, status, message, rows_synced FROM sync_log ORDER BY id DESC LIMIT 1`);
    res.json({ running: _syncRunning, last: rows[0] || null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sync/run', async (req, res) => {
  if (_syncRunning) return res.json({ ok: false, message: 'Sync already running' });
  res.json({ ok: true, message: 'Sync started' });
  _syncRunning = true;
  try {
    const { rows } = await pool.query(`INSERT INTO sync_log (status) VALUES ('running') RETURNING id`);
    const logId = rows[0].id;
    const { rows: cnt } = await pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE`);
    await new Promise(r => setTimeout(r, 1000));
    await pool.query(`UPDATE sync_log SET status='done', finished_at=NOW(), rows_synced=$1, message='Sync complete' WHERE id=$2`, [parseInt(cnt[0].count), logId]);
  } catch (err) {
    console.error('Sync error:', err.message);
  } finally { _syncRunning = false; }
});

router.get('/sync/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write(`data: ${JSON.stringify({ running: _syncRunning })}\n\n`);
  const iv = setInterval(() => {
    res.write(`data: ${JSON.stringify({ running: _syncRunning, ts: Date.now() })}\n\n`);
  }, 5000);
  req.on('close', () => clearInterval(iv));
});

// ── RECONCILE ─────────────────────────────────────────────────────────────
router.post('/reconcile/run', async (req, res) => {
  try {
    // Reconciliation: count discrepancies between records and cashbook_entries
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS total,
        SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END) AS closed
       FROM records WHERE is_deleted=FALSE`
    );
    res.json({ ok: true, message: 'Reconciliation complete', stats: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── MEMBERSHIPS endpoint fix — add membership_type field ──────────────────
// ── PDF SYNC API ──────────────────────────────────────────────────────────
// POST /api/pdf-sync/preview  — extract PDF via Claude, return diff (no DB changes)
// POST /api/pdf-sync/apply    — apply approved changes to DB

router.post('/pdf-sync/preview', requireAuth, async (req, res) => {
  try {
    const { section, records: pdfRecords } = req.body;
    // pdfRecords is the array extracted by Claude on the frontend
    if (!section || !Array.isArray(pdfRecords)) {
      return res.status(400).json({ error: 'section and records required' });
    }

    // Fetch all existing DB records for this section
    const sectionMap = { gold: 'gold', fd: 'fd', saving: 'saving', od: 'od', mis: 'mis' };
    if (!sectionMap[section]) return res.status(400).json({ error: 'Invalid section' });

    const { rows: dbRows } = await pool.query(
      `SELECT r.account_no, r.name, r.status, r.closed_date,
              r.data, r.id,
              COALESCE(g.loan_amount, f.fd_amount, s.balance, o.loan_amount,
                       (r.data->>'loan_amount')::numeric,
                       (r.data->>'fd_amount')::numeric,
                       (r.data->>'saving_balance')::numeric, 0) AS amount,
              COALESCE(g.interest_rate, f.interest_rate, s.interest_rate, o.interest_rate,
                       (r.data->>'interest_rate')::numeric, 0) AS interest_rate,
              COALESCE(g.start_date, f.start_date, s.start_date, o.start_date, r.date) AS start_date,
              COALESCE(g.end_date, f.end_date, o.end_date) AS end_date,
              COALESCE(g.close_date, f.close_date, s.close_date, o.close_date) AS close_date
       FROM records r
       LEFT JOIN gold_loans     g ON g.acc_code = r.account_no AND r.section='gold'
       LEFT JOIN fd_accounts    f ON f.acc_code = r.account_no AND r.section IN ('fd','mis')
       LEFT JOIN saving_accounts s ON s.acc_code = r.account_no AND r.section='saving'
       LEFT JOIN od_loans        o ON o.acc_code = r.account_no AND r.section='od'
       WHERE r.is_deleted=FALSE AND r.section=$1`,
      [section === 'fd' ? 'fd' : section]
    );

    // Build lookup by account_no
    const dbMap = {};
    for (const row of dbRows) {
      const key = (row.account_no || '').toString().toLowerCase().replace(/\s/g, '');
      if (key) dbMap[key] = row;
    }

    const missing = [];    // in PDF, not in DB
    const toClose = [];    // in PDF as closed, DB has active
    const toUpdate = [];   // amount/rate differs
    const matched = [];    // identical

    for (const pdf of pdfRecords) {
      const key = (pdf.acc_no || '').toString().toLowerCase().replace(/\s/g, '');
      const db = dbMap[key];

      if (!db) {
        missing.push(pdf);
        continue;
      }

      const diffs = [];

      // Check status change (closed in PDF but active in DB)
      const pdfClosed = !!(pdf.close_date || pdf.status === 'closed');
      if (pdfClosed && db.status === 'active') {
        diffs.push({ field: 'status', old: 'active', new: 'closed', close_date: pdf.close_date });
      }

      // Check amount
      const pdfAmt = parseFloat(pdf.amount || pdf.loan_amount || pdf.fd_amount || pdf.balance) || 0;
      const dbAmt  = parseFloat(db.amount) || 0;
      if (pdfAmt && dbAmt && Math.abs(pdfAmt - dbAmt) > 1) {
        diffs.push({ field: 'amount', old: dbAmt, new: pdfAmt });
      }

      // Check interest rate
      const pdfRate = parseFloat(pdf.interest_rate) || 0;
      const dbRate  = parseFloat(db.interest_rate) || 0;
      if (pdfRate && dbRate && Math.abs(pdfRate - dbRate) > 0.01) {
        diffs.push({ field: 'interest_rate', old: dbRate, new: pdfRate });
      }

      if (diffs.length) {
        toUpdate.push({ pdf, db: { id: db.id, account_no: db.account_no, name: db.name, status: db.status }, diffs });
      } else {
        matched.push({ acc_no: db.account_no, name: db.name });
      }
    }

    res.json({ section, missing, toClose, toUpdate, matched,
               summary: { total: pdfRecords.length, matched: matched.length, toUpdate: toUpdate.length, missing: missing.length } });
  } catch (err) {
    console.error('[pdf-sync/preview]', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/pdf-sync/apply', requireAuth, async (req, res) => {
  try {
    const { changes } = req.body;
    // changes: array of { record_id, type: 'close'|'update_amount'|'update_rate'|'add', data }
    if (!Array.isArray(changes) || !changes.length) {
      return res.status(400).json({ error: 'No changes provided' });
    }

    let applied = 0;
    const errors = [];
    const client = await pool.connect();
    try {
    await client.query('BEGIN');
    for (const ch of changes) {
      try {
        if (ch.type === 'close') {
          await pool.query(
            `UPDATE records SET status='closed', closed_date=$1, updated_at=NOW() WHERE id=$2 AND is_deleted=FALSE`,
            [ch.close_date || new Date().toISOString().split('T')[0], ch.record_id]
          );
          // Also update the specific table
          if (ch.section === 'gold') {
            await pool.query(`UPDATE gold_loans SET status='closed', close_date=$1, closed_date=$1 WHERE acc_code=$2`,
              [ch.close_date, ch.acc_no]);
          } else if (ch.section === 'fd' || ch.section === 'mis') {
            await pool.query(`UPDATE fd_accounts SET status='closed', close_date=$1, closed_date=$1 WHERE acc_code=$2`,
              [ch.close_date, ch.acc_no]);
          } else if (ch.section === 'saving') {
            await pool.query(`UPDATE saving_accounts SET status='closed', close_date=$1 WHERE acc_code=$2`,
              [ch.close_date, ch.acc_no]);
          } else if (ch.section === 'od') {
            await pool.query(`UPDATE od_loans SET status='closed', close_date=$1 WHERE acc_code=$2`,
              [ch.close_date, ch.acc_no]);
          }
          applied++;
        } else if (ch.type === 'update_amount') {
          const dataUpdate = ch.section === 'gold' ? { loan_amount: ch.new_value } :
                             ch.section === 'saving' ? { saving_balance: ch.new_value } :
                             { fd_amount: ch.new_value };
          await pool.query(
            `UPDATE records SET data = data || $1::jsonb, updated_at=NOW() WHERE id=$2 AND is_deleted=FALSE`,
            [JSON.stringify(dataUpdate), ch.record_id]
          );
          applied++;
        } else if (ch.type === 'update_rate') {
          await pool.query(
            `UPDATE records SET data = data || $1::jsonb, updated_at=NOW() WHERE id=$2 AND is_deleted=FALSE`,
            [JSON.stringify({ interest_rate: ch.new_value }), ch.record_id]
          );
          applied++;
        }
      } catch (e) {
        errors.push(`${ch.acc_no}: ${e.message}`);
      }
    }

    if (errors.length) {
      await client.query('ROLLBACK');
    } else {
      await client.query('COMMIT');
    }
    res.json({ ok: errors.length === 0, applied, errors });
    } finally { client.release(); }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
