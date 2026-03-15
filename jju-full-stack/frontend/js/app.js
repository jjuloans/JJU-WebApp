// JJU Bank — App Logic
// Requires: js/data/static-data.js loaded first

// ═══════════════════════════════════════
//  CONFIG — removed type_of_customer, account_no (Primary), sonar_group_no from visible form fields
// ═══════════════════════════════════════
// [static data moved to js/data/static-data.js]

// [static data moved to js/data/static-data.js]
const FM = {};
SECTIONS.forEach((s) =>
  s.fields.forEach((f) => (FM[f.id] = { ...f, secLabel: s.sec })),
);

// TF — remove type_of_customer, account_no, sonar_group_no from all arrays
const TF = {
  "Gold Loan": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "saving_balance",
    "loan_acc_no",
    "loan_amount",
    "loan_amount_words",
    "metal_type",
    "ornament_items",
    "comments",
    "photo_customer",
    "photo_ornament",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Slips - Loan": [
    "customer_name",
    "customer_id",
    "loan_acc_no",
    "mobile",
    "aadhar",
    "date",
    "loan_amount",
    "loan_amount_words",
    "comments",
  ],
  "Closing - Loan": [
    "customer_name",
    "customer_id",
    "aadhar",
    "mobile",
    "pan",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "loan_acc_no",
    "loan_amount",
    "loan_amount_words",
    "date",
    "nominee_name",
    "nominee_relation",
    "ornament_items",
    "comments",
    "photo_ornament",
  ],
  "New FD": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "fd_acc_no",
    "fd_parvati_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "saving_balance",
    "fd_amount",
    "fd_amount_words",
    "fd_period",
    "fd_interest_rate",
    "fd_maturity_date",
    "fd_maturity_amount",
    "fd_maturity_words",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Fixed Deposit": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "fd_acc_no",
    "fd_parvati_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "saving_balance",
    "fd_amount",
    "fd_amount_words",
    "fd_period",
    "fd_interest_rate",
    "fd_maturity_date",
    "fd_maturity_amount",
    "fd_maturity_words",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "FD - Slips": [
    "customer_name",
    "customer_id",
    "fd_acc_no",
    "fd_parvati_no",
    "saving_acc_no",
    "mobile",
    "aadhar",
    "date",
    "fd_amount",
    "fd_amount_words",
    "comments",
  ],
  "Closing - FD": [
    "customer_name",
    "customer_id",
    "aadhar",
    "mobile",
    "pan",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "fd_acc_no",
    "fd_parvati_no",
    "fd_amount",
    "fd_amount_words",
    "fd_period",
    "fd_maturity_date",
    "fd_maturity_amount",
    "fd_maturity_words",
    "date",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Closing - FD - Slips": [
    "customer_name",
    "customer_id",
    "fd_acc_no",
    "fd_parvati_no",
    "saving_acc_no",
    "mobile",
    "aadhar",
    "date",
    "fd_amount",
    "fd_amount_words",
    "fd_maturity_amount",
    "fd_maturity_words",
    "comments",
  ],
  "Saving Account": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "saving_balance",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Saving Deposit": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "saving_balance",
    "mobile",
    "pan",
    "aadhar",
    "date",
    "deposit_amount",
    "deposit_amount_words",
    "comments",
  ],
  "Saving Withdrawal": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "saving_balance",
    "mobile",
    "pan",
    "aadhar",
    "date",
    "deposit_amount",
    "deposit_amount_words",
    "comments",
  ],
  "Saving - Deposit Slip": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "saving_balance",
    "mobile",
    "pan",
    "aadhar",
    "date",
    "deposit_amount",
    "deposit_amount_words",
    "comments",
  ],
  "Saving - Withdrawal Slip": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "saving_balance",
    "mobile",
    "pan",
    "aadhar",
    "date",
    "deposit_amount",
    "deposit_amount_words",
    "comments",
  ],
  Sadasya: [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Sadasya - Slips": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "share_acc_no",
    "mobile",
    "aadhar",
    "date",
    "saving_balance",
    "comments",
  ],
  // Merged: New Sadasya = Sadasya form + Sadasya Slips in one selection
  "New Sadasya": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "saving_balance",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Closing - Saving Account": [
    "customer_name",
    "customer_id",
    "aadhar",
    "mobile",
    "pan",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "date",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "New FD-OD Loan": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "fd_acc_no",
    "fd_parvati_no",
    "loan_acc_no",
    "date",
    "nominee_name",
    "nominee_relation",
    "loan_amount",
    "loan_amount_words",
    "fd_amount",
    "fd_amount_words",
    "fd_maturity_date",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "OD Loan": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "fd_acc_no",
    "fd_parvati_no",
    "loan_acc_no",
    "date",
    "nominee_name",
    "nominee_relation",
    "loan_amount",
    "loan_amount_words",
    "fd_amount",
    "fd_amount_words",
    "fd_maturity_date",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Slips - FD-OD": [
    "customer_name",
    "customer_id",
    "loan_acc_no",
    "mobile",
    "aadhar",
    "date",
    "loan_amount",
    "loan_amount_words",
    "comments",
  ],
  "Slips - OD": [
    "customer_name",
    "customer_id",
    "loan_acc_no",
    "mobile",
    "aadhar",
    "date",
    "loan_amount",
    "loan_amount_words",
    "comments",
  ],
  "Closing - OD": [
    "customer_name",
    "customer_id",
    "aadhar",
    "mobile",
    "loan_acc_no",
    "loan_amount",
    "loan_amount_words",
    "date",
    "comments",
    "photo_customer",
  ],
  "Current Account": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Current - Slips": [
    "customer_name",
    "customer_id",
    "mobile",
    "aadhar",
    "date",
    "loan_amount",
    "loan_amount_words",
    "comments",
  ],
  "Shares Account": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Shares - Transfer": [
    "customer_name",
    "customer_id",
    "aadhar",
    "mobile",
    "share_acc_no",
    "date",
    "comments",
  ],
  "Naammatr Sabhasad Account": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "saving_balance",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  "Naammatr Sabhasad - Slips": [
    "customer_name",
    "customer_id",
    "saving_acc_no",
    "share_acc_no",
    "mobile",
    "aadhar",
    "date",
    "comments",
  ],
  // Merged: New Naammatr Sabhasad = Account form + Slips in one selection
  "New Naammatr Sabhasad": [
    "customer_name",
    "customer_id",
    "dob",
    "occupation",
    "mobile",
    "pan",
    "aadhar",
    "address",
    "saving_acc_no",
    "share_acc_no",
    "saving_balance",
    "date",
    "referral",
    "nominee_name",
    "nominee_relation",
    "comments",
    "photo_customer",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ],
  // ── FD Section: MIS Interest ─────────────────────────────────────────────────
  "MIS Interest": [
    "customer_name",
    "saving_acc_no",
    "mis_acc_no",
    "fd_parvati_no",
    "fd_amount",
    "fd_amount_words",
    "fd_period",
    "fd_interest_rate",
    "fd_maturity_date",
    "fd_maturity_amount",
    "fd_maturity_words",
    "date",
    "mis_month_select",
    "interest_amount",
    "interest_amount_words",
    "comments",
  ],
  // ── Office Maintenance Section ────────────────────────────────────────────────
  "Office Rent": [
    "date",
    "expense_amount",
    "expense_amount_words",
    "saving_acc_no",
    "comments",
  ],
  "Tea & Water Expense": [
    "date",
    "expense_amount",
    "expense_amount_words",
    "comments",
  ],
  "Office Maintenance": [
    "date",
    "expense_amount",
    "expense_amount_words",
    "saving_acc_no",
    "comments",
  ],
  "Printing & Stationary": [
    "date",
    "expense_amount",
    "expense_amount_words",
    "comments",
  ],
  "Employee Salary": [
    "customer_name",
    "date",
    "salary_month_select",
    "expense_amount",
    "expense_amount_words",
    "saving_acc_no",
    "comments",
  ],
  // ── Bank Transactions Section ─────────────────────────────────────────────────
  "Payment Received - Online": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  "Payment Transfer - Online": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  RTGS: [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "rtgs_beneficiary_name",
    "rtgs_beneficiary_bank",
    "rtgs_beneficiary_acc_no",
    "rtgs_beneficiary_ifsc",
    "comments",
  ],
  "Bank Charges": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  "Other Bank - Cash Withdrawal": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  "Other Bank - Cash Deposit": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  TDS: [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
  "Interest Received on FD from Other Bank": [
    "date",
    "customer_name",
    "saving_acc_no",
    "bank_acc_name",
    "fd_acc_no",
    "expense_acc_no",
    "expense_amount",
    "expense_amount_words",
    "upi_rrn",
    "cheque_no",
    "comments",
  ],
};

// [static data moved to js/data/static-data.js]

// ═══════════════════════════════════════
//  STATE
// ═══════════════════════════════════════
let checked = new Set(),
  photos = {},
  ctype = "regular";
let dbOff = 0,
  dbTot = 0,
  editId = null,
  searchTmr = null;
let dbTxFilter = "",
  dbTxTypeFilter = "",
  dbStatusFilter = "";
let impRows = [],
  impCols = [];
const API = "/api/records";

// ── Standalone Auth ──────────────────────────────────────────────────
let _appToken = localStorage.getItem('jju_token') || null;
let _appRedirecting = false;

const _origFetch = window.fetch;
window.fetch = function(url, opts = {}) {
  _appToken = localStorage.getItem('jju_token');
  if (_appToken && typeof url === 'string' && url.includes('/api/')) {
    opts = { ...opts, headers: { ...(opts.headers || {}), 'x-auth-token': _appToken } };
  }
  return _origFetch(url, opts).then(res => {
    if ((res.status === 401 || res.status === 403) && !_appRedirecting) {
      _appRedirecting = true;
      localStorage.removeItem('jju_token');
      _appToken = null;
      requestAnimationFrame(() => showAppLogin());
    }
    return res;
  });
};

async function appDoLogin() {
  const username = document.getElementById('app-login-username').value.trim();
  const password = document.getElementById('app-login-password').value;
  const btn = document.getElementById('app-login-btn');
  const msg = document.getElementById('app-login-msg');
  if (!username || !password) {
    msg.innerHTML = '<div style="color:#c0392b;font-size:13px;margin-bottom:10px;">Please enter username and password</div>';
    return;
  }
  btn.textContent = 'Signing in...'; btn.disabled = true;
  try {
    const res = await _origFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.error) {
      msg.innerHTML = `<div style="color:#c0392b;font-size:13px;margin-bottom:10px;">❌ ${data.error}</div>`;
      btn.textContent = 'Sign In →'; btn.disabled = false;
      return;
    }
    _appToken = data.token;
    localStorage.setItem('jju_token', _appToken);
    _appRedirecting = false;
    document.getElementById('app-login-screen').style.display = 'none';
    document.getElementById('app-main-wrap').style.display = 'block';
    btn.textContent = 'Sign In →'; btn.disabled = false;
    // Re-init app now that we're logged in
    document.getElementById("dash-date").textContent = new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
    renderTxList(); checkServer(); loadDashboard(); setInterval(checkServer, 30000);
  } catch(e) {
    msg.innerHTML = `<div style="color:#c0392b;font-size:13px;margin-bottom:10px;">❌ Cannot connect to server</div>`;
    btn.textContent = 'Sign In →'; btn.disabled = false;
  }
}

function showAppLogin() {
  localStorage.removeItem('jju_token');
  _appToken = null;
  document.getElementById('app-login-screen').style.display = 'flex';
  document.getElementById('app-main-wrap').style.display = 'none';
  setTimeout(() => document.getElementById('app-login-username').focus(), 100);
}

async function appCheckAuth() {
  if (!_appToken) { showAppLogin(); return false; }
  try {
    const res = await _origFetch('/api/auth/me', { headers: { 'x-auth-token': _appToken } });
    if (!res.ok) { showAppLogin(); return false; }
    document.getElementById('app-login-screen').style.display = 'none';
    document.getElementById('app-main-wrap').style.display = 'block';
    return true;
  } catch { showAppLogin(); return false; }
}
// ── End Auth ─────────────────────────────────────────────────────────

// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════
addEventListener("DOMContentLoaded", async () => {
  const ok = await appCheckAuth();
  if (!ok) return;
  document.getElementById("dash-date").textContent =
    new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  renderTxList();
  checkServer();
  loadDashboard();
  setInterval(checkServer, 30000);
});

async function checkServer() {
  const el = document.getElementById("conn");
  try {
    const r = await fetch(API + "/stats");
    if (r.ok) {
      el.textContent = "● Online";
      el.className = "conn online";
      // If we just came back online, remove the banner and reload data
      const banner = document.getElementById("offline-banner");
      if (banner) {
        banner.remove();
        loadDashboard();
        loadDB();
      }
    } else {
      el.textContent = "● Error";
      el.className = "conn offline";
      showOfflineBanner();
    }
  } catch {
    el.textContent = "● Offline";
    el.className = "conn offline";
    showOfflineBanner();
  }
}

// ═══════════════════════════════════════
//  GOOGLE SHEETS SYNC
// ═══════════════════════════════════════
async function loadSheetsLastSync() {
  // Read the sync timestamp from Z1 in the sheet via a backend endpoint
  // Falls back gracefully if not available
  try {
    const r = await fetch("/api/sync-sheets/status");
    if (!r.ok) return;
    const { syncInProgress } = await r.json();
    const el = document.getElementById("sheets-last-sync");
    if (!el) return;
    if (syncInProgress) {
      el.textContent = "⏳ Sync running…";
      el.style.color = "#e67e22";
    }
  } catch {}
}

async function triggerSheetsSync() {
  const btn = document.getElementById("sheets-sync-btn");
  const icon = document.getElementById("sheets-sync-icon");
  const status = document.getElementById("sheets-sync-status");
  if (!btn) return;

  // Disable button while syncing
  btn.disabled = true;
  btn.style.opacity = "0.6";
  icon.textContent = "⏳";
  status.style.display = "block";
  status.innerHTML =
    '<span style="color:#e67e22;font-weight:700">⏳ Sync started — running in background. This usually takes 10–30 seconds…</span>';

  try {
    const r = await fetch("/api/sync-sheets", { method: "POST" });
    const data = await r.json();

    if (data.ok) {
      status.innerHTML =
        '<span style="color:#27ae60;font-weight:700">✅ Sync request accepted! Google Sheet will be updated shortly. Check PM2 logs for progress.</span>';
      icon.textContent = "✅";
      // Poll status for up to 60 seconds
      let polls = 0;
      const poll = setInterval(async () => {
        polls++;
        try {
          const sr = await fetch("/api/sync-sheets/status");
          const sd = await sr.json();
          if (!sd.syncInProgress) {
            clearInterval(poll);
            status.innerHTML =
              '<span style="color:#27ae60;font-weight:700">✅ Sync complete! Google Sheet is now up to date.</span>';
            icon.textContent = "🔄";
            btn.disabled = false;
            btn.style.opacity = "1";
          }
        } catch {}
        if (polls > 60) clearInterval(poll); // stop polling after 60s
      }, 1000);
    } else {
      status.innerHTML = `<span style="color:#e67e22;font-weight:700">⚠️ ${data.message}</span>`;
      icon.textContent = "🔄";
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  } catch (e) {
    status.innerHTML =
      '<span style="color:#c0392b;font-weight:700">❌ Could not reach server. Make sure the app is running.</span>';
    icon.textContent = "🔄";
    btn.disabled = false;
    btn.style.opacity = "1";
  }
}

// ═══════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════
async function loadDashboard() {
  const fmtAmt = (n) => {
    if (!n || n === 0) return "—";
    if (n >= 10000000) return "₹ " + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "₹ " + (n / 100000).toFixed(2) + " L";
    return "₹ " + Number(n).toLocaleString("en-IN");
  };
  try {
    const s = await (await fetch(API + "/stats")).json();

    // KPI row
    document.getElementById("s-total").textContent = s.total;
    document.getElementById("s-today").textContent = s.today;
    document.getElementById("s-active-gold").textContent =
      s.activeGold ?? "—";
    document.getElementById("s-active-fd").textContent =
      s.activeFD ?? "—";
    document.getElementById("s-gold-amt").textContent = fmtAmt(
      s.totalGoldLoanAmt,
    );
    document.getElementById("s-fd-amt").textContent = fmtAmt(
      s.totalFDDepositAmt,
    );

    // Today activity
    document.getElementById("s-today-opened").textContent =
      s.todayOpenedGold ?? 0;
    document.getElementById("s-today-closed").textContent =
      s.todayClosedGold ?? 0;
    document.getElementById("s-active-gold2").textContent =
      s.activeGold ?? "—";
    document.getElementById("s-closed-gold").textContent =
      s.closedGold ?? "—";

    // Data errors
    const de = s.dataErrors || {};
    const totalErrors =
      (de.missingLoanAmt || 0) +
      (de.missingName || 0) +
      (de.missingDate || 0) +
      (de.dupLoanAcc || 0);
    const errEl = document.getElementById("data-errors-list");
    if (totalErrors === 0) {
      errEl.innerHTML =
        '<div style="color:#27ae60;font-weight:800;font-size:11pt;padding:6px 0">✅ No data errors found!</div><div style="font-size:8.5pt;color:#555">All records look clean.</div>';
    } else {
      const rows = [
        de.missingLoanAmt > 0
          ? `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #eee"><span>❌ Missing Loan Amount</span><span style="background:#fadbd8;color:#c0392b;font-weight:800;padding:1px 8px;border-radius:10px">${de.missingLoanAmt}</span></div>`
          : "",
        de.missingName > 0
          ? `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #eee"><span>❌ Missing Customer Name</span><span style="background:#fadbd8;color:#c0392b;font-weight:800;padding:1px 8px;border-radius:10px">${de.missingName}</span></div>`
          : "",
        de.missingDate > 0
          ? `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #eee"><span>⚠️ Missing Date</span><span style="background:#fef3cd;color:#856404;font-weight:800;padding:1px 8px;border-radius:10px">${de.missingDate}</span></div>`
          : "",
        de.dupLoanAcc > 0
          ? `<div style="display:flex;justify-content:space-between;padding:4px 0"><span>⚠️ Duplicate Loan Acc No.</span><span style="background:#fef3cd;color:#856404;font-weight:800;padding:1px 8px;border-radius:10px">${de.dupLoanAcc}</span></div>`
          : "",
      ]
        .filter(Boolean)
        .join("");
      errEl.innerHTML =
        `<div style="font-size:9pt;color:#555;margin-bottom:4px">Found <strong style="color:#c0392b">${totalErrors}</strong> issue(s):</div>` +
        rows;
      if (de.dupLoanAccList && de.dupLoanAccList.length) {
        errEl.innerHTML += `<div style="font-size:8pt;color:#856404;margin-top:4px">Dup acc: ${de.dupLoanAccList.map((r) => r.account_no).join(", ")}</div>`;
      }
    }

    // Recently closed loans
    const rcEl = document.getElementById("recent-closed-list");
    if (s.recentClosed && s.recentClosed.length) {
      rcEl.innerHTML = s.recentClosed
        .map(
          (r) =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px dashed #eee;gap:6px">
          <div style="min-width:0">
            <div style="font-weight:800;font-size:9pt;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.name || "—"}</div>
            <div style="font-size:8pt;color:#555">${r.account_no || "—"} · ${r.closed_date || "—"}</div>
          </div>
          <div style="font-size:8.5pt;font-weight:800;color:#1a5276;white-space:nowrap">${r.loan_amount ? "₹ " + Number(r.loan_amount).toLocaleString("en-IN") : ""}</div>
        </div>`,
        )
        .join("");
    } else {
      rcEl.innerHTML =
        '<div style="color:#aaa;font-size:9pt">No closed loans yet</div>';
    }

    // Section breakdown bars
    const bS = {};
    (s.bySection || []).forEach((r) => (bS[r.section] = r.count));
    const maxC = Math.max(1, ...Object.values(bS));
    document.getElementById("tx-breakdown").innerHTML = Object.entries(SL)
      .map(([k, l]) => {
        const c = bS[k] || 0,
          p = Math.round((c / maxC) * 100);
        return `<div class="bar-row"><div class="bar-lbl">${l}</div><div class="bar-wrap"><div class="bar-fill" style="width:${p}%;background:${SC[k]}"></div></div><div class="bar-cnt" style="color:${SC[k]}">${c}</div></div>`;
      })
      .join("");

    // Section summary card
    const secNames = {
      gold: "🥇 Gold Loan",
      fd: "📈 Fixed Deposit",
      saving: "💰 Saving",
      office: "🏢 Office",
      bank: "🏦 Bank",
      od: "📋 OD Loan",
      general: "📄 General",
    };
    document.getElementById("section-summary").innerHTML =
      Object.entries(bS)
        .sort((a, b) => b[1] - a[1])
        .map(
          ([k, c]) =>
            `<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dashed #eee;font-size:9pt"><span style="font-weight:700">${secNames[k] || k}</span><span style="font-weight:800;color:#1a3a5c">${c}</span></div>`,
        )
        .join("") ||
      '<div style="color:#aaa;font-size:9pt">No data</div>';

    // Recent records
    const rec = s.recent || [];
    document.getElementById("recent-list").innerHTML = rec.length
      ? rec
          .map((r) => {
            const sonarTag = r.sonar_sub_no
              ? '<span class="stag">' + r.sonar_sub_no + "</span>"
              : "";
            const bg = SB[r.section] || "#eee";
            const icon = SI[r.section] || "📄";
            return (
              '<div class="rrow" onclick="showPage(\'database\')">' +
              '<div class="rav" style="background:' +
              bg +
              '">' +
              icon +
              "</div>" +
              '<div style="flex:1;min-width:0"><div class="rname">' +
              (r.name || "—") +
              sonarTag +
              "</div>" +
              '<div class="rtx">' +
              (r.tx_types || "").substring(0, 34) +
              "</div></div>" +
              '<div class="rdate">' +
              (r.date || "—") +
              "</div>" +
              '<button class="rpdf" onclick="event.stopPropagation();pdfRec(' +
              r.id +
              ')">📄</button>' +
              "</div>"
            );
          })
          .join("")
      : '<div class="empty-st"><div class="ei">📭</div><p>No records yet</p></div>';

    // Update date/time in banner
    const now = new Date();
    document.getElementById("dash-date").textContent =
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  } catch (e) {
    document.getElementById("recent-list").innerHTML =
      `<div class="empty-st"><div class="ei">❌</div><p>Server offline — check connection</p></div>`;
    document.getElementById("tx-breakdown").innerHTML =
      `<div style="font-size:10px;color:var(--textl)">— offline —</div>`;
    [
      "s-total",
      "s-today",
      "s-active-gold",
      "s-active-fd",
      "s-gold-amt",
      "s-fd-amt",
      "s-today-opened",
      "s-today-closed",
      "s-active-gold2",
      "s-closed-gold",
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "—";
    });
    showOfflineBanner();
  }

  // Load Sheets sync status (non-blocking)
  loadSheetsLastSync().catch(() => {});
}

function showOfflineBanner() {
  if (document.getElementById("offline-banner")) return;
  const banner = document.createElement("div");
  banner.id = "offline-banner";
  banner.style.cssText =
    "position:fixed;top:60px;left:0;right:0;z-index:9999;background:#c0392b;color:#fff;padding:10px 16px;display:flex;align-items:center;gap:12px;font-family:Nunito,sans-serif;font-size:12px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.3)";
  banner.innerHTML = `
    <span style="font-size:16px">⚡</span>
    <span style="flex:1">Cannot connect to server. Make sure the server is running: <code style="background:rgba(255,255,255,.2);padding:1px 6px;border-radius:3px">npm start</code> then open <code style="background:rgba(255,255,255,.2);padding:1px 6px;border-radius:3px">http://localhost:4001</code></span>
    <button onclick="document.getElementById('offline-banner').remove();loadDashboard();loadDB();" style="background:#fff;color:#c0392b;border:none;border-radius:5px;padding:5px 14px;cursor:pointer;font-weight:800;font-size:11px;font-family:Nunito,sans-serif">🔄 Retry</button>
    <button onclick="document.getElementById('offline-banner').remove()" style="background:transparent;border:1.5px solid rgba(255,255,255,.5);color:#fff;border-radius:5px;padding:5px 10px;cursor:pointer;font-size:11px">✕</button>
  `;
  document.body.appendChild(banner);
}

// ═══════════════════════════════════════
//  TX LIST
// ═══════════════════════════════════════
function renderTxList() {
  document.getElementById("tx-list").innerHTML = GROUPS.map(
    (g) =>
      `<div class="tx-group-lbl">${g.label}</div>` +
      g.types
        .map(
          (
            tx,
          ) => `<div class="tx-row" id="row-${sid(tx)}" onclick="toggleTx('${tx}')">
<div class="tx-cb" id="cb-${sid(tx)}">✓</div>
<div class="tx-dot" style="background:${g.color}"></div>
<div class="tx-lbl">${tx}</div></div>`,
        )
        .join(""),
  ).join("");
}
function sid(t) {
  return t.replace(/[\s\-]+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
}
function toggleTx(tx) {
  if (checked.has(tx)) checked.delete(tx);
  else checked.add(tx);
  document
    .getElementById("row-" + sid(tx))
    .classList.toggle("on", checked.has(tx));
  document.getElementById("sel-count").textContent = checked.size;
  document.getElementById("go-btn").disabled = !checked.size;
  updateGoBtnLabel();
  window.checked = checked;
  updateCBPreview();
}
function selAll() {
  GROUPS.forEach((g) =>
    g.types.forEach((tx) => {
      checked.add(tx);
      document.getElementById("row-" + sid(tx)).classList.add("on");
    }),
  );
  document.getElementById("sel-count").textContent = checked.size;
  document.getElementById("go-btn").disabled = false;
  updateGoBtnLabel();
  window.checked = checked;
  updateCBPreview();
}
function selNone() {
  checked.clear();
  photos = {};
  document
    .querySelectorAll(".tx-row")
    .forEach((r) => r.classList.remove("on"));
  document.getElementById("sel-count").textContent = 0;
  document.getElementById("go-btn").disabled = true;
  document.getElementById("form-empty").style.display = "";
  document.getElementById("form-card").classList.remove("show");
  document.getElementById("action-bar").classList.remove("show");
  document.getElementById("cb-preview-panel").classList.remove("show");
}

// ── Multi-check ornament dropdown helpers ─────────────────────────────────────
function mchkToggle(id) {
  const drop = document.getElementById("mchk-drop-" + id);
  const btn = document.getElementById("mchk-btn-" + id);
  if (!drop || !btn) return;
  const isOpen = drop.classList.contains("open");
  document
    .querySelectorAll(".mchk-dropdown.open")
    .forEach((d) => d.classList.remove("open"));
  document
    .querySelectorAll(".mchk-trigger.open")
    .forEach((b) => b.classList.remove("open"));
  if (!isOpen) {
    drop.classList.add("open");
    btn.classList.add("open");
  }
}
function mchkUpdate(id) {
  const drop = document.getElementById("mchk-drop-" + id);
  if (!drop) return;
  const sel = [
    ...drop.querySelectorAll("input[type=checkbox]:checked"),
  ].map((c) => c.value);
  const custom = (
    document.getElementById("mchk-custom-" + id)?.value || ""
  ).trim();
  const all = [...sel, custom].filter(Boolean);
  const hiddenEl = document.getElementById("f-" + id);
  if (hiddenEl) hiddenEl.value = all.join(", ");
  const lbl = document.getElementById("mchk-lbl-" + id);
  if (lbl) {
    lbl.innerHTML = all.length
      ? all.map((o) => `<span class="mchk-tag">${o}</span>`).join("")
      : '<span style="color:var(--textl)">Select ornaments…</span>';
  }
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".mchk-wrap")) {
    document
      .querySelectorAll(".mchk-dropdown.open")
      .forEach((d) => d.classList.remove("open"));
    document
      .querySelectorAll(".mchk-trigger.open")
      .forEach((b) => b.classList.remove("open"));
  }
});

function updateCBPreview() {
  const panel = document.getElementById("cb-preview-panel");
  const rowsEl = document.getElementById("cb-preview-rows");
  if (!checked.size) {
    panel.classList.remove("show");
    return;
  }

  // Build deduplicated rows (same logic as addCashbookRows)
  const skipTypes = new Set();
  if (checked.has("Gold Loan") && checked.has("Slips - Loan"))
    skipTypes.add("Slips - Loan");
  if (checked.has("Fixed Deposit") && checked.has("FD - Slips"))
    skipTypes.add("FD - Slips");
  if (checked.has("Gold Loan") && checked.has("Saving Account"))
    skipTypes.add("Saving Account");
  // Skip Saving Account when New Sadasya selected — New Sadasya covers all 4 rows
  if (checked.has("New Sadasya") && checked.has("Saving Account"))
    skipTypes.add("Saving Account");
  const hasGoldLoan = checked.has("Gold Loan");

  const allRows = [];
  [...checked].forEach((tx) => {
    if (skipTypes.has(tx)) return;
    const rows = CB_TX_ROWS_MAP[tx];
    if (!rows) return;
    rows.forEach((r) => {
      if (r.skipWhenGoldLoan && hasGoldLoan) return;
      allRows.push({ ...r, txLabel: tx });
    });
  });
  if (!allRows.length) {
    panel.classList.remove("show");
    return;
  }
  const isCr = (r) => r.tx_type === "Credit";
  rowsEl.innerHTML = allRows
    .map((r) => {
      const cr = isCr(r);
      const amtLabel =
        typeof r.amountField === "number" && r.amountField > 0
          ? `<span style="font-size:9px;font-weight:700;color:var(--mint-a)">₹ ${r.amountField}</span>`
          : r.amountField
            ? `<span style="font-size:9px;opacity:.6">₹ from form</span>`
            : `<span style="font-size:9px;opacity:.6">₹ manual</span>`;
      return `<div class="cb-preview-row ${cr ? "cr" : "db"}">
<span class="cb-badge ${cr ? "cr" : "db"}">${cr ? "CR" : "DR"}</span>
<span class="cb-badge ${r.mode === "Transfer" ? "trf" : "cash"}">${r.mode}</span>
<span style="flex:1;font-weight:700">${r.task}</span>
<span style="opacity:.7;font-size:9px">${r.acc_no}</span>
${amtLabel}
    </div>`;
    })
    .join("");
  panel.classList.add("show");
}

function setCtype(t) {
  ctype = t;
  document.getElementById("btn-reg").className =
    "ctype-btn" + (t === "regular" ? " reg-on" : "");
  document.getElementById("btn-son").className =
    "ctype-btn" + (t === "sonar" ? " son-on" : "");
  updateGoBtnLabel();
  photos = {};
  document.getElementById("form-card").innerHTML = "";
  document.getElementById("form-card").classList.remove("show");
  document.getElementById("form-empty").style.display = "";
  document.getElementById("action-bar").classList.remove("show");
  const strip = document.getElementById("sonar-group-strip");
  if (strip) strip.classList.toggle("show", t === "sonar");
  if (t === "sonar") {
    sonarInit();
    setTimeout(
      () => document.getElementById("sonar-main-inp")?.focus(),
      120,
    );
  } else {
    const inp = document.getElementById("sonar-main-inp");
    if (inp) inp.value = "";
    document.getElementById("sonar-existing-strip").innerHTML = "";
    document.getElementById("sonar-next-badge").style.display = "none";
  }
}

function onGoBtn() {
  if (ctype === "sonar") {
    if (!checked.size) {
      toast("Select at least one transaction type first", "err");
      return;
    }
    const loanNo = document
      .getElementById("sonar-main-inp")
      ?.value?.trim();
    if (!loanNo) {
      toast("Enter Loan Number first", "err");
      document.getElementById("sonar-main-inp")?.focus();
      return;
    }
    buildForm();
  } else {
    buildForm();
  }
}
function updateGoBtnLabel() {
  const btn = document.getElementById("go-btn");
  if (ctype === "sonar") {
    btn.textContent = "✔ Types Selected";
  } else {
    btn.textContent = "Fill Form →";
  }
}

// ── Ornament Items Dynamic Table ──
function ornAddRow(prefill) {
  const tbody = document.getElementById("orn-items-tbody");
  if (!tbody) return;
  const tr = document.createElement("tr");
  const name = prefill ? prefill.name : "";
  const qty = prefill ? prefill.qty : "1";
  const wt = prefill ? prefill.weight : "";
  tr.innerHTML =
    '<td style="border:1px solid #ddd;padding:3px 4px">' +
    '<input type="text" aria-label="Ornament name" placeholder="e.g. Gold Chain / गोल्ड चेन" value="' +
    name +
    '" oninput="ornUpdateSummary()" ' +
    'style="width:100%;padding:5px 7px;border:1px solid #ccc;border-radius:5px;font-size:12px;font-family:Nunito,sans-serif;box-sizing:border-box" data-orn="name">' +
    "</td>" +
    '<td style="border:1px solid #ddd;padding:3px 4px">' +
    '<input type="number" min="1" aria-label="Ornament quantity" value="' +
    qty +
    '" oninput="ornUpdateSummary()" ' +
    'style="width:100%;padding:5px 7px;border:1px solid #ccc;border-radius:5px;font-size:12px;font-family:Nunito,sans-serif;box-sizing:border-box;text-align:center" data-orn="qty">' +
    "</td>" +
    '<td style="border:1px solid #ddd;padding:3px 4px">' +
    '<input type="number" min="0" step="0.01" aria-label="Ornament weight in grams" placeholder="0.00" value="' +
    wt +
    '" oninput="ornUpdateSummary()" ' +
    'style="width:100%;padding:5px 7px;border:1px solid #ccc;border-radius:5px;font-size:12px;font-family:Nunito,sans-serif;box-sizing:border-box;text-align:center" data-orn="weight">' +
    "</td>" +
    '<td style="border:1px solid #ddd;padding:3px 4px;text-align:center">' +
    '<button type="button" onclick="this.closest(\'tr\').remove();ornUpdateSummary()" ' +
    'style="background:#c62828;color:#fff;border:none;border-radius:4px;width:28px;height:28px;cursor:pointer;font-size:14px;line-height:1">✕</button>' +
    "</td>";
  tbody.appendChild(tr);
  ornUpdateSummary();
  tr.querySelector('[data-orn="name"]').focus();
}
function ornUpdateSummary() {
  const items = ornGetItems();
  const totalQty = items.reduce((s, r) => s + (parseInt(r.qty) || 0), 0);
  const totalWt = items.reduce(
    (s, r) => s + (parseFloat(r.weight) || 0),
    0,
  );
  const el = document.getElementById("orn-items-summary");
  if (el) {
    if (items.length) {
      const wtStr = totalWt > 0 ? ` | ${totalWt.toFixed(2)} gm` : "";
      el.textContent = `एकूण: ${items.length} प्रकार | ${totalQty} नग${wtStr}`;
    } else {
      el.textContent = "";
    }
  }
  // Keep hidden field in sync for collect()
  const hid = document.getElementById("f-ornament_items");
  if (hid) hid.value = items.length ? JSON.stringify(items) : "";
}
function ornGetItems() {
  const tbody = document.getElementById("orn-items-tbody");
  if (!tbody) return [];
  return Array.from(tbody.rows)
    .map((tr) => {
      const wtVal = tr.querySelector('[data-orn="weight"]')?.value;
      const wt =
        wtVal !== "" && wtVal !== null && wtVal !== undefined
          ? parseFloat(wtVal)
          : null;
      return {
        name: (tr.querySelector('[data-orn="name"]')?.value || "").trim(),
        qty: parseFloat(tr.querySelector('[data-orn="qty"]')?.value) || 1,
        weight: wt !== null && !isNaN(wt) ? wt : null,
      };
    })
    .filter((r) => r.name);
}

