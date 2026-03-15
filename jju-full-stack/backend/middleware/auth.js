'use strict';

const path = require('path');
const fs   = require('fs');

// ── Session persistence ────────────────────────────────────────────────────
// Sessions are saved to disk so pm2 restarts don't log everyone out.
const SESSION_FILE = path.join(__dirname, '..', '.sessions.json');
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const sessions = new Map(); // token -> { id, username, role, expiresAt }

// Load saved sessions from disk on startup
function loadSessionsFromDisk() {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      const raw = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      const now = Date.now();
      for (const [token, sess] of Object.entries(raw)) {
        if (sess.expiresAt > now) sessions.set(token, sess); // skip expired
      }
    }
  } catch (_) {} // ignore corrupt file
}

function saveSessionsToDisk() {
  try {
    const obj = {};
    for (const [token, sess] of sessions) obj[token] = sess;
    fs.writeFileSync(SESSION_FILE, JSON.stringify(obj), 'utf8');
  } catch (_) {}
}

loadSessionsFromDisk();

function createSession(user) {
  const token = require('crypto').randomBytes(32).toString('hex');
  sessions.set(token, {
    id:        user.id,
    username:  user.username,
    role:      user.role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  saveSessionsToDisk();
  return token;
}

function getSession(token) {
  if (!token) return null;
  const sess = sessions.get(token);
  if (!sess) return null;
  if (Date.now() > sess.expiresAt) {
    sessions.delete(token);
    saveSessionsToDisk();
    return null;
  }
  // Slide the expiry on activity
  sess.expiresAt = Date.now() + SESSION_TTL_MS;
  return sess;
}

function deleteSession(token) {
  sessions.delete(token);
  saveSessionsToDisk();
}

// Prune expired sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [token, sess] of sessions) {
    if (now > sess.expiresAt) { sessions.delete(token); changed = true; }
  }
  if (changed) saveSessionsToDisk();
}, 30 * 60 * 1000);

// FIX #2: middleware that protects every route it is applied to
// Also accepts token from query string (?token=) for window.open / download links
function requireAuth(req, res, next) {
  const token = req.headers['x-auth-token'] || req.query.token;
  const sess  = getSession(token);
  if (!sess) return res.status(401).json({ error: 'Not authenticated' });
  req.session = sess;
  next();
}

// Role-based access: requireRole('admin') — call after requireAuth
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ error: `Requires role: ${roles.join(' or ')}` });
    }
    next();
  };
}

module.exports = { sessions, createSession, getSession, deleteSession, requireAuth, requireRole };
