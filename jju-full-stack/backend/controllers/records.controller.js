'use strict';
const pool = require('../db/pool');

// ── helpers ───────────────────────────────────────────────────────────────
function parseTxTypes(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── GET /api/records ───────────────────────────────────────────────────────
async function list(req, res) {
  try {
    const {
      section, status, limit = 50, offset = 0,
      date_from, date_to, q, date, customer_type,
    } = req.query;

    const where = ['r.is_deleted = FALSE'];
    const params = [];
    let pi = 1;

    if (section)       { where.push(`r.section       = $${pi++}`); params.push(section); }
    if (status)        { where.push(`r.status        = $${pi++}`); params.push(status); }
    if (customer_type) { where.push(`r.customer_type = $${pi++}`); params.push(customer_type); }
    if (date)          { where.push(`r.date          = $${pi++}`); params.push(date); }
    if (date_from) { where.push(`r.date >= $${pi++}`); params.push(date_from); }
    if (date_to)   { where.push(`r.date <= $${pi++}`); params.push(date_to); }
    if (q) {
      where.push(`(LOWER(r.name) LIKE $${pi} OR r.aadhar LIKE $${pi} OR r.mobile LIKE $${pi} OR r.account_no LIKE $${pi})`);
      params.push(`%${q.toLowerCase()}%`);
      pi++;
    }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const countRes = await pool.query(
      `SELECT COUNT(*) AS total FROM records r ${whereClause}`,
      params,
    );
    const total = parseInt(countRes.rows[0].total);

    const lim = Math.min(parseInt(limit) || 50, 500);
    const off = parseInt(offset) || 0;

    const dataRes = await pool.query(
      `SELECT r.id, r.date, r.name, r.customer_id, r.customer_type,
              r.aadhar, r.mobile, r.account_no, r.section, r.tx_types,
              r.data, r.remarks, r.sonar_parent_no, r.sonar_sub_no, r.sonar_group_no,
              r.status, r.closed_date, r.closed_remarks, r.created_at, r.updated_at
       FROM records r
       ${whereClause}
       ORDER BY r.id DESC
       LIMIT $${pi} OFFSET $${pi+1}`,
      [...params, lim, off],
    );

    const records = dataRes.rows.map(r => ({
      ...r,
      tx_types: parseTxTypes(r.tx_types),
      data: typeof r.data === 'string' ? JSON.parse(r.data || '{}') : (r.data || {}),
    }));

    res.json({ records, total, limit: lim, offset: off });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/stats ────────────────────────────────────────────────
async function stats(req, res) {
  try {
    const today = getTodayStr();

    const [total, todayCount, activeGold, activeFD, closedGold,
      todayOpened, todayClosed, goldAmt, fdAmt,
      bySection, recent, recentClosed,
      missingLoan, missingName, missingDate, dupAcc] = await Promise.all([

      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND date=$1`, [today]),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='active'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='fd'  AND status='active'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='closed'`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='active' AND date=$1`, [today]),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND status='closed' AND closed_date=$1`, [today]),

      // total active gold loan amount  (data is JSONB — no text cast needed)
      pool.query(`SELECT COALESCE(SUM(
                    CASE WHEN (data->>'loan_amount') ~ '^[0-9]+(\.[0-9]+)?$'
                    THEN (data->>'loan_amount')::numeric ELSE NULL END
                  ), 0) AS amt
                  FROM records WHERE is_deleted=FALSE AND section='gold' AND status='active'`),
      // total active FD deposit amount
      pool.query(`SELECT COALESCE(SUM(
                    CASE WHEN (data->>'fd_amount') ~ '^[0-9]+(\.[0-9]+)?$'
                    THEN (data->>'fd_amount')::numeric ELSE NULL END
                  ), 0) AS amt
                  FROM records WHERE is_deleted=FALSE AND section='fd' AND status='active'`),

      // by section counts
      pool.query(`SELECT section, COUNT(*) AS count FROM records WHERE is_deleted=FALSE GROUP BY section ORDER BY count DESC`),

      // 10 most recent records
      pool.query(`SELECT id, date, name, section, tx_types, account_no, sonar_sub_no, status FROM records WHERE is_deleted=FALSE ORDER BY id DESC LIMIT 10`),

      // 5 most recently closed
      pool.query(`SELECT id, name, account_no, closed_date, section, data->>'loan_amount' AS loan_amount FROM records WHERE is_deleted=FALSE AND status='closed' ORDER BY id DESC LIMIT 5`),

      // data errors
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND section='gold' AND (data->>'loan_amount' IS NULL OR data->>'loan_amount'='')`),
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND (name IS NULL OR name='')`),
      // Fix #1: date is now a DATE column — can't compare to '' — just check IS NULL
      pool.query(`SELECT COUNT(*) FROM records WHERE is_deleted=FALSE AND date IS NULL`),
      // Fix #11: explicit AS count alias so all clients can read it reliably
      pool.query(`SELECT account_no, COUNT(*) AS count FROM records WHERE is_deleted=FALSE AND account_no IS NOT NULL AND account_no<>'' GROUP BY account_no HAVING COUNT(*)>1 LIMIT 10`),
    ]);

    res.json({
      total:             parseInt(total.rows[0].count),
      today:             parseInt(todayCount.rows[0].count),
      activeGold:        parseInt(activeGold.rows[0].count),
      activeFD:          parseInt(activeFD.rows[0].count),
      closedGold:        parseInt(closedGold.rows[0].count),
      todayOpenedGold:   parseInt(todayOpened.rows[0].count),
      todayClosedGold:   parseInt(todayClosed.rows[0].count),
      totalGoldLoanAmt:  parseFloat(goldAmt.rows[0].amt),
      totalFDDepositAmt: parseFloat(fdAmt.rows[0].amt),
      bySection:         bySection.rows.map(r => ({ section: r.section, count: parseInt(r.count) })),
      recent:            recent.rows.map(r => ({ ...r, tx_types: parseTxTypes(r.tx_types) })),
      recentClosed:      recentClosed.rows,
      dataErrors: {
        missingLoanAmt: parseInt(missingLoan.rows[0].count),
        missingName:    parseInt(missingName.rows[0].count),
        missingDate:    parseInt(missingDate.rows[0].count),
        dupLoanAcc:     dupAcc.rows.length,
        dupLoanAccList: dupAcc.rows.map(r => ({ account_no: r.account_no, count: r.count })),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/deleted ───────────────────────────────────────────────
async function listDeleted(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT id, date, name, section, tx_types, account_no, deleted_at
       FROM records WHERE is_deleted=TRUE ORDER BY deleted_at DESC LIMIT 100`,
    );
    res.json({ records: rows.map(r => ({ ...r, tx_types: parseTxTypes(r.tx_types) })) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/next-loan-no/:prefix ─────────────────────────────────
async function nextLoanNo(req, res) {
  try {
    const prefix = req.params.prefix;
    // Fix: use prefix + '-' + '%' so '03-%' won't match '030-xxx' accounts
    const { rows } = await pool.query(
      `SELECT COALESCE(MAX(
         CASE
           WHEN REGEXP_REPLACE(account_no, $1, '') ~ '^[0-9]+$'
           THEN REGEXP_REPLACE(account_no, $1, '')::integer
           ELSE NULL
         END
       ), 0) AS max_num
       FROM records WHERE account_no LIKE $2 AND is_deleted=FALSE`,
      ['^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-', prefix + '-%'],
    );
    const next = (parseInt(rows[0].max_num) || 0) + 1;
    const padded = String(next).padStart(3, '0');
    res.json({ next: `${prefix}-${padded}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/check-loan-no/:no ───────────────────────────────────
async function checkLoanNo(req, res) {
  try {
    const no = req.params.no;
    const { rows } = await pool.query(
      `SELECT id FROM records WHERE account_no=$1 AND is_deleted=FALSE LIMIT 1`, [no],
    );
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/next-fd-acc-no/:prefix ───────────────────────────────
async function nextFdAccNo(req, res) {
  try {
    const prefix = req.params.prefix;
    // Fix #9: use MAX in SQL so we never miss the highest number with a LIMIT
    const { rows } = await pool.query(
      `SELECT COALESCE(MAX(
         CASE
           WHEN REGEXP_REPLACE(data->>'fd_acc_no', $1, '') ~ '^[0-9]+$'
           THEN REGEXP_REPLACE(data->>'fd_acc_no', $1, '')::integer
           ELSE NULL
         END
       ), 0) AS max_num
       FROM records WHERE is_deleted=FALSE AND data->>'fd_acc_no' LIKE $2`,
      ['^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-', prefix + '-%'],
    );
    const next = (parseInt(rows[0].max_num) || 0) + 1;
    res.json({ next: `${prefix}-${String(next).padStart(3, '0')}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/check-fd-acc-no/:no ─────────────────────────────────
async function checkFdAccNo(req, res) {
  try {
    const no = req.params.no;
    const { rows } = await pool.query(
      `SELECT id FROM records WHERE is_deleted=FALSE AND data->>'fd_acc_no'=$1 LIMIT 1`, [no],
    );
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/next-mis-acc-no/:prefix ──────────────────────────────
async function nextMisAccNo(req, res) {
  try {
    const prefix = req.params.prefix;
    // Fix #9: use MAX in SQL so we never miss the highest number with a LIMIT
    const { rows } = await pool.query(
      `SELECT COALESCE(MAX(
         CASE
           WHEN REGEXP_REPLACE(data->>'mis_acc_no', $1, '') ~ '^[0-9]+$'
           THEN REGEXP_REPLACE(data->>'mis_acc_no', $1, '')::integer
           ELSE NULL
         END
       ), 0) AS max_num
       FROM records WHERE is_deleted=FALSE AND data->>'mis_acc_no' LIKE $2`,
      ['^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-', prefix + '-%'],
    );
    const next = (parseInt(rows[0].max_num) || 0) + 1;
    res.json({ next: `${prefix}-${String(next).padStart(3, '0')}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/check-mis-acc-no/:no ────────────────────────────────
async function checkMisAccNo(req, res) {
  try {
    const no = req.params.no;
    const { rows } = await pool.query(
      `SELECT id FROM records WHERE is_deleted=FALSE AND data->>'mis_acc_no'=$1 LIMIT 1`, [no],
    );
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/customers/search?q= ─────────────────────────────────
async function customerSearch(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const pattern = `%${q.toLowerCase()}%`;

    // Search customers table first (most up-to-date)
    const { rows } = await pool.query(
      `SELECT customer_id, name, aadhar, mobile,
              COALESCE(pan,'') AS pan, COALESCE(dob::text,'') AS dob,
              COALESCE(address,'') AS address, COALESCE(occupation,'') AS occupation,
              COALESCE(saving_acc_no,'') AS saving_acc_no,
              COALESCE(saving_balance::text,'0') AS saving_balance,
              COALESCE(share_acc_no,'') AS share_acc_no
       FROM customers
       WHERE LOWER(COALESCE(name,'')) LIKE $1 OR COALESCE(aadhar,'') LIKE $2 OR COALESCE(mobile,'') LIKE $3
       ORDER BY id DESC LIMIT 10`,
      [pattern, pattern, pattern],
    );

    // If not found in customers, fall back to records
    if (!rows.length) {
      const { rows: fallback } = await pool.query(
        `SELECT DISTINCT ON (COALESCE(NULLIF(customer_id::text,''), NULLIF(aadhar,''), NULLIF(mobile,'')))
                customer_id, name, aadhar, mobile,
                data->>'pan'            AS pan,
                data->>'dob'            AS dob,
                data->>'address'        AS address,
                data->>'occupation'     AS occupation,
                data->>'saving_acc_no'  AS saving_acc_no,
                data->>'saving_balance' AS saving_balance,
                data->>'share_acc_no'   AS share_acc_no
         FROM records
         WHERE is_deleted=FALSE
           AND (LOWER(name) LIKE $1 OR aadhar LIKE $2 OR mobile LIKE $3)
         ORDER BY COALESCE(NULLIF(customer_id::text,''), NULLIF(aadhar,''), NULLIF(mobile,'')), id DESC
         LIMIT 10`,
        [pattern, pattern, pattern],
      );
      return res.json(fallback);
    }

    res.json(rows);
  } catch (err) {
    console.error('customerSearch error:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
}

// ── GET /api/records/:id ──────────────────────────────────────────────────
async function getOne(req, res) {
  try {
    // Fix #3: exclude soft-deleted records from getOne
    const { rows } = await pool.query(
      `SELECT * FROM records WHERE id=$1 AND is_deleted=FALSE LIMIT 1`, [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const r = rows[0];
    res.json({ ...r, tx_types: parseTxTypes(r.tx_types), data: r.data || {} });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── POST /api/records ─────────────────────────────────────────────────────
async function create(req, res) {
  try {
    const {
      date, name, customer_id, customer_type = 'regular',
      aadhar, mobile, account_no, section, tx_types, data = {},
      remarks, sonar_parent_no, sonar_sub_no, sonar_group_no,
    } = req.body;

    const txStr = Array.isArray(tx_types) ? JSON.stringify(tx_types) : (tx_types || '[]');

    const { rows } = await pool.query(
      `INSERT INTO records
         (date, name, customer_id, customer_type, aadhar, mobile, account_no,
          section, tx_types, data, remarks, sonar_parent_no, sonar_sub_no, sonar_group_no)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id`,
      [date, name, customer_id || null, customer_type,
       aadhar || null, mobile || null, account_no || null,
       section, txStr, data, remarks || null,
       sonar_parent_no || null, sonar_sub_no || null, sonar_group_no || null],
    );

    const id = rows[0].id;

    // Upsert into customers table
    if (name) {
      await upsertCustomer({ customer_id, name, aadhar, mobile, data });
    }

    res.status(201).json({ id, ok: true });
  } catch (err) {
    console.error('[create record]', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
}

// ── PUT /api/records/:id ──────────────────────────────────────────────────
async function update(req, res) {
  try {
    const id = req.params.id;
    const {
      date, name, customer_id, customer_type, aadhar, mobile, account_no,
      section, tx_types, data, remarks,
      sonar_parent_no, sonar_sub_no, sonar_group_no,  // Fix #8: include sonar fields
    } = req.body;

    const txStr = Array.isArray(tx_types) ? JSON.stringify(tx_types) : (tx_types || '[]');

    // Fix #4: AND is_deleted=FALSE so soft-deleted records can't be silently updated
    const result = await pool.query(
      `UPDATE records SET
         date=$1, name=$2, customer_id=$3, customer_type=$4, aadhar=$5, mobile=$6,
         account_no=$7, section=$8, tx_types=$9, data=$10, remarks=$11,
         sonar_parent_no=$12, sonar_sub_no=$13, sonar_group_no=$14,
         updated_at=NOW()
       WHERE id=$15 AND is_deleted=FALSE`,
      [date, name, customer_id || null, customer_type || 'regular',
       aadhar || null, mobile || null,
       account_no || null, section, txStr, data || {}, remarks || null,
       sonar_parent_no || null, sonar_sub_no || null, sonar_group_no || null, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found or already deleted' });
    }

    if (name) await upsertCustomer({ customer_id, name, aadhar, mobile, data: data || {} });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── DELETE /api/records/:id (soft delete) ────────────────────────────────
async function softDelete(req, res) {
  try {
    // Fix #5: check rowCount so non-existent IDs return 404 instead of silent 200
    const result = await pool.query(
      `UPDATE records SET is_deleted=TRUE, deleted_at=NOW(), updated_at=NOW()
       WHERE id=$1 AND is_deleted=FALSE`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found or already deleted' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── PATCH /api/records/:id/soft-delete ───────────────────────────────────
async function softDeletePatch(req, res) {
  return softDelete(req, res);
}

// ── PATCH /api/records/:id/restore ────────────────────────────────────────
async function restore(req, res) {
  try {
    // Fix #5: check rowCount so non-existent IDs return 404 instead of silent 200
    const result = await pool.query(
      `UPDATE records SET is_deleted=FALSE, deleted_at=NULL, updated_at=NOW()
       WHERE id=$1 AND is_deleted=TRUE`,
      [req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found or not deleted' });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── DELETE /api/records/:id/permanent ────────────────────────────────────
async function permanentDelete(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT is_deleted FROM records WHERE id=$1 LIMIT 1`, [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Record not found' });
    if (!rows[0].is_deleted) {
      return res.status(400).json({ error: 'Record must be soft-deleted first before permanent deletion' });
    }
    await pool.query(`DELETE FROM records WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── PATCH /api/records/:id/close ─────────────────────────────────────────
async function close(req, res) {
  try {
    const { closed_date, closed_remarks, close_types } = req.body;
    const closedTxStr = close_types
      ? (Array.isArray(close_types) ? JSON.stringify(close_types) : close_types)
      : null;
    await pool.query(
      `UPDATE records SET status='closed', closed_date=$1, closed_remarks=$2, closed_tx_types=$3, updated_at=NOW() WHERE id=$4`,
      [closed_date || getTodayStr(), closed_remarks || null, closedTxStr, req.params.id],
    );
    // Fix #2: use the same fallback date for derived tables as we do for records
    const effectiveClosedDate = closed_date || getTodayStr();
    await pool.query(`UPDATE gold_loans  SET status='closed', closed_date=$1 WHERE record_id=$2`, [effectiveClosedDate, req.params.id]);
    await pool.query(`UPDATE fd_accounts SET status='closed', closed_date=$1 WHERE record_id=$2`, [effectiveClosedDate, req.params.id]);
    await pool.query(`UPDATE od_loans    SET status='closed', closed_date=$1 WHERE record_id=$2`, [effectiveClosedDate, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── PATCH /api/records/:id/reopen ─────────────────────────────────────────
async function reopen(req, res) {
  try {
    await pool.query(
      `UPDATE records SET status='active', closed_date=NULL, closed_remarks=NULL, updated_at=NOW() WHERE id=$1`,
      [req.params.id],
    );
    await pool.query(`UPDATE gold_loans  SET status='active', closed_date=NULL WHERE record_id=$1`, [req.params.id]);
    await pool.query(`UPDATE fd_accounts SET status='active', closed_date=NULL WHERE record_id=$1`, [req.params.id]);
    await pool.query(`UPDATE od_loans    SET status='active', closed_date=NULL WHERE record_id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── POST /api/records/import/bulk ────────────────────────────────────────
async function importBulk(req, res) {
  // Fix #7: wrap in a transaction so a partial failure rolls back everything
  const client = await pool.connect();
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || !records.length) {
      return res.status(400).json({ error: 'No records provided' });
    }
    await client.query('BEGIN');
    const results = [];
    for (const rec of records) {
      try {
        const txStr = Array.isArray(rec.tx_types) ? JSON.stringify(rec.tx_types) : (rec.tx_types || '[]');
        const { rows } = await client.query(
          `INSERT INTO records (date, name, customer_id, aadhar, mobile, account_no, section, tx_types, data, remarks)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [rec.date || null, rec.name || null, rec.customer_id || null,
           rec.aadhar || null, rec.mobile || null, rec.account_no || null,
           rec.section || 'general', txStr, rec.data || {}, rec.remarks || null],
        );
        results.push({ ok: true, id: rows[0].id });
      } catch (e) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Import failed on record ${results.length + 1}: ${e.message}`,
          failedAt: results.length,
          results,
        });
      }
    }
    await client.query('COMMIT');
    res.json({ results, count: results.filter(r => r.ok).length });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}

// ── POST /api/records/process-transaction ────────────────────────────────
// Updates derived tables: gold_loans, fd_accounts, saving_accounts, od_loans, memberships
async function processTransaction(req, res) {
  const { tx_types, data = {}, record_id, customer_name } = req.body;
  const txArr = Array.isArray(tx_types) ? tx_types : [];
  const results = [];
  const errors  = [];

  const upsert = async (table, conflictCol, vals, cols) => {
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const updates = cols
      .filter(c => c !== conflictCol)
      .map(c => `${c}=EXCLUDED.${c}`)
      .join(', ');
    await pool.query(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})
       ON CONFLICT (${conflictCol}) DO UPDATE SET ${updates}, updated_at=NOW()`,
      vals,
    );
  };

  try {
    // Fix #10: each operation is individually guarded so one failure doesn't
    // skip all subsequent operations. All errors are collected in errors[].

    // Gold Loan open
    if (txArr.includes('Gold Loan') && !txArr.includes('New FD-OD Loan')) {
      if (record_id && data.loan_acc_no) {
        try {
          await upsert('gold_loans', 'record_id', [
            record_id, data.loan_acc_no, customer_name || data.customer_name,
            data.aadhar || null, data.mobile || null,
            parseFloat(data.loan_amount) || 0, data.date || null,
            data.metal_type || null,
            data.ornament_items ? (typeof data.ornament_items === 'string' ? JSON.parse(data.ornament_items) : data.ornament_items) : [],
            data.sonar_group_no || null, data.sonar_sub_no || null, 'active',
          ], ['record_id','loan_acc_no','customer_name','aadhar','mobile','loan_amount','loan_date','metal_type','ornament_items','sonar_group_no','sonar_sub_no','status']);
          results.push('gold_loans upserted');
        } catch (e) { errors.push(`gold_loans: ${e.message}`); }
      }
    }

    // Gold Loan close
    if (txArr.includes('Closing - Loan') && record_id) {
      try {
        await pool.query(
          `UPDATE gold_loans SET status='closed', closed_date=$1 WHERE record_id=$2`,
          [data.date || getTodayStr(), record_id],
        );
        results.push('gold_loans closed');
      } catch (e) { errors.push(`gold_loans close: ${e.message}`); }
    }

    // FD open
    if ((txArr.includes('New FD') || txArr.includes('Fixed Deposit')) && record_id) {
      try {
        await upsert('fd_accounts', 'record_id', [
          record_id, data.fd_acc_no || null, data.mis_acc_no || null,
          data.fd_parvati_no || null, customer_name || data.customer_name,
          data.aadhar || null, data.mobile || null,
          parseFloat(data.fd_amount) || 0, parseInt(data.fd_period) || null,
          parseFloat(data.fd_interest_rate) || null, data.fd_maturity_date || null,
          parseFloat(data.fd_maturity_amount) || null, data.date || null, 'active', 'fd',
        ], ['record_id','fd_acc_no','mis_acc_no','fd_parvati_no','customer_name','aadhar','mobile',
            'fd_amount','fd_period','fd_interest_rate','fd_maturity_date','fd_maturity_amount','loan_date','status','section']);
        results.push('fd_accounts upserted');
      } catch (e) { errors.push(`fd_accounts: ${e.message}`); }
    }

    // FD close
    if (txArr.includes('Closing - FD') && record_id) {
      try {
        await pool.query(`UPDATE fd_accounts SET status='closed', closed_date=$1 WHERE record_id=$2`, [data.date || getTodayStr(), record_id]);
        results.push('fd_accounts closed');
      } catch (e) { errors.push(`fd_accounts close: ${e.message}`); }
    }

    // OD Loan open
    if ((txArr.includes('New FD-OD Loan') || txArr.includes('OD Loan')) && record_id) {
      try {
        await upsert('od_loans', 'record_id', [
          record_id, data.loan_acc_no || null, data.fd_acc_no || null,
          customer_name || data.customer_name,
          data.aadhar || null, data.mobile || null,
          parseFloat(data.loan_amount) || 0, parseFloat(data.fd_amount) || 0,
          data.fd_maturity_date || null, data.date || null, 'active',
        ], ['record_id','loan_acc_no','fd_acc_no','customer_name','aadhar','mobile','loan_amount','fd_amount','fd_maturity_date','loan_date','status']);
        results.push('od_loans upserted');
      } catch (e) { errors.push(`od_loans: ${e.message}`); }
    }

    // OD close
    if (txArr.includes('Closing - OD') && record_id) {
      try {
        await pool.query(`UPDATE od_loans SET status='closed', closed_date=$1 WHERE record_id=$2`, [data.date || getTodayStr(), record_id]);
        results.push('od_loans closed');
      } catch (e) { errors.push(`od_loans close: ${e.message}`); }
    }

    // Saving Account open
    if ((txArr.includes('Saving Account') || txArr.includes('New Sadasya') || txArr.includes('New Naammatr Sabhasad')) && record_id) {
      try {
        const { rows: existing } = await pool.query(`SELECT id FROM saving_accounts WHERE saving_acc_no=$1`, [data.saving_acc_no]);
        if (!existing.length && data.saving_acc_no) {
          await pool.query(
            `INSERT INTO saving_accounts (record_id, saving_acc_no, customer_name, aadhar, mobile, balance)
             VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
            [record_id, data.saving_acc_no, customer_name || data.customer_name,
             data.aadhar || null, data.mobile || null, parseFloat(data.saving_balance) || 0],
          );
          results.push('saving_accounts created');
        }
      } catch (e) { errors.push(`saving_accounts: ${e.message}`); }
    }

    // Saving balance update
    if ((txArr.includes('Saving Deposit') || txArr.includes('Saving Withdrawal')) && data.saving_acc_no) {
      try {
        const amt = parseFloat(data.deposit_amount) || 0;
        const delta = txArr.includes('Saving Withdrawal') ? -amt : amt;
        await pool.query(
          `UPDATE saving_accounts SET balance = balance + $1, updated_at=NOW() WHERE saving_acc_no=$2`,
          [delta, data.saving_acc_no],
        );
        results.push(`saving balance updated by ${delta}`);
      } catch (e) { errors.push(`saving balance: ${e.message}`); }
    }

    // Saving close
    if (txArr.includes('Closing - Saving Account')) {
      try {
        await pool.query(`UPDATE saving_accounts SET status='closed', closed_date=$1 WHERE saving_acc_no=$2`, [data.date || getTodayStr(), data.saving_acc_no]);
        results.push('saving_accounts closed');
      } catch (e) { errors.push(`saving_accounts close: ${e.message}`); }
    }

    // Membership
    if ((txArr.includes('New Sadasya') || txArr.includes('New Naammatr Sabhasad')) && record_id) {
      try {
        const mType = txArr.includes('New Sadasya') ? 'New Sadasya' : 'New Naammatr Sabhasad';
        await upsert('memberships', 'record_id', [
          record_id, customer_name || data.customer_name,
          data.aadhar || null, data.mobile || null,
          data.saving_acc_no || null, data.share_acc_no || null,
          mType, data.date || null, 'active',
        ], ['record_id','customer_name','aadhar','mobile','saving_acc_no','share_acc_no','membership_type','join_date','status']);
        results.push('memberships upserted');
      } catch (e) { errors.push(`memberships: ${e.message}`); }
    }

    res.json({ ok: errors.length === 0, results, errors });
  } catch (err) {
    errors.push(err.message);
    res.json({ ok: false, results, errors });
  }
}

// ── internal helper: upsert customer master ───────────────────────────────
async function upsertCustomer({ customer_id, name, aadhar, mobile, data = {} }) {
  try {
    if (!name) return;
    const key = customer_id || aadhar || mobile;
    if (!key) return;

    // Fix #6: ON CONFLICT (customer_id) never fires when customer_id is NULL because
    // NULL != NULL in unique constraints. Use a separate path for records without
    // a customer_id, falling back to aadhar or mobile as the natural key.
    if (customer_id) {
      await pool.query(
        `INSERT INTO customers (customer_id, name, aadhar, mobile, pan, dob, address, occupation, saving_acc_no, saving_balance, share_acc_no)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (customer_id) DO UPDATE SET
           name=EXCLUDED.name,
           aadhar=COALESCE(EXCLUDED.aadhar, customers.aadhar),
           mobile=COALESCE(EXCLUDED.mobile, customers.mobile),
           pan=COALESCE(EXCLUDED.pan, customers.pan),
           dob=COALESCE(EXCLUDED.dob, customers.dob),
           address=COALESCE(EXCLUDED.address, customers.address),
           occupation=COALESCE(EXCLUDED.occupation, customers.occupation),
           saving_acc_no=COALESCE(EXCLUDED.saving_acc_no, customers.saving_acc_no),
           saving_balance=COALESCE(EXCLUDED.saving_balance, customers.saving_balance),
           share_acc_no=COALESCE(EXCLUDED.share_acc_no, customers.share_acc_no),
           updated_at=NOW()`,
        [
          customer_id, name,
          data.aadhar || aadhar || null,
          data.mobile || mobile || null,
          data.pan || null, data.dob || null,
          data.address || null, data.occupation || null,
          data.saving_acc_no || null,
          parseFloat(data.saving_balance) || null,
          data.share_acc_no || null,
        ],
      );
    } else {
      // No customer_id — match on aadhar or mobile to avoid duplicates
      const matchKey = aadhar || data.aadhar || mobile || data.mobile;
      const matchCol = (aadhar || data.aadhar) ? 'aadhar' : 'mobile';
      const existing = await pool.query(
        `SELECT id FROM customers WHERE ${matchCol}=$1 LIMIT 1`, [matchKey],
      );
      if (existing.rows.length) {
        await pool.query(
          `UPDATE customers SET
             name=$1,
             aadhar=COALESCE($2, aadhar),
             mobile=COALESCE($3, mobile),
             pan=COALESCE($4, pan),
             dob=COALESCE($5, dob),
             address=COALESCE($6, address),
             occupation=COALESCE($7, occupation),
             saving_acc_no=COALESCE($8, saving_acc_no),
             saving_balance=COALESCE($9, saving_balance),
             share_acc_no=COALESCE($10, share_acc_no),
             updated_at=NOW()
           WHERE id=$11`,
          [name,
           data.aadhar || aadhar || null, data.mobile || mobile || null,
           data.pan || null, data.dob || null, data.address || null,
           data.occupation || null, data.saving_acc_no || null,
           parseFloat(data.saving_balance) || null, data.share_acc_no || null,
           existing.rows[0].id],
        );
      } else {
        await pool.query(
          `INSERT INTO customers (name, aadhar, mobile, pan, dob, address, occupation, saving_acc_no, saving_balance, share_acc_no)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [name,
           data.aadhar || aadhar || null, data.mobile || mobile || null,
           data.pan || null, data.dob || null, data.address || null,
           data.occupation || null, data.saving_acc_no || null,
           parseFloat(data.saving_balance) || null, data.share_acc_no || null],
        );
      }
    }
  } catch (err) { console.error('[upsertCustomer]', err.message); }
}

module.exports = {
  list, stats, listDeleted, getOne, create, update,
  softDelete, softDeletePatch, restore, permanentDelete,
  close, reopen, importBulk, processTransaction,
  nextLoanNo, checkLoanNo, nextFdAccNo, checkFdAccNo,
  nextMisAccNo, checkMisAccNo, customerSearch,
};