function buildForm() {
  if (!checked.size) return;
  const txArr = [...checked];
  const needed = new Set();
  txArr.forEach((tx) => (TF[tx] || []).forEach((f) => needed.add(f)));
  // Determine section so we can conditionally show loan number prefill
  let section = "general";
  for (const g of GROUPS) {
    if (txArr.some((t) => g.types.includes(t))) {
      section = g.section;
      break;
    }
  }
  let html =
    '<div class="form-card-title">📝 Customer Form</div>' +
    '<div class="form-card-sub">Forms: <strong>' +
    txArr.join(" · ") +
    "</strong></div>";
  // Determine if this is a deposit-only or withdrawal-only form for label override
  const isWithdrawalOnly =
    txArr.some((t) => t === "Saving Withdrawal") &&
    !txArr.some((t) => t === "Saving Deposit");
  const isDepositOnly =
    txArr.some((t) => t === "Saving Deposit") &&
    !txArr.some((t) => t === "Saving Withdrawal");

  SECTIONS.forEach((s) => {
    const vis = s.fields.filter((f) => needed.has(f.id));
    if (!vis.length) return;
    html += '<div class="sec-lbl">' + s.sec + '</div><div class="fgrid">';
    vis.forEach((f) => {
      // Override deposit_amount label based on transaction type
      if (f.id === "deposit_amount") {
        f = Object.assign({}, f, {
          label: isWithdrawalOnly
            ? "Withdrawal Amount (₹)"
            : isDepositOnly
              ? "Deposit Amount (₹)"
              : f.label,
        });
      }
      const cls = f.w === 2 ? "fw" : "",
        req = f.req ? '<span class="req"> *</span>' : "";
      const today = "";
      if (f.type === "photo") {
        html +=
          '<div class="field ' +
          cls +
          '"><label>' +
          f.label +
          "</label>" +
          '<div class="photo-box" id="pbox-' +
          f.id +
          '">' +
          '<div class="ph-hint"><div class="ph-icon">📷</div><div class="ph-lbl">Tap to add</div></div>' +
          '<input type="file" aria-label="Upload photo" accept="image/*" capture="environment" onchange="onPhoto(\'' +
          f.id +
          "',this)\">" +
          "</div></div>";
      } else if (f.type === "multicheck") {
        const opts = (f.opts || [])
          .map(
            (o) =>
              `<label class="mchk-item"><input type="checkbox" aria-label="${o}" value="${o}" onchange="mchkUpdate('${f.id}')"><span>${o}</span></label>`,
          )
          .join("");
        html +=
          '<div class="field ' +
          cls +
          '"><label>' +
          f.label +
          req +
          "</label>" +
          '<div class="mchk-wrap">' +
          '<button type="button" class="mchk-trigger" id="mchk-btn-' +
          f.id +
          '" onclick="mchkToggle(\'' +
          f.id +
          "')\">" +
          '<span id="mchk-lbl-' +
          f.id +
          '" style="font-size:12px;color:var(--textl)">Select ornaments…</span>' +
          '<span style="font-size:10px;color:var(--textl)">▼</span>' +
          "</button>" +
          '<div class="mchk-dropdown" id="mchk-drop-' +
          f.id +
          '">' +
          '<label class="mchk-item" style="background:var(--lem);font-weight:700"><input type="checkbox" id="mchk-other-' +
          f.id +
          '" style="display:none"><span style="color:var(--lem-a);font-size:11px">✏️ Type custom below</span></label>' +
          '<input type="text" id="mchk-custom-' +
          f.id +
          '" placeholder="Custom ornament name…" oninput="mchkUpdate(\'' +
          f.id +
          '\')" style="width:calc(100% - 24px);margin:0 12px 8px;padding:6px 9px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Nunito,sans-serif">' +
          opts +
          "</div>" +
          '<input type="hidden" id="f-' +
          f.id +
          '">' +
          "</div></div>";
      } else if (f.type === "ornament_items") {
        html +=
          '<div class="field fw" style="grid-column:1/-1"><label>' +
          f.label +
          "</label>" +
          '<div id="orn-items-wrap">' +
          '<table style="width:100%;border-collapse:collapse;margin-bottom:6px" id="orn-items-table">' +
          "<thead><tr>" +
          '<th style="background:#1a3a5c;color:#fff;padding:6px 8px;font-size:11px;border:1px solid #999;text-align:left;width:50%">दागिन्याचे नाव / Name</th>' +
          '<th style="background:#1a3a5c;color:#fff;padding:6px 8px;font-size:11px;border:1px solid #999;text-align:center;width:15%">नग / Qty</th>' +
          '<th style="background:#1a3a5c;color:#fff;padding:6px 8px;font-size:11px;border:1px solid #999;text-align:center;width:25%">वजन / Weight (gm)</th>' +
          '<th style="background:#1a3a5c;color:#fff;padding:6px 8px;font-size:11px;border:1px solid #999;width:10%"></th>' +
          "</tr></thead>" +
          '<tbody id="orn-items-tbody"></tbody>' +
          "</table>" +
          '<button type="button" onclick="ornAddRow()" style="background:#1a3a5c;color:#fff;border:none;border-radius:6px;padding:7px 16px;cursor:pointer;font-weight:700;font-size:12px;font-family:Nunito,sans-serif">+ दागिना जोडा / Add Ornament</button>' +
          '<div id="orn-items-summary" style="font-size:11px;color:#2e7d52;font-weight:700;margin-top:6px"></div>' +
          "</div>" +
          '<input type="hidden" id="f-ornament_items">' +
          "</div></div>";
        // Add first row after render
        setTimeout(function () {
          if (
            document.getElementById("orn-items-tbody") &&
            !document.getElementById("orn-items-tbody").rows.length
          )
            ornAddRow();
        }, 100);
      } else if (f.type === "textarea") {
        html +=
          '<div class="field ' +
          cls +
          '"><label>' +
          f.label +
          req +
          "</label>" +
          '<textarea id="f-' +
          f.id +
          '"></textarea></div>';
      } else if (f.type === "mis_month_year") {
        const curYear = new Date().getFullYear();
        const monthOpts = [
          "",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
          .map((m) => `<option>${m}</option>`)
          .join("");
        html +=
          '<div class="field ' +
          cls +
          '"><label>' +
          f.label +
          req +
          "</label>" +
          '<div style="display:flex;gap:6px;align-items:center">' +
          '<select id="f-' +
          f.id +
          '-month" style="flex:2" onchange="misCombineMonthYear(\'' +
          f.id +
          "')\">" +
          monthOpts +
          "</select>" +
          '<input type="number" id="f-' +
          f.id +
          '-year" placeholder="Year" value="' +
          curYear +
          '" min="2000" max="2099" style="flex:1;width:70px" onchange="misCombineMonthYear(\'' +
          f.id +
          "')\" oninput=\"misCombineMonthYear('" +
          f.id +
          "')\">" +
          '<input type="hidden" id="f-' +
          f.id +
          '">' +
          "</div></div>";
      } else if (f.type === "select") {
        html +=
          '<div class="field ' +
          cls +
          '"><label>' +
          f.label +
          req +
          "</label>" +
          '<select id="f-' +
          f.id +
          '">' +
          (f.opts || [])
            .map((o) => "<option>" + o + "</option>")
            .join("") +
          "</select></div>";
      } else {
        // Don't prefill loan_acc_no for Gold Loan (keep empty so user must enter manually)
        const prefillVal = f.id === "loan_acc_no" ? "" : f.prefill || "";
        const todayVal =
          f.id === "date" ? new Date().toISOString().split("T")[0] : "";
        const valAttr = prefillVal
          ? `value="${prefillVal}"`
          : todayVal
            ? `value="${todayVal}"`
            : "";
        // Auto-words trigger for amount fields + FD maturity recalc fields
        const autoWordsAttr =
          f.id === "loan_amount" ||
          f.id === "fd_amount" ||
          f.id === "fd_maturity_amount" ||
          f.id === "deposit_amount" ||
          f.id === "expense_amount" ||
          f.id === "interest_amount"
            ? ` oninput="autoFillWords('${f.id}',this.value)"`
            : f.id === "fd_period" || f.id === "fd_interest_rate"
              ? ` oninput="autoFillWords('${f.id}',this.value)"`
              : "";
        // Loan / FD / MIS acc no live check
        const loanAccAttr =
          f.id === "loan_acc_no"
            ? ` oninput="onLoanAccNoInput(this.value)" autocomplete="off"`
            : f.id === "fd_acc_no"
              ? ` oninput="onFdAccNoInput(this.value)" autocomplete="off"`
              : f.id === "mis_acc_no"
                ? ` oninput="onMisAccNoInput(this.value)" autocomplete="off"`
                : f.id === "saving_acc_no"
                  ? ` oninput="onSavingAccNoInput(this.value)" autocomplete="off"`
                  : "";
        html +=
          '<div class="field ' +
          cls +
          (f.id === "loan_acc_no" ? " loan-acc-wrap" : "") +
          '"><label>' +
          f.label +
          req +
          "</label>" +
          '<input type="' +
          f.type +
          '" id="f-' +
          f.id +
          '" ' +
          valAttr +
          (f.req ? " required" : "") +
          autoWordsAttr +
          loanAccAttr +
          "></div>" +
          (f.id === "loan_acc_no"
            ? '<div id="loan-acc-hint" style="grid-column:1/-1;margin:-10px 0 4px;padding:0 2px;font-size:10px"></div>'
            : "") +
          (f.id === "fd_acc_no"
            ? '<div id="fd-acc-hint"   style="grid-column:1/-1;margin:-10px 0 4px;padding:0 2px;font-size:10px"></div>'
            : "") +
          (f.id === "mis_acc_no"
            ? '<div id="mis-acc-hint"  style="grid-column:1/-1;margin:-10px 0 4px;padding:0 2px;font-size:10px"></div>'
            : "") +
          (f.id === "saving_acc_no"
            ? '<div id="saving-acc-hint" style="grid-column:1/-1;margin:-10px 0 4px;padding:0 2px;font-size:10px"></div>'
            : "");
      }
    });
    html += "</div>";
  });
  if (ctype === "sonar") {
    html +=
      '<div class="sec-lbl" style="color:var(--amber-a);border-color:var(--amber-a)">🔑 Other Sub-Cases — DB Only (no PDF)</div>' +
      '<div id="sonar-sub-panel"></div>';
  }
  const card = document.getElementById("form-card");
  card.innerHTML = html;
  card.classList.add("show");
  document.getElementById("form-empty").style.display = "none";
  document.getElementById("action-bar").classList.add("show");
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  // Auto-focus customer name field for gold loan section
  if (section === "gold" && ctype !== "sonar") {
    setTimeout(function () {
      document.getElementById("f-customer_name")?.focus();
    }, 300);
  }
  // For regular od loans only (not gold loan), auto-suggest next loan number
  if (ctype !== "sonar" && (section === "od" || section === "gold")) {
    setTimeout(prefillNextLoanNo, 250);
  }
  // For FD section — auto-suggest next fd_acc_no
  if (
    ctype !== "sonar" &&
    section === "fd" &&
    !txArr.includes("MIS Interest")
  ) {
    setTimeout(prefillNextFdAccNo, 250);
  }
  // For MIS Interest — auto-suggest next mis_acc_no
  if (ctype !== "sonar" && txArr.includes("MIS Interest")) {
    setTimeout(prefillNextMisAccNo, 250);
  }
  if (ctype === "sonar") {
    // store sonar group no internally but don't show field
    renderSonarSubPanel();
    // Auto-populate loan_acc_no from the sonar group number
    setTimeout(() => {
      const groupNo =
        document.getElementById("sonar-main-inp")?.value?.trim() || "";
      const lnEl = document.getElementById("f-loan_acc_no");
      if (lnEl && groupNo) {
        lnEl.value = groupNo;
      }
      if (lnEl)
        lnEl.addEventListener("input", () => {
          const groupNo2 =
            document.getElementById("sonar-main-inp")?.value?.trim() ||
            "";
          if (window.checkLoanAccWarning) checkLoanAccWarning(groupNo2);
          renderSonarSubPanel();
        });
    }, 200);
  }
}

function resetAll() {
  clearForm();
}

// ── Loan Acc No live check + next suggestion ──────────────────────────────
let _loanAccTimer = null;
async function onLoanAccNoInput(val) {
  clearTimeout(_loanAccTimer);
  const hint = document.getElementById("loan-acc-hint");
  if (!hint) return;
  hint.innerHTML = "";
  if (!val || val.trim().length < 4) return;
  const v = val.trim();
  const isClosing =
    window.checked && [...window.checked].includes("Closing - Loan");
  _loanAccTimer = setTimeout(async () => {
    try {
      const chk = await fetch(
        "/api/records/check-loan-no/" + encodeURIComponent(v),
      ).then((r) => r.json());
      if (chk.exists) {
        const rec = chk.record;
        const isClosed = rec.status === "closed";
        if (isClosing) {
          // For closing form: show whether loan is active or already closed
          if (isClosed) {
            hint.innerHTML = `<span style="color:#c0392b;font-weight:700;font-size:12px;">🔒 Already CLOSED — ${rec.name} · Closed on: ${rec.closed_date || "?"}</span>`;
          } else {
            hint.innerHTML = `<span style="color:#27ae60;font-weight:700;font-size:12px;">✅ Active Loan Found — ${rec.name} · Date: ${rec.date}</span>`;
          }
        } else {
          // For new loan form: warn duplicate
          const status = isClosed ? "🔒 CLOSED" : "🟢 Active";
          hint.innerHTML = `<span style="color:#c0392b;font-weight:700">⚠️ Loan No. already exists — ${rec.name} · ${rec.date} · ${status}</span>`;
          const prefix = v.split("-")[0];
          if (prefix) {
            const nxt = await fetch(
              "/api/records/next-loan-no/" + encodeURIComponent(prefix),
            ).then((r) => r.json());
            hint.innerHTML += `&nbsp;&nbsp;<button type="button" onclick="document.getElementById('f-loan_acc_no').value='${nxt.next}';onLoanAccNoInput('${nxt.next}')" style="font-size:10px;background:#1a5276;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer">Use next: ${nxt.next}</button>`;
          }
        }
      } else {
        if (isClosing) {
          hint.innerHTML = `<span style="color:#c0392b;font-weight:700;font-size:12px;">❌ No loan found with this number</span>`;
        } else {
          hint.innerHTML = `<span style="color:#27ae60;font-weight:700">✅ Loan No. is available</span>`;
        }
      }
    } catch (e) {
      hint.innerHTML = "";
    }
  }, 500);
}

// Pre-fill next loan number when form first loads for gold/od section
async function prefillNextLoanNo() {
  const el = document.getElementById("f-loan_acc_no");
  if (!el) return;
  // Determine correct prefix based on current section
  const isGold = [...(window.checked || [])].some((t) =>
    ["Gold Loan", "Gold Receipt", "Slips - Loan"].includes(t),
  );
  const prefix = isGold ? "03" : "17";
  // Only auto-fill if field is empty or still at bare prefix
  const cur = el.value.trim();
  if (cur && cur !== "03-" && cur !== "17-" && cur !== "") return;
  try {
    const nxt = await fetch("/api/records/next-loan-no/" + prefix).then(
      (r) => r.json(),
    );
    if (nxt.next) {
      el.value = nxt.next;
      onLoanAccNoInput(nxt.next);
    }
  } catch (e) {}
}

// ── FD Acc No live check + next suggestion ──────────────────────────────────
let _fdAccTimer;
async function onFdAccNoInput(val) {
  clearTimeout(_fdAccTimer);
  const hint = document.getElementById("fd-acc-hint");
  if (!hint) return;
  hint.innerHTML = "";
  if (!val || val.trim().length < 4) return;
  const v = val.trim();
  _fdAccTimer = setTimeout(async () => {
    try {
      const chk = await fetch(
        "/api/records/check-fd-acc-no/" + encodeURIComponent(v),
      ).then((r) => r.json());
      if (chk.exists) {
        const rec = chk.record;
        const status =
          rec.status === "closed" ? "🔒 CLOSED" : "🟢 Active";
        hint.innerHTML = `<span style="color:#c0392b;font-weight:700">⚠️ FD Acc No. already exists — ${rec.name} · ${rec.date} · ${status}</span>`;
        const prefix = v.split("-")[0];
        if (prefix) {
          const nxt = await fetch(
            "/api/records/next-fd-acc-no/" + encodeURIComponent(prefix),
          ).then((r) => r.json());
          hint.innerHTML += `&nbsp;&nbsp;<button type="button" onclick="document.getElementById('f-fd_acc_no').value='${nxt.next}';onFdAccNoInput('${nxt.next}')" style="font-size:10px;background:#1a5276;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer">Use next: ${nxt.next}</button>`;
        }
      } else {
        hint.innerHTML = `<span style="color:#27ae60;font-weight:700">✅ FD Acc No. is available</span>`;
      }
    } catch (e) {
      hint.innerHTML = "";
    }
  }, 500);
}

async function prefillNextFdAccNo() {
  const el = document.getElementById("f-fd_acc_no");
  if (!el || el.value !== "46-") return;
  try {
    const nxt = await fetch("/api/records/next-fd-acc-no/46").then((r) =>
      r.json(),
    );
    if (nxt.next) {
      el.value = nxt.next;
      onFdAccNoInput(nxt.next);
    }
  } catch (e) {}
}

// ── MIS Acc No live check + next suggestion ───────────────────────────────────
let _misAccTimer;
async function onMisAccNoInput(val) {
  clearTimeout(_misAccTimer);
  const hint = document.getElementById("mis-acc-hint");
  if (!hint) return;
  hint.innerHTML = "";
  if (!val || val.trim().length < 4) return;
  const v = val.trim();
  _misAccTimer = setTimeout(async () => {
    try {
      const chk = await fetch(
        "/api/records/check-mis-acc-no/" + encodeURIComponent(v),
      ).then((r) => r.json());
      if (chk.exists) {
        const rec = chk.record;
        const status =
          rec.status === "closed" ? "🔒 CLOSED" : "🟢 Active";
        hint.innerHTML = `<span style="color:#c0392b;font-weight:700">⚠️ MIS Acc No. already exists — ${rec.name} · ${rec.date} · ${status}</span>`;
        const prefix = v.split("-")[0];
        if (prefix) {
          const nxt = await fetch(
            "/api/records/next-mis-acc-no/" + encodeURIComponent(prefix),
          ).then((r) => r.json());
          hint.innerHTML += `&nbsp;&nbsp;<button type="button" onclick="document.getElementById('f-mis_acc_no').value='${nxt.next}';onMisAccNoInput('${nxt.next}')" style="font-size:10px;background:#1a5276;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer">Use next: ${nxt.next}</button>`;
        }
      } else {
        hint.innerHTML = `<span style="color:#27ae60;font-weight:700">✅ MIS Acc No. is available</span>`;
      }
    } catch (e) {
      hint.innerHTML = "";
    }
  }, 500);
}

async function prefillNextMisAccNo() {
  const el = document.getElementById("f-mis_acc_no");
  if (!el || el.value !== "290-") return;
  try {
    const nxt = await fetch("/api/records/next-mis-acc-no/290").then(
      (r) => r.json(),
    );
    if (nxt.next) {
      el.value = nxt.next;
      onMisAccNoInput(nxt.next);
    }
  } catch (e) {}
}

// ── Saving Acc No live check — auto-populate saving balance ────────────────
let _savingAccTimer = null;
async function onSavingAccNoInput(val) {
  clearTimeout(_savingAccTimer);
  const hint = document.getElementById("saving-acc-hint");
  if (!hint) return;
  hint.innerHTML = "";
  const v = (val || "").trim();
  if (!v || v.length < 5) return; // need at least "43-XX" to avoid matching all accounts
  _savingAccTimer = setTimeout(async () => {
    try {
      const nm = (document.getElementById("f-customer_name")?.value || "")
        .trim()
        .toLowerCase();
      const mob = (
        document.getElementById("f-mobile")?.value || ""
      ).trim();
      const aadh = (
        document.getElementById("f-aadhar")?.value || ""
      ).trim();
      const { records } = await fetch(
        API + "?section=saving&limit=200",
      ).then((r) => r.json());
      if (!records || !records.length) {
        setBalZero();
        return;
      }

      // Score each record: exact saving_acc match = 10, name match = 3, mobile = 3, aadhar = 3
      const scored = records
        .map((r) => {
          const d =
            typeof r.data === "string"
              ? (() => {
                  try {
                    return JSON.parse(r.data);
                  } catch (e) {
                    return {};
                  }
                })()
              : r.data || {};
          let score = 0;
          if ((d.saving_acc_no || "").trim() === v) score += 10;
          if (nm && (r.name || "").toLowerCase().includes(nm)) score += 3;
          if (mob && (d.mobile || "") === mob) score += 3;
          if (aadh && (d.aadhar || "") === aadh) score += 3;
          return { r, d, score };
        })
        .filter((x) => x.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score || new Date(b.r.date) - new Date(a.r.date),
        );

      if (!scored.length) {
        setBalZero();
        return;
      }

      const best = scored[0];
      const bal = best.d.saving_balance;
      const balEl = document.getElementById("f-saving_balance");

      if (best.score >= 10 && bal != null && bal !== "") {
        // Exact acc match — auto-fill balance
        if (balEl) balEl.value = bal;
        hint.innerHTML = `<span style="color:#27ae60;font-weight:700;font-size:11px">✅ Balance auto-filled from DB — ${best.r.name} · ${best.r.date}</span>`;
      } else if (best.score >= 10) {
        // Acc matched but no balance on record
        if (balEl) balEl.value = "0";
        hint.innerHTML = `<span style="color:#f39c12;font-weight:700;font-size:11px">⚠️ Account found but no balance recorded — ${best.r.name} · ${best.r.date}</span>`;
      } else {
        // Partial match — show as suggestion
        setBalZero();
        hint.innerHTML =
          `<span style="color:#8e44ad;font-weight:700;font-size:11px">💡 Possible match — ${best.r.name} · ${best.r.date} · Bal: ₹${bal != null ? Number(bal).toLocaleString("en-IN") : "?"}</span>` +
          `&nbsp;&nbsp;<button type="button" onclick="(function(){var el=document.getElementById('f-saving_balance');if(el)el.value='${bal || 0}';document.getElementById('saving-acc-hint').innerHTML='<span style=\\'color:#27ae60;font-weight:700;font-size:11px\\'>✅ Balance applied</span>';})()" style="font-size:10px;background:#1a5276;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer">Use this balance</button>`;
      }
    } catch (e) {
      setBalZero();
    }

    function setBalZero() {
      const balEl = document.getElementById("f-saving_balance");
      if (balEl && !balEl.value) balEl.value = "0";
      hint.innerHTML =
        '<span style="color:#7f8c8d;font-size:11px">No matching account found — balance set to 0</span>';
    }
  }, 600);
}

// Calculate FD maturity amount from principal, period (months), rate (%)
// Uses simple interest: maturity = P + P*R*T/100  where T = period/12 years
// Only runs for New FD transactions — NOT for MIS Interest
function calcFdMaturity() {
  const isMisInterest =
    window.checked && [...window.checked].includes("MIS Interest");
  if (isMisInterest) return;
  const principal =
    parseFloat(document.getElementById("f-fd_amount")?.value) || 0;
  const period =
    parseFloat(document.getElementById("f-fd_period")?.value) || 0;
  const rate =
    parseFloat(document.getElementById("f-fd_interest_rate")?.value) || 0;
  if (!principal || !period || !rate) return;
  const interest = (((principal * rate) / 100) * period) / 12;
  const maturity = Math.round(principal + interest);
  const matEl = document.getElementById("f-fd_maturity_amount");
  const matWrdEl = document.getElementById("f-fd_maturity_words");
  if (matEl) {
    matEl.value = maturity;
    if (matWrdEl)
      matWrdEl.value = maturity > 0 ? convertNumberToWords(maturity) : "";
  }
}

function autoFillWords(srcFieldId, val) {
  const amt = parseFloat(val) || 0;
  const words = amt > 0 ? convertNumberToWords(amt) : "";
  const wordsMap = {
    loan_amount: "loan_amount_words",
    fd_amount: "fd_amount_words",
    fd_maturity_amount: "fd_maturity_words",
    deposit_amount: "deposit_amount_words",
    expense_amount: "expense_amount_words",
    interest_amount: "interest_amount_words",
  };
  // For MIS Interest: maturity amount = fd_amount (principal returned unchanged)
  if (srcFieldId === "fd_amount") {
    const isMisInterest =
      window.checked && [...window.checked].includes("MIS Interest");
    if (isMisInterest) {
      const matEl = document.getElementById("f-fd_maturity_amount");
      const matWrdEl = document.getElementById("f-fd_maturity_words");
      if (matEl) matEl.value = val;
      if (matWrdEl && amt > 0) matWrdEl.value = words;
    }
  }
  // For New FD: trigger maturity recalc when amount, period, or rate changes
  if (
    srcFieldId === "fd_amount" ||
    srcFieldId === "fd_period" ||
    srcFieldId === "fd_interest_rate"
  ) {
    calcFdMaturity();
  }
  const targetId = wordsMap[srcFieldId];
  if (targetId) {
    const el = document.getElementById("f-" + targetId);
    if (el) el.value = words;
  }
}

function misCombineMonthYear(fieldId) {
  const m =
    document.getElementById("f-" + fieldId + "-month")?.value || "";
  const y =
    document.getElementById("f-" + fieldId + "-year")?.value || "";
  const hidden = document.getElementById("f-" + fieldId);
  if (hidden) hidden.value = m && y ? m + "-" + y : m || y || "";
}

function onPhoto(fid, inp) {
  if (!inp.files[0]) return;
  const r = new FileReader();
  r.onload = (e) => {
    photos[fid] = e.target.result;
    const b = document.getElementById("pbox-" + fid);
    b.innerHTML = `<img src="${e.target.result}"><input type="file" aria-label="Replace photo" accept="image/*" capture="environment" onchange="onPhoto('${fid}',this)" style="position:absolute;inset:0;opacity:0;cursor:pointer;z-index:2">`;
  };
  r.readAsDataURL(inp.files[0]);
}

function collect() {
  const d = {};
  SECTIONS.forEach((s) =>
    s.fields.forEach((f) => {
      if (f.type === "photo") {
        d[f.id] = photos[f.id] || null;
        return;
      }
      if (f.type === "ornament_items") {
        const items = ornGetItems();
        d.ornament_items = items.length ? items : null;
        const _totalQty = items.reduce(
          (s, r) => s + (parseInt(r.qty) || 0),
          0,
        );
        const _totalWt = items.reduce(
          (s, r) => s + (parseFloat(r.weight) || 0),
          0,
        );
        const hasAnyWeight = items.some(
          (r) => r.weight !== null && r.weight !== undefined,
        );
        d.ornament_qty = items.length ? _totalQty : null;
        d.ornament_weight =
          items.length && hasAnyWeight ? _totalWt : null;
        d.gold_ornaments =
          items
            .filter(
              (r) =>
                !r.name.toLowerCase().includes("silver") &&
                !r.name.includes("चांदी"),
            )
            .map((r) => r.name)
            .join(", ") || null;
        d.silver_ornaments =
          items
            .filter(
              (r) =>
                r.name.toLowerCase().includes("silver") ||
                r.name.includes("चांदी"),
            )
            .map((r) => r.name)
            .join(", ") || null;
        return;
      }
      const el = document.getElementById("f-" + f.id);
      if (el) d[f.id] = el.value;
    }),
  );
  // If sonar mode, get group no from strip input
  if (ctype === "sonar") {
    d.sonar_group_no =
      document.getElementById("sonar-main-inp")?.value?.trim() || "";
  }
  return d;
}

// ═══════════════════════════════════════
//  SAVE + PDF
// ═══════════════════════════════════════
async function saveAndPDF() {
  if (!checked.size) {
    toast("Select at least one type", "err");
    return;
  }
  const data = collect(),
    txArr = [...checked];
  // Determine section first to decide validation rules
  let section = "general";
  for (const g of GROUPS) {
    if (txArr.some((t) => g.types.includes(t))) {
      section = g.section;
      break;
    }
  }
  const noNameRequired = ["office"].includes(section);
  if (!data.customer_name && !noNameRequired) {
    toast("Customer Name is required", "err");
    return;
  }
  if (section === "gold" || section === "od") {
    if (!data.loan_acc_no) {
      toast("Loan Acc No is required (e.g. 03-1234)", "err");
      document.getElementById("f-loan_acc_no")?.focus();
      return;
    }
    if (!data.loan_amount) {
      toast("Loan Amount is required", "err");
      document.getElementById("f-loan_amount")?.focus();
      return;
    }
  }
  if (section === "fd") {
    const isMisInterest = txArr.includes("MIS Interest");
    if (!isMisInterest && !data.fd_acc_no) {
      toast("FD Acc No is required", "err");
      document.getElementById("f-fd_acc_no")?.focus();
      return;
    }
    if (isMisInterest && !data.mis_acc_no) {
      toast("MIS Acc No (290-) is required", "err");
      document.getElementById("f-mis_acc_no")?.focus();
      return;
    }
    if (!data.fd_amount) {
      toast("FD Amount is required", "err");
      document.getElementById("f-fd_amount")?.focus();
      return;
    }
  }
  if (section === "saving") {
    if (!data.saving_acc_no) {
      toast("Saving Acc No is required", "err");
      document.getElementById("f-saving_acc_no")?.focus();
      return;
    }
    // Deposit / Withdrawal require an amount
    const isDepWd = txArr.some((t) =>
      [
        "Saving Deposit",
        "Saving Withdrawal",
        "Saving - Deposit Slip",
        "Saving - Withdrawal Slip",
      ].includes(t),
    );
    if (isDepWd && !data.deposit_amount) {
      toast("Deposit / Withdrawal Amount is required", "err");
      document.getElementById("f-deposit_amount")?.focus();
      return;
    }
  }
  if (ctype === "sonar") {
    if (!data.sonar_group_no) {
      toast("Enter Loan Number (e.g. 03-1234)", "err");
      return;
    }
    // Skip sub-case validation for Closing - Loan (no new sub-cases are being added)
    if (!txArr.includes("Closing - Loan")) {
      // For a new Gold Loan with type "Other", at least one sub-case is required
      if (
        (section === "gold" || section === "od") &&
        sonarSubCases.length === 0
      ) {
        toast(
          "Add at least one sub-case (Sub Loan) before saving",
          "err",
        );
        return;
      }
      if (!sonarValidate()) return;
    }
  }
  const dbData = { ...data };
  // Store photos in DB as actual base64 (not placeholder)
  // photos object has actual base64 data from camera/upload
  const groupNo = data.sonar_group_no || null;

  // ── Build pdfTxArr and generate PDF NOW (before any awaits) so popup isn't blocked ──
  let pdfTxArr = [...txArr];
  if (txArr.includes("Gold Loan") && !txArr.includes("Slips - Loan")) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "Gold Loan"
          ? ["Gold Loan", "Slips - Loan", "Gold Receipt"]
          : [t],
      )
      .flat();
  }
  if (txArr.includes("New FD-OD Loan")) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "New FD-OD Loan"
          ? ["New FD-OD Loan", "Slips - FD-OD"]
          : [t],
      )
      .flat();
  }
  if (txArr.includes("New FD")) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "New FD"
          ? ["Fixed Deposit", "FD - Slips", "Form 60-61"]
          : [t],
      )
      .flat();
  }
  if (txArr.includes("MIS Interest")) {
    pdfTxArr = pdfTxArr
      .map((t) => (t === "MIS Interest" ? ["MIS Interest - Slips"] : [t]))
      .flat();
  }
  if (
    txArr.includes("Closing - FD") &&
    !txArr.includes("Closing - FD - Slips")
  ) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "Closing - FD"
          ? ["Closing - FD", "Closing - FD - Slips"]
          : [t],
      )
      .flat();
  }
  if (txArr.includes("New Sadasya")) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "New Sadasya" ? ["Sadasya", "Sadasya - Slips"] : [t],
      )
      .flat();
  }
  if (txArr.includes("New Naammatr Sabhasad")) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "New Naammatr Sabhasad"
          ? ["Naammatr Sabhasad Account", "Naammatr Sabhasad - Slips"]
          : [t],
      )
      .flat();
  }
  if (
    txArr.includes("Saving Account") &&
    !txArr.includes("Saving - Deposit Slip")
  ) {
    pdfTxArr = pdfTxArr
      .map((t) =>
        t === "Saving Account"
          ? ["Saving Account", "Saving - Deposit Slip"]
          : [t],
      )
      .flat();
  }
  generateTemplatePDF(pdfTxArr, data);

  // For gold/od loans, use loan_acc_no as the primary account_no
  const primaryAccNo =
    section === "gold" || section === "od"
      ? data.loan_acc_no || data.saving_acc_no || data.account_no || ""
      : data.saving_acc_no || data.account_no || data.fd_acc_no || "";
  const payload = {
    date:
      txArr.includes("Closing - Loan") && data.date
        ? data.date
        : data.date || new Date().toISOString().split("T")[0],
    name: data.customer_name,
    customer_id: data.customer_id || "",
    customer_type: ctype,
    aadhar: data.aadhar || "",
    mobile: data.mobile || "",
    account_no: primaryAccNo,
    section,
    tx_types: txArr,
    data: dbData,
    remarks: data.comments || "",
    sonar_parent_no: groupNo,
    sonar_sub_no: null,
    sonar_group_no: groupNo,
  };
  // When saving a Closing - Loan for a sub-loan case, inherit the original
  // record's sonar identity so it is NOT stored as Regular/wrong account_no
  if (window._closingMeta && txArr.includes("Closing - Loan")) {
    const m = window._closingMeta;
    payload.customer_type = m.customer_type;
    payload.sonar_sub_no = m.sonar_sub_no;
    payload.sonar_parent_no = m.sonar_parent_no;
    payload.sonar_group_no = m.sonar_group_no;
    if (m.account_no) payload.account_no = m.account_no;
  }
  let mainId = null;
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error);
    mainId = j.id;
  } catch (e) {
    toast("Save failed: " + e.message, "err");
    return;
  }
  let subSaved = 0;
  if (ctype === "sonar" && groupNo) {
    subSaved = await sonarSaveSubCases(dbData, section, txArr, groupNo);
  }
  const msg =
    subSaved > 0
      ? "✅ Saved main + " + subSaved + " sub-case(s)"
      : "✅ Saved — Record #" + mainId;
  toast(msg, "ok");
  // Auto-add cashbook entries for this transaction
  await addCashbookRows(mainId, data, txArr);
  // Process transaction side-effects (update gold_loans, saving_accounts, fd_accounts etc.)
  fetch(API + "/process-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tx_types: txArr, data, record_id: mainId, customer_name: data.customer_name }),
  }).then(r => r.json()).then(j => {
    if (j.errors && j.errors.length) console.warn("process-transaction errors:", j.errors);
    if (j.results && j.results.length) console.log("process-transaction:", j.results);
  }).catch(e => console.warn("process-transaction failed:", e.message));
  // If Closing - Loan, also generate GL Int Received voucher with all closed loans
  if (txArr.includes("Closing - Loan")) {
    try {
      const closedResp = await fetch(
        API + "?section=gold&status=closed",
      ).catch(() => null);
      if (closedResp && closedResp.ok) {
        const closedData = await closedResp.json();
        const closedLoans = (closedData.records || closedData || []).map(
          function (r) {
            const d =
              typeof r.data === "string"
                ? JSON.parse(r.data || "{}")
                : r.data || {};
            return {
              name: r.name,
              loan_acc_no: d.loan_acc_no || r.account_no,
              loan_date: d.date || r.date,
              closed_date: r.closed_date,
              loan_amount: d.loan_amount,
            };
          },
        );
        const voucherData = Object.assign({}, data, {
          _closedLoans: closedLoans,
        });
        generateTemplatePDF(["Int Recv GL Voucher"], voucherData);
      }
    } catch (e) {
      console.warn("GL Int Voucher generation failed:", e);
    }
  }
  // If this is a Gold Loan closing via the pre-filled form, mark original record as closed
  if (window._closingRecId && txArr.includes("Closing - Loan")) {
    const closingDate =
      data.date || new Date().toISOString().split("T")[0];
    await fetch(API + "/" + window._closingRecId + "/close", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        closed_date: closingDate,
        closed_remarks: data.comments || "",
      }),
    });
    window._closingRecId = null;
    window._closingOriginalDate = null;
    window._closingMeta = null;
    toast("✅ Loan closed & PDF generated!", "ok");
    invalidateSavingCache();
    loadDB();
  }
  setTimeout(() => {
    clearForm();
    showPage("home");
    invalidateSavingCache();
    loadDB();
  }, 800);
}

