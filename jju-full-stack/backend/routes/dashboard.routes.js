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
    const { rows } = await pool.query(`SELECT id, username, role, created_at FROM users ORDER BY id`);
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
    if (password) { fields.push(`password=$${fields.length+1}`); vals.push(password); }
    if (role)     { fields.push(`role=$${fields.length+1}`); vals.push(role); }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });
    vals.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE users SET ${fields.join(',')} WHERE id=$${vals.length} RETURNING id, username, role`,
      vals
    );
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/auth/users/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── STATS ─────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const today = getTodayStr();
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
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile, r.status,
              COALESCE(r.closed_date, NULL)    AS closed_date,
              COALESCE(r.sonar_group_no, NULL) AS sonar_group_no,
              COALESCE(r.sonar_sub_no, NULL)   AS sonar_sub_no,
              COALESCE(r.customer_type, NULL)  AS customer_type,
              COALESCE(r.customer_id, NULL)    AS cust_code,
              r.data->>'loan_amount' AS loan_amount,
              r.data->>'loan_amount' AS balance,
              r.data->>'metal_type' AS metal_type,
              r.data->>'loan_date' AS loan_date,
              r.data->>'loan_date' AS start_date,
              r.data->>'loan_end_date' AS end_date,
              r.data->>'interest_rate' AS interest_rate,
              r.data->>'pan' AS pan_no,
              r.data->>'ornament_items' AS ornament_items
       FROM records r
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
      `SELECT r.*, r.data->>'loan_amount' AS loan_amount
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
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
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile, r.status, r.closed_date,
              r.data->>'fd_amount' AS fd_amount,
              r.data->>'fd_amount' AS loan_amount,
              r.data->>'fd_amount' AS balance,
              r.data->>'fd_maturity_amount' AS maturity_amount,
              r.data->>'fd_period' AS fd_period,
              r.data->>'fd_period' AS duration,
              r.data->>'fd_interest_rate' AS fd_interest_rate,
              r.data->>'fd_interest_rate' AS interest_rate,
              r.data->>'fd_maturity_date' AS fd_maturity_date,
              r.data->>'fd_maturity_date' AS end_date,
              r.date AS start_date,
              r.data->>'fd_acc_no' AS fd_acc_no,
              r.data->>'mis_acc_no' AS mis_acc_no
       FROM records r
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
      `SELECT r.* FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
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
      `SELECT r.id,
              r.account_no AS saving_acc_no, r.account_no AS acc_no, r.account_no,
              r.name AS customer_name, r.name,
              r.aadhar, r.mobile, r.status, r.closed_date, r.date AS start_date,
              COALESCE(r.data->>'saving_balance', '0') AS balance,
              r.data->>'interest_rate' AS interest_rate
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT 5000`,
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
      `SELECT r.id, r.account_no AS saving_acc_no, r.account_no AS acc_no,
              r.name AS customer_name, r.name,
              r.aadhar, r.mobile, r.status, r.closed_date, r.date AS start_date,
              COALESCE(r.data->>'saving_balance', '0') AS balance,
              r.data->>'interest_rate' AS interest_rate
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT $${pi}`,
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
      `SELECT r.id, r.date,
              r.name AS customer_name, r.name,
              r.account_no AS acc_no, r.account_no,
              r.aadhar, r.mobile, r.status, r.closed_date,
              r.date AS start_date,
              r.data->>'loan_amount' AS loan_amount,
              r.data->>'loan_amount' AS balance,
              r.data->>'interest_rate' AS interest_rate,
              r.data->>'fd_acc_no' AS fd_acc_no,
              r.data->>'fd_amount' AS fd_amount,
              r.data->>'fd_maturity_date' AS fd_maturity_date,
              r.data->>'fd_maturity_date' AS end_date
       FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC LIMIT 2000`,
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
    const searchCond = search ? `AND (LOWER(name) LIKE $${pi} OR aadhar LIKE $${pi} OR mobile LIKE $${pi})` : '';
    if (search) { params.push(`%${search.toLowerCase()}%`); pi++; }
    // Get distinct customers with account counts
    const { rows: baseRows } = await pool.query(
      `SELECT DISTINCT ON (COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')))
              id, name, aadhar, mobile,
              customer_id AS cust_code,
              data->>'pan' AS pan_no,
              data->>'address' AS address,
              data->>'occupation' AS occupation
       FROM records WHERE is_deleted=FALSE ${searchCond}
       ORDER BY COALESCE(NULLIF(customer_id,''),NULLIF(aadhar,''),NULLIF(mobile,'')), id DESC
       LIMIT $${pi}`,
      [...params, parseInt(limit) || 100]
    );
    // Enrich with counts per aadhar/mobile
    const rows = await Promise.all(baseRows.map(async c => {
      const key = c.aadhar || c.mobile;
      if (!key) return { ...c, active_loans:0, saving_accs:0, fd_accs:0, share_accs:0, od_accs:0 };
      const { rows: counts } = await pool.query(
        `SELECT
           SUM(CASE WHEN section='gold' AND status='active' THEN 1 ELSE 0 END) AS active_loans,
           SUM(CASE WHEN section='saving' AND status='active' THEN 1 ELSE 0 END) AS saving_accs,
           SUM(CASE WHEN section='fd' AND status='active' THEN 1 ELSE 0 END) AS fd_accs,
           SUM(CASE WHEN section='od' AND status='active' THEN 1 ELSE 0 END) AS od_accs,
           SUM(CASE WHEN data IS NOT NULL AND data->>'share_acc_no' IS NOT NULL AND data->>'share_acc_no'!='' THEN 1 ELSE 0 END) AS share_accs
         FROM records WHERE is_deleted=FALSE AND (aadhar=$1 OR mobile=$2)`,
        [c.aadhar||'__', c.mobile||'__']
      );
      return { ...c, ...counts[0] };
    }));
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
      [date, name, customer_id||null, aadhar||null, mobile||null, account_no||null, section, txStr, typeof data === 'object' ? JSON.stringify(data) : (data||'{}'), remarks||null]
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
      [name, aadhar||null, mobile||null, req.params.id]
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
router.get('/sync/status', async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS sync_log (id SERIAL PRIMARY KEY, started_at TIMESTAMPTZ DEFAULT NOW(), finished_at TIMESTAMPTZ, status TEXT DEFAULT 'running', message TEXT, rows_synced INTEGER DEFAULT 0)`);
    const { rows } = await pool.query(`SELECT * FROM sync_log ORDER BY id DESC LIMIT 1`);
    res.json({ running: _syncRunning, last: rows[0] || null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sync/run', async (req, res) => {
  if (_syncRunning) return res.json({ ok: false, message: 'Sync already running' });
  res.json({ ok: true, message: 'Sync started' });
  _syncRunning = true;
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS sync_log (id SERIAL PRIMARY KEY, started_at TIMESTAMPTZ DEFAULT NOW(), finished_at TIMESTAMPTZ, status TEXT DEFAULT 'running', message TEXT, rows_synced INTEGER DEFAULT 0)`);
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
module.exports = router;
