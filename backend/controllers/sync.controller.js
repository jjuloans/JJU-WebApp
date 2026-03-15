'use strict';
const pool = require('../db/pool');

// Fix #2: track sync state in DB, not just in-process memory.
// In-process flag is still used as a fast-path guard within a single process,
// but the DB is the source of truth — so PM2 restarts don't leave orphaned rows.
let _syncInProgress = false;

// Fix #3: ensureSyncLog is called once at module load (not on every request).
// This avoids pg_catalog lock contention on every status/trigger call.
let _syncLogReady = false;
async function ensureSyncLog() {
  if (_syncLogReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sync_log (
      id          SERIAL PRIMARY KEY,
      started_at  TIMESTAMPTZ DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      status      TEXT DEFAULT 'running',
      message     TEXT,
      rows_synced INTEGER DEFAULT 0
    )
  `);
  // Fix #4: on startup, mark any orphaned 'running' rows as 'error'
  // so status() never incorrectly reports a past crash as still running.
  await pool.query(`
    UPDATE sync_log
    SET status='error', finished_at=NOW(), message='Server restarted mid-sync'
    WHERE status='running'
  `);
  // Fix #8: prune old rows — keep only the last 100 sync log entries
  await pool.query(`
    DELETE FROM sync_log
    WHERE id NOT IN (
      SELECT id FROM sync_log ORDER BY id DESC LIMIT 100
    )
  `);
  _syncLogReady = true;
}

// Initialise at module load so the first request never pays the cost
ensureSyncLog().catch(err => console.error('[sync] ensureSyncLog failed:', err.message));

// ── GET /api/sync-sheets/status ───────────────────────────────────────────
async function status(req, res) {
  try {
    // Fix #7: explicit column list instead of SELECT *
    const { rows } = await pool.query(
      `SELECT id, started_at, finished_at, status, message, rows_synced
       FROM sync_log ORDER BY id DESC LIMIT 1`,
    );
    const last = rows[0] || null;
    res.json({
      syncInProgress: _syncInProgress,
      lastSync: last ? {
        startedAt:  last.started_at,
        finishedAt: last.finished_at,
        status:     last.status,
        message:    last.message,
        rowsSynced: last.rows_synced,
      } : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ── POST /api/sync-sheets ─────────────────────────────────────────────────
async function trigger(req, res) {
  if (_syncInProgress) {
    return res.json({ ok: false, message: 'Sync already running. Please wait.' });
  }

  // Fix #1: create the log row and capture logId BEFORE sending the response,
  // so we always have a row to update and never risk a double-response on error.
  let logId = null;
  try {
    await ensureSyncLog();
    const { rows } = await pool.query(
      `INSERT INTO sync_log (status) VALUES ('running') RETURNING id`,
    );
    logId = rows[0].id;
  } catch (err) {
    return res.status(500).json({ ok: false, error: `Failed to start sync: ${err.message}` });
  }

  // Safe to respond now — logId is committed, in-progress flag set
  _syncInProgress = true;
  res.json({ ok: true, message: 'Sync started in background.', logId });

  // Fix #6: background work runs after response — clearly marked as a stub.
  // Replace the contents of this block with real sync logic when ready.
  setImmediate(async () => {
    try {
      const { rows: cnt } = await pool.query(
        `SELECT COUNT(*) FROM records WHERE is_deleted=FALSE`,
      );
      const total = parseInt(cnt[0].count);

      // ── STUB: replace this block with real Google Sheets sync logic ────────
      // e.g. await syncToGoogleSheets(records);
      await new Promise(r => setTimeout(r, 2000));
      // ── END STUB ───────────────────────────────────────────────────────────

      await pool.query(
        `UPDATE sync_log SET status='done', finished_at=NOW(), rows_synced=$1, message='Sync complete' WHERE id=$2`,
        [total, logId],
      );
    } catch (err) {
      console.error('[sync] background sync error:', err.message);
      await pool.query(
        `UPDATE sync_log SET status='error', finished_at=NOW(), message=$1 WHERE id=$2`,
        [err.message, logId],
      ).catch(() => {});
    } finally {
      _syncInProgress = false;
    }
  });
}

module.exports = { status, trigger };