function clearForm() {
  selNone();
  ctype = "regular";
  window._closingRecId = null;
  window._closingOriginalDate = null;
  window._closingMeta = null;
  document.getElementById("btn-reg").className = "ctype-btn reg-on";
  document.getElementById("btn-son").className = "ctype-btn";
  sonarSubCases = [];
  sonarExisting = [];
  const inp = document.getElementById("sonar-main-inp");
  if (inp) inp.value = "";
  const strip = document.getElementById("sonar-group-strip");
  if (strip) strip.classList.remove("show");
  const badge = document.getElementById("sonar-next-badge");
  if (badge) badge.style.display = "none";
  const exStr = document.getElementById("sonar-existing-strip");
  if (exStr) exStr.innerHTML = "";
  photos = {};
  document.getElementById("form-card").innerHTML = "";
  document.getElementById("form-card").classList.remove("show");
  document.getElementById("form-empty").style.display = "";
  document.getElementById("action-bar").classList.remove("show");
}

// ═══════════════════════════════════════
//  PDF — delegated to /pdf-template.js
// ═══════════════════════════════════════
// generateTemplatePDF is defined in /pdf-template.js (HTML-based, supports Marathi/Devanagari)

// ═══════════════════════════════════════
//  PAGE NAV
// ═══════════════════════════════════════
function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (!target) { console.warn("showPage: no page with id 'page-" + id + "'"); return; }
  target.classList.add("active");
  document
    .querySelectorAll(".nav-item,.bnav-btn")
    .forEach((n) => n.classList.toggle("active", n.dataset.page === id));
  if (id === "database") loadDB();
  if (id === "home") loadDashboard();
  if (id === "new") {
    // Fix 6: Reset the transaction form when switching to New Transaction tab
    clearForm();
  }
  if (id === "cashbook") {
    if (!document.getElementById("cb-date").value)
      document.getElementById("cb-date").value = new Date()
        .toISOString()
        .split("T")[0];
  }
  if (id === "ledger") {
    // Auto-set today's date and load ledger data
    const ldgDate = document.getElementById("ldg-date");
    if (ldgDate && !ldgDate.value)
      ldgDate.value = new Date().toISOString().split("T")[0];
    loadLedger();
  }
  window.scrollTo(0, 0);
}
function filterGo(s) {
  showPage("database");
  document.getElementById("db-sect").value = s;
  loadDB();
}
function filterCtype(t) {
  showPage("database");
  document.getElementById("db-ctype").value = t;
  loadDB();
}

function quickStart(txType) {
  showPage("new");
  selNone();
  setTimeout(() => {
    toggleTx(txType);
    document.getElementById("go-btn").click();
  }, 100);
}

// ═══════════════════════════════════════
//  DATABASE
// ═══════════════════════════════════════
function dbSearch() {
  clearTimeout(searchTmr);
  searchTmr = setTimeout(() => {
    dbOff = 0;
    loadDB();
  }, 350);
}

// Cache of all saving records for running balance computation
let _allSavingRecords = null;
let _allSavingRecordsTs = 0;
function invalidateSavingCache() {
  _allSavingRecords = null;
}

const SECT_TX_TYPES = {
  gold: ["Gold Loan", "Slips - Loan", "Closing - Loan"],
  od: ["OD Loan", "New FD-OD Loan"],
  fd: ["Fixed Deposit", "FD - Slips", "New FD", "MIS Interest"],
  saving: [
    "Saving Account",
    "Saving Deposit",
    "Saving Withdrawal",
    "Saving - Deposit Slip",
    "Saving - Withdrawal Slip",
    "Closing - Saving Account",
  ],
  membership: [
    "New Sadasya",
    "Sadasya",
    "New Naammatr Sabhasad",
    "Naammatr Sabhasad Account",
  ],
  current: ["Current Account"],
  bank: ["Bank Transfer", "Bank Expense", "Bank Deposit", "Bank Withdrawal", "UPI Transfer", "NEFT", "RTGS", "Cheque"],
  office: ["Office Expense", "Office Income", "Miscellaneous"],
};
const CLOSING_TX_TYPES = new Set([
  "Closing - Loan",
  "Closing - FD",
  "Closing - FD - Slips",
  "Closing - FD OD Loan",
  "Closing - Saving Account",
  "Closing - Sadasya",
  "Closing - Naammatr Sadasya",
  "Closing - Gold Loan",
]);

async function loadDB() {
  const q = document.getElementById("db-q").value;
  const sect = dbTxFilter || document.getElementById("db-sect").value;
  const ct = document.getElementById("db-ctype").value;
  const p = new URLSearchParams({ limit: 50, offset: dbOff });
  if (q) p.set("q", q);
  if (sect) p.set("section", sect);
  if (ct) p.set("customer_type", ct);
  if (dbStatusFilter) p.set("status", dbStatusFilter);
  try {
    let { records, total } = await (await fetch(API + "?" + p)).json();
    if (sect && SECT_TX_TYPES[sect]) {
      const relevantTxTypes = new Set(SECT_TX_TYPES[sect]);
      const crossP = new URLSearchParams({ limit: 9999, offset: 0 });
      if (q) crossP.set("q", q);
      if (ct) crossP.set("customer_type", ct);
      const { records: allRecords } = await (
        await fetch(API + "?" + crossP)
      ).json();
      const existingIds = new Set(records.map((r) => r.id));
      const crossRecords = allRecords.filter((r) => {
        if (existingIds.has(r.id)) return false;
        const rTxTypes = parseTxTypes(r.tx_types);
        if (!rTxTypes.some((t) => relevantTxTypes.has(t))) return false;
        const closedTx = new Set(parseTxTypes(r.closed_tx_types));
        if (dbStatusFilter === "closed")
          return rTxTypes.some(
            (t) => relevantTxTypes.has(t) && closedTx.has(t),
          );
        if (dbStatusFilter === "active")
          return rTxTypes.some(
            (t) => relevantTxTypes.has(t) && !closedTx.has(t),
          );
        return true;
      });
      records = [...records, ...crossRecords];
    }
    if (sect && SECT_TX_TYPES[sect]) {
      const relevantTxTypes = new Set(SECT_TX_TYPES[sect]);
      records = records.filter((r) => {
        const rTxTypes = parseTxTypes(r.tx_types);
        if (rTxTypes.every((t) => CLOSING_TX_TYPES.has(t))) return false;
        if (dbStatusFilter === "active") {
          const closedTx = new Set(parseTxTypes(r.closed_tx_types));
          return rTxTypes.some(
            (t) => relevantTxTypes.has(t) && !closedTx.has(t),
          );
        }
        return true;
      });
    }
    if (dbTxTypeFilter) {
      records = records.filter((r) =>
        parseTxTypes(r.tx_types).includes(dbTxTypeFilter),
      );
    }
    total = records.length;

    // Always fetch ALL saving records to compute running balance chain
    try {
      const now = Date.now();
      if (!_allSavingRecords || now - _allSavingRecordsTs > 30000) {
        const allP = new URLSearchParams({
          section: "saving",
          limit: 9999,
          offset: 0,
        });
        if (ct) allP.set("customer_type", ct);
        const allRes = await (await fetch(API + "?" + allP)).json();
        _allSavingRecords = allRes.records || [];
        _allSavingRecordsTs = now;
      }
      window._runningBalMap = computeRunningBalMap(_allSavingRecords);
    } catch (balErr) {
      console.warn("Balance chain fetch failed", balErr);
      window._runningBalMap = {};
    }

    dbTot = total;
    renderTable(records);
    renderPages();
  } catch (e) {
    console.error("loadDB error:", e);
    document.getElementById("db-body").innerHTML =
      `<tr><td colspan="9"><div class="empty-st"><div class="ei">❌</div><p style="font-weight:700">Server offline</p><p style="font-size:10px;margin-top:4px">Run <code>npm start</code> and open <a href="http://localhost:4001">localhost:4001</a></p><button onclick="loadDB()" style="margin-top:8px;padding:5px 14px;background:var(--sky-a);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px">🔄 Retry</button></div></td></tr>`;
    showOfflineBanner();
  }
}

// Compute running balance for ALL saving deposit/withdrawal records grouped by account
function computeRunningBalMap(allRecords) {
  const map = {};
  // Filter only deposit/withdrawal records
  const depWdRecs = allRecords.filter((r) =>
    parseTxTypes(r.tx_types)
      .some((t) => t === "Saving Deposit" || t === "Saving Withdrawal"),
  );
  // Group by saving_acc_no
  const accGroups = {};
  depWdRecs.forEach((r) => {
    const d =
      typeof r.data === "string"
        ? (function () {
            try {
              return JSON.parse(r.data);
            } catch (e) {
              return {};
            }
          })()
        : r.data || {};
    const acc = (d.saving_acc_no || r.account_no || "__unknown__").trim();
    if (!accGroups[acc]) accGroups[acc] = [];
    accGroups[acc].push({ r, d });
  });
  // For each account, sort chronologically then chain balances
  Object.values(accGroups).forEach((group) => {
    group.sort(
      (a, b) =>
        new Date(a.r.date) - new Date(b.r.date) || a.r.id - b.r.id,
    );
    let runBal = null;
    group.forEach(({ r, d }) => {
      const storedBal =
        d.saving_balance != null ? parseFloat(d.saving_balance) : null;
      const depAmt =
        d.deposit_amount != null ? parseFloat(d.deposit_amount) : null;
      const isDeposit = parseTxTypes(r.tx_types).includes("Saving Deposit");
      // First record of this account: use its stored balance as starting point
      const prevBal = runBal !== null ? runBal : storedBal;
      let resultBal = null;
      if (prevBal !== null && depAmt !== null) {
        resultBal = isDeposit ? prevBal + depAmt : prevBal - depAmt;
        runBal = resultBal;
      } else if (prevBal !== null) {
        runBal = prevBal;
      }
      map[r.id] = { prevBal, resultBal };
    });
  });
  return map;
}

function setDbTxTab(el, section, txType) {
  dbTxFilter = section;
  dbTxTypeFilter = txType || "";
  dbOff = 0;
  document.getElementById("db-sect").value = section;
  document
    .querySelectorAll(".db-tx-tab:not(.db-status-tab)")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  loadDB();
}
function setDbStatus(el, status) {
  dbStatusFilter = status;
  dbOff = 0;
  document
    .querySelectorAll(".db-status-tab")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  loadDB();
}
function syncTabFromSelect() {
  const s = document.getElementById("db-sect").value;
  dbTxFilter = s;
  dbTxTypeFilter = "";
  document
    .querySelectorAll(".db-tx-tab:not(.db-status-tab)")
    .forEach((b) => {
      b.classList.remove("active");
      if (b.dataset.tx === s) b.classList.add("active");
    });
}

