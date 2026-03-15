'use strict';
const router = require('express').Router();
const pool   = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/audit?resource=records&action=DELETE&user=&from=&to=&limit=50&offset=0
router.get('/', async (req, res) => {
  try {
    const { resource, action, username, from, to, limit = 50, offset = 0 } = req.query;
    const where = []; const params = []; let pi = 1;

    if (resource) { where.push(`resource=$${pi++}`); params.push(resource); }
    if (action)   { where.push(`action=$${pi++}`);   params.push(action); }
    if (username) { where.push(`username ILIKE $${pi++}`); params.push(`%${username}%`); }
    if (from)     { where.push(`created_at >= $${pi++}`); params.push(from); }
    if (to)       { where.push(`created_at <= $${pi++}`); params.push(to); }

    const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const [countRes, rows] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM audit_log ${clause}`, params),
      pool.query(
        `SELECT * FROM audit_log ${clause} ORDER BY created_at DESC
         LIMIT $${pi} OFFSET $${pi + 1}`,
        [...params, Math.min(parseInt(limit) || 50, 200), parseInt(offset) || 0]
      ),
    ]);

    res.json({ logs: rows.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/audit/resource/:resource/:id  — full history for one record
router.get('/resource/:resource/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM audit_log WHERE resource=$1 AND resource_id=$2 ORDER BY created_at DESC LIMIT 100`,
      [req.params.resource, req.params.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/audit/stats  — summary counts by action/resource (last 30 days)
router.get('/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT action, resource, COUNT(*) AS count
      FROM audit_log
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY action, resource
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

/*
── ADD TO server.js (one line) ──────────────────────────────────────────────
  app.use('/api/audit', require('./features/audit/audit.routes'));

── ADD TO records.routes.js ─────────────────────────────────────────────────
  const { auditMiddleware } = require('../features/audit/audit.middleware');

  router.post('/',            auditMiddleware('CREATE',  'records'), c.create);
  router.put('/:id',          auditMiddleware('UPDATE',  'records'), c.update);
  router.delete('/:id',       auditMiddleware('DELETE',  'records'), c.softDelete);
  router.patch('/:id/close',  auditMiddleware('CLOSE',   'records'), c.close);
  router.patch('/:id/reopen', auditMiddleware('REOPEN',  'records'), c.reopen);
*/
