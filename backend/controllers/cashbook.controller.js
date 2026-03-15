'use strict';
const pool = require('../db/pool');

// ── GET /api/cashbook?date=&limit=&offset= ────────────────────────────────
async function list(req, res) {
  try {
    const { date, limit = 200, offset = 0 } = req.query;
    const where = ['is_deleted=FALSE'];
    const params = [];
    let pi = 1;

    if (!date) {
      // Safety: without a date filter this returns ALL cashbook entries — require it
      return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: `Invalid date format "${date}" — expected YYYY-MM-DD` });
    }
    where.push(`date=$${pi++}`);
    params.push(date);

    // Fix #4: explicit column list instead of SELECT *
    // Fix #5: LIMIT/OFFSET pagination so large cashbooks don't OOM the process
    const lim = Math.min(parseInt(limit) || 200, 1000);
    const off = parseInt(offset) || 0;

    const countRes = await pool.query(
      `SELECT COUNT(*) AS total FROM cashbook_entries WHERE ${where.join(' AND ')}`,
      params,
    );

    const { rows } = await pool.query(
      `SELECT id, date, entry_date, record_id, name, task, acc_type, tx_type,
              acc_no, amount, mode, scroll_no, loan_date, sort_order,
              is_deleted, deleted_at, created_at, updated_at
       FROM cashbook_entries
       WHERE ${where.join(' AND ')}
       ORDER BY sort_order ASC, id ASC
       LIMIT $${pi} OFFSET $${pi + 1}`,
      [...params, lim, off],
    );

    res.json({ entries: rows, count: rows.length, total: parseInt(countRes.rows[0].total), limit: lim, offset: off });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── POST /api/cashbook/bulk ───────────────────────────────────────────────
// Fix #1: wrap in a transaction so a partial failure rolls back everything
// Fix #6: validate that each entry has at least date and amount
async function bulkInsert(req, res) {
  const client = await pool.connect();
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || !entries.length) {
      return res.status(400).json({ error: 'No entries provided' });
    }

    // Fix #6: validate required fields before touching the DB
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.date) return res.status(400).json({ error: `Entry ${i + 1}: date is required` });
      if (e.amount === undefined || e.amount === null || e.amount === '') {
        return res.status(400).json({ error: `Entry ${i + 1}: amount is required` });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) {
        return res.status(400).json({ error: `Entry ${i + 1}: invalid date format "${e.date}" — expected YYYY-MM-DD` });
      }
    }

    await client.query('BEGIN');
    const inserted = [];
    for (const e of entries) {
      const { rows } = await client.query(
        `INSERT INTO cashbook_entries
           (date, parent_id, record_id, name, task, acc_type, tx_type, acc_no, amount, mode, scroll_no, loan_date, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING id, date, entry_date, parent_id, record_id, name, task, acc_type, tx_type,
                   acc_no, amount, mode, scroll_no, loan_date, sort_order, created_at, updated_at`,
        [e.date, e.parent_id || null, e.record_id || null, e.name || null, e.task || null,
         e.acc_type || null, e.tx_type || null, e.acc_no || null,
         parseFloat(e.amount) || 0, e.mode || null, e.scroll_no || null,
         e.loan_date || null, parseInt(e.sort_order) || 0],
      );
      inserted.push(rows[0]);
    }
    await client.query('COMMIT');
    res.status(201).json({ entries: inserted, count: inserted.length });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

// ── PUT /api/cashbook/:id ─────────────────────────────────────────────────
// Fix #7: include date in the UPDATE so it can actually be changed
async function update(req, res) {
  try {
    const { date, name, task, acc_type, tx_type, acc_no, amount, mode, scroll_no, loan_date, sort_order } = req.body;

    // Fix #7: validate date format if provided
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: `Invalid date format "${date}" — expected YYYY-MM-DD` });
    }

    // Only update date if explicitly provided — don't wipe existing date with NULL
    const dateClause = date ? `date=$1,` : '';
    const dateParam  = date ? [date] : [];
    const { rows } = await pool.query(
      `UPDATE cashbook_entries SET
         ${dateClause} name=$${dateParam.length+1}, task=$${dateParam.length+2}, acc_type=$${dateParam.length+3}, tx_type=$${dateParam.length+4}, acc_no=$${dateParam.length+5},
         amount=$${dateParam.length+6}, mode=$${dateParam.length+7}, scroll_no=$${dateParam.length+8}, loan_date=$${dateParam.length+9}, sort_order=$${dateParam.length+10}, updated_at=NOW()
       WHERE id=$${dateParam.length+11} AND is_deleted=FALSE
       RETURNING id, date, entry_date, parent_id, record_id, name, task, acc_type, tx_type,
                 acc_no, amount, mode, scroll_no, loan_date, sort_order, created_at, updated_at`,
      [...dateParam, name || null, task || null, acc_type || null, tx_type || null,
       acc_no || null, parseFloat(amount) || 0, mode || null,
       scroll_no || null, loan_date || null, parseInt(sort_order) || 0,
       req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Entry not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── PATCH /api/cashbook/:id/soft-delete ──────────────────────────────────
// Fix #3: check rowCount so non-existent IDs return 404
// Fix #8: guard is_deleted=FALSE so re-deleting doesn't corrupt deleted_at
async function softDelete(req, res) {
  try {
    const result = await pool.query(
      `UPDATE cashbook_entries
       SET is_deleted=TRUE, deleted_at=NOW(), updated_at=NOW()
       WHERE id=$1 AND is_deleted=FALSE`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Entry not found or already deleted' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── PATCH /api/cashbook/:id/restore ──────────────────────────────────────
// Fix #3: check rowCount so non-existent IDs return 404
// Fix #9: guard is_deleted=TRUE so restoring active entries is a no-op
async function restore(req, res) {
  try {
    const result = await pool.query(
      `UPDATE cashbook_entries
       SET is_deleted=FALSE, deleted_at=NULL, updated_at=NOW()
       WHERE id=$1 AND is_deleted=TRUE`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Entry not found or not deleted' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── DELETE /api/cashbook/:id ──────────────────────────────────────────────
// Fix #2: require soft-delete first; check existence; check rowCount
async function permanentDelete(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT is_deleted FROM cashbook_entries WHERE id=$1 LIMIT 1`,
      [req.params.id],
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    if (!rows[0].is_deleted) {
      return res.status(400).json({ error: 'Entry must be soft-deleted first before permanent deletion' });
    }
    await pool.query(`DELETE FROM cashbook_entries WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/cashbook/deleted ─────────────────────────────────────────────
async function listDeleted(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, date, entry_date, record_id, name, task, acc_type, tx_type,
              acc_no, amount, mode, scroll_no, loan_date, sort_order, deleted_at, created_at
       FROM cashbook_entries
       WHERE is_deleted=TRUE
       ORDER BY deleted_at DESC
       LIMIT 100`,
    );
    res.json({ entries: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { list, bulkInsert, update, softDelete, restore, permanentDelete, listDeleted };