function renderTable(rows) {
  const b = document.getElementById("db-body");
  // Update column headers based on current section filter
  const sect =
    dbTxFilter || document.getElementById("db-sect").value || "";
  const acctHdr = document.getElementById("db-col-acct");
  const extraHdr = document.getElementById("db-col-extra");
  if (acctHdr) {
    if (sect === "gold" || sect === "od") {
      acctHdr.textContent = "Loan A/c No";
      if (extraHdr) extraHdr.textContent = "Loan Amount · Ornaments";
    } else if (sect === "fd") {
      acctHdr.textContent = "FD A/c No";
      if (extraHdr)
        extraHdr.textContent = "FD Amount · Period · Rate · Maturity";
    } else if (dbTxTypeFilter === "Saving Deposit") {
      acctHdr.textContent = "Saving A/c No";
      if (extraHdr)
        extraHdr.textContent = "Deposit Amount · Running Balance";
    } else if (dbTxTypeFilter === "Saving Withdrawal") {
      acctHdr.textContent = "Saving A/c No";
      if (extraHdr)
        extraHdr.textContent = "Withdrawal Amount · Running Balance";
    } else if (sect === "saving" || sect === "membership") {
      acctHdr.textContent = "Saving A/c No";
      if (extraHdr) extraHdr.textContent = "Saving Balance · Share A/c";
    } else {
      acctHdr.textContent = "Account No";
      if (extraHdr) extraHdr.textContent = "Details";
    }
  }
  if (!rows.length) {
    b.innerHTML = `<tr><td colspan="10"><div class="empty-st"><div class="ei">🔍</div><p>No records found</p></div></td></tr>`;
    return;
  }
  b.innerHTML = rows
    .map((r, i) => {
      const bs = `background:${SB[r.section] || "#eee"};color:${SC[r.section] || "#666"}`;
      const isSon = r.customer_type === "sonar";
      // Show correct account no + extra details per section
      const d =
        typeof r.data === "string"
          ? (function () {
              try {
                return JSON.parse(r.data);
              } catch (e) {
                return {};
              }
            })()
          : r.data || {};
      let acctDisplay = "";
      let extraInfo = ""; // shown in Name cell (small info)
      let extraCol = "—"; // shown in new Details column

      if (r.section === "gold" || r.section === "od") {
        acctDisplay = d.loan_acc_no || "—"; // Never fall back to saving acc no
        const ornWt = d.ornament_weight ? `${d.ornament_weight}g` : "";
        const ornType =
          d.ornament_items && d.ornament_items.length
            ? [d.metal_type, d.ornament_items[0].name]
                .filter(Boolean)
                .join(" · ")
            : [
                d.metal_type,
                d.gold_ornaments?.split(",")[0],
                d.silver_ornaments?.split(",")[0],
              ]
                .filter(Boolean)
                .join(" · ");
        const lnAmt = d.loan_amount
          ? `₹ ${Number(d.loan_amount).toLocaleString("en-IN")}`
          : "";
        extraCol = [lnAmt, ornWt, ornType].filter(Boolean).join("<br>");
        if (d.address)
          extraInfo += `<div style="font-size:9px;color:#888;margin-top:1px">${d.address.substring(0, 40)}</div>`;
      } else if (r.section === "fd") {
        acctDisplay = d.fd_acc_no || r.account_no || "—";
        if (d.fd_parvati_no)
          acctDisplay += `<br><span style="font-size:8px;color:#777">Parvati: ${d.fd_parvati_no}</span>`;
        const fdAmt = d.fd_amount
          ? `₹ ${Number(d.fd_amount).toLocaleString("en-IN")}`
          : "";
        const fdPrd = d.fd_period || "";
        const fdRate = d.fd_interest_rate ? `${d.fd_interest_rate}%` : "";
        const fdMat = d.fd_maturity_date
          ? `Mat: ${d.fd_maturity_date}`
          : "";
        extraCol = [fdAmt, fdPrd, fdRate, fdMat]
          .filter(Boolean)
          .join("<br>");
      } else if (r.section === "saving" || r.section === "membership") {
        acctDisplay = d.saving_acc_no || r.account_no || "—";
        if (
          dbTxTypeFilter === "Saving Deposit" ||
          dbTxTypeFilter === "Saving Withdrawal"
        ) {
          const isDeposit = dbTxTypeFilter === "Saving Deposit";
          const depAmt = d.deposit_amount
            ? parseFloat(d.deposit_amount)
            : null;
          const rb = (window._runningBalMap || {})[r.id] || {};
          const prevBal =
            rb.prevBal != null
              ? rb.prevBal
              : d.saving_balance
                ? parseFloat(d.saving_balance)
                : null;
          const resultBal = rb.resultBal;
          const depAmtFmt =
            depAmt != null ? `₹ ${depAmt.toLocaleString("en-IN")}` : "—";
          const depWrd = d.deposit_amount_words
            ? `<div style="font-style:italic;color:#666;font-size:8px">${d.deposit_amount_words}</div>`
            : "";
          let balCalc = "";
          if (prevBal != null && depAmt != null && resultBal != null) {
            const op = isDeposit
              ? `<span style="color:#155724">₹ ${prevBal.toLocaleString("en-IN")} + ₹ ${depAmt.toLocaleString("en-IN")} = <strong>₹ ${resultBal.toLocaleString("en-IN")}</strong></span>`
              : `<span style="color:#721c24">₹ ${prevBal.toLocaleString("en-IN")} − ₹ ${depAmt.toLocaleString("en-IN")} = <strong>₹ ${resultBal.toLocaleString("en-IN")}</strong></span>`;
            balCalc = `<div style="font-size:8px;margin-top:2px">${op}</div>`;
          } else if (prevBal != null) {
            balCalc = `<div style="font-size:8px;color:#888;margin-top:2px">Bal: ₹ ${prevBal.toLocaleString("en-IN")}</div>`;
          }
          extraCol = `<div style="font-weight:800;font-size:9.5pt">${depAmtFmt}</div>${depWrd}${balCalc}`;
        } else {
          const rb = (window._runningBalMap || {})[r.id] || {};
          const runBal =
            rb.resultBal != null
              ? rb.resultBal
              : d.saving_balance
                ? parseFloat(d.saving_balance)
                : null;
          const savBal =
            runBal != null
              ? `Bal: ₹ ${runBal.toLocaleString("en-IN")}`
              : "";
          const shrAcc = d.share_acc_no ? `Share: ${d.share_acc_no}` : "";
          extraCol = [savBal, shrAcc].filter(Boolean).join("<br>") || "—";
        }
      } else if (r.section === "bank") {
        acctDisplay =
          d.bank_acc_name || d.saving_acc_no || r.account_no || "—";
        const expAmt = d.expense_amount
          ? `₹ ${Number(d.expense_amount).toLocaleString("en-IN")}`
          : "";
        const swAcc = d.saving_acc_no ? `A/c: ${d.saving_acc_no}` : "";
        const rrn = d.upi_rrn ? `RRN: ${d.upi_rrn}` : "";
        const chq = d.cheque_no ? `Chq: ${d.cheque_no}` : "";
        extraCol =
          [expAmt, swAcc, rrn, chq].filter(Boolean).join("<br>") || "—";
      } else {
        acctDisplay = d.saving_acc_no || r.account_no || "—";
      }

      // Main sonar case: show loan_acc_no. Sub-case: show sonar_sub_no. Regular: acctDisplay
      const isMainSonar = isSon && !r.sonar_sub_no;
      const isSubSonar = isSon && !!r.sonar_sub_no;
      const acct = isSubSonar
        ? `<span style="background:#fef3c7;color:#92400e;font-size:8px;font-weight:800;border-radius:3px;padding:1px 5px;vertical-align:middle">🔑 ${r.sonar_sub_no}</span>`
        : isMainSonar
          ? `<span style="font-weight:800;color:#1a3a5c">${acctDisplay}</span><span style="font-size:8px;background:#e0e7ff;color:#3730a3;border-radius:3px;padding:1px 5px;margin-left:4px;vertical-align:middle">MAIN</span>`
          : acctDisplay;
      const isClosed = r.status === "closed";
      const allTypes = parseTxTypes(r.tx_types);
      const closedTypes = new Set(
        (r.closed_tx_types || "")
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      const isClosingRecord = allTypes.every((t) =>
        t.startsWith("Closing"),
      );
      const hasOpenTypes =
        !isClosingRecord && allTypes.some((t) => !closedTypes.has(t));
      const isPartial = !isClosed && closedTypes.size > 0;
      const closedBadge = isClosed
        ? `<span style="display:inline-block;background:#e53e3e;color:#fff;font-size:8px;font-weight:800;border-radius:4px;padding:1px 5px;margin-left:4px;vertical-align:middle">🔒 CLOSED${r.closed_date ? " " + r.closed_date : ""}</span>`
        : isPartial
          ? `<span style="display:inline-block;background:#f59e0b;color:#fff;font-size:8px;font-weight:800;border-radius:4px;padding:1px 5px;margin-left:4px;vertical-align:middle">🔒 Partial: ${[...closedTypes].join(", ")}</span>`
          : "";
      // Photo thumbnail (customer photo if available)
      const photoThumb = d.photo_customer
        ? `<img src="${d.photo_customer}" style="width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-left:4px;border:1px solid #ddd" title="Customer photo">`
        : "";

      // Build expandable detail panel (all sections)
      let detailFields = [];
      if (r.section === "gold" || r.section === "od") {
        detailFields = [
          ["Loan A/c No", d.loan_acc_no],
          ["Saving A/c No", d.saving_acc_no],
          ["Share A/c No", d.share_acc_no],
          [
            "Loan Amount",
            d.loan_amount
              ? "₹ " + Number(d.loan_amount).toLocaleString("en-IN")
              : "",
          ],
          ["Amount (Words)", d.loan_amount_words],
          ["Metal Type", d.metal_type],
          [
            "Ornaments",
            d.ornament_items
              ? d.ornament_items
                  .map((r) => `${r.name} × ${r.qty} (${r.weight}gm)`)
                  .join(", ")
              : [d.gold_ornaments, d.silver_ornaments]
                  .filter(Boolean)
                  .join(" / "),
          ],
          [
            "Total Weight",
            d.ornament_weight ? d.ornament_weight + " g" : "",
          ],
          [
            "Nominee",
            d.nominee_name
              ? `${d.nominee_name} (${d.nominee_relation || "—"})`
              : "",
          ],
          ["PAN", d.pan],
          ["DOB", d.dob],
          ["Occupation", d.occupation],
          ["Referral", d.referral],
          ["Comments", d.comments],
        ];
      } else if (r.section === "fd") {
        detailFields = [
          ["FD A/c No", d.fd_acc_no],
          ["Parvati No", d.fd_parvati_no],
          ["Saving A/c No", d.saving_acc_no],
          [
            "FD Amount",
            d.fd_amount
              ? "₹ " + Number(d.fd_amount).toLocaleString("en-IN")
              : "",
          ],
          ["Amount (Words)", d.fd_amount_words],
          ["FD Period", d.fd_period],
          [
            "Interest Rate",
            d.fd_interest_rate ? d.fd_interest_rate + "%" : "",
          ],
          ["Maturity Date", d.fd_maturity_date],
          [
            "Maturity Amount",
            d.fd_maturity_amount
              ? "₹ " +
                Number(d.fd_maturity_amount).toLocaleString("en-IN")
              : "",
          ],
          [
            "Nominee",
            d.nominee_name
              ? `${d.nominee_name} (${d.nominee_relation || "—"})`
              : "",
          ],
          ["PAN", d.pan],
          ["DOB", d.dob],
          ["Comments", d.comments],
        ];
      } else {
        detailFields = [
          ["Saving A/c No", d.saving_acc_no],
          ["Share A/c No", d.share_acc_no],
          ...(dbTxTypeFilter === "Saving Deposit" ||
          dbTxTypeFilter === "Saving Withdrawal"
            ? (function () {
                const isDeposit = dbTxTypeFilter === "Saving Deposit";
                const rb = (window._runningBalMap || {})[r.id] || {};
                const prevBal =
                  rb.prevBal != null
                    ? rb.prevBal
                    : d.saving_balance
                      ? parseFloat(d.saving_balance)
                      : null;
                const resultBal = rb.resultBal;
                return [
                  [
                    isDeposit ? "Deposit Amount" : "Withdrawal Amount",
                    d.deposit_amount
                      ? "₹ " +
                        Number(d.deposit_amount).toLocaleString("en-IN")
                      : "",
                  ],
                  ["Amount (Words)", d.deposit_amount_words],
                  [
                    "Previous Balance",
                    prevBal != null
                      ? "₹ " + prevBal.toLocaleString("en-IN")
                      : "",
                  ],
                  [
                    isDeposit
                      ? "Total Balance After"
                      : "Remaining Balance After",
                    resultBal != null
                      ? "₹ " + resultBal.toLocaleString("en-IN")
                      : "",
                  ],
                ];
              })()
            : [
                [
                  "Saving Balance",
                  d.saving_balance
                    ? "₹ " +
                      Number(d.saving_balance).toLocaleString("en-IN")
                    : "",
                ],
              ]),
          [
            "Nominee",
            d.nominee_name
              ? `${d.nominee_name} (${d.nominee_relation || "—"})`
              : "",
          ],
          ["PAN", d.pan],
          ["DOB", d.dob],
          ["Occupation", d.occupation],
          ["Referral", d.referral],
          ["Comments", d.comments],
        ];
      }
      const photos = [
        { src: d.photo_customer, lbl: "Customer" },
        { src: d.photo_ornament, lbl: "Ornament" },
        { src: d.photo_aadhar_front, lbl: "Aadhar Front" },
        { src: d.photo_aadhar_back, lbl: "Aadhar Back" },
        { src: d.photo_pan, lbl: "PAN" },
      ].filter((p) => p.src);
      const photoHtml = photos
        .map(
          (p) =>
            `<div style="text-align:center"><img src="${p.src}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;border:1.5px solid #ddd"><div style="font-size:8px;color:#777;margin-top:2px">${p.lbl}</div></div>`,
        )
        .join("");
      const fieldHtml = detailFields
        .filter((f) => f[1])
        .map(
          (f) =>
            `<div style="font-size:8.5pt"><span style="color:#888;font-weight:600">${f[0]}:</span> <strong>${f[1]}</strong></div>`,
        )
        .join("");
      const detailRow = `<tr id="detail-${r.id}" style="display:none;background:#f8f9ff">
    <td colspan="10" style="padding:10px 16px;border-top:1px solid #e0e7ff">
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start">
        <div style="flex:1;min-width:220px;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px">${fieldHtml}</div>
        ${photos.length ? `<div style="display:flex;gap:8px;flex-wrap:wrap">${photoHtml}</div>` : ""}
      </div>
    </td>
  </tr>`;

      return `<tr style="cursor:pointer;${isClosed ? "opacity:0.65;" : ""}${isSubSonar ? "background:#fffbeb;border-left:3px solid #f59e0b;" : isMainSonar ? "background:#f0f4ff;border-left:3px solid #6366f1;" : ""}" onclick="toggleDetail(${r.id},this)">
<td>${dbOff + i + 1}</td><td style="white-space:nowrap">${r.date || "—"}</td>
<td><strong>${r.name || "—"}</strong>${photoThumb}${closedBadge}${extraInfo}</td>
<td>${isSon ? '<span class="stag">🔑 Other</span>' : "Regular"}</td>
<td style="font-size:9px">${r.aadhar || "—"}</td>
<td style="white-space:nowrap">${r.mobile || "—"}</td>
<td style="font-size:9px">${acct}</td>
<td style="font-size:8.5pt;color:#555;line-height:1.5">${extraCol}</td>
<td><span class="badge" style="${bs}">${(function(raw){
  if (!raw) return "—";
  if (Array.isArray(raw)) return raw.join(", ").substring(0, 36);
  const s = String(raw).trim();
  if (s.startsWith("[") || s.startsWith("{")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.join(", ").substring(0, 36);
      if (typeof parsed === "object") return Object.values(parsed).join(", ").substring(0, 36);
    } catch(e) {}
    return s.replace(/[\[\]{}\'"]/g, "").replace(/,/g, ", ").substring(0, 36);
  }
  return s.substring(0, 36);
})(r.tx_types)}</span></td>
<td><div class="abtns">
  <button class="sb" style="background:#daeef8;color:#3a8fbf" onclick="event.stopPropagation();editRec(${r.id})">✏️</button>
  <button class="sb" style="background:#fde8d8;color:#e87b50" onclick="event.stopPropagation();pdfRec(${r.id})">📄</button>
  ${
    isClosed
      ? `<button class="sb" style="background:#d4f5e9;color:#2a7a50" title="Reopen" onclick="event.stopPropagation();reopenRec(${r.id})">🔓</button>`
      : hasOpenTypes &&
          (dbTxFilter || document.getElementById("db-sect").value)
        ? `<button class="sb" style="background:#fde0e8;color:#c0392b" title="Close Account/Loan" onclick="event.stopPropagation();openCloseModal(${r.id},'${(r.name || "").replace(/'/g, "\\'")}','${r.tx_types || ""}','${r.sonar_sub_no || ""}','${dbTxFilter || document.getElementById("db-sect").value}')">🔒</button>`
        : ``
  }
  <button class="sb" style="background:#fde0e8;color:#d04070" onclick="event.stopPropagation();delRec(${r.id})">🗑️</button>
</div></td></tr>${detailRow}`;
    })
    .join("");
}

function renderPages() {
  const pg = document.getElementById("db-pages");
  const pages = Math.ceil(dbTot / 50),
    cur = Math.floor(dbOff / 50);
  if (pages <= 1) {
    pg.innerHTML = `<span style="font-size:10px;color:var(--textl)">${dbTot} record(s)</span>`;
    return;
  }
  let h = `<span style="font-size:10px;color:var(--textl)">${dbTot} total</span>`;
  if (cur > 0)
    h += `<button class="btn" style="background:var(--mint);color:var(--mint-a);padding:6px 11px;font-size:10px" onclick="goPage(${cur - 1})">← Prev</button>`;
  h += `<span style="font-size:10px;font-weight:700;padding:0 7px">Page ${cur + 1}/${pages}</span>`;
  if (cur < pages - 1)
    h += `<button class="btn" style="background:var(--mint);color:var(--mint-a);padding:6px 11px;font-size:10px" onclick="goPage(${cur + 1})">Next →</button>`;
  pg.innerHTML = h;
}
function goPage(p) {
  dbOff = p * 50;
  loadDB();
}

function toggleDetail(id, row) {
  const detail = document.getElementById("detail-" + id);
  if (!detail) return;
  const isOpen = detail.style.display !== "none";
  detail.style.display = isOpen ? "none" : "table-row";
  row.style.background = isOpen ? "" : "#eef2ff";
}

async function delRec(id) {
  if (!confirm("Delete this record?")) return;
  await fetch(API + "/" + id, { method: "DELETE" });
  toast("Deleted", "err");
  invalidateSavingCache();
  loadDB();
  loadDashboard();
}

async function editRec(id) {
  const rec = await (await fetch(API + "/" + id)).json();
  editId = id;
  const d2 = rec.data || {};
  let html = "";
  if (rec.sonar_sub_no) {
    html += `<div style="background:var(--amber);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:11px;font-weight:700;color:var(--amber-a)">🔑 Other — Group: ${rec.sonar_group_no || "—"} · Sub: ${rec.sonar_sub_no}</div>`;
  }
  SECTIONS.forEach((s) => {
    const vis = s.fields.filter(
      (f) => f.type !== "photo" && (d2[f.id] !== undefined || f.req),
    );
    if (!vis.length) return;
    html += `<div class="sec-lbl">${s.sec}</div><div class="fgrid">`;
    vis.forEach((f) => {
      const cls = f.w === 2 ? "fw" : "",
        val = d2[f.id] || "";
      if (f.type === "textarea")
        html += `<div class="field ${cls}"><label>${f.label}</label><textarea id="ef-${f.id}">${val}</textarea></div>`;
      else if (f.type === "select")
        html += `<div class="field ${cls}"><label>${f.label}</label><select id="ef-${f.id}">${(f.opts || []).map((o) => `<option ${o === val ? "selected" : ""}>${o}</option>`).join("")}</select></div>`;
      else
        html += `<div class="field ${cls}"><label>${f.label}</label><input type="${f.type}" id="ef-${f.id}" value="${val}"></div>`;
    });
    html += "</div>";
  });
  document.getElementById("edit-body").innerHTML = html;
  document.getElementById("edit-modal").classList.add("open");
}

async function saveEdit() {
  const rec = await (await fetch(API + "/" + editId)).json();
  const nd = { ...rec.data };
  SECTIONS.forEach((s) =>
    s.fields.forEach((f) => {
      const el = document.getElementById("ef-" + f.id);
      if (el) nd[f.id] = el.value;
    }),
  );
  await fetch(API + "/" + editId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nd.customer_name || rec.name,
      customer_id: nd.customer_id || rec.customer_id,
      customer_type: rec.customer_type,
      aadhar: nd.aadhar || rec.aadhar,
      mobile: nd.mobile || rec.mobile,
      account_no: nd.saving_acc_no || nd.account_no || rec.account_no,
      date: nd.date || rec.date,
      section: rec.section,
      tx_types: rec.tx_types,
      data: nd,
      remarks: nd.comments || "",
      sonar_parent_no: rec.sonar_parent_no,
      sonar_sub_no: rec.sonar_sub_no,
      sonar_group_no: rec.sonar_group_no,
    }),
  });
  closeEdit();
  invalidateSavingCache();
  loadDB();
  toast("✅ Updated!", "ok");
}
function closeEdit() {
  document.getElementById("edit-modal").classList.remove("open");
  editId = null;
}

async function pdfRec(id) {
  const rec = await (await fetch(API + "/" + id)).json();
  const txArr = parseTxTypes(rec.tx_types);
  const data = { ...(rec.data || {}) };
  // Restore key top-level fields if missing in data blob
  if (!data.customer_name) data.customer_name = rec.name;
  if (!data.aadhar) data.aadhar = rec.aadhar;
  if (!data.mobile) data.mobile = rec.mobile;
  if (!data.saving_acc_no && rec.account_no)
    data.saving_acc_no = rec.account_no;
  if (!data.customer_id) data.customer_id = rec.customer_id;
  if (!data.date) data.date = rec.date;
  // For Closing - Loan: always use the closing date from the form, never the original loan date
  if (txArr.includes("Closing - Loan") && window._closingOriginalDate) {
    data.date = data.date || window._closingOriginalDate;
  }
  const pC = ctype;
  ctype = rec.sonar_group_no ? "sonar" : "regular";
  let pdfTxArrRec = [...txArr];
  if (txArr.includes("Gold Loan") && !txArr.includes("Gold Receipt")) {
    pdfTxArrRec = pdfTxArrRec
      .map((t) =>
        t === "Gold Loan"
          ? ["Gold Loan", "Slips - Loan", "Gold Receipt"]
          : [t],
      )
      .flat();
  }
  if (txArr.includes("New FD")) {
    pdfTxArrRec = pdfTxArrRec
      .map((t) =>
        t === "New FD"
          ? ["Fixed Deposit", "FD - Slips", "Form 60-61"]
          : [t],
      )
      .flat();
  }
  if (
    txArr.includes("MIS Interest") &&
    !pdfTxArrRec.includes("MIS Interest - Slips")
  ) {
    pdfTxArrRec = pdfTxArrRec
      .map((t) => (t === "MIS Interest" ? ["MIS Interest - Slips"] : [t]))
      .flat();
  }
  generateTemplatePDF(pdfTxArrRec, data);
  ctype = pC;
  toast("📄 PDF ready", "ok");
}

async function exportCSV() {
  const q = document.getElementById("db-q")?.value || "";
  const sect = document.getElementById("db-sect")?.value || "";
  const ct = document.getElementById("db-ctype")?.value || "";
  const p = new URLSearchParams({ limit: 9999, offset: 0 });
  if (q) p.set("q", q);
  if (sect) p.set("section", sect);
  if (ct) p.set("customer_type", ct);
  const { records } = await (await fetch(API + "?" + p)).json();
  if (!records.length) {
    toast("No records", "err");
    return;
  }
  const keys = [
    "id",
    "date",
    "name",
    "customer_id",
    "customer_type",
    "aadhar",
    "mobile",
    "account_no",
    "section",
    "tx_types",
    "sonar_parent_no",
    "sonar_sub_no",
    "sonar_group_no",
    "remarks",
    "created_at",
  ];
  const csv = [
    keys.join(","),
    ...records.map((r) =>
      keys
        .map((k) => `"${(r[k] || "").toString().replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `JJU_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  toast(`📥 Exported ${records.length} records`, "ok");
}

// ═══════════════════════════════════════
//  IMPORT
// ═══════════════════════════════════════
function onDrop(e) {
  e.preventDefault();
  document.getElementById("drop-zone").classList.remove("over");
  const f = e.dataTransfer.files[0];
  if (f) processFile(f);
}
function onFileSelect(e) {
  const f = e.target.files[0];
  if (f) processFile(f);
}

function processFile(file) {
  document.getElementById("file-info").style.display = "block";
  document.getElementById("file-info").textContent =
    `📁 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let rows = [];
      if (file.name.toLowerCase().endsWith(".csv")) {
        rows = parseCSV(e.target.result);
      } else {
        const wb = XLSX.read(e.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      }
      if (rows.length < 2) {
        toast("File empty or no data rows", "err");
        return;
      }
      impCols = rows[0].map((c) => String(c).trim());
      impRows = rows
        .slice(1)
        .filter((r) => r.some((c) => String(c).trim()));
      buildColMap();
      showPreview();
    } catch (err) {
      toast("Error reading file: " + err.message, "err");
    }
  };
  if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
  else reader.readAsBinaryString(file);
}

function parseCSV(txt) {
  return txt
    .split(/\r?\n/)
    .map((line) => {
      const row = [];
      let cur = "",
        inQ = false;
      for (const ch of line) {
        if (ch === '"') inQ = !inQ;
        else if (ch === "," && !inQ) {
          row.push(cur.trim());
          cur = "";
        } else cur += ch;
      }
      row.push(cur.trim());
      return row;
    })
    .filter((r) => r.some((c) => c));
}
function autoMatch(fid) {
  const needle = fid.toLowerCase().replace(/_/g, "");
  return impCols.find((c) => {
    const ch = c.toLowerCase().replace(/[\s_\-]/g, "");
    return (
      ch === needle ||
      ch.includes(needle) ||
      needle.includes(ch.substring(0, 5))
    );
  });
}
function buildColMap() {
  document.getElementById("col-map").innerHTML = IMP_FIELDS.map((f) => {
    const match = autoMatch(f.id);
    return `<div class="map-item"><label>${f.label}</label>
<select id="map-${f.id}"><option value="">(skip)</option>
  ${impCols.map((c) => `<option value="${c}"${c === match ? " selected" : ""}>${c}</option>`).join("")}
</select></div>`;
  }).join("");
  document.getElementById("map-card").style.display = "block";
}
function showPreview() {
  const n = Math.min(impRows.length, 5);
  document.getElementById("preview-info").textContent =
    `${impRows.length} records found. Preview of first ${n} rows:`;
  const hd = impCols
    .map(
      (c) =>
        `<th style="background:var(--mint);padding:5px 7px;font-size:8px;font-weight:800;color:var(--mint-a);white-space:nowrap">${c}</th>`,
    )
    .join("");
  const tb = impRows
    .slice(0, n)
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td style="padding:4px 7px;font-size:9px;border-bottom:1px solid var(--border)">${c}</td>`).join("")}</tr>`,
    )
    .join("");
  document.getElementById("preview-table").innerHTML =
    `<table style="border-collapse:collapse;background:#fff;min-width:400px"><thead><tr>${hd}</tr></thead><tbody>${tb}</tbody></table>`;
  document.getElementById("preview-card").style.display = "block";
}

async function doImport() {
  const section = document.getElementById("imp-section").value;
  const custType = document.getElementById("imp-ctype").value;
  const mapping = {};
  IMP_FIELDS.forEach((f) => {
    const v = document.getElementById("map-" + f.id)?.value;
    if (v) mapping[f.id] = v;
  });
  if (!mapping.name) {
    toast("Map Customer Name column first", "err");
    return;
  }
  const colIdx = {};
  impCols.forEach((c, i) => (colIdx[c] = i));
  const records = impRows
    .map((row) => {
      const rec = { section, customer_type: custType, data: {} };
      IMP_FIELDS.forEach((f) => {
        if (mapping[f.id]) {
          const val = String(row[colIdx[mapping[f.id]]] || "").trim();
          rec[f.id] = val;
          rec.data[f.id] = val;
        }
      });
      return rec.name ? rec : null;
    })
    .filter(Boolean);
  if (!records.length) {
    toast("No valid records to import", "err");
    return;
  }
  const progDiv = document.getElementById("import-prog");
  progDiv.style.display = "block";
  const bar = document.getElementById("prog-bar");
  const ptxt = document.getElementById("prog-text");
  let imported = 0;
  const chunk = 50;
  for (let i = 0; i < records.length; i += chunk) {
    try {
      const res = await fetch(API + "/import/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: records.slice(i, i + chunk) }),
      });
      const j = await res.json();
      imported += j.count || 0;
    } catch (e) {
      toast("Import error: " + e.message, "err");
      break;
    }
    bar.style.width =
      Math.min(Math.round(((i + chunk) / records.length) * 100), 100) +
      "%";
    ptxt.textContent = `Imported ${imported} / ${records.length}…`;
  }
  toast(`✅ Imported ${imported} records!`, "ok");
  loadDashboard();
  setTimeout(resetImport, 1800);
}
function resetImport() {
  impRows = [];
  impCols = [];
  document.getElementById("file-inp").value = "";
  document.getElementById("file-info").style.display = "none";
  document.getElementById("map-card").style.display = "none";
  document.getElementById("preview-card").style.display = "none";
  document.getElementById("import-prog").style.display = "none";
  document.getElementById("prog-bar").style.width = "0%";
}

// ═══════════════════════════════════════
//  CASH BOOK
// ═══════════════════════════════════════

const CB_API = "/api/cashbook";

// [static data moved to js/data/static-data.js]

// [static data moved to js/data/static-data.js]

// Determine transaction type from tx type name
function cbTxType(txType) {
  const credits = [
    "Saving Account",
    "Sadasya",
    "Fixed Deposit",
    "Gold Loan",
    "OD Loan",
    "New FD-OD Loan",
    "Naammatr Sabhasad Account",
    "FD - Slips",
    "Sadasya - Slips",
    "Naammatr Sabhasad - Slips",
    "Closing - Loan",
    "Closing - FD",
    "Closing - FD - Slips",
  ];
  const debits = [
    "Slips - Loan",
    "Slips - OD",
    "Slips - FD-OD",
    "Closing - Saving Account",
  ];
  if (credits.includes(txType)) return "Credit";
  if (debits.includes(txType)) return "Debit";
  return "Credit";
}

// Determine if transaction is Cash or Transfer
function cbMode(txType) {
  const transfers = [
    "Slips - Loan",
    "Slips - OD",
    "Slips - FD-OD",
    "FD - Slips",
    "Sadasya - Slips",
    "Naammatr Sabhasad - Slips",
    "Closing - FD - Slips",
  ];
  return transfers.includes(txType) ? "Transfer" : "Cash";
}

// Get amount from record data
function cbAmount(rec) {
  const d = rec.data || {};
  return (
    parseFloat(
      d.loan_amount ||
        d.fd_amount ||
        d.expense_amount ||
        d.saving_balance ||
        0,
    ) || 0
  );
}

// Add cashbook entries automatically when a record is saved
// ── IN-MEMORY ONLY — entries live here until user clicks Generate/Print ──
async function addCashbookRows(recordId, data, txArr) {
  try {
    // For Closing - Loan: always use the form date (= closing date), not fallback to today
    const date = data.date || new Date().toISOString().split("T")[0];
    const name = data.customer_name || "";
    const entries = [];
    let sortOrder = 0;

    // If Gold Loan is selected along with Slips - Loan, skip Slips - Loan
    // to avoid double entries (Gold Loan already covers all 4 rows)
    const skipTypes = new Set();
    if (txArr.includes("Gold Loan") && txArr.includes("Slips - Loan")) {
      skipTypes.add("Slips - Loan");
    }
    // Skip standalone Saving Account row when Gold Loan is selected
    // (Gold Loan already generates the saving account rows)
    if (txArr.includes("Gold Loan") && txArr.includes("Saving Account")) {
      skipTypes.add("Saving Account");
    }
    // Skip Saving Account when New Sadasya selected — New Sadasya covers all 4 rows
    if (
      txArr.includes("New Sadasya") &&
      txArr.includes("Saving Account")
    ) {
      skipTypes.add("Saving Account");
    }
    if (txArr.includes("Fixed Deposit") && txArr.includes("FD - Slips")) {
      skipTypes.add("FD - Slips");
    }
    if (txArr.includes("New FD")) {
      skipTypes.add("Fixed Deposit");
      skipTypes.add("FD - Slips");
    }
    if (
      txArr.includes("Closing - FD") &&
      txArr.includes("Closing - FD - Slips")
    ) {
      skipTypes.add("Closing - FD - Slips");
    }

    // For sub-loan closing, only the final "Gold Loan Closing" Cash row
    // belongs in the main cashbook — skip the two TRF rows
    const isSubLoanClosing =
      txArr.includes("Closing - Loan") &&
      window._closingMeta &&
      window._closingMeta.sonar_sub_no;

    txArr.forEach((txType) => {
      if (skipTypes.has(txType)) return;
      const rows = CB_TX_ROWS_MAP[txType];
      if (!rows) return;
      rows.forEach((row) => {
        // Sub-loan closing: skip the TRF rows, keep only the Cash closing row
        if (
          isSubLoanClosing &&
          txType === "Closing - Loan" &&
          row.mode === "Transfer"
        )
          return;
        // Skip saving acc TRF row from New Sadasya when Gold Loan already handles it
        if (row.skipWhenGoldLoan && txArr.includes("Gold Loan")) return;

        let amount = 0;
        if (typeof row.amountField === "number" && row.amountField > 0) {
          // Fixed amount (e.g. Loan Form Fee = 50)
          amount = row.amountField;
        } else if (
          row.amountField &&
          typeof row.amountField === "string"
        ) {
          // Pull from form data field
          amount = parseFloat(data[row.amountField]) || 0;
        }
        entries.push({
          date,
          record_id: recordId,
          name,
          task:
            row.acc_type === "Bank TRF" && data.bank_acc_name
              ? (() => {
                  // Map bank_acc_name → exact VOUCHER_TEMPLATE task name
                  const BANK_TASK_MAP = {
                    "Buldhana Urban Bank - Current Acc (015002100000260)":
                      "Buldhana Urban Bank - Current Acc (015002100000260) - TRF",
                    "Bank of Maha - FD-OD (60494510691)":
                      "Bank of Maha - FD-OD (60494510691) - TRF",
                    "Bank of Maha - Current Acc (60438097699)":
                      "Bank of Maha - Current Acc (60438097699) - TRF",
                    "THE N.U. BANK Current Acc (003002100000926)":
                      "THE N.U. BANK Current Acc (003002100000926) - TRF",
                    "Rajarshi Shahu Curr (03202007000046)":
                      "Rajarshi Shahu Curr (03202007000046) - TRF",
                    "The Sahyog Urban Curr Acc (8001173)":
                      "The Sahyog Urban Curr Acc (8001173) - TRF",
                    "SBI Current Acc (43227989097)":
                      "SBI Current Acc - TRF",
                  };
                  return (
                    BANK_TASK_MAP[data.bank_acc_name] ||
                    data.bank_acc_name + " - TRF"
                  );
                })()
              : row.task,
          acc_type: row.isBeneficiary
            ? data[row.acc_type_field] || row.acc_type
            : row.acc_type === "Bank TRF" && data.bank_acc_name
              ? data.bank_acc_name
              : row.acc_type,
          tx_type: row.tx_type,
          acc_no: (() => {
            // Beneficiary rows (e.g. RTGS Credit) use their own acc_no field directly
            if (row.isBeneficiary) {
              return data[row.acc_no] && data[row.acc_no] !== undefined
                ? data[row.acc_no]
                : row.accFallback || row.acc_no;
            }
            // For Bank TRF rows, resolve acc_no from bank_acc_name mapping
            const BANK_ACC_MAP = {
              "Buldhana Urban Bank - Current Acc (015002100000260)":
                "945-2",
              "Bank of Maha - FD-OD (60494510691)": "946-2",
              "Bank of Maha - Current Acc (60438097699)": "288-1",
              "THE N.U. BANK Current Acc (003002100000926)": "926-2",
              "Rajarshi Shahu Curr (03202007000046)": "960-2",
              "The Sahyog Urban Curr Acc (8001173)": "952-2",
              "SBI Current Acc (43227989097)": "953-1",
            };
            if (
              row.acc_type === "Bank TRF" &&
              data.bank_acc_name &&
              BANK_ACC_MAP[data.bank_acc_name]
            ) {
              return BANK_ACC_MAP[data.bank_acc_name];
            }
            return row.acc_no &&
              data[row.acc_no] !== undefined &&
              data[row.acc_no]
              ? data[row.acc_no]
              : row.accFallback || row.acc_no;
          })(),
          amount,
          mode: row.mode,
          scroll_no: "",
          loan_date: "",
          sort_order: sortOrder++,
        });
      });
    });

    if (entries.length === 0) {
      console.warn("addCashbookRows: 0 entries built for txArr=", txArr, "data=", data);
      toast("⚠️ No cashbook rows generated — check CB_TX_ROWS_MAP for: " + txArr.join(", "), "err");
      return;
    }

    // ── Save to DB: first entry is parent, rest are children ──
    try {
      // Insert parent row first to get its DB id
      const parentEntry = { ...entries[0], parent_id: null };
      const parentRes = await fetch(CB_API + "/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: [parentEntry] }),
      });
      if (!parentRes.ok) {
        const errText = await parentRes.text().catch(() => parentRes.status);
        console.error("addCashbookRows: parent insert failed:", errText);
        toast("⚠️ Ledger rows save failed: " + errText, "err");
        return;
      }
      const parentSaved = await parentRes.json();
      const parentRow   = (parentSaved.entries || [])[0];
      const parentId    = parentRow?.id || null;

      // Insert child rows with parent_id + inherit name/record_id from parent
      const childEntries = entries.slice(1).map(e => ({
        ...e,
        parent_id: parentId,
        record_id: e.record_id || recordId,
        name:      e.name      || parentRow?.name || name,
        task:      e.task      || parentRow?.task || "",
      }));

      let allSaved = parentRow ? [parentRow] : [];
      if (childEntries.length > 0) {
        const childRes = await fetch(CB_API + "/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entries: childEntries }),
        });
        if (childRes.ok) {
          const childSaved = await childRes.json();
          allSaved = allSaved.concat(childSaved.entries || []);
        } else {
          const errText = await childRes.text().catch(() => childRes.status);
          console.error("addCashbookRows: child insert failed:", errText);
        }
      }

      // Push all saved rows (with real DB ids) to in-memory arrays
      allSaved.forEach(e => { if (e) { e._saved = true; ledgerAllRows.push(e); } });

      // Push parent record to ledgerRecords if not already there
      if (recordId && !ledgerRecords.find(r => r.id === recordId)) {
        ledgerRecords.push({
          id: recordId,
          name: data.customer_name || data.name || "",
          tx_types: txArr.join(","),
          date: date,
          sonar_sub_no: null,
        });
      }
      console.log("addCashbookRows: saved", allSaved.length, "rows to DB for", txArr);
      toast("✅ " + allSaved.length + " ledger rows saved", "ok");
    } catch(bulkErr) {
      console.error("addCashbookRows: fetch error:", bulkErr);
      toast("⚠️ Ledger rows error: " + bulkErr.message, "err");
    }

    // Re-render ledger if it's visible
    try { renderLedger(); } catch(e) {}

  } catch (e) {
    console.error("Cashbook auto-fill error:", e);
    toast("⚠️ Cashbook auto-fill error: " + e.message, "err");
  }
}

let cbData = null;

async function loadPrevClosingAsOpening() {
  const dateEl = document.getElementById("cb-date");
  const openEl = document.getElementById("cb-opening");
  if (!dateEl.value) {
    toast("Select a date first", "err");
    return;
  }
  const dt = new Date(dateEl.value);
  dt.setDate(dt.getDate() - 1);
  const prevDate = dt.toISOString().split("T")[0];
  try {
    let entries;
    const todayStr = new Date().toISOString().split("T")[0];
    if (prevDate === todayStr && ledgerAllRows.length > 0) {
      entries = ledgerAllRows.filter(r => !r.date || r.date === prevDate);
    } else {
      const resp = await fetch(CB_API + "?date=" + prevDate);
      const json = await resp.json();
      entries = json.entries || [];
    }
    const prevOpening =
      parseFloat(
        document
          .getElementById("cb-opening")
          ?.getAttribute("data-prev-opening") || "0",
      ) || 0;
    const txRows = entries.map((e) => ({
      txType: e.tx_type,
      amount: parseFloat(e.amount) || 0,
      mode: e.mode,
    }));
    const cashRows = txRows.filter((r) => r.mode === "Cash");
    const totalCredit = cashRows
      .filter((r) => r.txType === "Credit")
      .reduce((s, r) => s + r.amount, 0);
    const totalDebit = cashRows
      .filter((r) => r.txType === "Debit")
      .reduce((s, r) => s + r.amount, 0);
    // We need prev opening too - check localStorage
    const savedPrevOpening =
      parseFloat(localStorage.getItem("cb-opening-" + prevDate) || "0") ||
      0;
    const prevClosing = savedPrevOpening + totalCredit - totalDebit;
    openEl.value = prevClosing;
    localStorage.setItem("cb-opening-" + dateEl.value, prevClosing);
    toast(
      `Previous closing (${prevDate}): ₹${prevClosing.toLocaleString("en-IN")} set as opening balance`,
      "ok",
    );
  } catch (e) {
    toast("Could not load previous day data", "err");
  }
}

async function loadCashBook() {
  const date = document.getElementById("cb-date").value;
  const opening =
    parseFloat(document.getElementById("cb-opening").value) || 0;
  if (!date) {
    toast("Select a date", "err");
    return;
  }
  try { localStorage.setItem("cb-opening-" + date, opening); } catch(e) {}

  const today = new Date().toISOString().split("T")[0];
  let sourceEntries;

  if (date === today && ledgerAllRows.length > 0) {
    // Today: use in-memory entries
    sourceEntries = ledgerAllRows.filter(r => !r.date || r.date === date);
  } else {
    // Past date or nothing in memory: load from DB
    try {
      const resp = await fetch(CB_API + "?date=" + date);
      const json = await resp.json();
      sourceEntries = json.entries || [];
    } catch(e) {
      toast("❌ Server offline — cannot load cash book", "err");
      showOfflineBanner();
      return;
    }
  }

  const txRows = sourceEntries.map((e, i) => ({
    id: e.id,
    txNo: i + 1,
    name: e.name,
    task: e.task || e.acc_type,
    accType: e.acc_type || e.task,
    txType: e.tx_type,
    accNo: e.acc_no,
    amount: parseFloat(e.amount) || 0,
    mode: e.mode,
    scrollNo: e.scroll_no,
    loanDate: e.loan_date,
    recordId: e.record_id,
  }));

  const credits = txRows.filter(r => r.txType === "Credit");
  const debits  = txRows.filter(r => r.txType === "Debit");
  const totalCredit = credits.reduce((s,r) => s + r.amount, 0);
  const totalDebit  = debits.reduce((s,r)  => s + r.amount, 0);
  const closing = opening + totalCredit - totalDebit;

  cbData = { date, opening, closing, totalCredit, totalDebit, txRows };
  renderCashBook(cbData);

  // ── Save to DB when generating cash book ──
  // This is the moment entries get persisted: only Cash mode rows go to cashbook_entries
  await _flushToDB(date, sourceEntries);
}

// Flush in-memory entries to DB (called only when generating cashbook/PDF)
async function _flushToDB(date, entries) {
  const unsaved = entries.filter(e => !e._saved);
  if (!unsaved.length) return; // nothing new to save

  try {
    const payload = unsaved.map(e => ({
      date:       e.date       || date,
      parent_id:  e.parent_id  || null,
      record_id:  e.record_id  || null,
      name:       e.name       || "",
      task:       e.task       || e.acc_type || "",
      acc_type:   e.acc_type   || e.task || "",
      tx_type:    e.tx_type    || "Credit",
      acc_no:     e.acc_no     || "",
      amount:     parseFloat(e.amount) || 0,
      mode:       e.mode       || "Cash",
      scroll_no:  e.scroll_no  || "",
      loan_date:  e.loan_date  || "",
      sort_order: e.sort_order || 0,
    }));

    const res = await fetch(CB_API + "/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: payload }),
    });

    if (res.ok) {
      const saved = await res.json();
      // Update in-memory rows with real DB ids and mark as saved
      (saved.entries || []).forEach((dbRow, i) => {
        const memRow = ledgerAllRows.find(r => !r._saved &&
          r.name === dbRow.name && r.task === dbRow.task &&
          String(r.amount) === String(dbRow.amount));
        if (memRow) { memRow.id = dbRow.id; memRow._saved = true; }
      });
      toast("✅ " + payload.length + " entries saved to database", "ok");
    } else {
      const err = await res.text().catch(() => res.status);
      toast("⚠️ Could not save to DB: " + err, "err");
    }
  } catch(e) {
    // Server offline — silently skip DB save, PDF still works from memory
    console.warn("_flushToDB: server unreachable, skipping DB save", e.message);
  }
}

function fmt(n) {
  return "₹ " + Number(n).toLocaleString("en-IN");
}

async function cbSaveCell(id, field, value) {
  await fetch(CB_API + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: value }),
  });
}

async function cbFullSave(id) {
  const row = document.querySelector(`tr[data-cb-id="${id}"]`);
  if (!row) return;
  const get = (f) =>
    row.querySelector(`[data-field="${f}"]`)?.value ?? "";
  const payload = {
    acc_no: get("acc_no"),
    amount: parseFloat(get("amount")) || 0,
    scroll_no: get("scroll_no"),
    loan_date: get("loan_date"),
    tx_type: get("tx_type"),
    mode: get("mode"),
    task: get("task"),
    acc_type: get("acc_type"),
  };
  await fetch(CB_API + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  toast("✅ Row saved", "ok");
  loadCashBook();
}

async function cbDeleteRow(id) {
  // Delegate to ldgDeleteRow which handles soft-delete + recycle bin
  await ldgDeleteRow(id);
  loadCashBook();
}

function renderCashBook(d) {
  const fmtAmt = (n) =>
    Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 0 });
  const fmtDate = (s) => {
    if (!s) return "";
    const dt = new Date(s);
    if (isNaN(dt)) return s;
    return dt
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const cashRows = d.txRows.filter((r) => r.mode === "Cash");
  const crRows = cashRows.filter((r) => r.txType === "Credit");
  const dbRows = cashRows.filter((r) => r.txType === "Debit");
  const totalCredit = crRows.reduce((s, r) => s + r.amount, 0);
  const totalDebit = dbRows.reduce((s, r) => s + r.amount, 0);
  const closing = d.opening + totalCredit - totalDebit;

  // Compute dates for summary table
  const todayDt = new Date(d.date);
  const prevDt = new Date(todayDt);
  prevDt.setDate(prevDt.getDate() - 1);
  const prevDateFmt = fmtDate(prevDt.toISOString().split("T")[0]);
  const todayDateFmt = fmtDate(d.date);

  // Currency denomination table
  const denominations = [500, 100, 50, 10, 5, 1];
  const denomRows = denominations
    .map(
      (denom) => `
    <tr>
      <td style="padding:3px 8px;border:1px solid #ccc;text-align:center">${denom}</td>
      <td style="padding:3px 8px;border:1px solid #ccc;text-align:center"><input type="number" min="0" aria-label="Count for ₹${denom}" value="0" style="width:70px;border:none;text-align:center;font-size:9pt;background:transparent" oninput="recalcDenom()" data-denom="${denom}"></td>
      <td style="padding:3px 8px;border:1px solid #ccc;text-align:right" id="denom-amt-${denom}">0</td>
    </tr>`,
    )
    .join("");

  const currencyTable = `
    <table style="border-collapse:collapse;width:100%;font-size:9.5pt">
      <tr style="background:#f5f5f5">
        <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700">Currency</th>
        <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700">No. of Notes</th>
        <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:right">Amount (₹)</th>
      </tr>
      ${denomRows}
      <tr style="background:#e8f5e9;font-weight:800">
        <td colspan="2" style="padding:4px 8px;border:1px solid #999;text-align:center">Total</td>
        <td id="denom-total" style="padding:4px 8px;border:1px solid #999;text-align:right;color:#c0392b">0</td>
      </tr>
      <tr style="background:#fffde7">
        <td colspan="2" style="padding:4px 8px;border:1px solid #ccc;text-align:center;font-size:8.5pt;color:#7a5800">Closing Balance (should match)</td>
        <td id="denom-closing-ref" data-closing="${closing}" style="padding:4px 8px;border:1px solid #ccc;text-align:right;font-weight:800;font-size:8.5pt;color:#7a5800">${fmtAmt(closing)}</td>
      </tr>
    </table>`;

  // ── Column header — matches screenshot exactly ──
  const colHdr = `
    <tr style="background:#f0f0f0">
      <th style="padding:5px 8px;border:1px solid #ccc;font-size:9pt;text-align:center;width:52px">Trans<br>No</th>
      <th style="padding:5px 8px;border:1px solid #ccc;font-size:9pt;text-align:left">Name</th>
      <th style="padding:5px 8px;border:1px solid #ccc;font-size:9pt;text-align:left">Transaction Type</th>
      <th style="padding:5px 8px;border:1px solid #ccc;font-size:9pt;text-align:center;width:64px">Acc<br>No</th>
      <th style="padding:5px 8px;border:1px solid #ccc;font-size:9pt;text-align:right;width:80px">Amount</th>
    </tr>`;

  // ── Credit rows ──
  const crTblRows =
    crRows
      .map(
        (r, i) => `
    <tr style="${i % 2 === 0 ? "background:#fff" : "background:#f9fdf9"}">
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;color:#555">${r.txNo}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-weight:700">${r.name || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd">${r.accType || r.task || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;font-weight:600;color:#553c9a">${r.accNo || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;font-weight:700">${fmtAmt(r.amount)}</td>
    </tr>`,
      )
      .join("") ||
    `<tr><td colspan="5" style="padding:12px;text-align:center;color:#999;border:1px solid #ddd">No credit entries</td></tr>`;

  // ── Debit rows ──
  const dbTblRows =
    dbRows
      .map(
        (r, i) => `
    <tr style="${i % 2 === 0 ? "background:#fff" : "background:#fff8f8"}">
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;color:#555">${r.txNo}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;font-weight:700">${r.name || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd">${r.accType || r.task || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:center;font-weight:600;color:#553c9a">${r.accNo || "—"}</td>
      <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;font-weight:700">${fmtAmt(r.amount)}</td>
    </tr>`,
      )
      .join("") ||
    `<tr><td colspan="5" style="padding:12px;text-align:center;color:#999;border:1px solid #ddd">No debit entries</td></tr>`;

  document.getElementById("cb-content").innerHTML = `
  <div id="cb-print-area">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:10px">
<div style="font-size:14pt;font-weight:800;font-family:'Playfair Display',serif">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या.</div>
<div style="font-size:10pt;font-weight:600;margin-top:3px">Daily Cash Book — <strong>${fmtDate(d.date)}</strong></div>
    </div>

    <!-- Credit + Debit transaction tables side by side — PRIMARY VIEW matching screenshot -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;margin-bottom:16px">
<!-- Credit table -->
<div>
  <div style="background:#c8e6c9;padding:6px 10px;font-weight:800;font-size:10pt;text-align:center;border:1px solid #999;border-bottom:none">Credit</div>
  <table style="border-collapse:collapse;width:100%;font-size:9pt">
    <thead>${colHdr}</thead>
    <tbody>${crTblRows}</tbody>
    <tfoot>
      <tr style="background:#e8f5e9;font-weight:800">
        <td colspan="4" style="padding:5px 8px;border:1px solid #999;text-align:right">Total Credit</td>
        <td style="padding:5px 8px;border:1px solid #999;text-align:right">${fmtAmt(totalCredit)}</td>
      </tr>
    </tfoot>
  </table>
</div>
<!-- Debit table -->
<div>
  <div style="background:#ffcdd2;padding:6px 10px;font-weight:800;font-size:10pt;text-align:center;border:1px solid #999;border-bottom:none">Debit</div>
  <table style="border-collapse:collapse;width:100%;font-size:9pt">
    <thead>${colHdr}</thead>
    <tbody>${dbTblRows}</tbody>
    <tfoot>
      <tr style="background:#ffebee;font-weight:800">
        <td colspan="4" style="padding:5px 8px;border:1px solid #999;text-align:right">Total Debit</td>
        <td style="padding:5px 8px;border:1px solid #999;text-align:right">${fmtAmt(totalDebit)}</td>
      </tr>
    </tfoot>
  </table>
</div>
    </div>

    <div style="border-top:2px solid #ccc;margin-bottom:12px"></div>

    <!-- Summary + Currency side by side -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;align-items:start">
<table style="border-collapse:collapse;width:100%;font-size:9.5pt">
  <tr><td colspan="3" style="background:#c8e6c9;padding:5px 8px;font-weight:800;text-align:center;border:1px solid #999">Credit</td></tr>
  <tr style="background:#f0f0f0">
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:left">Details</th>
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:center">Date</th>
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:right">Amount (₹)</th>
  </tr>
  <tr>
    <td style="padding:4px 8px;border:1px solid #ccc">Opening Balance</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:center">${prevDateFmt}</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:right;font-weight:700">${fmtAmt(d.opening)}</td>
  </tr>
  <tr>
    <td style="padding:4px 8px;border:1px solid #ccc">Credit for</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:center">${todayDateFmt}</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:right;font-weight:700">${fmtAmt(totalCredit)}</td>
  </tr>
  <tr style="background:#e8f5e9;font-weight:800">
    <td colspan="2" style="padding:4px 8px;border:1px solid #999;text-align:center">Total Credit</td>
    <td style="padding:4px 8px;border:1px solid #999;text-align:right">${fmtAmt(d.opening + totalCredit)}</td>
  </tr>
  <tr><td colspan="3" style="background:#ffcdd2;padding:5px 8px;font-weight:800;text-align:center;border:1px solid #999">Debit</td></tr>
  <tr style="background:#f0f0f0">
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:left">Details</th>
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:center">Date</th>
    <th style="padding:4px 8px;border:1px solid #ccc;font-weight:700;text-align:right">Amount (₹)</th>
  </tr>
  <tr>
    <td style="padding:4px 8px;border:1px solid #ccc">Debit for</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:center">${todayDateFmt}</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:right;font-weight:700">${fmtAmt(totalDebit)}</td>
  </tr>
  <tr>
    <td style="padding:4px 8px;border:1px solid #ccc">Closing Balance</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:center">${todayDateFmt}</td>
    <td style="padding:4px 8px;border:1px solid #ccc;text-align:right;font-weight:700">${fmtAmt(closing)}</td>
  </tr>
  <tr style="background:#fff9c4;font-weight:800">
    <td colspan="2" style="padding:4px 8px;border:1px solid #999;text-align:center">Total Debit</td>
    <td style="padding:4px 8px;border:1px solid #999;text-align:right">${fmtAmt(totalDebit + closing)}</td>
  </tr>
