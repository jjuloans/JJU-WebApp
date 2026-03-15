"use strict";
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const { runMigrations } = require("./db/migrations");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ── CSP: allow CDN resources ────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;",
  );
  next();
});

// ── safeRequire — wrap ALL route modules ────────────────────────────────────
// If any route file has a syntax error / missing dependency it returns a 503
// stub so the REST of the server keeps running instead of crashing on startup.
function safeRequire(modulePath) {
  try {
    return require(modulePath);
  } catch (e) {
    console.error(`⚠️  Could not load "${modulePath}": ${e.message}`);
    const stub = express.Router();
    stub.use((req, res) =>
      res
        .status(503)
        .json({
          error: `Module unavailable: ${path.basename(modulePath)}`,
          detail: e.message,
        }),
    );
    return stub;
  }
}

// ── DB pool (imported after safeRequire is defined) ─────────────────────────
let pool;
try {
  pool = require("./db/pool");
} catch (e) {
  console.error("⚠️  DB pool failed to load:", e.message);
}

// ── Static frontend ─────────────────────────────────────────────────────────
// Looks for a sibling "frontend/" folder first, then a local one.
const _fc = path.join(__dirname, "..", "frontend");
const FRONTEND = fs.existsSync(_fc) ? _fc : path.join(__dirname, "frontend");
app.use(express.static(FRONTEND));

// Staff frontend  →  /  or  /index.html
app.get("/", (req, res) => {
  const p = path.join(FRONTEND, "index.html");
  if (fs.existsSync(p)) return res.sendFile(p);
  res
    .status(404)
    .send("index.html not found — place it in the frontend/ folder");
});

// Admin dashboard  →  /admin  or  /admin.html
app.get(["/admin", "/admin.html"], (req, res) => {
  const p = path.join(FRONTEND, "admin.html");
  if (fs.existsSync(p)) return res.sendFile(p);
  res
    .status(404)
    .send("admin.html not found — place it in the frontend/ folder");
});

// ── Request logger ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    console.log(`${new Date().toISOString()}  ${req.method} ${req.path}`);
  }
  next();
});

// ── Core API routes (all wrapped in safeRequire) ────────────────────────────
app.use("/api/records", safeRequire("./routes/records.routes"));
app.use("/api/cashbook", safeRequire("./routes/cashbook.routes"));
app.use("/api/sync-sheets", safeRequire("./routes/sync.routes"));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    if (!pool || typeof pool.query !== "function") {
      throw new Error(
        "DB pool not initialised — check DB_PASSWORD / DB_NAME in .env",
      );
    }
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected", uptime: process.uptime() });
  } catch (e) {
    res.status(500).json({ ok: false, db: "error", error: e.message });
  }
});

app.use("/api", safeRequire("./routes/dashboard.routes"));

// ── Feature routes (optional — 503 if not present) ──────────────────────────
app.use("/api/audit", safeRequire("./features/audit.routes"));
app.use("/api/notifications", safeRequire("./features/notifications.routes"));
app.use("/api/sms", safeRequire("./features/sms.routes"));
app.use("/api/reports", safeRequire("./features/reports.routes"));
app.use("/api/export", safeRequire("./features/export.routes"));
app.use("/api/interest", safeRequire("./features/interest.routes"));
app.use("/api/backup", safeRequire("./features/backup.routes"));

// ── 404 for unknown API routes ───────────────────────────────────────────────
app.use("/api/*", (req, res) => {
  res
    .status(404)
    .json({ error: `API route not found: ${req.method} ${req.path}` });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "4001", 10);
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`⚠️  Invalid PORT "${process.env.PORT}" — must be 1–65535`);
  process.exit(1);
}

async function start() {
  try {
    await runMigrations();
  } catch (e) {
    console.error("⚠️  Migration failed:", e.message);
    console.error("   Check DB_PASSWORD / DB_NAME in your .env file");
    process.exit(1);
  }

  app.listen(PORT, () => {
    const label = `  🏦  JJU Bank Server — port ${PORT}  `;
    const bar = "═".repeat(label.length + 2);
    console.log(`\n╔${bar}╗`);
    console.log(`║ ${label} ║`);
    console.log(`╚${bar}╝`);
    console.log(`\n  Staff frontend : http://localhost:${PORT}`);
    console.log(`  Admin dashboard: http://localhost:${PORT}/admin`);
    console.log(`  Health check   : http://localhost:${PORT}/api/health\n`);
  });
}

start();

module.exports = { app, start };
