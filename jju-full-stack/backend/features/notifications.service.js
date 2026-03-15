'use strict';
const pool = require('../db/pool');

// ── Migration ─────────────────────────────────────────────────────────────
async function ensureNotificationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER,
      type       TEXT NOT NULL,   -- fd_maturity, overdue_loan, new_record, system
      title      TEXT NOT NULL,
      body       TEXT,
      link       TEXT,
      is_read    BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, is_read)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_notif_created   ON notifications(created_at)`);
}
ensureNotificationsTable().catch(e => console.error('[notifications] init failed:', e.message));

// ── Core push ─────────────────────────────────────────────────────────────
async function push(user_id, type, title, body = null, link = null) {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link) VALUES ($1,$2,$3,$4,$5)`,
      [user_id || null, type, title, body, link]
    );
  } catch (err) { console.error('[notifications] push failed:', err.message); }
}

// ── Scheduled checkers (call from a cron or startup) ──────────────────────

// Notify about FDs maturing in the next 7 days
async function checkFDMaturities() {
  const { rows } = await pool.query(`
    SELECT id, name, account_no, data->>'fd_maturity_date' AS maturity_date,
           data->>'fd_amount' AS fd_amount
    FROM records
    WHERE is_deleted=FALSE AND section='fd' AND status='active'
      AND data->>'fd_maturity_date' IS NOT NULL
      AND (data->>'fd_maturity_date')::date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  `);
  for (const r of rows) {
    await push(null, 'fd_maturity',
      `FD Maturing Soon`,
      `${r.name} — A/C ${r.account_no} matures on ${r.maturity_date} (₹${r.fd_amount})`,
      `/records/${r.id}`
    );
  }
  return rows.length;
}

// Notify about gold loans older than 365 days (overdue)
async function checkOverdueLoans() {
  const { rows } = await pool.query(`
    SELECT id, name, account_no, date, data->>'loan_amount' AS loan_amount
    FROM records
    WHERE is_deleted=FALSE AND section='gold' AND status='active'
      AND date::date < CURRENT_DATE - INTERVAL '365 days'
  `);
  for (const r of rows) {
    await push(null, 'overdue_loan',
      `Overdue Gold Loan`,
      `${r.name} — A/C ${r.account_no} opened ${r.date} (₹${r.loan_amount})`,
      `/records/${r.id}`
    );
  }
  return rows.length;
}

module.exports = { push, checkFDMaturities, checkOverdueLoans };