</table>
<div>${currencyTable}</div>
    </div>

    <!-- Closing balance bar -->
    <div style="margin-top:12px;background:var(--lem);border-radius:9px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
<span style="font-weight:800;font-size:11pt;color:var(--lem-a)">Closing Balance</span>
<span style="font-weight:800;font-size:14pt;color:var(--lem-a)">${fmtAmt(closing)}</span>
    </div>

    <!-- Notes / Particulars section -->
    <div style="margin-top:14px;border:1.5px solid #e0d7f5;border-radius:9px;padding:12px 14px;background:#faf8ff">
<div style="font-weight:800;font-size:10pt;color:#553c9a;margin-bottom:7px">📝 Notes / Particulars</div>
<textarea id="cb-notes" rows="3" placeholder="Add daily notes, remarks, or particulars here…"
  style="width:100%;border:1.5px solid #ddd;border-radius:6px;padding:8px 10px;font-size:9.5pt;font-family:'Nunito',sans-serif;resize:vertical;box-sizing:border-box"
  oninput="try{localStorage.setItem('cb-notes-${d.date}',this.value)}catch(e){}">${(() => {
    try {
      return localStorage.getItem("cb-notes-${d.date}") || "";
    } catch (e) {
      return "";
    }
  })()}</textarea>
    </div>

  </div>`;
}

function recalcDenom() {
  let total = 0;
  document.querySelectorAll("[data-denom]").forEach((inp) => {
    const denom = parseInt(inp.getAttribute("data-denom"));
    const count = parseInt(inp.value) || 0;
    const amt = denom * count;
    const cell = document.getElementById("denom-amt-" + denom);
    if (cell) cell.textContent = amt.toLocaleString("en-IN");
    total += amt;
  });
  const totEl = document.getElementById("denom-total");
  if (totEl) {
    totEl.textContent = total.toLocaleString("en-IN");
    // Compare with closing balance
    const closingEl = document.getElementById("denom-closing-ref");
    if (closingEl) {
      const closing =
        parseFloat(closingEl.getAttribute("data-closing")) || 0;
      if (closing > 0 && total !== closing) {
        totEl.style.color = "#c0392b";
        totEl.title = `⚠️ Mismatch! Closing balance is ₹${closing.toLocaleString("en-IN")}`;
      } else if (closing > 0 && total === closing) {
        totEl.style.color = "#2a7a50";
        totEl.title = "✓ Matches closing balance";
      }
    }
  }
}

async function cbAddRow() {
  const date = document.getElementById("cb-date").value;
  if (!date) {
    toast("Select a date first", "err");
    return;
  }
  const newRow = {
    id: -(Date.now()),
    date,
    record_id: null,
    name: "",
    task: "Manual Entry",
    acc_type: "",
    tx_type: "Credit",
    acc_no: "",
    amount: 0,
    mode: "Cash",
    scroll_no: "",
    loan_date: "",
    sort_order: 9999,
    _saved: false,
  };
  ledgerAllRows.push(newRow);
  loadCashBook();
}

async function exportCashBook() {
  if (!cbData) {
    toast("Generate Cash Book first", "err");
    return;
  }
  const d = cbData;
  const wb = XLSX.utils.book_new();

  // Sheet 1: Cash Book entries
  const cbRows = [
    ["जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या."],
    ["Daily Cash Book", "", d.date],
    [
      "Opening Balance",
      d.opening,
      "",
      "Total Credit",
      d.totalCredit,
      "",
      "Total Debit",
      d.totalDebit,
      "",
      "Closing Balance",
      d.closing,
    ],
    [],
    [
      "#",
      "Name",
      "Task",
      "Account Type",
      "Cr/Dr",
      "Acc No",
      "Amount",
      "Mode",
      "Scroll No",
      "Loan Date",
    ],
    ...d.txRows.map((r) => [
      r.txNo,
      r.name,
      r.task,
      r.accType,
      r.txType,
      r.accNo,
      r.amount,
      r.mode,
      r.scrollNo,
      r.loanDate,
    ]),
    [],
    ["", "", "", "", "", "Total Credit", d.totalCredit],
    ["", "", "", "", "", "Total Debit", d.totalDebit],
    ["", "", "", "", "", "Closing Balance", d.closing],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(cbRows);
  XLSX.utils.book_append_sheet(wb, ws1, "CashBook");

  // Sheet 2: Covering Vouchers — matches templateData format with Transfer/Cash split
  const taskTrf = {},
    taskCash = {};
  d.txRows.forEach((r) => {
    if (!r.task) return;
    if (r.mode === "Transfer")
      taskTrf[r.task] = (taskTrf[r.task] || 0) + (r.amount || 0);
    if (r.mode === "Cash")
      taskCash[r.task] = (taskCash[r.task] || 0) + (r.amount || 0);
  });

  const vRows = [
    [
      "Account Type",
      "Account Number",
      "Cr/Dr",
      "Date",
      "Transfer",
      "Cash",
      "Transfer Voucher Name",
      "Cash Voucher Name",
    ],
    ...VOUCHER_TEMPLATE.map((v) => {
      const trfAmt = taskTrf[v.task] || 0;
      const cashAmt = taskCash[v.task] || 0;
      return [
        v.acc_type,
        v.acc_no,
        v.tx_type,
        d.date,
        trfAmt || "",
        cashAmt || "",
        v.trf_name || "",
        v.cash_name || "",
      ];
    }),
    [],
    ["", "", "Grand Total Credit", "", d.totalCredit, "", "", ""],
    ["", "", "Grand Total Debit", "", d.totalDebit, "", "", ""],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(vRows);
  XLSX.utils.book_append_sheet(wb, ws2, "Vouchers");

  XLSX.writeFile(wb, "CashBook_" + d.date + ".xlsx");
  toast("📥 Cash Book exported!", "ok");
}

async function printCashBook() {
  if (!cbData) {
    // Auto-generate if memory has rows
    if (ledgerAllRows.length > 0) { await loadCashBook(); }
    else { toast("Generate Cash Book first", "err"); return; }
  }
  // Flush any unsaved rows to DB before printing
  const date = cbData.date || new Date().toISOString().split("T")[0];
  await _flushToDB(date, ledgerAllRows.filter(r => !r.date || r.date === date));
  const d = cbData;
  const fmtAmt = (n) => Number(n || 0).toLocaleString("en-IN");
  const fmtDate = (s) => {
    try {
      return new Date(s)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    } catch {
      return s || "";
    }
  };

  const cashRows = d.txRows.filter((r) => r.mode === "Cash");
  const crRows = cashRows.filter((r) => r.txType === "Credit");
  const dbRows = cashRows.filter((r) => r.txType === "Debit");
  const totalCr = crRows.reduce((s, r) => s + r.amount, 0);
  const totalDb = dbRows.reduce((s, r) => s + r.amount, 0);
  const closing = d.opening + totalCr - totalDb;
  const BANK = "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या.";

  const todayDt = new Date(d.date);
  const prevDt = new Date(todayDt);
  prevDt.setDate(prevDt.getDate() - 1);
  const prevDateFmt = fmtDate(prevDt.toISOString().split("T")[0]);
  const todayDateFmt = fmtDate(d.date);

  // Read denomination inputs from the screen
  const denomData = [500, 100, 50, 10, 5, 1].map((denom) => {
    const inp = document.querySelector(`input[data-denom="${denom}"]`);
    const notes = inp ? parseInt(inp.value) || 0 : 0;
    return { denom, notes, amt: denom * notes };
  });
  const denomTotal = denomData.reduce((s, r) => s + r.amt, 0);

  // Shared cell styles (inlined so they survive the new window context)
  const S = {
    th: "border:1px solid #999;padding:3px 7px;background:#d9d9d9;font-weight:700;font-size:7.5pt;",
    td: "border:1px solid #ccc;padding:3px 7px;font-size:7.5pt;",
    tdC: "border:1px solid #ccc;padding:3px 7px;font-size:7.5pt;text-align:center;",
    tdR: "border:1px solid #ccc;padding:3px 7px;font-size:7.5pt;text-align:right;",
    tdRB: "border:1px solid #ccc;padding:3px 7px;font-size:7.5pt;text-align:right;font-weight:700;",
    totCr:
      "border:1px solid #999;padding:3px 7px;font-size:7.5pt;background:#e8f5e9;font-weight:800;",
    totDb:
      "border:1px solid #999;padding:3px 7px;font-size:7.5pt;background:#fff9c4;font-weight:800;",
    totDn:
      "border:1px solid #999;padding:3px 7px;font-size:7.5pt;background:#e8f5e9;font-weight:800;",
    totRw:
      "border:1px solid #999;padding:3px 7px;font-size:7.5pt;background:#f0f0f0;font-weight:800;",
    lblCr:
      "border:1px solid #999;padding:4px 7px;font-size:8pt;background:#c8e6c9;font-weight:800;text-align:center;",
    lblDb:
      "border:1px solid #999;padding:4px 7px;font-size:8pt;background:#ffcdd2;font-weight:800;text-align:center;",
  };

  const mkTxRows = (rows) =>
    rows
      .map(
        (r) =>
          "<tr>" +
          '<td style="' +
          S.tdC +
          '">' +
          r.txNo +
          "</td>" +
          '<td style="' +
          S.td +
          'font-weight:700;">' +
          (r.name || "—") +
          "</td>" +
          '<td style="' +
          S.td +
          '">' +
          (r.accType || r.task || "—") +
          "</td>" +
          '<td style="' +
          S.tdC +
          '">' +
          (r.accNo || "—") +
          "</td>" +
          '<td style="' +
          S.tdR +
          'font-weight:700;">' +
          fmtAmt(r.amount) +
          "</td>" +
          "</tr>",
      )
      .join("");

  const denomRows = denomData
    .map(
      (r) =>
        "<tr>" +
        '<td style="' +
        S.tdC +
        '">' +
        r.denom +
        "</td>" +
        '<td style="' +
        S.tdC +
        '">' +
        (r.notes || "") +
        "</td>" +
        '<td style="' +
        S.tdR +
        '">' +
        (r.amt ? fmtAmt(r.amt) : "") +
        "</td>" +
        "</tr>",
    )
    .join("");

  // Summary table HTML (left column of top section)
  const summaryTbl =
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td colspan="3" style="' +
    S.lblCr +
    '">Credit</td></tr>' +
    "<tr>" +
    '<th style="' +
    S.th +
    'text-align:left;">Details</th>' +
    '<th style="' +
    S.th +
    '">Date</th>' +
    '<th style="' +
    S.th +
    '">Amount (Rs.)</th>' +
    "</tr>" +
    "<tr>" +
    '<td style="' +
    S.td +
    '">Opening Balance</td>' +
    '<td style="' +
    S.tdC +
    '">' +
    prevDateFmt +
    "</td>" +
    '<td style="' +
    S.tdRB +
    '">' +
    fmtAmt(d.opening) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td style="' +
    S.td +
    '">Credit for</td>' +
    '<td style="' +
    S.tdC +
    '">' +
    todayDateFmt +
    "</td>" +
    '<td style="' +
    S.tdRB +
    '">' +
    fmtAmt(totalCr) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="2" style="' +
    S.totCr +
    'text-align:center;">Total Credit</td>' +
    '<td style="' +
    S.totCr +
    'text-align:right;">' +
    fmtAmt(d.opening + totalCr) +
    "</td>" +
    "</tr>" +
    '<tr><td colspan="3" style="' +
    S.lblDb +
    '">Debit</td></tr>' +
    "<tr>" +
    '<th style="' +
    S.th +
    'text-align:left;">Details</th>' +
    '<th style="' +
    S.th +
    '">Date</th>' +
    '<th style="' +
    S.th +
    '">Amount (Rs.)</th>' +
    "</tr>" +
    "<tr>" +
    '<td style="' +
    S.td +
    '">Debit for</td>' +
    '<td style="' +
    S.tdC +
    '">' +
    todayDateFmt +
    "</td>" +
    '<td style="' +
    S.tdRB +
    '">' +
    fmtAmt(totalDb) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td style="' +
    S.td +
    '">Closing Balance</td>' +
    '<td style="' +
    S.tdC +
    '">' +
    todayDateFmt +
    "</td>" +
    '<td style="' +
    S.tdRB +
    '">' +
    fmtAmt(closing) +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td colspan="2" style="' +
    S.totDb +
    'text-align:center;">Total Debit</td>' +
    '<td style="' +
    S.totDb +
    'text-align:right;">' +
    fmtAmt(totalDb + closing) +
    "</td>" +
    "</tr>" +
    "</table>";

  // Currency denomination table HTML (right column of top section)
  const currencyTbl =
    '<table style="width:100%;border-collapse:collapse;">' +
    "<tr>" +
    '<th style="' +
    S.th +
    '">Currency Details</th>' +
    '<th style="' +
    S.th +
    '">No of Notes</th>' +
    '<th style="' +
    S.th +
    '">Amount (Rs.)</th>' +
    "</tr>" +
    denomRows +
    "<tr>" +
    '<td colspan="2" style="' +
    S.totDn +
    'text-align:center;">Total</td>' +
    '<td style="' +
    S.totDn +
    'text-align:right;">' +
    fmtAmt(denomTotal || closing) +
    "</td>" +
    "</tr>" +
    "</table>";

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Daily Cash Book — ${fmtDate(d.date)}</title>
<style>
  /* GAS export: A4 landscape | top 0.5" (12.7mm) | left/right/bottom 0.25" (6.35mm) */
  @page {
    size: A4 landscape;
    margin: 12.7mm 6.35mm 6.35mm 6.35mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, 'Noto Sans Devanagari', sans-serif; font-size: 7.5pt; color: #000; }
  /* gridlines: true — all table borders */
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #999; }
  /* fzr: true — repeat thead on every printed page */
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr { page-break-inside: avoid; }
  @media print { body { margin: 0; } }
</style>
</head><body>

<div style="font-size:11pt;font-weight:800;text-align:center;margin-bottom:2mm;">${BANK}</div>
<div style="font-size:8.5pt;text-align:center;font-weight:400;margin-bottom:4mm;">Daily Cash Book &nbsp;—&nbsp; ${fmtDate(d.date)}</div>

<!-- TOP SECTION: summary left | currency right -->
<table style="width:100%;border-collapse:collapse;margin-bottom:5mm;"><tr>
  <td style="width:50%;vertical-align:top;padding-right:4mm;border:none;">${summaryTbl}</td>
  <td style="width:50%;vertical-align:top;border:none;">${currencyTbl}</td>
</tr></table>
<div style="border-top:1.5px solid #aaa;margin-bottom:4mm;"></div>

<!-- DETAIL SECTION: credit left | debit right -->
<table style="width:100%;border-collapse:collapse;"><tr>
  <td style="width:50%;vertical-align:top;padding-right:4mm;border:none;">
    <div style="background:#c8e6c9;border:1px solid #999;padding:4px 8px;font-weight:800;text-align:center;font-size:8pt;">Credit</div>
    <table style="width:100%;border-collapse:collapse;">
<thead>
  <tr>
    <th style="${S.th}text-align:center;">Trans No</th>
    <th style="${S.th}text-align:left;">Name</th>
    <th style="${S.th}text-align:left;">Transaction Type</th>
    <th style="${S.th}text-align:center;">Acc No</th>
    <th style="${S.th}text-align:right;">Amount</th>
  </tr>
</thead>
<tbody>${mkTxRows(crRows)}</tbody>
<tfoot>
  <tr>
    <td colspan="4" style="${S.totRw}text-align:right;">Total Credit</td>
    <td style="${S.totRw}text-align:right;">${fmtAmt(totalCr)}</td>
  </tr>
</tfoot>
    </table>
  </td>
  <td style="width:50%;vertical-align:top;border:none;">
    <div style="background:#ffcdd2;border:1px solid #999;padding:4px 8px;font-weight:800;text-align:center;font-size:8pt;">Debit</div>
    <table style="width:100%;border-collapse:collapse;">
<thead>
  <tr>
    <th style="${S.th}text-align:center;">Trans No</th>
    <th style="${S.th}text-align:left;">Name</th>
    <th style="${S.th}text-align:left;">Transaction Type</th>
    <th style="${S.th}text-align:center;">Acc No</th>
    <th style="${S.th}text-align:right;">Amount</th>
  </tr>
</thead>
<tbody>${mkTxRows(dbRows)}</tbody>
<tfoot>
  <tr>
    <td colspan="4" style="${S.totRw}text-align:right;">Total Debit</td>
    <td style="${S.totRw}text-align:right;">${fmtAmt(totalDb)}</td>
  </tr>
</tfoot>
    </table>
  </td>
</tr></table>
<div style="background:#fff9c4;padding:4px 10px;font-weight:800;font-size:9pt;text-align:right;border:1px solid #999;margin-top:3mm;">Closing Balance: ₹ ${fmtAmt(closing)}</div>
<div style="display:flex;justify-content:space-between;font-size:7pt;color:#777;margin-top:2mm;border-top:1px solid #ddd;padding-top:1mm;">
  <span>${BANK}</span><span>Daily Cash Book — ${fmtDate(d.date)}</span>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank");
  if (!tab) toast("Please allow popups to open PDF", "err");
}

// ═══════════════════════════════════════════════════════════════════════════
//  TRANSACTION LEDGER — Master sheet + auto-derived child tabs
//  Equivalent to Google Sheets Sheet2 + FILTER formula child tabs
// ═══════════════════════════════════════════════════════════════════════════

let ledgerAllRows = []; // all cashbook entries for selected date
let ledgerRecords = []; // all parent records for selected date
let currentLedgerTab = "main";
let cbRecycleBin = []; // soft-deleted cashbook rows (in-memory)

// ── Options for editable dropdowns ───────────────────────────────────────────
// [static data moved to js/data/static-data.js]

function switchLedgerTab(tab) {
  currentLedgerTab = tab;
  document
    .querySelectorAll(".ltab")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("ltab-" + tab)?.classList.add("active");
  [
    "main",
    "transfer",
    "cashbook",
    "intgl",
    "intfdod",
    "banktrf",
    "template",
    "journal",
    "recycle",
  ].forEach((t) => {
    const el = document.getElementById("ltab-panel-" + t);
    if (el) el.style.display = t === tab ? "" : "none";
  });
  // Always reload fresh data when switching any tab
  if (tab === "recycle") {
    loadRecycleBin();
    renderCbRecycleBin();
  } else {
    loadLedger();
  }
}

async function loadLedger() {
  if (!document.getElementById("ldg-date").value) {
    document.getElementById("ldg-date").value = new Date()
      .toISOString()
      .split("T")[0];
  }
  const d = document.getElementById("ldg-date").value;

  // Always load from DB (covers today + past dates, and survives page refresh)
  try {
    const [cbResp, recResp] = await Promise.all([
      fetch(CB_API + "?date=" + d),
      fetch(API + "?limit=500&date_from=" + d + "&date_to=" + d),
    ]);
    const cbJson  = cbResp.ok  ? await cbResp.json()  : {};
    const recJson = recResp.ok ? await recResp.json() : {};
    ledgerAllRows  = (cbJson.entries   || []).map(e => ({...e, _saved: true}));
    ledgerRecords  = recJson.records   || [];
  } catch(e) {
    console.error("loadLedger fetch error:", e);
    document.getElementById("ldg-main-body").innerHTML =
      `<tr><td colspan="10" style="text-align:center;padding:24px;color:#c0392b;font-weight:700">❌ Server offline — run <code>npm start</code><br><button onclick="loadLedger()" style="margin-top:8px;padding:5px 14px;background:var(--sky-a);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:11px">🔄 Retry</button></td></tr>`;
    return;
  }

  // Auto-generate cashbook rows for any parent record that has none saved yet
  const savedIds = new Set(ledgerAllRows.map(r => String(r.record_id)));
  // Guard: don't re-attempt records we already tried generating this session
  if (!window._autoGenAttempted) window._autoGenAttempted = new Set();
  const missing  = ledgerRecords.filter(r =>
    !r.sonar_sub_no &&
    !savedIds.has(String(r.id)) &&
    !window._autoGenAttempted.has(String(r.id))
  );
  missing.forEach(r => window._autoGenAttempted.add(String(r.id)));
  if (missing.length) {
    await Promise.all(missing.map(async (rec) => {
      let txArr = parseTxTypes(rec.tx_types);
      // Fallback: derive tx type from section when tx_types not saved
      if (!txArr.length && rec.section) {
        const sectionFallback = {
          gold: ["Gold Loan"],
          fd:   ["New FD"],
          od:   ["New FD-OD Loan"],
          saving: ["Saving Account"],
          membership: ["New Sadasya"],
        };
        txArr = sectionFallback[rec.section] || [];
      }
      if (!txArr.length) return;
      const d2   = typeof rec.data === "string"
        ? (() => { try { return JSON.parse(rec.data); } catch(e) { return {}; } })()
        : (rec.data || {});
      const data = Object.assign({}, d2, { customer_name: rec.name, date: rec.date });
      await addCashbookRows(rec.id, data, txArr);
    }));
    // Re-fetch after auto-generate
    try {
      const cbResp2 = await fetch(CB_API + "?date=" + d);
      if (cbResp2.ok) {
        const cbJson2 = await cbResp2.json();
        ledgerAllRows = (cbJson2.entries || []).map(e => ({...e, _saved: true}));
      }
    } catch(e) {}
  }

  const count    = ledgerRecords.length;
  const subCount = ledgerAllRows.length;
  document.getElementById("ldg-count").textContent =
    count    + " transaction" + (count    !== 1 ? "s" : "") +
    ", " + subCount + " ledger row" + (subCount !== 1 ? "s" : "");

  renderLedger();
}

function renderLedger() {
  switch (currentLedgerTab) {
    case "main":
      renderLedgerMain();
      break;
    case "transfer":
      renderLedgerTransfer();
      break;
    case "cashbook":
      renderLedgerCashBook();
      break;
    case "intgl":
      renderLedgerIntGL();
      break;
    case "intfdod":
      renderLedgerIntFDOD();
      break;
    case "banktrf":
      renderLedgerBankTRF();
      break;
    case "template":
      renderLedgerTemplate();
      break;
    case "journal":
      renderJournalTemplates();
      break;
  }
}

function ldgFilteredRows() {
  const q = (document.getElementById("ldg-name")?.value || "")
    .toLowerCase()
    .trim();
  return q
    ? ledgerAllRows.filter((r) =>
        (r.name || "").toLowerCase().includes(q),
      )
    : ledgerAllRows;
}
function ldgFilteredParents() {
  const q = (document.getElementById("ldg-name")?.value || "")
    .toLowerCase()
    .trim();
  return q
    ? ledgerRecords.filter((r) =>
        (r.name || "").toLowerCase().includes(q),
      )
    : ledgerRecords;
}

// ── Inline editable cell helpers ─────────────────────────────────────────────
// Compact editable input for secondary tabs (scroll_no / acc_no only)
function ldgInlineEdit(id, field, val, placeholder) {
  return `<td><input type="text" data-id="${id}" data-field="${field}" value="${(val || "").replace(/"/g, "&quot;")}"
    placeholder="${placeholder || ""}"
    title="✏️ Click to edit — saves automatically"
    style="width:100%;min-width:70px;font-size:8.5pt;border:1.5px solid #c5b8f0;border-radius:4px;padding:2px 5px;font-family:'Nunito',sans-serif;background:#f8f4ff;color:#3d2b7a;font-weight:700"
    onblur="ldgSaveCell(this)" onkeydown="if(event.key==='Enter'){this.blur();}"></td>`;
}
function ldgEditTxt(id, field, val, placeholder) {
  placeholder = placeholder || "";
  var _isEmpty = !val || String(val).trim() === "";
  var _bg = _isEmpty ? "#fffbe6" : "#f0f7ff";
  var _bd = _isEmpty ? "#f6c90e" : "#b8d4f0";
  var safeVal = (val || "").replace(/"/g, "&quot;");
  return (
    '<td style="position:relative">' +
    '<span style="position:absolute;left:4px;top:50%;transform:translateY(-50%);font-size:8px;opacity:0.4;pointer-events:none;z-index:1">&#9998;</span>' +
    '<input type="text" data-id="' +
    id +
    '" data-field="' +
    field +
    '" value="' +
    safeVal +
    '"' +
    ' placeholder="' +
    placeholder +
    '"' +
    ' title="Click to edit — auto-saves on blur or Enter"' +
    ' style="width:100%;min-width:80px;font-size:9pt;border:1.5px solid ' +
    _bd +
    ";border-radius:4px;padding:3px 5px 3px 18px;font-family:Nunito,sans-serif;background:" +
    _bg +
    ';color:#1a3a5c;font-weight:600;box-sizing:border-box"' +
    " onfocus=\"this.style.borderColor='#2b6cb0';this.style.boxShadow='0 0 0 2px #bee3f8';this.style.background='#fff'\"" +
    " onblur=\"this.style.borderColor='" +
    _bd +
    "';this.style.boxShadow='none';this.style.background='" +
    _bg +
    "';ldgSaveCell(this)\"" +
    " onkeydown=\"if(event.key==='Enter'){this.blur();}\">" +
    "</td>"
  );
}
function ldgEditNum(id, field, val) {
  return `<td style="position:relative"><input type="number" data-id="${id}" data-field="${field}" value="${val || ""}"
    title="✏️ Editable — Tab or Enter to save"
    style="width:80px;font-size:9pt;border:1.5px solid #b8d4f0;border-radius:4px;padding:3px 5px;font-family:'Nunito',sans-serif;background:#f0f7ff;text-align:right;color:#1a3a5c;font-weight:600"
    onfocus="this.style.borderColor='#2b6cb0';this.style.boxShadow='0 0 0 2px #bee3f8'"
    onblur="this.style.borderColor='#b8d4f0';this.style.boxShadow='none';ldgSaveCell(this)"
    onkeydown="if(event.key==='Enter'){this.blur();}"></td>`;
}
function ldgEditDate(id, field, val) {
  const isLoanDate = field === "loan_date";
  const placeholder = isLoanDate
    ? 'placeholder="कर्ज घेतल्याची दि."'
    : "";
  const title = isLoanDate
    ? 'title="कर्ज घेतल्याची दि. — Only fill for Loan Closing entries"'
    : 'title="✏️ Editable date"';
  const bg = isLoanDate && !val ? "#fffbe6" : "#f0f7ff";
  return `<td><input type="date" data-id="${id}" data-field="${field}" value="${val || ""}"
    style="font-size:9pt;border:1.5px solid #b8d4f0;border-radius:4px;padding:3px 5px;font-family:'Nunito',sans-serif;background:${bg};color:#1a3a5c"
    ${placeholder} ${title}
    onfocus="this.style.borderColor='#2b6cb0'"
    onblur="this.style.borderColor='#b8d4f0'"
    onchange="ldgSaveCell(this)"></td>`;
}
function ldgEditSel(id, field, val, opts, colorFn) {
  const color = colorFn ? colorFn(val) : "";
  // If val is not in opts, add it as the first selected option
  const hasVal = opts.includes(val);
  const extraOpt =
    !hasVal && val
      ? `<option value="${val}" selected>${val}</option>`
      : "";
  return `<td><select data-id="${id}" data-field="${field}"
    style="width:100%;font-size:9pt;border:1.5px solid #b8d4f0;border-radius:4px;padding:3px 5px;font-family:'Nunito',sans-serif;font-weight:700;${color}"
    onchange="ldgSaveCell(this);this.style.cssText=this.style.cssText+ldgSelColor('${field}',this.value)">
    ${extraOpt}${opts.map((o) => `<option value="${o}" ${hasVal && o === val ? "selected" : ""}>${o || "—"}</option>`).join("")}
  </select></td>`;
}

function ldgSelColor(field, val) {
  if (field === "tx_type") {
    if (val === "Credit") return "background:#d4f5e9;color:#2a7a50;";
    if (val === "Debit") return "background:#fde0e8;color:#c0392b;";
  }
  if (field === "mode") {
    if (val === "Transfer") return "background:#e8f4fd;color:#2b6cb0;";
    if (val === "Cash") return "background:#fff8e1;color:#b7791f;";
  }
  return "background:#fff;color:#333;";
}

async function ldgSaveCell(el) {
  const id = el.dataset.id;
  const field = el.dataset.field;
  const value = el.value;
  if (!id || !field) return;
  // Update dropdown color immediately
  if (field === "tx_type" || field === "mode") {
    el.style.cssText = el.style.cssText.replace(
      /background:[^;]+;color:[^;]+;/g,
      "",
    );
    const col = ldgSelColor(field, value);
    el.style.background = col.match(/background:([^;]+)/)?.[1] || "";
    el.style.color = col.match(/color:([^;]+)/)?.[1] || "";
  }

  // Always update in-memory first
  const row = ledgerAllRows.find((r) => String(r.id) === String(id));
  if (row) row[field] = field === "amount" ? parseFloat(value) || 0 : value;

  const isSavedRow = row && row._saved && Number(id) > 0;

  if (isSavedRow) {
    // Already committed to DB (past date) — persist the edit
    el.style.outline = "2px solid #f6c90e";
    try {
      const res = await fetch(CB_API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [field]: field === "amount" ? parseFloat(value) || 0 : value,
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      el.style.outline = "2px solid #2a7a50";
      el.style.background = "#d4f5e9";
      setTimeout(() => { el.style.outline = ""; el.style.background = ""; }, 900);
    } catch (e) {
      el.style.outline = "2px solid #c0392b";
      el.style.background = "#fde0e8";
      setTimeout(() => { el.style.outline = ""; el.style.background = ""; }, 1200);
      console.error("Save error", e);
      toast("❌ Save failed", "err");
      return;
    }
  } else {
    // In-memory row — just flash green, no DB call
    el.style.outline = "2px solid #2a7a50";
    el.style.background = "#d4f5e9";
    setTimeout(() => { el.style.outline = ""; el.style.background = ""; }, 600);
  }

  // Sync other inputs on the page with same data-id+data-field
  document.querySelectorAll(`[data-id="${id}"][data-field="${field}"]`)
    .forEach((other) => { if (other !== el) other.value = value; });

  // Re-render background tabs
  requestAnimationFrame(() => {
    try { renderLedgerCashBook(); } catch(e) {}
    try { renderLedgerIntGL(); } catch(e) {}
    try { renderLedgerIntFDOD(); } catch(e) {}
    try { renderLedgerTemplate(); } catch(e) {}
  });
}

// ── Helper: parse tx_types regardless of storage format ────────────────
function parseTxTypes(raw) {
  if (!raw) return [];
  const s = String(raw).trim();
  if (s.startsWith("[") || s.startsWith("{")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(t => String(t).trim()).filter(Boolean);
      if (typeof parsed === "object") return Object.values(parsed).map(t => String(t).trim()).filter(Boolean);
    } catch(e) {}
    // Fallback: strip braces/brackets/quotes then split
    return s.replace(/[\[\]{}'"]/g, "").split(",").map(t => t.trim()).filter(Boolean);
  }
  return s.split(",").map(t => t.trim()).filter(Boolean);
}

function renderLedgerMain() {
  const tbody = document.getElementById("ldg-main-body");
  // Show unsaved banner if any in-memory (unsaved) rows exist
  const banner = document.getElementById("ldg-unsaved-banner");
  if (banner) {
    const hasUnsaved = ledgerAllRows.some(r => !r._saved);
    banner.style.display = hasUnsaved ? "flex" : "none";
  }
  // Fix 4: Only show main loan cases (not sub-cases with sonar_sub_no)
  const parents = ldgFilteredParents().filter((r) => !r.sonar_sub_no);
  const rows = ldgFilteredRows();

  if (!parents.length && !rows.length) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--textl)">
No data for selected date — submit transactions from <strong>New Transaction</strong> tab, or select a different date and click 🔄 Load.</td></tr>`;
    return;
  }

  // Index cashbook rows by record_id
  const byRec = {};
  rows.forEach((r) => {
    const k = r.record_id ?? "_manual_";
    (byRec[k] = byRec[k] || []).push(r);
  });

  let txNo = 1;
  let html = "";

  parents.forEach((rec) => {
    // Build readable label: "Customer Name — New Gold Loan"
    const taskLabel = parseTxTypes(rec.tx_types).join(" + ") || "—";
    const headerLabel = `${rec.name || "—"} — ${taskLabel}`;

    // ── Header row: full-width "CustomerName — Task" banner ──
    html += `<tr style="background:#fffde7;border-left:4px solid #f6c90e;border-top:2px solid #f6c90e">
<td colspan="10" style="padding:6px 10px">
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px">
    <span>
      <span style="font-weight:800;font-size:10pt;color:#7a5800">${rec.name || "—"}</span>
      <span style="color:#ccc;margin:0 6px">—</span>
      <span style="background:var(--lav);color:var(--lav-a);padding:2px 9px;border-radius:5px;font-size:8pt;font-weight:800">${taskLabel}</span>
    </span>
    <div style="display:flex;gap:6px;align-items:center">
      <button onclick="ldgAddRowForRecord(${rec.id},'${(rec.name || "").replace(/'/g, "\\'")}','${document.getElementById("ldg-date")?.value || ""}')"
        style="background:#553c9a;color:#fff;border:none;border-radius:5px;padding:3px 10px;cursor:pointer;font-size:9pt;font-weight:700;white-space:nowrap">+ Add Row</button>
      <button onclick="ldgSoftDeleteRecord(${rec.id},'${(rec.name || "").replace(/'/g, "\\'")}')"
        title="Delete this transaction (can be restored from Recycle Bin)"
        style="background:#fde0e8;color:#c0392b;border:1px solid #f5a0b0;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;white-space:nowrap">🗑️</button>
    </div>
  </div>
</td>
    </tr>`;

    // ── Child rows — grouped by transaction type from journal templates ──
    const children = byRec[rec.id] || [];
    // Map each CB_TX_ROWS_MAP key to its rows for this record
    const txTypes = parseTxTypes(rec.tx_types);
    // Group children by their source tx type using task names from journal templates
    // Build a map: task → which txType it belongs to
    const taskToTxType = {};
    txTypes.forEach((txType) => {
      const rows = CB_TX_ROWS_MAP[txType] || [];
      rows.forEach((row) => {
        if (!taskToTxType[row.task]) taskToTxType[row.task] = txType;
      });
    });

    // Group children by their source txType
    const grouped = {};
    const groupOrder = [];
    children.forEach((r) => {
      const srcTx =
        taskToTxType[r.task] || taskToTxType[r.acc_type] || "_other_";
      if (!grouped[srcTx]) {
        grouped[srcTx] = [];
        groupOrder.indexOf(srcTx) === -1 && groupOrder.push(srcTx);
      }
      grouped[srcTx].push(r);
    });
    // Also add _other_ for rows not matching any template
    if (grouped["_other_"] && groupOrder.indexOf("_other_") === -1)
      groupOrder.push("_other_");

    // If multiple tx types, show sub-group headers; otherwise just show rows
    const showSubHeaders = txTypes.length > 1 && groupOrder.length > 1;

    // Section color map
    const txColors = {
      "Gold Loan": { bg: "#fdf5d0", border: "#c8a020", text: "#7a5800" },
      "Slips - Loan": {
        bg: "#fdf5d0",
        border: "#c8a020",
        text: "#7a5800",
      },
      "Closing - Loan": {
        bg: "#fde0e8",
        border: "#c0392b",
        text: "#c0392b",
      },
      "Saving Account": {
        bg: "#daeef8",
        border: "#3a8fbf",
        text: "#1a3a5c",
      },
      "Saving Deposit": {
        bg: "#daeef8",
        border: "#3a8fbf",
        text: "#1a3a5c",
      },
      "Saving Withdrawal": {
        bg: "#fff8e1",
        border: "#b7791f",
        text: "#7a5200",
      },
      "New Sadasya": {
        bg: "#e8f4fd",
        border: "#2b6cb0",
        text: "#1a3a5c",
      },
      Sadasya: { bg: "#e8f4fd", border: "#2b6cb0", text: "#1a3a5c" },
      "Sadasya - Slips": {
        bg: "#e8f4fd",
        border: "#2b6cb0",
        text: "#1a3a5c",
      },
      "New Naammatr Sabhasad": {
        bg: "#d0f0f0",
        border: "#2a9d8f",
        text: "#134e4a",
      },
      "Naammatr Sabhasad Account": {
        bg: "#d0f0f0",
        border: "#2a9d8f",
        text: "#134e4a",
      },
      "Naammatr Sabhasad - Slips": {
        bg: "#d0f0f0",
        border: "#2a9d8f",
        text: "#134e4a",
      },
      "New FD": { bg: "#d4f5e9", border: "#4CAF7A", text: "#2a7a50" },
      "Fixed Deposit": {
        bg: "#d4f5e9",
        border: "#4CAF7A",
        text: "#2a7a50",
      },
      "FD - Slips": { bg: "#d4f5e9", border: "#4CAF7A", text: "#2a7a50" },
      _other_: { bg: "#f5f5f5", border: "#aaa", text: "#555" },
    };

    groupOrder.forEach((grpKey) => {
      const grpRows = grouped[grpKey] || [];
      const col = txColors[grpKey] || txColors["_other_"];
      if (showSubHeaders) {
        html += `<tr style="background:${col.bg};border-left:3px solid ${col.border}">
        <td colspan="10" style="padding:3px 10px 3px 20px;font-size:8.5pt;font-weight:800;color:${col.text}">
          ↳ ${grpKey === "_other_" ? "Other / Manual Entries" : grpKey}
        </td>
      </tr>`;
      }
      grpRows.forEach((r) => {
        const txBg =
          r.tx_type === "Credit"
            ? "background:#d4f5e9;color:#2a7a50;"
            : "background:#fde0e8;color:#c0392b;";
        const modeBg =
          r.mode === "Transfer"
            ? "background:#e8f4fd;color:#2b6cb0;"
            : "background:#fff8e1;color:#b7791f;";
        html += `<tr data-cb-id="${r.id}" style="background:#fff;border-left:3px solid ${showSubHeaders ? col.border : "transparent"}">
    <td style="text-align:center;color:#aaa;padding-left:16px;font-size:9pt">${txNo++}</td>
    <td style="font-size:9pt">${r.name || "—"}</td>
    ${ldgEditSel(r.id, "acc_type", r.acc_type || r.task, LDG_ACC_TYPES, null)}
    <td><select data-id="${r.id}" data-field="tx_type"
      style="width:100%;font-size:9pt;border:1px solid #ddd;border-radius:4px;padding:3px 5px;font-weight:800;${txBg}"
      onchange="ldgSaveCell(this)">
      <option value="Credit" ${r.tx_type === "Credit" ? "selected" : ""}>Credit</option>
      <option value="Debit"  ${r.tx_type === "Debit" ? "selected" : ""}>Debit</option>
    </select></td>
    ${ldgEditTxt(r.id, "acc_no", r.acc_no, "e.g. 43-118")}
    ${ldgEditNum(r.id, "amount", r.amount)}
    <td><select data-id="${r.id}" data-field="mode"
      style="width:100%;font-size:9pt;border:1px solid #ddd;border-radius:4px;padding:3px 5px;font-weight:800;${modeBg}"
      onchange="ldgSaveCell(this)">
      <option value="Cash"     ${r.mode === "Cash" ? "selected" : ""}>Cash</option>
      <option value="Transfer" ${r.mode === "Transfer" ? "selected" : ""}>Transfer</option>
    </select></td>
    ${ldgEditTxt(r.id, "scroll_no", r.scroll_no, "Scroll #")}
    ${ldgEditDate(r.id, "loan_date", r.loan_date)}
    <td style="text-align:center">
      <button onclick="ldgDeleteRow(${r.id})" title="Delete row"
        style="background:#fde0e8;color:#c0392b;border:none;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">🗑</button>
    </td>
  </tr>`;
      });
    });
  });

  // Orphan / manual rows (no parent record)
  (byRec["_manual_"] || []).forEach((r) => {
    const txBg =
      r.tx_type === "Credit"
        ? "background:#d4f5e9;color:#2a7a50;"
        : "background:#fde0e8;color:#c0392b;";
    const modeBg =
      r.mode === "Transfer"
        ? "background:#e8f4fd;color:#2b6cb0;"
        : "background:#fff8e1;color:#b7791f;";
    html += `<tr data-cb-id="${r.id}" style="background:#f0fff4;border-left:3px solid var(--mint-a)">
<td style="text-align:center;font-size:9pt">${txNo++}</td>
<td>${r.name || "Manual"}</td>
${ldgEditSel(r.id, "acc_type", r.acc_type || r.task, LDG_ACC_TYPES, null)}
<td><select data-id="${r.id}" data-field="tx_type"
  style="width:100%;font-size:9pt;border:1px solid #ddd;border-radius:4px;padding:3px 5px;font-weight:800;${txBg}"
  onchange="ldgSaveCell(this)">
  <option value="Credit" ${r.tx_type === "Credit" ? "selected" : ""}>Credit</option>
  <option value="Debit"  ${r.tx_type === "Debit" ? "selected" : ""}>Debit</option>
</select></td>
${ldgEditTxt(r.id, "acc_no", r.acc_no, "e.g. 43")}
${ldgEditNum(r.id, "amount", r.amount)}
<td><select data-id="${r.id}" data-field="mode"
  style="width:100%;font-size:9pt;border:1px solid #ddd;border-radius:4px;padding:3px 5px;font-weight:800;${modeBg}"
  onchange="ldgSaveCell(this)">
  <option value="Cash"     ${r.mode === "Cash" ? "selected" : ""}>Cash</option>
  <option value="Transfer" ${r.mode === "Transfer" ? "selected" : ""}>Transfer</option>
</select></td>
${ldgEditTxt(r.id, "scroll_no", r.scroll_no, "Scroll #")}
${ldgEditDate(r.id, "loan_date", r.loan_date)}
<td style="text-align:center">
  <button onclick="ldgDeleteRow(${r.id})"
    style="background:#fde0e8;color:#c0392b;border:none;border-radius:4px;padding:2px 7px;cursor:pointer;font-size:11px">🗑</button>
</td>
    </tr>`;
  });

  tbody.innerHTML =
    html ||
    `<tr><td colspan="10" style="text-align:center;padding:24px;color:var(--textl)">No records match the filter</td></tr>`;
}

