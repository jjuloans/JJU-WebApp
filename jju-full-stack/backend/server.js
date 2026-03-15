'use strict';
require('dotenv').config();
const express      = require('express');
const path         = require('path');
const fs           = require('fs');
const cors         = require('cors');
const pool         = require('./db/pool');                  // Fix 2: top-level import
const errorHandler = require('./middleware/errorHandler');
const { runMigrations } = require('./db/migrations');

// ── Route modules ──────────────────────────────────────────────────────────
const recordsRouter   = require('./routes/records.routes');
const cashbookRouter  = require('./routes/cashbook.routes');
const syncRouter      = require('./routes/sync.routes');
const dashboardRouter = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Remove strict CSP so the frontend can load CDN resources
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
  );
  next();
});

// ── Static frontend ────────────────────────────────────────────────────────
// Fix 1: resolve relative to project root, not blindly stepping up one level
// Compute the candidate path once so the same value is used for both the
// existence check and the actual usage (avoids a TOCTOU race).
const _frontendCandidate = path.join(__dirname, '..', 'frontend');
const FRONTEND = fs.existsSync(_frontendCandidate)
  ? _frontendCandidate
  : path.join(__dirname, 'frontend');
app.use(express.static(FRONTEND));

app.get('/', (req, res) => {
  const p = path.join(FRONTEND, 'index.html');
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send('index.html not found — place it in the frontend/ folder');
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.path}`);
  next();
});

app.use('/api/records',     recordsRouter);
app.use('/api/cashbook',    cashbookRouter);
app.use('/api/sync-sheets', syncRouter);
app.use('/api',             dashboardRouter);  // ← moved up, before 404 catcher

// ── Feature Routes ──────────────────────────────────────────────────────────
// safeRequire: if a feature module fails to load (missing file, syntax error,
// bad dependency) it returns a 503 stub so the rest of the server keeps running.
function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (e) {
    console.error(`⚠️  Could not load route module "${modulePath}": ${e.message}`);
    return (req, res) => res.status(503).json({ error: `Feature unavailable: ${modulePath}` });
  }
}

app.use('/api/audit',         safeRequire('./features/audit.routes'));
app.use('/api/notifications', safeRequire('./features/notifications.routes'));
app.use('/api/sms',           safeRequire('./features/sms.routes'));
app.use('/api/reports',       safeRequire('./features/reports.routes'));
app.use('/api/export',        safeRequire('./features/export.routes'));
app.use('/api/interest',      safeRequire('./features/interest.routes'));
app.use('/api/backup',        safeRequire('./features/backup.routes'));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    if (!pool || typeof pool.query !== 'function') {
      throw new Error('DB pool not initialised — check ./db/pool export');
    }
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected', uptime: process.uptime() });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error', error: e.message });
  }
});

// ── 404 for unknown API routes ─────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});

// ── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '4001', 10);
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`⚠️  Invalid PORT value "${process.env.PORT}" — must be a number between 1 and 65535`);
  process.exit(1);
}

// Fix 4: run migrations before opening the port so no request can arrive
// against a partially-migrated schema. A fatal migration error exits cleanly.
async function start() {
  try {
    await runMigrations();
  } catch (e) {
    console.error('⚠️  Migration failed — aborting startup:', e.message);
    console.error('   Check your DB_PASSWORD / DB_NAME in .env');
    process.exit(1);
  }

  app.listen(PORT, () => {
    // Fix 3: dynamic padding so the box stays correct for any port width
    const label = `  🏦  JJU Bank Server — port ${PORT}  `;
    const width = label.length + 2;
    const bar   = '═'.repeat(width);
    console.log('');
    console.log(`╔${bar}╗`);
    console.log(`║ ${label} ║`);
    console.log(`╚${bar}╝`);
    console.log(`\n🚀 Ready at http://localhost:${PORT}\n`);
  });
}

start();

// Export app for tests that only need the Express instance (e.g. supertest
// against an already-migrated test DB).  Export start() separately so test
// suites that need a fully migrated DB can await start() themselves.
module.exports = { app, start };
