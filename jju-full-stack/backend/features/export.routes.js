'use strict';
const router = require('express').Router();
const pool   = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// ── Helper: convert rows to CSV ───────────────────────────────────────────
function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape  = (v) => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return s.includes(',') || s.includes('\n') || s.includes('"') ? `"${s}"` : s;
  };
  return [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
  ].join('\n');
}

// ── Helper: simple HTML table → used for PDF via browser print ────────────
function toHTMLTable(title, rows) {
  if (!rows.length) return `<p>No data</p>`;
  const headers = Object.keys(rows[0]);
  const th = headers.map(h => `<th>${h}</th>`).join('');
  const trs = rows.map(r =>
    `<tr>${headers.map(h => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`
  ).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    h2   { margin-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
    tr:nth-child(even) { background: #fafafa; }
    @media print { button { display: none; } }
  </style></head><body>
  <h2>${title}</h2>
  <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
  <table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>
  <br><button onclick="window.print()">🖨 Print / Save as PDF</button>
  </body></html>`;
}

// ── Shared query helper ───────────────────────────────────────────────────
async function fetchRecords(section, status = 'active') {
  const where = [`r.is_deleted=FALSE`];
  const params = [];
  let pi = 1;
  if (section !== 'all') { where.push(`r.section=$${pi++}`); params.push(section); }
  if (status  !== 'all') { where.push(`r.status=$${pi++}`);  params.push(status); }
  const { rows } = await pool.query(
    `SELECT r.id, r.date, r.name, r.account_no, r.aadhar, r.mobile,
            r.section, r.status, r.closed_date,
            r.data->>'loan_amount' AS loan_amount,
            r.data->>'fd_amount'   AS fd_amount,
            r.data->>'fd_maturity_date' AS fd_maturity_date,
            r.data->>'interest_rate' AS interest_rate
     FROM records r WHERE ${where.join(' AND ')} ORDER BY r.id DESC`,
    params
  );
  return rows;
}

// GET /api/export/csv?section=gold&status=active
router.get('/csv', async (req, res) => {
  try {
    const { section = 'all', status = 'active' } = req.query;
    const rows = await fetchRecords(section, status);
    const csv  = toCSV(rows);
    const filename = `${section}_${status}_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/export/html?section=gold&status=active  — open in browser → Print → Save as PDF
router.get('/html', async (req, res) => {
  try {
    const { section = 'all', status = 'active' } = req.query;
    const rows  = await fetchRecords(section, status);
    const title = `${section.toUpperCase()} Records — ${status} (${rows.length} rows)`;
    res.setHeader('Content-Type', 'text/html');
    res.send(toHTMLTable(title, rows));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/export/cashbook/csv?date=YYYY-MM-DD
router.get('/cashbook/csv', async (req, res) => {
  try {
    const { date, from, to } = req.query;
    const where = ['is_deleted=FALSE']; const params = []; let pi = 1;
    if (date) { where.push(`date=$${pi++}`); params.push(date); }
    else if (from && to) {
      where.push(`date BETWEEN $${pi++} AND $${pi++}`);
      params.push(from, to);
    }
    const { rows } = await pool.query(
      `SELECT id, date, name, task, acc_type, tx_type, acc_no, amount, mode, scroll_no, loan_date
       FROM cashbook_entries WHERE ${where.join(' AND ')} ORDER BY date, sort_order, id`,
      params
    );
    const filename = `cashbook_${date || `${from}_to_${to}`}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(toCSV(rows));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/export/cashbook/html?date=YYYY-MM-DD
router.get('/cashbook/html', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });
    const { rows } = await pool.query(
      `SELECT id, name, task, acc_type, tx_type, acc_no, amount, mode, scroll_no
       FROM cashbook_entries WHERE is_deleted=FALSE AND date=$1 ORDER BY sort_order, id`,
      [date]
    );
    res.setHeader('Content-Type', 'text/html');
    res.send(toHTMLTable(`Cashbook — ${date}`, rows));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

/*
── ADD TO server.js ──────────────────────────────────────────────────────────
  app.use('/api/export', require('./features/export/export.routes'));

── FRONTEND USAGE ────────────────────────────────────────────────────────────
  // Download CSV
  window.open('/api/export/csv?section=gold&status=active');

  // Open printable PDF
  window.open('/api/export/html?section=fd&status=active');

  // For actual PDF generation (optional, needs puppeteer):
  // npm install puppeteer  then fetch /html and screenshot it
*/