async function ldgDeleteRow(id) {
  const row = ledgerAllRows.find(r => String(r.id) === String(id));
  if (!row) return;
  if (!confirm(`Move this row to Recycle Bin?

"${row.name || "Manual"} — ${row.acc_type || row.task || ""}"

You can restore it from the Recycle Bin tab.`)) return;

  // Mark deleted timestamp
  row._deleted = true;
  row._deleted_at = new Date().toISOString();

  // If saved to DB, soft-delete there too
  if (row._saved && Number(id) > 0) {
    try {
      await fetch(CB_API + "/" + id + "/soft-delete", { method: "PATCH" });
    } catch(e) {}
  }

  // Move from active to recycle bin
  ledgerAllRows = ledgerAllRows.filter(r => String(r.id) !== String(id));
  cbRecycleBin.unshift(row); // newest first

  showCbRowUndoToast(id, row.name, row.acc_type || row.task);
  renderLedger();
}

function showCbRowUndoToast(id, name, type) {
  const existing = document.getElementById("undo-toast-cb");
  if (existing) existing.remove();
  const el = document.createElement("div");
  el.id = "undo-toast-cb";
  el.innerHTML = `<span>🗑️ Moved to Recycle Bin: <strong>${name || "row"}</strong></span>
    <button onclick="ldgUndoDeleteRow('${id}')"
      style="margin-left:12px;background:#fff;color:#c0392b;border:none;border-radius:5px;padding:3px 10px;cursor:pointer;font-weight:800;font-size:11px">↩ Undo (8s)</button>
    <button onclick="document.getElementById('undo-toast-cb').remove()"
      style="margin-left:6px;background:transparent;color:#fff;border:none;cursor:pointer;font-size:14px;opacity:0.7">✕</button>`;
  el.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:10px 16px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;display:flex;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,0.25);white-space:nowrap;";
  document.body.appendChild(el);
  setTimeout(() => {
    const t = document.getElementById("undo-toast-cb");
    if (t) { t.style.opacity="0"; t.style.transition="opacity 0.4s"; setTimeout(()=>t.remove(),400); }
  }, 8000);
}

async function ldgUndoDeleteRow(id) {
  const idx = cbRecycleBin.findIndex(r => String(r.id) === String(id));
  if (idx === -1) { toast("Row not found in recycle bin", "err"); return; }
  const row = cbRecycleBin[idx];
  row._deleted = false;
  delete row._deleted_at;
  // Restore in DB if saved
  if (row._saved && Number(id) > 0) {
    try { await fetch(CB_API + "/" + id + "/restore", { method: "PATCH" }); } catch(e) {}
  }
  cbRecycleBin.splice(idx, 1);
  ledgerAllRows.push(row);
  document.getElementById("undo-toast-cb")?.remove();
  toast("Restored: " + (row.name || "row"), "ok");
  renderLedger();
}

// ── SOFT DELETE PARENT RECORD ────────────────────────────────────────────
let _ldgUndoTimer = null;

async function ldgSoftDeleteRecord(recId, name) {
  if (
    !confirm(
      `Delete transaction for "${name}" and all its ledger rows?\n\nThis can be restored from the Recycle Bin tab.`,
    )
  )
    return;
  const res = await fetch(API + "/" + recId + "/soft-delete", {
    method: "PATCH",
  });
  if (!res.ok) {
    toast("Delete failed — server error", "err");
    return;
  }
  ledgerRecords = ledgerRecords.filter((r) => r.id !== recId);
  ledgerAllRows = ledgerAllRows.filter((r) => r.record_id !== recId);
  renderLedger();
  showUndoToast(recId, name);
}

function showUndoToast(recId, name) {
  const existing = document.getElementById("undo-toast");
  if (existing) existing.remove();
  if (_ldgUndoTimer) clearTimeout(_ldgUndoTimer);
  const el = document.createElement("div");
  el.id = "undo-toast";
  el.innerHTML = `<span>&#x1F5D1;&#xFE0F; Deleted: <strong>${name}</strong></span>
    <button onclick="ldgUndoDelete(${recId},'${name.replace(/'/g, "\'")}')"
      style="margin-left:12px;background:#fff;color:#c0392b;border:none;border-radius:5px;padding:3px 10px;cursor:pointer;font-weight:800;font-size:11px">&#x21A9; Undo (10s)</button>
    <button onclick="document.getElementById('undo-toast').remove()"
      style="margin-left:6px;background:transparent;color:#fff;border:none;cursor:pointer;font-size:14px;opacity:0.7">&#x2715;</button>`;
  el.style.cssText =
    "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#c0392b;color:#fff;padding:10px 16px;border-radius:10px;font-size:12px;font-weight:700;z-index:9999;display:flex;align-items:center;box-shadow:0 4px 16px rgba(0,0,0,0.25);white-space:nowrap;";
  document.body.appendChild(el);
  _ldgUndoTimer = setTimeout(() => {
    const t = document.getElementById("undo-toast");
    if (t) {
      t.style.opacity = "0";
      t.style.transition = "opacity 0.4s";
      setTimeout(() => t.remove(), 400);
    }
  }, 10000);
}

async function ldgUndoDelete(recId, name) {
  const res = await fetch(API + "/" + recId + "/restore", {
    method: "PATCH",
  });
  if (!res.ok) {
    toast("Restore failed", "err");
    return;
  }
  document.getElementById("undo-toast")?.remove();
  if (_ldgUndoTimer) clearTimeout(_ldgUndoTimer);
  toast("Restored: " + name, "ok");
  await loadLedger();
}

// ── RECYCLE BIN ──────────────────────────────────────────────────────────
async function loadRecycleBin() {
  const tbody = document.getElementById("recycle-bin-body");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#aaa">Loading...</td></tr>`;
  // Also render cashbook rows section
  renderCbRecycleBin();
  try {
    const res = await fetch(API + "/deleted");
    const data = await res.json();
    const records = data.records || [];
    if (!records.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:24px;color:#aaa">&#x1F389; Recycle Bin is empty</td></tr>`;
      return;
    }
    tbody.innerHTML = records
      .map(
        (r) => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:8px 10px;font-weight:700;font-size:10pt">${r.name || "—"}</td>
        <td style="padding:8px 10px"><span style="background:var(--lav);color:var(--lav-a);padding:2px 8px;border-radius:5px;font-size:8pt;font-weight:700">${(function(raw){
          if (!raw) return "—";
          const s = raw.trim();
          if (s.startsWith("[") || s.startsWith("{")) {
            try {
              const parsed = JSON.parse(s);
              if (Array.isArray(parsed)) return parsed.join(" + ");
              if (typeof parsed === "object") return Object.values(parsed).join(" + ");
            } catch(e) {}
            return s.replace(/[\[\]{}\'"]/g, "").replace(/,/g, " + ");
          }
          return s.replace(/,/g, " + ");
        })(r.tx_types)}</span></td>
        <td style="padding:8px 10px;font-size:9pt;color:#aaa">${r.deleted_at ? new Date(r.deleted_at).toLocaleString("en-IN") : r.date || "—"}</td>
        <td style="padding:8px 10px;text-align:center;white-space:nowrap">
          <button onclick="ldgRestoreRecord(${r.id},\`${(r.name || "").replace(/`/g, "'")}\`)"
            style="background:#d4f5e9;color:#2a7a50;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:10px;font-weight:700;margin-right:5px">&#x1F504; Restore</button>
          <button onclick="ldgPermDelete(${r.id},\`${(r.name || "").replace(/`/g, "'")}\`)"
            style="background:#fde0e8;color:#c0392b;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:10px;font-weight:700">&#x2620;&#xFE0F; Delete Forever</button>
        </td>
      </tr>`,
      )
      .join("");
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#c0392b">Could not load recycle bin</td></tr>`;
  }
}

async function ldgRestoreRecord(recId, name) {
  const res = await fetch(API + "/" + recId + "/restore", {
    method: "PATCH",
  });
  if (!res.ok) {
    toast("Restore failed", "err");
    return;
  }
  toast("Restored: " + name, "ok");
  loadRecycleBin();
}

// ── Render cashbook row recycle bin (in-memory + DB deleted) ──────────────
async function renderCbRecycleBin() {
  const tbody = document.getElementById("recycle-cb-rows-body");
  if (!tbody) return;

  // Merge in-memory deleted rows with any DB-deleted rows
  let allDeleted = [...cbRecycleBin];

  // Also fetch DB-deleted rows (for past dates / server restarts)
  try {
    const res = await fetch(CB_API + "/deleted");
    if (res.ok) {
      const json = await res.json();
      const dbRows = json.rows || json.entries || [];
      dbRows.forEach(r => {
        if (!allDeleted.find(m => String(m.id) === String(r.id))) {
          allDeleted.push({ ...r, _saved: true, _deleted: true });
        }
      });
    }
    // 404 = server doesn't have soft-delete yet — just use in-memory
  } catch(e) { console.log("CB deleted endpoint not available yet"); }

  if (!allDeleted.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:#aaa">No deleted cashbook rows</td></tr>`;
    return;
  }

  const fmtAmt = n => "₹ " + Number(n||0).toLocaleString("en-IN");
  tbody.innerHTML = allDeleted.map(r => `
    <tr style="border-bottom:1px solid #f0e0e0">
      <td style="padding:8px 10px;font-weight:700;font-size:10pt">${r.name || "—"}</td>
      <td style="padding:8px 10px;font-size:9pt">
        <span style="background:#fde0e8;color:#c0392b;padding:2px 8px;border-radius:5px;font-size:8pt;font-weight:700">${r.acc_type || r.task || "—"}</span>
      </td>
      <td style="padding:8px 10px;font-size:9pt;text-align:right;font-weight:700;color:#2a7a50">${fmtAmt(r.amount)}</td>
      <td style="padding:8px 10px;text-align:center">
        <span style="background:${r.tx_type==='Credit'?'#d4f5e9':'#fde0e8'};color:${r.tx_type==='Credit'?'#2a7a50':'#c0392b'};padding:2px 8px;border-radius:5px;font-size:8pt;font-weight:700">${r.tx_type||"—"}</span>
      </td>
      <td style="padding:8px 10px;font-size:9pt;color:#aaa">${r._deleted_at || r.deleted_at ? new Date(r._deleted_at || r.deleted_at).toLocaleString("en-IN") : "—"}</td>
      <td style="padding:8px 10px;text-align:center;white-space:nowrap">
        <button onclick="cbRowRestore('${r.id}')"
          style="background:#d4f5e9;color:#2a7a50;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:10px;font-weight:700;margin-right:5px">🔄 Restore</button>
        <button onclick="cbRowPermDelete('${r.id}')"
          style="background:#fde0e8;color:#c0392b;border:none;border-radius:5px;padding:4px 10px;cursor:pointer;font-size:10px;font-weight:700">☠️ Delete Forever</button>
      </td>
    </tr>`).join("");
}

async function cbRowRestore(id) {
  const idx = cbRecycleBin.findIndex(r => String(r.id) === String(id));
  let row;
  if (idx !== -1) {
    row = cbRecycleBin[idx];
    cbRecycleBin.splice(idx, 1);
    row._deleted = false;
    delete row._deleted_at;
    ledgerAllRows.push(row);
  }
  // Restore in DB if saved
  if (Number(id) > 0) {
    try {
      const res = await fetch(CB_API + "/" + id + "/restore", { method: "PATCH" });
      if (res.ok && !row) {
        // Row came from DB only — add it back to memory
        const { row: dbRow } = await res.json();
        if (dbRow) { dbRow._saved = true; ledgerAllRows.push(dbRow); }
      }
    } catch(e) {}
  }
  toast("Cashbook row restored", "ok");
  renderLedger();
  renderCbRecycleBin();
}

async function cbRowPermDelete(id) {
  if (!confirm("Permanently delete this cashbook row?\n\nThis CANNOT be undone.")) return;
  cbRecycleBin = cbRecycleBin.filter(r => String(r.id) !== String(id));
  if (Number(id) > 0) {
    try { await fetch(CB_API + "/" + id, { method: "DELETE" }); } catch(e) {}
  }
  toast("Permanently deleted", "ok");
  renderCbRecycleBin();
}

async function ldgPermDelete(recId, name) {
  if (
    !confirm(
      'Permanently delete "' + name + '"?\n\n This CANNOT be undone.',
    )
  )
    return;
  const res = await fetch(API + "/" + recId + "/permanent", {
    method: "DELETE",
  });
  if (!res.ok) {
    toast("Permanent delete failed", "err");
    return;
  }
  toast("Permanently deleted: " + name, "ok");
  loadRecycleBin();
}

async function ldgAddManualRow() {
  const date = document.getElementById("ldg-date").value;
  if (!date) {
    toast("Select a date first", "err");
    return;
  }
  const name = prompt("Customer name for this row:") || "";
  const newRow = {
    id: -(Date.now()),
    date,
    record_id: null,
    name,
    task: "Manual Entry",
    acc_type: "",
    tx_type: "Credit",
    acc_no: "",
    amount: 0,
    mode: "Cash",
    scroll_no: "",
    loan_date: "",
    sort_order: 9999,
    _saved: false,
  };
  ledgerAllRows.push(newRow);
  toast("Row added — edit inline below", "ok");
  renderLedger();
}

// Add a new cashbook row linked to a specific parent record
async function ldgAddRowForRecord(recordId, name, date) {
  const newRow = {
    id: -(Date.now()),
    date: date || document.getElementById("ldg-date").value,
    record_id: recordId,
    name: name || "",
    task: "Gold Loan TRF",
    acc_type: "Gold Loan TRF",
    tx_type: "Debit",
    acc_no: "",
    amount: 0,
    mode: "Cash",
    scroll_no: "",
    loan_date: "",
    sort_order: 9999,
    _saved: false,
  };
  ledgerAllRows.push(newRow);
  toast("Row added under " + (name || "record") + " — edit inline", "ok");
  renderLedger();
}

// ── TRANSFER ENTRIES TAB ──────────────────────────────────────────────────────
// Only Transfer mode, non-zero amounts
function renderLedgerTransfer() {
  const rows = ldgFilteredRows().filter(
    (r) => r.mode === "Transfer" && Number(r.amount) > 0,
  );
  const tbody = document.getElementById("ldg-trf-body");
  const tfoot = document.getElementById("ldg-trf-foot");
  const fmtAmt = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--textl)">No Transfer transactions for this date</td></tr>';
    tfoot.innerHTML = "";
    return;
  }

  const crRows = rows.filter((r) => r.tx_type === "Credit");
  const dbRows = rows.filter((r) => r.tx_type === "Debit");
  const totalCr = crRows.reduce((s, r) => s + Number(r.amount), 0);
  const totalDb = dbRows.reduce((s, r) => s + Number(r.amount), 0);

  let html = "";
  if (crRows.length) {
    html += `<tr style="background:#ede9f8"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center;color:#553c9a">— Credit —</td></tr>`;
    html += crRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#f9f6ff"}">
<td style="text-align:center;color:#888;padding:4px 6px">${i + 1}</td>
<td style="padding:4px 8px"><strong>${r.name || "—"}</strong></td>
<td style="padding:4px 8px">${r.acc_type || r.task || "—"}</td>
<td style="text-align:center;padding:4px 6px"><span style="background:#d4f5e9;color:#2a7a50;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Credit</span></td>
<td style="font-family:monospace;font-weight:700;color:#553c9a;padding:4px 8px">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800;padding:4px 8px">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
${ldgInlineEdit(r.id, "loan_date", r.loan_date, "Date")}
    </tr>`,
      )
      .join("");
    html += `<tr style="background:#ede9f8;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Credit (Transfer):</td>
<td style="text-align:right;color:#553c9a;padding:5px 8px">${fmtAmt(totalCr)}</td><td colspan="2"></td>
    </tr>`;
  }
  if (dbRows.length) {
    html += `<tr style="background:#fde0e8"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center;color:#c0392b">— Debit —</td></tr>`;
    html += dbRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#fdf5f5"}">
<td style="text-align:center;color:#888;padding:4px 6px">${i + 1}</td>
<td style="padding:4px 8px"><strong>${r.name || "—"}</strong></td>
<td style="padding:4px 8px">${r.acc_type || r.task || "—"}</td>
<td style="text-align:center;padding:4px 6px"><span style="background:#fde0e8;color:#c0392b;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Debit</span></td>
<td style="font-family:monospace;font-weight:700;color:#553c9a;padding:4px 8px">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800;padding:4px 8px">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
${ldgInlineEdit(r.id, "loan_date", r.loan_date, "Date")}
    </tr>`,
      )
      .join("");
    html += `<tr style="background:#fde0e8;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Debit (Transfer):</td>
<td style="text-align:right;color:#c0392b;padding:5px 8px">${fmtAmt(totalDb)}</td><td colspan="2"></td>
    </tr>`;
  }
  tbody.innerHTML = html;
  tfoot.innerHTML = `<tr style="background:#f3f0ff;font-weight:800;border-top:2px solid #553c9a">
<td colspan="5" style="text-align:right;padding:6px 8px">Net (Credit − Debit):</td>
<td style="text-align:right;padding:6px 8px;color:${totalCr - totalDb >= 0 ? "#2a7a50" : "#c0392b"}">${fmtAmt(Math.abs(totalCr - totalDb))} ${totalCr - totalDb >= 0 ? "CR" : "DB"}</td>
<td colspan="2"></td>
    </tr>`;

  // wire up inline-edit listeners
  tbody.querySelectorAll("input[data-id]").forEach((inp) => {
    inp.addEventListener("change", async () => {
      const id = inp.dataset.id;
      const field = inp.dataset.field;
      const value = inp.value;
      try {
        await fetch(`${CB_API}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
      } catch (e) {
        console.error("Inline edit error", e);
      }
    });
  });
}

// ── CASH BOOK TAB ─────────────────────────────────────────────────────────────
// Only Cash mode, non-zero amounts — mirrors Google Sheets CashBook tab
function renderLedgerCashBook() {
  const rows = ldgFilteredRows().filter(
    (r) => r.mode === "Cash" && Number(r.amount) > 0,
  );
  const tbody = document.getElementById("ldg-cb-body");
  const tfoot = document.getElementById("ldg-cb-foot");
  const fmtAmt = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--textl)">No Cash transactions for this date</td></tr>';
    tfoot.innerHTML = "";
    return;
  }

  const crRows = rows.filter((r) => r.tx_type === "Credit");
  const dbRows = rows.filter((r) => r.tx_type === "Debit");
  const totalCr = crRows.reduce((s, r) => s + Number(r.amount), 0);
  const totalDb = dbRows.reduce((s, r) => s + Number(r.amount), 0);

  let html = "";
  if (crRows.length) {
    html += `<tr style="background:#c8e6c9"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center">— Credit —</td></tr>`;
    html += crRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#f9fafb"}">
<td style="text-align:center;color:#888">${i + 1}</td>
<td><strong>${r.name || "—"}</strong></td>
<td>${r.acc_type || r.task || "—"}</td>
<td style="text-align:center"><span style="background:#d4f5e9;color:#2a7a50;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Credit</span></td>
<td style="font-family:monospace;font-weight:700;color:#553c9a">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800">${fmtAmt(r.amount)}</td>
<td style="text-align:center;color:#555">${r.scroll_no || "—"}</td>
<td style="text-align:center">${r.loan_date || "—"}</td>
    </tr>`,
      )
      .join("");
    // Fix 7: Total Credit row AFTER all credit entries
    html += `<tr style="background:#d4f5e9;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Credit (Cash):</td>
<td style="text-align:right;color:#2a7a50;padding:5px 8px">${fmtAmt(totalCr)}</td><td colspan="2"></td>
    </tr>`;
  }
  if (dbRows.length) {
    html += `<tr style="background:#ffcdd2"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center">— Debit —</td></tr>`;
    html += dbRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#f9fafb"}">
<td style="text-align:center;color:#888">${i + 1}</td>
<td><strong>${r.name || "—"}</strong></td>
<td>${r.acc_type || r.task || "—"}</td>
<td style="text-align:center"><span style="background:#fde0e8;color:#c0392b;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Debit</span></td>
<td style="font-family:monospace;font-weight:700;color:#553c9a">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800">${fmtAmt(r.amount)}</td>
<td style="text-align:center;color:#555">${r.scroll_no || "—"}</td>
<td style="text-align:center">${r.loan_date || "—"}</td>
    </tr>`,
      )
      .join("");
    // Fix 7: Total Debit row AFTER all debit entries
    html += `<tr style="background:#fde0e8;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Debit (Cash):</td>
<td style="text-align:right;color:#c0392b;padding:5px 8px">${fmtAmt(totalDb)}</td><td colspan="2"></td>
    </tr>`;
  }
  tbody.innerHTML = html;

  tfoot.innerHTML = `
    <tr style="background:#fffde7;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Credit - Total Debit (Net):</td>
<td style="text-align:right;color:#7a5800;padding:5px 8px">${fmtAmt(totalCr - totalDb)}</td><td colspan="2"></td>
    </tr>`;
}

// ── INT RECV GOLD LOAN TAB ────────────────────────────────────────────────────
async function generateGLIntVoucherManual() {
  try {
    // Use the already-loaded Int GL ledger rows (Transfer entries for Interest Received On Gold Loan TRF + Gold Loan TRF)
    const GL_TASKS = new Set([
      "Interest Received On Gold Loan TRF",
      "Gold Loan TRF",
    ]);
    let rows = ledgerAllRows.filter((r) => {
      const t = (r.acc_type || r.task || "").trim();
      return (
        GL_TASKS.has(t) && r.mode === "Transfer"
      );
    });

    // If ledger not loaded, use in-memory or fetch from DB
    if (!rows.length) {
      const d =
        document.getElementById("ldg-date")?.value ||
        new Date().toISOString().split("T")[0];
      let allEntries = ledgerAllRows.filter(r => !r.date || r.date === d);
      if (!allEntries.length) {
        try {
          const { entries } = await (await fetch(CB_API + "?date=" + d)).json();
          allEntries = entries || [];
        } catch(e) {}
      }
      rows = allEntries.filter((r) => {
        const t = (r.acc_type || r.task || "").trim();
        return (
          GL_TASKS.has(t) && r.mode === "Transfer"
        );
      });
    }

    if (!rows.length) {
      toast("No GL interest entries found for this date", "err");
      return;
    }

    const date =
      document.getElementById("ldg-date")?.value ||
      new Date().toISOString().split("T")[0];
    const dtFmt = new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    generateTemplatePDF(["Int Recv GL Voucher"], {
      _closedLoans: rows,
      date: dtFmt,
    });
  } catch (e) {
    toast("Failed to generate voucher: " + e.message, "err");
  }
}

async function generateFDODIntVoucherManual() {
  try {
    const FDOD_TASKS = new Set([
      "Int Received On FD-OD TRF",
      "FDOD Int Recv - TRF",
      "FD OD TRF",
      "FD OD Loan Int - TRF",
    ]);
    let rows = ledgerAllRows.filter((r) => {
      const t = (r.acc_type || r.task || "").trim();
      return (
        FDOD_TASKS.has(t) && r.mode === "Transfer" && Number(r.amount) > 0
      );
    });

    // If ledger not loaded, use in-memory or fetch from DB
    if (!rows.length) {
      const d =
        document.getElementById("ldg-date")?.value ||
        new Date().toISOString().split("T")[0];
      let allEntries = ledgerAllRows.filter(r => !r.date || r.date === d);
      if (!allEntries.length) {
        try {
          const { entries } = await (await fetch(CB_API + "?date=" + d)).json();
          allEntries = entries || [];
        } catch(e) {}
      }
      rows = allEntries.filter((r) => {
        const t = (r.acc_type || r.task || "").trim();
        return (
          FDOD_TASKS.has(t) &&
          r.mode === "Transfer" &&
          Number(r.amount) > 0
        );
      });
    }

    if (!rows.length) {
      toast("No FD-OD interest entries found for this date", "err");
      return;
    }

    const date =
      document.getElementById("ldg-date")?.value ||
      new Date().toISOString().split("T")[0];
    const dtFmt = new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    generateTemplatePDF(["Int Recv FDOD Voucher"], {
      _closedLoans: rows,
      date: dtFmt,
    });
  } catch (e) {
    toast("Failed to generate FD-OD voucher: " + e.message, "err");
  }
}

// Mirrors Google Sheets IntRecGL-83 FILTER formula
function renderLedgerIntGL() {
  const GL_TASKS = new Set([
    "Interest Received On Gold Loan TRF",
    "Gold Loan TRF",
  ]);
  const rows = ldgFilteredRows().filter((r) => {
    const t = (r.acc_type || r.task || "").trim();
    return (
      GL_TASKS.has(t) && r.mode === "Transfer"
    );
  });
  const tbody = document.getElementById("ldg-intgl-body");
  const fmtAmt = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--textl)">No GL interest Transfer entries for this date</td></tr>';
    return;
  }
  tbody.innerHTML = rows
    .map((r, i) => {
      const crBg =
        r.tx_type === "Credit"
          ? "background:#d4f5e9;color:#2a7a50"
          : "background:#fde0e8;color:#c0392b";
      return `<tr style="${i % 2 === 0 ? "" : "background:#fff8e8"}">
<td style="text-align:center;color:#888">${i + 1}</td>
<td><strong>${r.name || "—"}</strong></td>
<td>${r.acc_type || r.task || "—"}</td>
<td style="text-align:center"><span style="${crBg};padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">${r.tx_type}</span></td>
${ldgInlineEdit(r.id, "acc_no", r.acc_no, "Acc No.")}
<td style="text-align:right;font-weight:800">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
<td style="text-align:center">${r.loan_date || "—"}</td>
    </tr>`;
    })
    .join("");
}

// ── INT RECV FD-OD TAB ────────────────────────────────────────────────────────
// Mirrors Google Sheets IntRecFD-OD-277 FILTER formula
function renderLedgerIntFDOD() {
  const FDOD_TASKS = new Set([
    "Int Received On FD-OD TRF",
    "FDOD Int Recv - TRF",
    "FD OD TRF",
    "FD OD Loan Int - TRF",
  ]);
  const rows = ldgFilteredRows().filter((r) => {
    const t = (r.acc_type || r.task || "").trim();
    return (
      FDOD_TASKS.has(t) && r.mode === "Transfer" && Number(r.amount) > 0
    );
  });
  const tbody = document.getElementById("ldg-intfdod-body");
  const fmtAmt = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--textl)">No FD-OD interest Transfer entries for this date</td></tr>';
    return;
  }
  tbody.innerHTML = rows
    .map((r, i) => {
      const crBg =
        r.tx_type === "Credit"
          ? "background:#d4f5e9;color:#2a7a50"
          : "background:#fde0e8;color:#c0392b";
      return `<tr style="${i % 2 === 0 ? "" : "background:#e8f4fd"}">
<td style="text-align:center;color:#888">${i + 1}</td>
<td><strong>${r.name || "—"}</strong></td>
<td>${r.acc_type || r.task || "—"}</td>
<td style="text-align:center"><span style="${crBg};padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">${r.tx_type}</span></td>
${ldgInlineEdit(r.id, "acc_no", r.acc_no, "Acc No.")}
<td style="text-align:right;font-weight:800">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
<td style="text-align:center">${r.loan_date || "—"}</td>
    </tr>`;
    })
    .join("");
}

// ── BANK TRF TAB ──────────────────────────────────────────────────────────────
// Mirrors Google Sheets Bank-TRF-Vouchers — Transfer mode rows for Bank accounts
function renderLedgerBankTRF() {
  const BANK_NAMES = new Set([
    "Buldhana Urban Bank - Current Acc (015002100000260)",
    "Bank of Maha - FD-OD (60494510691)",
    "Bank of Maha - Current Acc (60438097699)",
    "THE N.U. BANK Current Acc (003002100000926)",
    "Rajarshi Shahu Curr (03202007000046)",
    "The Sahyog Urban Curr Acc (8001173)",
    "SBI Current Acc (43227989097)",
  ]);
  const rows = ldgFilteredRows().filter((r) => {
    const t = (r.acc_type || r.task || "").trim();
    return (
      BANK_NAMES.has(t) && r.mode === "Transfer"
    );
  });
  const tbody = document.getElementById("ldg-banktrf-body");
  const tfoot = document.getElementById("ldg-banktrf-foot");
  const fmtAmt = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--textl)">No Bank Transfer transactions for this date</td></tr>';
    tfoot.innerHTML = "";
    return;
  }

  const crRows = rows.filter((r) => r.tx_type === "Credit");
  const dbRows = rows.filter((r) => r.tx_type === "Debit");
  const totalCr = crRows.reduce((s, r) => s + Number(r.amount), 0);
  const totalDb = dbRows.reduce((s, r) => s + Number(r.amount), 0);

  let html = "";
  if (crRows.length) {
    html += `<tr style="background:#bee3f8"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center;color:#1a365d">— Credit —</td></tr>`;
    html += crRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#ebf8ff"}">
<td style="text-align:center;color:#888;padding:4px 6px">${i + 1}</td>
<td style="padding:4px 8px"><strong>${r.name || "—"}</strong></td>
<td style="padding:4px 8px;font-size:8.5pt">${r.acc_type || r.task || "—"}</td>
<td style="text-align:center;padding:4px 6px"><span style="background:#d4f5e9;color:#2a7a50;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Credit</span></td>
<td style="font-family:monospace;font-weight:700;color:#1a365d;padding:4px 8px">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800;padding:4px 8px">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
<td style="padding:4px 8px;font-size:8pt;color:#555">${r.upi_rrn || "—"}</td>
    </tr>`,
      )
      .join("");
    html += `<tr style="background:#bee3f8;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Credit (Bank TRF):</td>
<td style="text-align:right;color:#1a365d;padding:5px 8px">${fmtAmt(totalCr)}</td><td colspan="2"></td>
    </tr>`;
  }
  if (dbRows.length) {
    html += `<tr style="background:#fde0e8"><td colspan="8" style="padding:4px 8px;font-weight:800;text-align:center;color:#c0392b">— Debit —</td></tr>`;
    html += dbRows
      .map(
        (
          r,
          i,
        ) => `<tr style="${i % 2 === 0 ? "background:#fff" : "background:#fff5f5"}">
<td style="text-align:center;color:#888;padding:4px 6px">${i + 1}</td>
<td style="padding:4px 8px"><strong>${r.name || "—"}</strong></td>
<td style="padding:4px 8px;font-size:8.5pt">${r.acc_type || r.task || "—"}</td>
<td style="text-align:center;padding:4px 6px"><span style="background:#fde0e8;color:#c0392b;padding:2px 7px;border-radius:4px;font-size:8pt;font-weight:800">Debit</span></td>
<td style="font-family:monospace;font-weight:700;color:#1a365d;padding:4px 8px">${r.acc_no || "—"}</td>
<td style="text-align:right;font-weight:800;padding:4px 8px">${fmtAmt(r.amount)}</td>
${ldgInlineEdit(r.id, "scroll_no", r.scroll_no, "Scroll #")}
<td style="padding:4px 8px;font-size:8pt;color:#555">${r.upi_rrn || "—"}</td>
    </tr>`,
      )
      .join("");
    html += `<tr style="background:#fde0e8;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 8px">Total Debit (Bank TRF):</td>
<td style="text-align:right;color:#c0392b;padding:5px 8px">${fmtAmt(totalDb)}</td><td colspan="2"></td>
    </tr>`;
  }
  tbody.innerHTML = html;
  tfoot.innerHTML = `<tr style="background:#ebf8ff;font-weight:800;border-top:2px solid #1a365d">
<td colspan="5" style="text-align:right;padding:6px 8px">Net (Credit − Debit):</td>
<td style="text-align:right;padding:6px 8px;color:${totalCr - totalDb >= 0 ? "#2a7a50" : "#c0392b"}">${fmtAmt(Math.abs(totalCr - totalDb))} ${totalCr - totalDb >= 0 ? "CR" : "DB"}</td>
<td colspan="2"></td>
    </tr>`;

  // Wire up scroll_no inline edit
  tbody.querySelectorAll("input[data-id]").forEach((inp) => {
    inp.addEventListener("change", async () => {
      try {
        await fetch(`${CB_API}/${inp.dataset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [inp.dataset.field]: inp.value }),
        });
      } catch (e) {
        console.error("Inline edit error", e);
      }
    });
  });
}

async function generateBankTRFVoucherManual() {
  try {
    const BANK_NAMES = new Set([
      "Buldhana Urban Bank - Current Acc (015002100000260)",
      "Bank of Maha - FD-OD (60494510691)",
      "Bank of Maha - Current Acc (60438097699)",
      "THE N.U. BANK Current Acc (003002100000926)",
      "Rajarshi Shahu Curr (03202007000046)",
      "The Sahyog Urban Curr Acc (8001173)",
      "SBI Current Acc (43227989097)",
    ]);
    let rows = ledgerAllRows.filter((r) => {
      const t = (r.acc_type || r.task || "").trim();
      return (
        BANK_NAMES.has(t) && r.mode === "Transfer"
      );
    });

    if (!rows.length) {
      const d =
        document.getElementById("ldg-date")?.value ||
        new Date().toISOString().split("T")[0];
      let allEntries = ledgerAllRows.filter(r => !r.date || r.date === d);
      if (!allEntries.length) {
        try {
          const { entries } = await (await fetch(CB_API + "?date=" + d)).json();
          allEntries = entries || [];
        } catch(e) {}
      }
      rows = allEntries.filter((r) => {
        const t = (r.acc_type || r.task || "").trim();
        return (
          BANK_NAMES.has(t) &&
          r.mode === "Transfer" &&
          Number(r.amount) > 0
        );
      });
    }

    if (!rows.length) {
      toast("No Bank Transfer entries found for this date", "err");
      return;
    }

    const date =
      document.getElementById("ldg-date")?.value ||
      new Date().toISOString().split("T")[0];
    const dtFmt = new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");

    generateTemplatePDF(["Bank TRF Voucher"], {
      _bankRows: rows,
      date: dtFmt,
    });
  } catch (e) {
    toast("Failed to generate Bank TRF voucher: " + e.message, "err");
  }
}

// ── TEMPLATE DATA TAB ─────────────────────────────────────────────────────────
// Aggregated voucher covering data — exactly matches Google Sheets templateData tab
// Columns: Account Type | Account Number | Tx Mode | Tx Type | Date | Transfer | Cash | Voucher Names
function renderLedgerTemplate() {
  const rows = ldgFilteredRows();
  const tbody = document.getElementById("ldg-tmpl-body");
  const tfoot = document.getElementById("ldg-tmpl-foot");
  const date =
    document.getElementById("ldg-date").value ||
    new Date().toISOString().split("T")[0];
  const fmtAmt = (n) =>
    n > 0
      ? "₹ " +
        Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })
      : "";

  if (!rows.length) {
    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--textl)">No data loaded</td></tr>';
    tfoot.innerHTML = "";
    return;
  }

  const taskTrf = {};
  const taskCash = {};

  // Index by task name only (acc_type now matches task for all rows)
  rows.forEach((r) => {
    const key = r.task || "";
    if (!key) return;
    if (r.mode === "Transfer")
      taskTrf[key] = (taskTrf[key] || 0) + Number(r.amount);
    if (r.mode === "Cash")
      taskCash[key] = (taskCash[key] || 0) + Number(r.amount);
  });

  let totalTrf = 0,
    totalCash = 0;
  let rowNum = 0,
    html = "";

  VOUCHER_TEMPLATE.forEach((v) => {
    // Check both task field and acc_type field
    const trfAmt = taskTrf[v.task] || 0;
    const cashAmt = taskCash[v.task] || 0;
    if (trfAmt === 0 && cashAmt === 0) return;

    totalTrf += trfAmt;
    totalCash += cashAmt;

    const crBg =
      v.tx_type === "Credit"
        ? "background:#d4f5e9;color:#2a7a50"
        : "background:#fde0e8;color:#c0392b";
    const modeBg =
      trfAmt > 0
        ? "background:#e8f4fd;color:#2b6cb0"
        : "background:#fff8e1;color:#b7791f";
    const modeLabel =
      trfAmt > 0 && cashAmt > 0
        ? "Both"
        : trfAmt > 0
          ? "Transfer"
          : "Cash";
    const trfCell =
      trfAmt > 0
        ? `<strong style="color:var(--sky-a)">${fmtAmt(trfAmt)}</strong>`
        : `<span style="color:#ddd">—</span>`;
    const cashCell =
      cashAmt > 0
        ? `<strong style="color:var(--lem-a)">${fmtAmt(cashAmt)}</strong>`
        : `<span style="color:#ddd">—</span>`;

    html += `<tr style="${rowNum % 2 === 0 ? "background:#fff" : "background:#f9f6ff"}">
<td style="font-weight:700">${v.acc_type}</td>
<td>${v.acc_no}</td>
<td style="text-align:center"><span style="${modeBg};padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:800">${modeLabel}</span></td>
<td style="text-align:center"><span style="${crBg};padding:2px 6px;border-radius:4px;font-size:8pt;font-weight:800">${v.tx_type}</span></td>
<td style="text-align:center">${date}</td>
<td style="text-align:right">${trfCell}</td>
<td style="text-align:right">${cashCell}</td>
<td style="font-size:8pt;color:#555">${v.trf_name || "—"}</td>
<td style="font-size:8pt;color:#555">${v.cash_name || "—"}</td>
    </tr>`;
    rowNum++;
  });

  tbody.innerHTML =
    html ||
    '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--textl)">No voucher entries found for this date</td></tr>';

  const fmtT = (n) =>
    "₹ " +
    Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  tfoot.innerHTML = `
    <tr style="background:#e8f4fd;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 9px">Total Transfer:</td>
<td style="text-align:right;color:var(--sky-a);padding:5px 9px">${fmtT(totalTrf)}</td>
<td colspan="3"></td>
    </tr>
    <tr style="background:#fff8e1;font-weight:800">
<td colspan="5" style="text-align:right;padding:5px 9px">Total Cash:</td>
<td colspan="1"></td>
<td style="text-align:right;color:var(--lem-a);padding:5px 9px">${fmtT(totalCash)}</td>
<td colspan="2"></td>
    </tr>`;
}

// ── JOURNAL ENTRY TEMPLATES ──────────────────────────────────────────────────
// [static data moved to js/data/static-data.js]

function renderJournalTemplates() {
  const container = document.getElementById("journal-tmpl-content");
  if (!container) return;
  const modeColor = { Transfer: "#2b6cb0", Cash: "#b7791f" };
  const modeBg = { Transfer: "#e8f4fd", Cash: "#fff8e1" };
  let html = "";
  for (const [txType, rows] of Object.entries(JOURNAL_TEMPLATES)) {
    const hasTransfer = rows.some((r) => r[4] === "Transfer");
    const hasCash = rows.some((r) => r[4] === "Cash");
    const badgeTrf = hasTransfer
      ? `<span style="background:#d6eaff;color:#2b6cb0;padding:2px 7px;border-radius:4px;font-size:7.5pt;font-weight:800;margin-left:4px">TRF</span>`
      : "";
    const badgeCash = hasCash
      ? `<span style="background:#fff0c0;color:#b7791f;padding:2px 7px;border-radius:4px;font-size:7.5pt;font-weight:800;margin-left:4px">CASH</span>`
      : "";
    html += `<div style="background:#fff;border-radius:10px;border:1.5px solid #e0d7f5;overflow:hidden;box-shadow:0 1px 5px #0001">
    <div style="background:#553c9a;color:#fff;padding:7px 12px;font-weight:800;font-size:9.5pt;display:flex;align-items:center;justify-content:space-between">
      <span>${txType}</span><span>${badgeTrf}${badgeCash}</span>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:8pt">
      <tr style="background:#f0ebff">
        <th style="padding:4px 8px;text-align:left;color:#553c9a;font-weight:700">Account</th>
        <th style="padding:4px 6px;text-align:center;color:#553c9a;font-weight:700">Dr/Cr</th>
        <th style="padding:4px 6px;text-align:left;color:#553c9a;font-weight:700">Acc No.</th>
        <th style="padding:4px 6px;text-align:left;color:#553c9a;font-weight:700">Amount</th>
        <th style="padding:4px 6px;text-align:center;color:#553c9a;font-weight:700">Mode</th>
      </tr>`;
    rows.forEach((r, i) => {
      const [account, drCr, accNo, amount, mode] = r;
      const drCrBg = drCr === "Debit" ? "#fde0e8" : "#d4f5e9";
      const drCrColor = drCr === "Debit" ? "#c0392b" : "#2a7a50";
      html += `<tr style="background:${i % 2 === 0 ? "#fff" : "#faf8ff"}">
      <td style="padding:4px 8px;color:#333">${account || "—"}</td>
      <td style="padding:4px 6px;text-align:center"><span style="background:${drCrBg};color:${drCrColor};padding:1px 6px;border-radius:3px;font-size:7pt;font-weight:800">${drCr}</span></td>
      <td style="padding:4px 6px;font-family:monospace;color:#553c9a;font-weight:700">${accNo || "—"}</td>
      <td style="padding:4px 6px;color:#666;font-size:7.5pt">${amount || "—"}</td>
      <td style="padding:4px 6px;text-align:center"><span style="background:${modeBg[mode] || "#eee"};color:${modeColor[mode] || "#666"};padding:1px 6px;border-radius:3px;font-size:7pt;font-weight:800">${mode}</span></td>
    </tr>`;
    });
    html += `</table></div>`;
  }
  container.innerHTML = html;
}

// ── EXPORT ALL TABS TO EXCEL (5 sheets) ──────────────────────────────────────
function exportLedgerExcel() {
  if (!ledgerAllRows.length && !ledgerRecords.length) {
    toast("Load data first", "err");
    return;
  }
  const wb = XLSX.utils.book_new();
  const date = document.getElementById("ldg-date").value || "Today";
  const fmtAmt = (n) => Number(n) || 0;

  // Sheet 1: Main Data
  const mainRows = [
    [
      "Trans No",
      "Name",
      "Account Type",
      "Transaction Type",
      "Account No",
      "Total Amount",
      "Transaction Mode",
      "Scroll No",
      "Loan Date",
      "Task",
    ],
  ];
  let n = 1;
  ledgerRecords.forEach((rec) => {
    mainRows.push([
      n++,
      rec.name,
      "Account Type",
      "",
      "Account No",
      "##",
      "",
      "##",
      "",
      rec.tx_types || "",
    ]);
    ledgerAllRows
      .filter((r) => r.record_id === rec.id)
      .forEach((r) =>
        mainRows.push([
          n++,
          r.name,
          r.acc_type || r.task,
          r.tx_type,
          r.acc_no,
          fmtAmt(r.amount),
          r.mode,
          r.scroll_no,
          r.loan_date,
          "",
        ]),
      );
  });
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(mainRows),
    "Main Data",
  );

  // Sheet 2: Cash Book
  const cbRows = [
    [
      "#",
      "Name",
      "Account Type",
      "Transaction Type",
      "Account No",
      "Amount",
      "Scroll No",
      "Loan Date",
    ],
  ];
  ledgerAllRows
    .filter((r) => r.mode === "Cash" && Number(r.amount) > 0)
    .forEach((r, i) =>
      cbRows.push([
        i + 1,
        r.name,
        r.acc_type || r.task,
        r.tx_type,
        r.acc_no,
        fmtAmt(r.amount),
        r.scroll_no,
        r.loan_date,
      ]),
    );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(cbRows),
    "CashBook",
  );

  // Sheet 3: Int Recv Gold Loan
  const glRows = [
    [
      "#",
      "Name",
      "Account Type",
      "Transaction Type",
      "Account No",
      "Amount",
      "Scroll No",
      "Loan Date",
    ],
  ];
  const GL_TASKS = [
    "Interest Received On Gold Loan TRF",
    "Gold Loan TRF",
  ];
  ledgerAllRows
    .filter(
      (r) =>
        GL_TASKS.some((t) =>
          (r.acc_type || r.task || "").includes(t.split(" ")[0]),
        ) &&
        r.mode === "Transfer" &&
        Number(r.amount) > 0,
    )
    .forEach((r, i) =>
      glRows.push([
        i + 1,
        r.name,
        r.acc_type || r.task,
        r.tx_type,
        r.acc_no,
        fmtAmt(r.amount),
        r.scroll_no,
        r.loan_date,
      ]),
    );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(glRows),
    "IntRecGL-83",
  );

  // Sheet 4: Int Recv FD-OD
  const fdodRows = [
    [
      "#",
      "Name",
      "Account Type",
      "Transaction Type",
      "Account No",
      "Amount",
      "Scroll No",
      "Loan Date",
    ],
  ];
  const FDOD_TASKS = ["Int Received On FD-OD TRF", "FD OD TRF"];
  ledgerAllRows
    .filter(
      (r) =>
        FDOD_TASKS.some((t) =>
          (r.acc_type || r.task || "").includes(t.split(" ")[0]),
        ) &&
        r.mode === "Transfer" &&
        Number(r.amount) > 0,
    )
    .forEach((r, i) =>
      fdodRows.push([
        i + 1,
        r.name,
        r.acc_type || r.task,
        r.tx_type,
        r.acc_no,
        fmtAmt(r.amount),
        r.scroll_no,
        r.loan_date,
      ]),
    );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(fdodRows),
    "IntRecFD-OD-277",
  );

  // Sheet 5: Template Data
  const tmplRows = [
    [
      "Account Type",
      "Account Number",
      "Transaction Mode",
      "Transaction Type",
      "Date of Trans",
      "Transfer",
      "Cash",
      "Transfer Voucher Name",
      "Cash Voucher Name",
    ],
  ];
  const tTrf = {},
    tCash = {};
  ledgerAllRows.forEach((r) => {
    const k = r.task || "";
    if (!k || !r.amount) return;
    if (r.mode === "Transfer")
      tTrf[k] = (tTrf[k] || 0) + Number(r.amount);
    if (r.mode === "Cash") tCash[k] = (tCash[k] || 0) + Number(r.amount);
  });
  VOUCHER_TEMPLATE.forEach((v) => {
    const ta = tTrf[v.task] || 0;
    const ca = tCash[v.task] || 0;
    if (!ta && !ca) return;
    const mode = ta > 0 && ca > 0 ? "Both" : ta > 0 ? "Transfer" : "Cash";
    tmplRows.push([
      v.acc_type,
      v.acc_no,
      mode,
      v.tx_type,
      date,
      ta || "",
      ca || "",
      v.trf_name || "",
      v.cash_name || "",
    ]);
  });
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(tmplRows),
    "templateData",
  );

  XLSX.writeFile(wb, "TransactionLedger_" + date + ".xlsx");
  toast(
    "📥 Exported — 5 sheets: Main Data, CashBook, IntRecGL-83, IntRecFD-OD-277, templateData",
    "ok",
  );
}

// ─── Generate Vouchers PDF directly from ledger (Template Data tab) ───────────
async function generateVouchersPDFFromLedger() {
  if (!ledgerAllRows.length) {
    toast("Load ledger data first", "err");
    return;
  }
  const date = document.getElementById("ldg-date").value || new Date().toISOString().split("T")[0];
  await _flushToDB(date, ledgerAllRows.filter(r => !r.date || r.date === date));
  // Build synthetic cbData from ledger rows
  const taskTrf = {},
    taskCash = {};
  ledgerAllRows.forEach((r) => {
    const key = r.task || "";
    if (!key) return;
    if (r.mode === "Transfer")
      taskTrf[key] = (taskTrf[key] || 0) + Number(r.amount);
    if (r.mode === "Cash")
      taskCash[key] = (taskCash[key] || 0) + Number(r.amount);
  });
  const txRowsForPDF = ledgerAllRows.map((r) => ({
    task: r.task || r.acc_type || "",
    mode: r.mode,
    amount: Number(r.amount) || 0,
    name: r.name,
    scrollNo: r.scroll_no,
    accNo: r.acc_no,
    loanDate: r.loan_date,
    txType: r.tx_type,
  }));
  // Borrow the existing generateAllVouchersPDF logic by temporarily setting cbData
  const prevCbData = cbData;
  cbData = {
    date,
    opening: 0,
    closing: 0,
    totalCredit: 0,
    totalDebit: 0,
    txRows: txRowsForPDF,
  };
  generateAllVouchersPDF();
  cbData = prevCbData;
}

// ─── Generate Cash Book PDF directly from ledger ───────────────────────────────
async function generateCashBookPDFFromLedger() {
  if (!ledgerAllRows.length) {
    toast("Load ledger data first", "err");
    return;
  }
  const date = document.getElementById("ldg-date").value || new Date().toISOString().split("T")[0];
  await _flushToDB(date, ledgerAllRows.filter(r => !r.date || r.date === date));
  const cashRows = ledgerAllRows.filter(
    (r) => r.mode === "Cash" && Number(r.amount) > 0,
  );
  const crRows = cashRows.filter((r) => r.tx_type === "Credit");
  const dbRows = cashRows.filter((r) => r.tx_type === "Debit");
  const totalCr = crRows.reduce((s, r) => s + Number(r.amount), 0);
  const totalDb = dbRows.reduce((s, r) => s + Number(r.amount), 0);
  const fmtAmt = (n) => Number(n || 0).toLocaleString("en-IN");
  const fmtDate = (s) => {
    try {
      return new Date(s)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    } catch {
      return s || "";
    }
  };
  const BANK = "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या.";

  const mkTblRows = (rows) =>
    rows
      .map(
        (r, i) => `
    <tr>
<td style="border:1px solid #ccc;padding:4px 8px;text-align:center">${r.scroll_no || i + 1}</td>
<td style="border:1px solid #ccc;padding:4px 8px;font-weight:700">${r.name || "—"}</td>
<td style="border:1px solid #ccc;padding:4px 8px">${r.acc_type || r.task || "—"}</td>
<td style="border:1px solid #ccc;padding:4px 8px">${r.acc_no || "—"}</td>
<td style="border:1px solid #ccc;padding:4px 8px;text-align:right;font-weight:700">${fmtAmt(r.amount)}</td>
    </tr>`,
      )
      .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Daily Cash Book — ${fmtDate(date)}</title>
<style>
  /* GAS export: A4 landscape | top 0.5" (12.7mm) | left/right/bottom 0.25" (6.35mm) */
  @page {
    size: A4 landscape;
    margin: 12.7mm 6.35mm 6.35mm 6.35mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, 'Noto Sans Devanagari', sans-serif; font-size: 7.5pt; color: #000; }
  /* gridlines: true */
  table { border-collapse: collapse; width: 100%; }
  td, th { border: 1px solid #999; }
  /* fzr: true — repeat thead on every printed page */
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr { page-break-inside: avoid; }
  th { background: #eee; padding: 4px 8px; font-size: 7.5pt; text-align: left; }
  .cr-hdr { background: #c8e6c9; border: 1px solid #999; padding: 4px 8px; font-weight: 800; text-align: center; font-size: 8pt; }
  .db-hdr { background: #ffcdd2; border: 1px solid #999; padding: 4px 8px; font-weight: 800; text-align: center; font-size: 8pt; }
  .tot { font-weight: 800; background: #f0f0f0; padding: 3px 7px; }
  @media print { body { margin: 0; } }
</style></head><body>
<div style="font-size:11pt;font-weight:800;text-align:center;margin-bottom:2mm;">${BANK}</div>
<div style="font-size:8.5pt;text-align:center;font-weight:400;margin-bottom:4mm;">Daily Cash Book — ${fmtDate(date)}</div>

<!-- TOP SECTION: summary left | currency right -->
<table style="width:100%;border-collapse:collapse;margin-bottom:5mm;"><tr>
  <td style="width:50%;vertical-align:top;padding-right:4mm;border:none;">${summaryTbl}</td>
  <td style="width:50%;vertical-align:top;border:none;">${currencyTbl}</td>
</tr></table>
<div style="border-top:1.5px solid #aaa;margin-bottom:4mm;"></div>

<!-- DETAIL SECTION: credit left | debit right -->
<table style="width:100%;border-collapse:collapse;"><tr>
  <td style="width:50%;vertical-align:top;padding-right:4mm;border:none;">
    <div class="cr-hdr">Credit</div>
    <table style="width:100%;border-collapse:collapse;">
<thead>
  <tr><th style="text-align:center;width:8%">Trans No</th><th>Name</th><th>Transaction Type</th><th style="text-align:center;width:14%">Acc No</th><th style="text-align:right;width:16%">Amount</th></tr>
</thead>
<tbody>${mkTblRows(crRows)}</tbody>
<tfoot><tr><td colspan="4" class="tot" style="text-align:right">Total Credit</td><td class="tot" style="text-align:right">${fmtAmt(totalCr)}</td></tr></tfoot>
    </table>
  </td>
  <td style="width:50%;vertical-align:top;border:none;">
    <div class="db-hdr">Debit</div>
    <table style="width:100%;border-collapse:collapse;">
<thead>
  <tr><th style="text-align:center;width:8%">Trans No</th><th>Name</th><th>Transaction Type</th><th style="text-align:center;width:14%">Acc No</th><th style="text-align:right;width:16%">Amount</th></tr>
</thead>
<tbody>${mkTblRows(dbRows)}</tbody>
<tfoot><tr><td colspan="4" class="tot" style="text-align:right">Total Debit</td><td class="tot" style="text-align:right">${fmtAmt(totalDb)}</td></tr></tfoot>
    </table>
  </td>
</tr></table>
<div style="background:#fff9c4;padding:4px 10px;font-weight:800;font-size:9pt;text-align:right;border:1px solid #999;margin-top:3mm;">Closing Balance: ₹ ${fmtAmt(closing)}</div>
<div style="display:flex;justify-content:space-between;font-size:7pt;color:#777;margin-top:2mm;border-top:1px solid #ddd;padding-top:1mm;">
  <span>${BANK}</span><span>Daily Cash Book — ${fmtDate(date)}</span>
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank");
  if (!tab) toast("Allow popups to open PDF", "err");
}

// ═══════════════════════════════════════════════════════════════════════════
//  BANK CLOSING — GENERATE ALL COVERING VOUCHERS PDF
//  Matches the exact format produced by Google Apps Script / Google Docs
// ═══════════════════════════════════════════════════════════════════════════

function convertNumberToWords(number) {
  const num = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (!number || number === 0) return "Zero";
  const whole = Math.floor(Math.abs(number));
  const paisa = Math.round((Math.abs(number) - whole) * 100);
  function words(n) {
    if (n === 0) return "";
    if (n < 20) return num[n] + " ";
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 ? " " + num[n % 10] : "") + " "
      );
    if (n < 1000)
      return num[Math.floor(n / 100)] + " Hundred " + words(n % 100);
    if (n < 100000)
      return words(Math.floor(n / 1000)) + "Thousand " + words(n % 1000);
    if (n < 10000000)
      return words(Math.floor(n / 100000)) + "Lakh " + words(n % 100000);
    return (
      words(Math.floor(n / 10000000)) + "Crore " + words(n % 10000000)
    );
  }
  let result = words(whole).trim();
  if (paisa > 0) result += " and " + words(paisa).trim() + " Paisa";
  return result;
}

async function generateAllVouchersPDF() {
  if (!cbData) {
    if (ledgerAllRows.length > 0) { await loadCashBook(); }
    else { toast("Generate Cash Book first, then click Bank Closing", "err"); return; }
  }
  const date = cbData.date || new Date().toISOString().split("T")[0];
  await _flushToDB(date, ledgerAllRows.filter(r => !r.date || r.date === date));

  const d = cbData;
  const dateStr = d.date;
  const fmtDate = (s) => {
    try {
      return new Date(s)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-");
    } catch {
      return s || "";
    }
  };
  const BANK =
    "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव जामोद र.नं.१०६७";

  // Build per-task totals split by Cash / Transfer
  const taskTrf = {},
    taskCash = {};
  d.txRows.forEach((r) => {
    if (!r.task || !r.amount) return;
    if (r.mode === "Transfer")
      taskTrf[r.task] = (taskTrf[r.task] || 0) + r.amount;
    if (r.mode === "Cash")
      taskCash[r.task] = (taskCash[r.task] || 0) + r.amount;
  });

  // Build detailed rows from txRows for a specific task + mode
  function getDetailRows(taskName, mode) {
    return d.txRows
      .filter(
        (r) => r.task === taskName && r.mode === mode && r.amount > 0,
      )
      .map((r) => ({
        scrollNo: r.scrollNo,
        name: r.name,
        amt: r.amount,
        accNo: r.accNo,
        loanDate: r.loanDate,
      }));
  }

  // Build a single voucher block matching Image 2 format
  // voucherLabel = the slip label e.g. "Pink Slip - CASH" or "SAV - CR - TRF"
  // mode = 'Cash' | 'Transfer'
  // accType, accCode, amount, txType
  function buildVoucherBlock(
    accType,
    accCode,
    dateDisplay,
    modeLabel,
    amount,
    voucherLabel,
    txType,
    rows,
  ) {
    const amtFmt =
      "₹ " +
      Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      });
    const words = convertNumberToWords(amount);
    const modeCol = modeLabel === "Cash" ? "Cash" : "Transfer";

    // Individual name rows if present
    const rowsHtml =
      rows.length > 0
        ? `
<table class="row-table">
  <thead><tr style="background:#f0f0f0">
    <th>Scroll No</th>
    <th style="text-align:left">Name</th>
    <th style="text-align:right">Amount (₹)</th>
    <th>Acc No</th>
  </tr></thead>
  <tbody>${rows
    .map(
      (r) => `<tr>
    <td style="text-align:center">${r.scrollNo || ""}</td>
    <td>${r.name || ""}</td>
    <td style="text-align:right">${r.amt > 0 ? "₹ " + Number(r.amt).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : ""}</td>
    <td>${r.accNo || ""}</td>
  </tr>`,
    )
    .join("")}</tbody>
</table>`
        : "";

    return `
<div class="voucher-block">
  <div class="v-bank">** ${BANK} **</div>
  <div class="v-sub">Covering Voucher — ${txType} &nbsp;—&nbsp; ${voucherLabel}</div>
  <table class="v-table">
    <thead><tr>
      <th>Account Type</th><th>Acc Code</th><th>Date</th><th>${modeCol}</th>
    </tr></thead>
    <tbody><tr>
      <td>${accType}</td><td>${accCode}</td><td>${dateDisplay}</td>
      <td style="font-weight:800">${amtFmt}</td>
    </tr></tbody>
  </table>
  ${rowsHtml}
  <div class="v-total">एकूण / Total — ${amtFmt} &nbsp; ( ₹ ${words} )</div>
  <div class="v-sig">
    <div class="v-sig-left">लेखापाल / व्यवस्थापक / अधिकृत अधिकारी<br><span style="display:inline-block;border-top:1px solid #000;min-width:90px;margin-top:5mm">&nbsp;</span></div>
  </div>
</div>`;
  }

  // Build combined voucher (Cash + Transfer) — matches 3rd block in Image 2
  function buildCombinedBlock(
    accType,
    accCode,
    dateDisplay,
    cashAmt,
    trfAmt,
    txType,
  ) {
    const totalAmt = cashAmt + trfAmt;
    const amtFmt =
      "₹ " +
      Number(totalAmt).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      });
    const words = convertNumberToWords(totalAmt);
    return `
<div class="voucher-block">
  <div class="v-bank">** ${BANK} **</div>
  <div class="v-sub">Covering Voucher — Combined (Cash + Transfer) — ${txType}</div>
  <table class="v-table">
    <thead><tr>
      <th>Account Type</th><th>Acc Code</th><th>Date</th><th>Cash</th><th>Transfer</th><th>Total</th>
    </tr></thead>
    <tbody><tr>
      <td>${accType}</td><td>${accCode}</td><td>${dateDisplay}</td>
      <td>${cashAmt > 0 ? "₹ " + Number(cashAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</td>
      <td>${trfAmt > 0 ? "₹ " + Number(trfAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "—"}</td>
      <td style="font-weight:800">${amtFmt}</td>
    </tr></tbody>
  </table>
  <div class="v-total">एकूण / Total — ${amtFmt} &nbsp; ( ₹ ${words} )</div>
  <div class="v-sig">
    <div class="v-sig-left">लेखापाल / व्यवस्थापक / अधिकृत अधिकारी<br><span style="display:inline-block;border-top:1px solid #000;min-width:90px;margin-top:5mm">&nbsp;</span></div>
   
  </div>
</div>`;
  }

  // Generate all voucher blocks
  let pages = "";
  const displayDate = fmtDate(dateStr);

  VOUCHER_TEMPLATE.forEach((v) => {
    const trfAmt = taskTrf[v.task] || 0;
    const cashAmt = taskCash[v.task] || 0;

    // Cash voucher (e.g. Pink Slip - CASH)
    if (v.cash_name && cashAmt > 0) {
      const rows = getDetailRows(v.task, "Cash");
      pages += buildVoucherBlock(
        v.acc_type,
        v.acc_no,
        displayDate,
        "Cash",
        cashAmt,
        v.cash_name,
        v.tx_type,
        rows,
      );
    }

    // Transfer voucher (e.g. SAV - CR - TRF)
    if (v.trf_name && trfAmt > 0) {
      const rows = getDetailRows(v.task, "Transfer");
      pages += buildVoucherBlock(
        v.acc_type,
        v.acc_no,
        displayDate,
        "Transfer",
        trfAmt,
        v.trf_name,
        v.tx_type,
        rows,
      );
    }

    // Combined voucher when both exist (e.g. Cash + Transfer Combined)
    if (v.cash_name && v.trf_name && cashAmt > 0 && trfAmt > 0) {
      pages += buildCombinedBlock(
        v.acc_type,
        v.acc_no,
        displayDate,
        cashAmt,
        trfAmt,
        v.tx_type,
      );
    }
  });

  // Bank transfer vouchers (no cash_name/trf_name — pure Transfer rows)
  VOUCHER_TEMPLATE.filter((v) => !v.trf_name && !v.cash_name).forEach(
    (v) => {
      const trfAmt = taskTrf[v.task] || 0;
      if (trfAmt <= 0) return;
      const rows = getDetailRows(v.task, "Transfer");
      pages += buildVoucherBlock(
        v.acc_type,
        v.acc_no,
        displayDate,
        "Transfer",
        trfAmt,
        "Bank TRF",
        v.tx_type,
        rows,
      );
    },
  );

  // Build full print window
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <title>Covering Vouchers — ${dateStr}</title>
  <style>
    @page { size: A4; margin: 5mm 8mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, 'Noto Sans Devanagari', sans-serif; font-size: 9.5pt; color: #000; margin: 0; }
    .voucher-wrap { display: block; }
    .voucher-block { width: 100%; margin-bottom: 4mm; border: 1px solid #bbb; border-radius: 3px; padding: 3mm 5mm 2mm; page-break-inside: avoid; break-inside: avoid; }
    .v-bank { font-size: 9pt; text-align: center; font-weight: 700; margin: 0 0 1mm; border-bottom: 1px solid #000; padding-bottom: 1mm; }
    .v-sub { font-size: 8.5pt; text-align: center; margin: 1mm 0 2mm; color: #333; }
    .v-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 2mm; }
    .v-table th { border: 1px solid #000; padding: 2px 5px; background: #f0f0f0; font-weight: 700; text-align: left; }
    .v-table td { border: 1px solid #000; padding: 2px 5px; }
    .v-total { font-size: 9pt; font-weight: 700; margin: 1mm 0 1mm; }
    .v-sig { display: flex; justify-content: space-between; font-size: 9pt; margin-top: 5mm; border-top: 1px dashed #888; padding-top: 1mm; }
    .v-sig-left { text-align: left; }
    .v-divider { border: none; border-top: 1.5px dashed #555; margin: 3mm 0; }
    .row-table { width: 100%; border-collapse: collapse; margin: 1mm 0; font-size: 8pt; }
    .row-table th { border: 1px solid #000; padding: 2px 4px; background: #f5f5f5; }
    .row-table td { border: 1px solid #000; padding: 2px 4px; }
    @media print {
.voucher-block { page-break-inside: avoid; break-inside: avoid; }
.no-print { display: none; }
    }
  </style>
  </head><body>
  <div class="no-print" style="background:#7c3aed;color:#fff;padding:10px 16px;font-family:Arial;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:99">
    <strong>🏦 Covering Vouchers — ${dateStr}</strong>
    <button onclick="window.print()" style="background:#fff;color:#7c3aed;border:none;padding:6px 18px;border-radius:5px;font-weight:800;cursor:pointer;font-size:11pt">🖨️ Print / Save PDF</button>
    <span style="font-size:9pt;opacity:.8">Use browser Print → Save as PDF</span>
  </div>
  ${pages || '<p style="padding:20mm;text-align:center;color:#999">No voucher entries found for this date.</p>'}
  </body></html>`);
  w.document.close();
}

function toast(msg, type = "ok") {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3500);
}
document
  .getElementById("edit-modal")
  .addEventListener("click", function (e) {
    if (e.target === this) closeEdit();
  });

// ══════════════════════════════════════════════════
//  CLOSE ACCOUNT / LOAN SYSTEM
// ══════════════════════════════════════════════════
let closeRecId = null;

function openCloseModal(id, name, txTypes, subNo, activeSect) {
  closeRecId = id;
  const displayName = subNo ? `${name} (Sub: ${subNo})` : name;
  document.getElementById("close-rec-title").textContent =
    "🔒 Close: " + displayName;
  document.getElementById("close-rec-types").textContent =
    "Type: " + txTypes;
  document.getElementById("close-date").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("close-remarks").value = "";
  const SECT_TX_MAP = {
    gold: ["Gold Loan", "Slips - Loan", "Closing - Loan"],
    od: ["OD Loan", "New FD-OD Loan"],
    fd: ["Fixed Deposit", "FD - Slips", "New FD", "MIS Interest"],
    saving: [
      "Saving Account",
      "Saving Deposit",
      "Saving Withdrawal",
      "Saving - Deposit Slip",
      "Saving - Withdrawal Slip",
      "Closing - Saving Account",
    ],
    membership: [
      "New Sadasya",
      "Sadasya",
      "New Naammatr Sabhasad",
      "Naammatr Sabhasad Account",
    ],
    current: ["Current Account"],
  };

  fetch(API + "/" + id)
    .then((r) => r.json())
    .then((rec) => {
      const allTypes = parseTxTypes(rec.tx_types);
      const closedTypes = new Set(
        (rec.closed_tx_types || "")
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean),
      );
      let openTypes = allTypes.filter((t) => !closedTypes.has(t));
      const sectAllowed = activeSect && SECT_TX_MAP[activeSect];
      if (sectAllowed)
        openTypes = openTypes.filter((t) => sectAllowed.includes(t));

      // Build checkboxes for open types only
      const checkHtml =
        openTypes.length === 0
          ? `<div style="color:#e53e3e;font-weight:700;font-size:11px">⚠️ All transaction types already closed.</div>`
          : openTypes
              .map(
                (t) => `
        <label style="display:flex;align-items:center;gap:7px;font-size:11px;padding:4px 0;cursor:pointer">
          <input type="checkbox" class="close-tx-chk" aria-label="Close ${t}" value="${t}" checked style="width:14px;height:14px">
          <span>${t}</span>
        </label>`,
              )
              .join("");

      // Already-closed badges
      const alreadyHtml =
        closedTypes.size > 0
          ? `<div style="margin-top:6px;font-size:10px;color:#888">Already closed: ${[...closedTypes].map((t) => `<span style="background:#fde0e8;color:#c0392b;border-radius:3px;padding:1px 5px;margin-right:3px;font-weight:700">${t}</span>`).join("")}</div>`
          : "";

      const txSelEl = document.getElementById("close-tx-select");
      if (txSelEl) txSelEl.innerHTML = checkHtml + alreadyHtml;

      // Sadasya warning
      const txList = parseTxTypes(rec.tx_types);
      const hasSadasya = txList.some((t) =>
        [
          "New Sadasya",
          "Sadasya",
          "New Naammatr Sabhasad",
          "Naammatr Sabhasad Account",
        ].includes(t.trim()),
      );
      const warningEl = document.getElementById("close-warning");
      if (warningEl) {
        if (hasSadasya && openTypes.length > 1) {
          warningEl.style.display = "block";
          warningEl.textContent =
            "⚠️ This record includes Sadasya / membership. Uncheck types you want to keep active.";
        } else {
          warningEl.style.display = "none";
        }
      }

      // PDF type dropdown — suggest based on open types
      const map = {
        "Gold Loan": "Closing - Gold Loan",
        "Slips - Loan": "Closing - Gold Loan",
        "Closing - Loan": "Closing - Gold Loan",
        "Fixed Deposit": "Closing - FD",
        "FD - Slips": "Closing - FD",
        "New FD": "Closing - FD",
        "OD Loan": "Closing - FD OD Loan",
        "New FD-OD Loan": "Closing - FD OD Loan",
        "Saving Account": "Closing - Saving Account",
        Sadasya: "Closing - Sadasya",
        "New Sadasya": "Closing - Sadasya",
        "Naammatr Sabhasad Account": "Closing - Naammatr Sadasya",
        "New Naammatr Sabhasad": "Closing - Naammatr Sadasya",
      };
      let suggested = "";
      openTypes.forEach((t) => {
        if (map[t] && !suggested) suggested = map[t];
      });
      const sel = document.getElementById("close-pdf-type");
      sel.innerHTML =
        '<option value="">— No closing PDF —</option>' +
        [
          "Closing - Gold Loan",
          "Closing - FD OD Loan",
          "Closing - Saving Account",
          "Closing - FD",
          "Closing - FD - Slips",
          "Closing - FD + Slips (Both)",
          "Closing - Sadasya",
          "Closing - Naammatr Sadasya",
        ]
          .map(
            (t) =>
              `<option value="${t}"${t === suggested ? " selected" : ""}>${t}</option>`,
          )
          .join("");
    });

  document.getElementById("close-modal").style.display = "flex";
}

function closeCloseModal() {
  document.getElementById("close-modal").style.display = "none";
  closeRecId = null;
}

async function confirmClose() {
  if (!closeRecId) return;
  const d = document.getElementById("close-date").value;
  const rem = document.getElementById("close-remarks").value;
  const pdfType = document.getElementById("close-pdf-type").value;

  // Collect which tx types user checked
  const checkedBoxes = [
    ...document.querySelectorAll(".close-tx-chk:checked"),
  ].map((cb) => cb.value);
  if (checkedBoxes.length === 0) {
    toast("Select at least one type to close", "err");
    return;
  }

  const currentRec = await (await fetch(API + "/" + closeRecId)).json();

  // For Gold Loan closing: navigate to pre-filled form
  if (pdfType === "Closing - Gold Loan") {
    // First do partial close
    await fetch(API + "/" + closeRecId + "/close", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        closed_date: d,
        closed_remarks: rem,
        tx_types_to_close: checkedBoxes,
      }),
    });
    closeCloseModal();
    await openClosingLoanForm(currentRec, d, rem, closeRecId);
    return;
  }

  // Partial/full close
  const r = await fetch(API + "/" + closeRecId + "/close", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      closed_date: d,
      closed_remarks: rem,
      tx_types_to_close: checkedBoxes,
    }),
  });
  if (!r.ok) {
    toast("Close failed", "err");
    return;
  }
  const result = await r.json();
  toast(
    result.allClosed
      ? "Record fully CLOSED ✓"
      : `${checkedBoxes.join(", ")} closed ✓ (other types remain active)`,
  );
  closeCloseModal();
  loadDB();
  loadDashboard();

  // Optionally open closing PDF
  if (pdfType) {
    const rec = await (await fetch(API + "/" + closeRecId)).json();
    const d2 = { ...rec.data };
    if (!d2.customer_name) d2.customer_name = rec.name;
    if (!d2.aadhar) d2.aadhar = rec.aadhar;
    if (!d2.mobile) d2.mobile = rec.mobile;
    if (!d2.saving_acc_no && rec.account_no)
      d2.saving_acc_no = rec.account_no;
    if (!d2.customer_id) d2.customer_id = rec.customer_id;
    d2.date = d;
    if (pdfType === "Closing - FD + Slips (Both)") {
      generateTemplatePDF(["Closing - FD", "Closing - FD - Slips"], d2);
    } else {
      const pdfMap = {
        "Closing - Gold Loan": "Closing - Loan",
        "Closing - FD OD Loan": "Closing - OD",
        "Closing - Sadasya": "Closing - Saving Account",
        "Closing - Naammatr Sadasya": "Closing - Saving Account",
      };
      generateTemplatePDF([pdfMap[pdfType] || pdfType], d2);
    }
  }
}

// ── Open Gold Loan closing form pre-populated from DB ──
async function openClosingLoanForm(rec, closingDate, remarks, recId) {
  // Switch to New Transaction tab
  showPage("new");
  // Clear any existing selection and set Closing - Loan
  selNone();
  // Wait for tab to render
  await new Promise((r) => setTimeout(r, 100));
  // Select "Closing - Loan" in the tx list
  const closingTx = "Closing - Loan";
  // Make Closing - Loan available — it's in Gold Loan group
  toggleTx(closingTx);
  buildForm();
  // Pre-fill all form fields from DB record data
  await new Promise((r) => setTimeout(r, 150));
  const d = rec.data || {};
  // For sub-cases: loan_acc_no is already stored as the full sub-loan acc (e.g. "04-4610-A")
  let closingLoanAccNo = d.loan_acc_no;
  let closingLoanAmount = d.loan_amount;
  let closingLoanAmountWords = d.loan_amount_words;
  if (rec.sonar_sub_no) {
    // loan_acc_no already includes the sub-letter (e.g. "04-4610-A") — use it as-is
    closingLoanAccNo = d.loan_acc_no || rec.sonar_sub_no;
    closingLoanAmount = d.loan_amount;
    closingLoanAmountWords = d.loan_amount_words || "";
  }
  const fill = (id, val) => {
    const el = document.getElementById("f-" + id);
    if (el && val) el.value = val;
  };
  fill("customer_name", rec.name || d.customer_name);
  fill("customer_id", rec.customer_id || d.customer_id);
  fill("aadhar", rec.aadhar || d.aadhar);
  fill("mobile", rec.mobile || d.mobile);
  fill("pan", d.pan);
  fill("address", d.address);
  fill("saving_acc_no", d.saving_acc_no || rec.account_no);
  fill("share_acc_no", d.share_acc_no);
  fill("loan_acc_no", closingLoanAccNo);
  fill("loan_amount", closingLoanAmount);
  fill("loan_amount_words", closingLoanAmountWords);
  fill("nominee_name", d.nominee_name);
  fill("nominee_relation", d.nominee_relation);
  // Restore ornament_items into the dynamic table
  if (d.ornament_items && d.ornament_items.length) {
    setTimeout(function () {
      const tbody = document.getElementById("orn-items-tbody");
      if (tbody) {
        tbody.innerHTML = "";
        d.ornament_items.forEach(function (item) {
          ornAddRow(item);
        });
      }
    }, 200);
  }
  fill("comments", remarks || d.comments);
  // Fix 3: Pre-populate photos from DB (ornament + customer)
  const photoFields = [
    "photo_customer",
    "photo_ornament",
    "photo_aadhar_front",
    "photo_aadhar_back",
    "photo_pan",
  ];
  photoFields.forEach((pid) => {
    if (d[pid]) {
      photos[pid] = d[pid];
      const pbox = document.getElementById("pbox-" + pid);
      if (pbox) {
        pbox.innerHTML = `<img src="${d[pid]}"><input type="file" aria-label="Replace photo" accept="image/*" capture="environment" onchange="onPhoto('${pid}',this)" style="position:absolute;inset:0;opacity:0;cursor:pointer;z-index:2">`;
      }
    }
  });
  // Also restore multicheck ornament selections
  if (d.gold_ornaments) {
    const hiddenEl = document.getElementById("f-gold_ornaments");
    if (hiddenEl) {
      hiddenEl.value = d.gold_ornaments;
      const lbl = document.getElementById("mchk-lbl-gold_ornaments");
      if (lbl) {
        lbl.innerHTML = d.gold_ornaments
          .split(",")
          .map((o) => `<span class="mchk-tag">${o.trim()}</span>`)
          .join("");
      }
    }
  }
  if (d.silver_ornaments) {
    const hiddenEl = document.getElementById("f-silver_ornaments");
    if (hiddenEl) {
      hiddenEl.value = d.silver_ornaments;
      const lbl = document.getElementById("mchk-lbl-silver_ornaments");
      if (lbl) {
        lbl.innerHTML = d.silver_ornaments
          .split(",")
          .map((o) => `<span class="mchk-tag">${o.trim()}</span>`)
          .join("");
      }
    }
  }
  // Leave date empty so user must fill the closing date
  const dateEl = document.getElementById("f-date");
  if (dateEl) dateEl.value = closingDate || "";
  // Mark the DB record ID for closing on submit
  window._closingRecId = recId;
  window._closingOriginalDate = closingDate;
  // Preserve original record's sonar meta so the Closing record inherits correct type/account
  window._closingMeta = {
    customer_type: rec.customer_type || "regular",
    sonar_sub_no: rec.sonar_sub_no || null,
    sonar_parent_no: rec.sonar_parent_no || null,
    sonar_group_no: rec.sonar_group_no || null,
    // Correct account_no for sub-loan closing = sonar_sub_no (e.g. "4545-B")
    account_no: rec.sonar_sub_no ? rec.sonar_sub_no : null,
  };
  // Set ctype so the new closing record is saved with the correct customer_type
  ctype = rec.customer_type || "regular";
  if (ctype === "sonar") {
    document.getElementById("btn-reg").className = "ctype-btn";
    document.getElementById("btn-son").className = "ctype-btn reg-on";
    // Populate sonar group input so sonar_group_no validation passes on save
    const sonarInp = document.getElementById("sonar-main-inp");
    if (sonarInp && rec.sonar_group_no) {
      sonarInp.value = rec.sonar_group_no;
      const strip = document.getElementById("sonar-group-strip");
      if (strip) strip.classList.add("show");
    }
  }
  toast(
    "✅ Closing form pre-filled from database. Enter closing date & generate PDF.",
    "ok",
  );
  // Scroll to form
  document
    .getElementById("form-card")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function reopenRec(id) {
  if (!confirm("Reopen this record?")) return;
  await fetch(API + "/" + id + "/reopen", { method: "PATCH" });
  toast("Record reopened");
  loadDB();
}

// ── Customer Search ──────────────────────────────────────────
let _custSearchTimer = null;

function initCustomerSearch() {
  const nameEl = document.getElementById("f-customer_name");
  if (!nameEl || document.getElementById("cust-search-dropdown")) return;
  const wrap = document.createElement("div");
  wrap.className = "cust-search-wrap";
  nameEl.parentNode.insertBefore(wrap, nameEl);
  wrap.appendChild(nameEl);
  const dropdown = document.createElement("div");
  dropdown.id = "cust-search-dropdown";
  dropdown.className = "cust-search-dropdown";
  dropdown.style.display = "none";
  wrap.appendChild(dropdown);
  nameEl.addEventListener("input", () => {
    clearTimeout(_custSearchTimer);
    const q = nameEl.value.trim();
    if (q.length < 2) {
      dropdown.style.display = "none";
      return;
    }
    dropdown.style.display = "block";
    dropdown.innerHTML =
      '<div class="cust-search-item csi-loading">Searching...</div>';
    _custSearchTimer = setTimeout(
      () => doCustomerSearch(q, dropdown),
      350,
    );
  });
  document.addEventListener(
    "click",
    (e) => {
      if (!wrap.contains(e.target)) dropdown.style.display = "none";
    },
    true,
  );
}

async function doCustomerSearch(q, dropdown) {
  try {
    const rows = await fetch(
      API + "/customers/search?q=" + encodeURIComponent(q),
    ).then((r) => r.json());
    if (!rows.length) {
      dropdown.innerHTML =
        '<div class="cust-search-item csi-loading">No existing customer — will create new</div>';
      return;
    }
    dropdown.innerHTML = "";
    rows.forEach(function (r) {
      const div = document.createElement("div");
      div.className = "cust-search-item";
      const nameSpan = document.createElement("span");
      nameSpan.className = "csi-name";
      nameSpan.textContent = r.name || "—";
      const metaSpan = document.createElement("span");
      metaSpan.className = "csi-meta";
      metaSpan.textContent =
        "ID: " +
        r.customer_id +
        "  ·  Aadhar: " +
        (r.aadhar || "—") +
        "  ·  Mobile: " +
        (r.mobile || "—");
      div.appendChild(nameSpan);
      div.appendChild(metaSpan);
      div.addEventListener("click", function () {
        selectCustomer(r);
      });
      dropdown.appendChild(div);
    });
  } catch (e) {
    dropdown.innerHTML =
      '<div class="cust-search-item csi-loading">Error: ' +
      e.message +
      "</div>";
  }
}

function selectCustomer(r) {
  // r is the full customer object from the search API
  var custId = typeof r === "object" ? r.customer_id : r;
  var map = {
    "f-customer_name": typeof r === "object" ? r.name : arguments[1],
    "f-customer_id": custId,
    "f-aadhar": typeof r === "object" ? r.aadhar : arguments[2],
    "f-mobile": typeof r === "object" ? r.mobile : arguments[3],
    "f-address": typeof r === "object" ? r.address : "",
    "f-dob": typeof r === "object" ? (r.dob ? String(r.dob).split("T")[0] : "") : "",
    "f-pan": typeof r === "object" ? r.pan : "",
    "f-occupation": typeof r === "object" ? r.occupation : "",
    "f-saving_acc_no": typeof r === "object" ? r.saving_acc_no : "",
    "f-saving_balance": typeof r === "object" ? r.saving_balance : "",
    "f-share_acc_no": typeof r === "object" ? r.share_acc_no : "",
  };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (el && map[id]) el.value = map[id];
  });
  var dd = document.getElementById("cust-search-dropdown");
  if (dd) dd.style.display = "none";
  var lnEl = document.getElementById("f-loan_acc_no");
  if (lnEl && !lnEl.value) suggestNextLoanNo();
}

async function suggestNextLoanNo() {
  try {
    var r = await fetch("/api/records/next-loan-no/03").then(
      function (res) {
        return res.json();
      },
    );
    var lnEl = document.getElementById("f-loan_acc_no");
    if (lnEl && !lnEl.value && r.next) {
      lnEl.value = r.next;
      lnEl.style.background = "#fffbe6";
      lnEl.title = "Auto-suggested — confirm before submitting";
    }
  } catch (e) {}
}

(function () {
  var obs = new MutationObserver(function () {
    if (
      document.getElementById("f-customer_name") &&
      !document.getElementById("cust-search-dropdown")
    ) {
      initCustomerSearch();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();

// ═══════════════════════════════════════════════════════════════════════════
//  GLOBAL DATE SELECTOR
//  All pages read window.APP_DATE. Defaults to today → zero behaviour change.
// ═══════════════════════════════════════════════════════════════════════════

window.APP_DATE = new Date().toISOString().split('T')[0];

function getAppDate() {
  return window.APP_DATE || new Date().toISOString().split('T')[0];
}

function isToday(d) {
  return d === new Date().toISOString().split('T')[0];
}

// Called once on login / page load to set the date picker to today
function initGlobalDate() {
  const inp = document.getElementById('global-date');
  if (!inp) return;
  const today = new Date().toISOString().split('T')[0];
  inp.value = today;
  window.APP_DATE = today;
  _updateDateUI(today);
}

// Triggered by the date input's onchange
function onGlobalDateChange() {
  const inp = document.getElementById('global-date');
  if (!inp) return;
  const d = inp.value || new Date().toISOString().split('T')[0];
  window.APP_DATE = d;
  _updateDateUI(d);

  // Sync all page-level date inputs so Ledger / Cash Book stay in step
  _syncPageDates(d);

  // Reload whatever page is currently visible
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    const pageId = activePage.id.replace('page-', '');
    _refreshPageForDate(pageId);
  }
}

// Jump back to today
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  const inp = document.getElementById('global-date');
  if (inp) inp.value = today;
  window.APP_DATE = today;
  _updateDateUI(today);
  _syncPageDates(today);
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    const pageId = activePage.id.replace('page-', '');
    _refreshPageForDate(pageId);
  }
}

function _updateDateUI(d) {
  const today  = new Date().toISOString().split('T')[0];
  const isPast = d && d !== today;

  // Past-date badge on header
  const badge = document.getElementById('hdate-badge');
  if (badge) badge.style.display = isPast ? 'inline-block' : 'none';

  // Close Day button — show whenever any date is set
  const closeBtn = document.getElementById('close-day-btn');
  if (closeBtn) closeBtn.style.display = d ? 'flex' : 'none';

  // Past date banner inside Dashboard
  _renderPastDateBanner(d);
}

function _renderPastDateBanner(d) {
  // Remove any existing banner first
  document.querySelectorAll('.past-date-banner').forEach(el => el.remove());
  if (!d || isToday(d)) return;

  const fmt = new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const banner = document.createElement('div');
  banner.className = 'past-date-banner';
  banner.innerHTML = `
    <span>📅</span>
    <div>
      <div class="pdb-date">${fmt}</div>
      <div style="font-size:9px;font-weight:600;opacity:0.8">Viewing past date — data filtered for this day</div>
    </div>
    <button class="pdb-back" onclick="setTodayDate()">↩ Back to Today</button>
  `;

  // Insert at top of every visible .page
  document.querySelectorAll('.page.active').forEach(page => {
    page.insertBefore(banner.cloneNode(true), page.firstChild);
  });
}

// Keep Ledger + Cash Book date inputs in sync with global date
function _syncPageDates(d) {
  const ldgDate = document.getElementById('ldg-date');
  if (ldgDate) ldgDate.value = d;

  const cbDate = document.getElementById('cb-date');
  if (cbDate) cbDate.value = d;

  // Restore any previously saved opening balance for that date
  try {
    const saved = localStorage.getItem('cb-opening-' + d);
    const openEl = document.getElementById('cb-opening');
    if (openEl && saved) openEl.value = saved;
  } catch(e) {}
}

// Reload data for the given page using the global date
function _refreshPageForDate(pageId) {
  switch (pageId) {
    case 'home':
      loadDashboard();
      break;
    case 'database':
      dbOff = 0;
      loadDB();
      break;
    case 'ledger':
      loadLedger();
      break;
    case 'cashbook':
      // Don't auto-generate cash book on date change — user clicks the button
      // Just make sure the date input is correct (already done in _syncPageDates)
      break;
  }
}

// ── Patch loadDashboard to accept a date param ────────────────────────────────
// We wrap the existing function so the stats endpoint can receive ?date=
// The original call was: fetch(API + "/stats")
// New call adds: fetch(API + "/stats?date=" + getAppDate())
// If backend doesn't support the param it's silently ignored — zero risk.
const _origLoadDashboard = loadDashboard;
loadDashboard = async function() {
  // Patch the stats fetch URL inside the call by temporarily overriding
  // We achieve this by tagging APP_DATE onto the URL via a global intercept
  window._dashDateParam = getAppDate();

  // Update dash-date label to reflect selected date
  const d = getAppDate();
  const fmt = new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const dashDateEl = document.getElementById('dash-date');
  if (dashDateEl) {
    dashDateEl.textContent = isToday(d)
      ? fmt
      : '📅 Viewing: ' + fmt;
  }

  // Update label on "Today's Entries" KPI card to reflect date context
  const todayLbl = document.querySelector('#s-today + .stat-lbl') ||
    document.querySelector('[id="s-today"]')?.nextElementSibling;
  if (todayLbl) todayLbl.textContent = isToday(d) ? "Today's Entries" : "Day's Entries";

  // Re-render the past-date banner
  _renderPastDateBanner(d);

  await _origLoadDashboard();
};

// ── Patch loadDB to filter by selected date ────────────────────────────────────
// We add date_from / date_to only when a past date is selected.
// When today → no change (the original params already work for today).
const _origLoadDB = loadDB;
loadDB = async function() {
  const d = getAppDate();
  if (!isToday(d)) {
    // Temporarily set hidden date filters that loadDB will pick up
    // We do this by patching URLSearchParams construction via a flag
    window._dbDateFilter = d;
  } else {
    window._dbDateFilter = null;
  }
  await _origLoadDB();
  window._dbDateFilter = null;
};

// Patch URLSearchParams to inject date filter when flag is set.
// This is the safest interception — no change to loadDB source code.
const _NativeURLSearchParams = window.URLSearchParams;
window.URLSearchParams = function(init) {
  const params = new _NativeURLSearchParams(init);
  const original_set = params.set.bind(params);
  const original_append = params.append.bind(params);

  // After construction, inject date filter if flag is set AND this looks like a records query
  if (window._dbDateFilter &&
      typeof init === 'object' &&
      'limit' in (init || {}) &&
      !params.has('date_from')) {
    params.set('date_from', window._dbDateFilter);
    params.set('date_to',   window._dbDateFilter);
  }
  return params;
};
window.URLSearchParams.prototype = _NativeURLSearchParams.prototype;

// ── Patch showPage to always sync dates when switching pages ──────────────────
const _origShowPage = showPage;
showPage = function(id) {
  _origShowPage(id);
  const d = getAppDate();
  _syncPageDates(d);
  _renderPastDateBanner(d);
};

// ═══════════════════════════════════════════════════════════════════════════
//  CLOSE DAY SYNC ENGINE
// ═══════════════════════════════════════════════════════════════════════════

async function openCloseDayModal() {
  const d = getAppDate();
  const fmt = new Date(d + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  document.getElementById('close-day-subtitle').textContent = fmt;

  // Reset UI
  ['cd-gold-n','cd-closed-n','cd-fd-n','cd-ledger-n'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '…';
  });
  const log = document.getElementById('close-day-log');
  if (log) { log.style.display = 'none'; log.innerHTML = ''; }
  const btn = document.getElementById('close-day-confirm-btn');
  if (btn) { btn.disabled = false; btn.textContent = '✅ Sync & Close Day'; }

  document.getElementById('close-day-modal').style.display = 'flex';

  // Fetch day summary from backend
  try {
    const [recRes, cbRes] = await Promise.all([
      fetch(API + '?limit=500&date_from=' + d + '&date_to=' + d),
      fetch(CB_API + '?date=' + d),
    ]);
    const recJson = recRes.ok ? await recRes.json() : {};
    const cbJson  = cbRes.ok  ? await cbRes.json()  : {};
    const records = recJson.records || [];
    const entries = cbJson.entries  || [];

    // Count by type
    let newGold = 0, closedLoans = 0, newFD = 0;
    records.forEach(r => {
      const txs = parseTxTypes(r.tx_types);
      if (txs.some(t => t === 'Gold Loan' || t === 'Slips - Loan')) newGold++;
      if (txs.some(t => t === 'Closing - Loan')) closedLoans++;
      if (txs.some(t => t === 'New FD' || t === 'Fixed Deposit')) newFD++;
    });

    document.getElementById('cd-gold-n').textContent   = newGold;
    document.getElementById('cd-closed-n').textContent = closedLoans;
    document.getElementById('cd-fd-n').textContent     = newFD;
    document.getElementById('cd-ledger-n').textContent = entries.length;

    // Store for sync
    window._closeDayData = { d, records, entries };
  } catch(e) {
    toast('Could not load day summary: ' + e.message, 'err');
  }
}

function _cdLog(msg, type) {
  const log = document.getElementById('close-day-log');
  if (!log) return;
  log.style.display = 'block';
  const color = type === 'ok' ? '#27ae60' : type === 'err' ? '#c0392b' : '#555';
  log.innerHTML += `<div style="color:${color}">${msg}</div>`;
  log.scrollTop = log.scrollHeight;
}

async function runCloseDaySync() {
  const btn = document.getElementById('close-day-confirm-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Syncing…'; }

  const log = document.getElementById('close-day-log');
  if (log) { log.style.display = 'block'; log.innerHTML = ''; }

  const { d, records, entries } = window._closeDayData || {};
  if (!d) { toast('No data loaded — reopen the modal', 'err'); return; }

  let ok = 0, errs = 0;

  _cdLog(`📅 Syncing ${d} — ${records.length} records, ${entries.length} ledger rows`, 'info');

  // ── 1. Process each record through process-transaction ──────────────────────
  // This is idempotent — it upserts gold_loans, fd_accounts, saving_accounts
  for (const rec of records) {
    const txs = parseTxTypes(rec.tx_types);
    const d2 = typeof rec.data === 'string'
      ? (() => { try { return JSON.parse(rec.data); } catch(e) { return {}; } })()
      : (rec.data || {});

    try {
      const res = await fetch(API + '/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_types: txs,
          data: d2,
          record_id: rec.id,
          customer_name: rec.name,
        }),
      });
      if (res.ok) {
        ok++;
        _cdLog(`✅ ${rec.name} — ${txs.join(', ')}`, 'ok');
      } else {
        const j = await res.json().catch(() => ({}));
        errs++;
        _cdLog(`⚠️ ${rec.name}: ${j.error || res.status}`, 'err');
      }
    } catch(e) {
      errs++;
      _cdLog(`❌ ${rec.name}: ${e.message}`, 'err');
    }
  }

  // ── 2. Flush any unsaved ledger entries ─────────────────────────────────────
  const unsaved = (ledgerAllRows || []).filter(r => !r._saved && (!r.date || r.date === d));
  if (unsaved.length) {
    _cdLog(`📋 Flushing ${unsaved.length} unsaved ledger rows…`, 'info');
    try {
      await _flushToDB(d, unsaved);
      _cdLog(`✅ Ledger rows saved`, 'ok');
    } catch(e) {
      _cdLog(`❌ Ledger flush failed: ${e.message}`, 'err');
      errs++;
    }
  } else {
    _cdLog(`📋 All ledger entries already saved`, 'ok');
  }

  // ── 3. Mark closed loans as closed in gold_loans table ──────────────────────
  for (const rec of records) {
    const txs = parseTxTypes(rec.tx_types);
    if (!txs.includes('Closing - Loan')) continue;
    if (rec.closed_date) continue; // already closed

    const closingDate = rec.date || d;
    try {
      const res = await fetch(API + '/' + rec.id + '/close', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closed_date: closingDate, closed_remarks: rec.remarks || '' }),
      });
      if (res.ok) {
        _cdLog(`🔒 Marked closed: ${rec.name} (${closingDate})`, 'ok');
        ok++;
      } else {
        errs++;
        _cdLog(`⚠️ Close failed for ${rec.name}`, 'err');
      }
    } catch(e) {
      errs++;
      _cdLog(`❌ Close error for ${rec.name}: ${e.message}`, 'err');
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  const summary = `✅ Done — ${ok} synced, ${errs} error(s)`;
  _cdLog(summary, errs > 0 ? 'err' : 'ok');
  toast(summary, errs > 0 ? 'inf' : 'ok');

  if (btn) { btn.disabled = false; btn.textContent = '✅ Done — Close Modal'; }
  if (btn) btn.onclick = () => {
    document.getElementById('close-day-modal').style.display = 'none';
    loadDashboard();
    loadDB();
  };

  invalidateSavingCache();
}

// ── Wire initGlobalDate into app startup ──────────────────────────────────────
// Find the existing appDoLogin success handler and call initGlobalDate() there.
// Also call it on DOMContentLoaded in case user is already logged in.
document.addEventListener('DOMContentLoaded', () => {
  // Small delay so DOM is fully ready
  setTimeout(initGlobalDate, 50);
});

// Also hook into appCheckAuth which is called on startup
const _origAppCheckAuth = window.appCheckAuth;
if (typeof _origAppCheckAuth === 'function') {
  window.appCheckAuth = async function() {
    const result = await _origAppCheckAuth();
    if (result) setTimeout(initGlobalDate, 100);
    return result;
  };
}
