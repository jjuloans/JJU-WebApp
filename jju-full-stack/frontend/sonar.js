// ═══════════════════════════════════════════════════════
//  SONAR LOAN MODULE  — sonar.js
//  Logic:
//    • Main form = regular Gold Loan form (printed as PDF)
//    • Sub-cases = DB-only records (no PDF), amounts must sum to main total
// ═══════════════════════════════════════════════════════

// State (reset on every sonarInit call)
let sonarSubCases = [];   // [{ letter, sub_no, name, amount }]
let sonarExisting = [];   // existing sub-cases fetched from DB

// ─────────────────────────────────
//  Called when Sonar tab activated
// ─────────────────────────────────
function sonarInit() {
  sonarSubCases = [];
  sonarExisting = [];
  renderSonarSubPanel();
}

// ─────────────────────────────────
//  Called whenever main loan number changes
// ─────────────────────────────────
let _sonarGroupTimer = null;
function onSonarGroupChange(val) {
  clearTimeout(_sonarGroupTimer);
  sonarSubCases = [];
  sonarExisting = [];

  // Keep strip input in sync
  const stripInp = document.getElementById('sonar-main-inp');
  if (stripInp && stripInp.value !== val) stripInp.value = val;

  // If loan_acc_no form field exists, check for mismatch warning
  checkLoanAccWarning(val);

  const badge = document.getElementById('sonar-next-badge');
  if (badge) badge.style.display = 'none';

  if (val && val.trim().length >= 3) {
    _sonarGroupTimer = setTimeout(() => fetchSonarExisting(val.trim()), 600);
  } else {
    renderSonarSubPanel();
    const exStr = document.getElementById('sonar-existing-strip');
    if (exStr) exStr.innerHTML = '';
  }
}

function checkLoanAccWarning(groupNo) {
  const warnBar = document.getElementById('sonar-warning-bar');
  if (!warnBar || !groupNo) { if(warnBar) warnBar.style.display='none'; return; }
  const loanAccEl = document.getElementById('f-loan_acc_no');
  if (!loanAccEl) return;
  const loanAcc = loanAccEl.value.trim();
  if (loanAcc && loanAcc !== groupNo) {
    warnBar.style.display = 'block';
    warnBar.textContent = '⚠️ Warning: Loan Acc No. in form (' + loanAcc + ') does not match Main Loan Case No. (' + groupNo + ')';
  } else {
    warnBar.style.display = 'none';
  }
}

async function fetchSonarExisting(groupNo) {
  try {
    const rows = await fetch('/api/records/sonar-group/' + encodeURIComponent(groupNo)).then(r => r.json());
    sonarExisting = Array.isArray(rows) ? rows : [];
  } catch { sonarExisting = []; }

  // Show next sub-case badge in the strip
  const nextL  = nextSubLetter();
  const badge  = document.getElementById('sonar-next-badge');
  if (badge && nextL) {
    const suffix = groupNo.includes('-') ? groupNo.split('-').slice(1).join('-') : groupNo;
    badge.textContent = 'Next: ' + suffix + '-' + nextL;
    badge.style.display = 'inline-block';
  }

  // Show existing sub-cases in the strip
  const exStr = document.getElementById('sonar-existing-strip');
  if (exStr) {
    if (sonarExisting.length) {
      exStr.innerHTML = '<div class="son-existing-box">'
        + '<div class="son-existing-title">Existing sub-cases for ' + groupNo + ':</div>'
        + sonarExisting.map(s =>
            '<div class="son-existing-row">'
            + '<span class="son-chip amber">' + (s.sonar_sub_no||'—') + '</span>'
            + '<span>' + (s.name||'—') + '</span>'
            + '</div>'
          ).join('')
        + '</div>';
    } else {
      exStr.innerHTML = '<div class="son-hint">No existing sub-cases for ' + groupNo + ' — this will be the first.</div>';
    }
  }

  renderSonarSubPanel();
}

// ─────────────────────────────────
//  Next available sub-case letter
// ─────────────────────────────────
function nextSubLetter() {
  const used = new Set([
    ...sonarExisting.map(s => (s.sonar_sub_no || '').slice(-1)),
    ...sonarSubCases.map(s => s.letter),
  ]);
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(l => !used.has(l)) || null;
}

// ─────────────────────────────────
//  Add a sub-case row
// ─────────────────────────────────
function sonarAddSub() {
  const groupNo = document.getElementById('sonar-main-inp')?.value?.trim();
  if (!groupNo) { toast('Enter Main Loan Number first', 'err'); return; }

  const letter = nextSubLetter();
  if (!letter) { toast('All sub-case letters used!', 'err'); return; }

  // Sub no = suffix + '-' + letter  (e.g. 1234-A, not 03-1234-A)
  const suffix = groupNo.includes('-') ? groupNo.split('-').slice(1).join('-') : groupNo;
  sonarSubCases.push({ letter, sub_no: suffix + '-' + letter, name: '', amount: '', metal_type: 'Gold', ornament_qty: '', ornament_weight: '', gold_ornaments: '', silver_ornaments: '' });
  renderSonarSubPanel();

  // Scroll to new row
  setTimeout(() => {
    const el = document.getElementById('sub-row-' + letter);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 80);
}

// ─────────────────────────────────
//  Remove a sub-case row
// ─────────────────────────────────
function sonarRemoveSub(letter) {
  sonarSubCases = sonarSubCases.filter(s => s.letter !== letter);
  renderSonarSubPanel();
}

// ─────────────────────────────────
//  Field change handlers
// ─────────────────────────────────
function sonarSubName(letter, val) {
  const sc = sonarSubCases.find(s => s.letter === letter);
  if (sc) sc.name = val;
}
function sonarSubField(letter, field, val) {
  var sc = sonarSubCases.find(function(s){return s.letter === letter;});
  if (sc) sc[field] = val;
}
function sonarSubAmount(letter, val) {
  const sc = sonarSubCases.find(s => s.letter === letter);
  if (sc) sc.amount = val;
  renderSonarTotals();
}

// ─────────────────────────────────
//  Render sub-case panel
// ─────────────────────────────────
function renderSonarSubPanel() {
  const panel = document.getElementById('sonar-sub-panel');
  if (!panel) return;

  const groupNo = document.getElementById('sonar-main-inp')?.value?.trim() || '';
  const nextL   = nextSubLetter();

  // Also check if form's loan_acc_no matches groupNo and show warning
  const loanAccEl = document.getElementById('f-loan_acc_no');
  const warnBar   = document.getElementById('sonar-warning-bar');
  if (warnBar && groupNo && loanAccEl) {
    const loanAcc = loanAccEl.value.trim();
    if (loanAcc && loanAcc !== groupNo) {
      warnBar.style.display = 'block';
      warnBar.textContent = '⚠️ Warning: Loan Acc No. in form (' + loanAcc + ') does not match Main Loan Case No. (' + groupNo + ')';
    } else {
      warnBar.style.display = 'none';
    }
  }

  let html = '';

  // Existing sub-cases info
  if (sonarExisting.length) {
    html += '<div class="son-existing-box">'
      + '<div class="son-existing-title">⚠️ Existing sub-cases for ' + groupNo + ':</div>'
      + sonarExisting.map(s =>
          '<div class="son-existing-row">'
          + '<span class="son-chip amber">' + (s.sonar_sub_no||'—') + '</span>'
          + '<span>' + (s.name||'—') + '</span>'
          + '<span class="son-existing-amt">₹' + (s.loan_amount||s.data?.loan_amount||'—') + '</span>'
          + '<button class="rpdf-btn" onclick="pdfRec(' + s.id + ')">📄</button>'
          + '</div>'
        ).join('')
      + '</div>';
  }

  // Sub-case rows
  if (sonarSubCases.length) {
    html += '<div class="son-rows">';
    sonarSubCases.forEach(sc => {
      html += '<div class="son-sub-row" id="sub-row-' + sc.letter + '">'
        + '<div class="son-sub-row-header">'
        + '  <span class="son-chip">' + sc.sub_no + '</span>'
        + '  <span style="font-size:11px;font-weight:700;color:var(--amber-a)">Sub-case ' + sc.letter + ' — DB only, no PDF</span>'
        + '  <button class="son-remove-btn" onclick="sonarRemoveSub(\'' + sc.letter + '\')">✕</button>'
        + '</div>'
        + '<div class="fgrid">'
        + '  <div class="field">'
        + '    <label>Customer Name <span class="req">*</span></label>'
        + '    <input type="text" value="' + esc(sc.name) + '" placeholder="Customer name for ' + sc.sub_no + '"'
        + '      oninput="sonarSubName(\'' + sc.letter + '\',this.value)">'
        + '  </div>'
        + '  <div class="field">'
        + '    <label>Loan Amount (₹) <span class="req">*</span></label>'
        + '    <input type="number" value="' + esc(sc.amount) + '" placeholder="Amount"'
        + '      oninput="sonarSubAmount(\'' + sc.letter + '\',this.value)">'
        + '  </div>'
        + '  <div class="field">'
        + '    <label>Metal Type</label>'
        + '    <select oninput="sonarSubField(\'' + sc.letter + '\',\'metal_type\',this.value)">'
        + '      <option>Gold</option><option>Silver</option><option>Gold &amp; Silver</option>'
        + '    </select>'
        + '  </div>'
        + '  <div class="field">'
        + '    <label>Ornament Qty</label>'
        + '    <input type="number" value="' + esc(sc.ornament_qty) + '" placeholder="e.g. 3"'
        + '      oninput="sonarSubField(\'' + sc.letter + '\',\'ornament_qty\',this.value)">'
        + '  </div>'
        + '  <div class="field">'
        + '    <label>Ornament Weight (Gm)</label>'
        + '    <input type="number" step="0.01" value="' + esc(sc.ornament_weight) + '" placeholder="e.g. 12.5"'
        + '      oninput="sonarSubField(\'' + sc.letter + '\',\'ornament_weight\',this.value)">'
        + '  </div>'
        + '  <div class="field fw">'
        + '    <label>Gold Ornaments (सोन्याचे दागिने)</label>'
        + sonarMchk(sc.letter, 'gold_ornaments', ['गोल्ड अंगुठी - 1 नग','गोल्ड अंगुठी - 2 नग','गोल्ड अंगुठी - 3 नग','गोल्ड पोत/मंगळसूत्र - 1 नग','गोल्ड पोत/मंगळसूत्र - 2 नग','गोल्ड हार/नेकलेस - 1 नग','गोल्ड हार/नेकलेस - 2 नग','गोल्ड हार/नेकलेस - 3 नग','गोल्ड बांगडी - 1 नग','गोल्ड बांगडी - 2 नग','गोल्ड बांगडी - 4 नग','गोल्ड कानातली रिंग - 1 नग','गोल्ड कानातली रिंग - 2 नग','गोल्ड कानातली रिंग - 4 नग','गोल्ड चेन - 1 नग','गोल्ड चेन - 2 नग','गोल्ड कानातली चेन - 1 नग','गोल्ड कानातली चेन - 2 नग','गोल्ड कानातली चेन - 4 नग','गोल्ड गहू मणी','Other'], sc.gold_ornaments || '')
        + '  </div>'
        + '  <div class="field fw">'
        + '    <label>Silver Ornaments (चांदीचे दागिने)</label>'
        + sonarMchk(sc.letter, 'silver_ornaments', ['चांदी कडे - 1 नग','चांदी कडे - 2 नग','चांदी कडे - 3 नग','चांदी कडे - 4 नग','चांदी साखळी - 1 नग','चांदी साखळी - 2 नग','चांदी पाटली - 1 नग','चांदी पाटली - 2 नग','चांदी पाटली - 4 नग','चांदी तागडी - 1 नग','चांदी तागडी - 2 नग','चांदी बाष्या - 1 नग','चांदी बाष्या - 2 नग','चांदी फुलतोडे - 1 नग','Other'], sc.silver_ornaments || '')
        + '  </div>'
        + '</div>'
        + '</div>';
    });
    html += '</div>';

    // Totals bar
    html += '<div class="son-totals" id="son-totals"></div>';
  }

  // Add button
  if (groupNo && nextL) {
    const suffix = groupNo.includes('-') ? groupNo.split('-').slice(1).join('-') : groupNo;
    html += '<button class="son-add-btn" onclick="sonarAddSub()">'
      + '＋ Add Sub-case ' + suffix + '-' + nextL
      + '</button>';
  } else if (!groupNo) {
    html += '<div class="son-hint">Enter Main Loan Number above to add sub-cases</div>';
  }

  panel.innerHTML = html;
  renderSonarTotals();
}

// ─────────────────────────────────
//  Render totals row
// ─────────────────────────────────
function renderSonarTotals() {
  const el = document.getElementById('son-totals');
  if (!el || !sonarSubCases.length) return;

  const mainAmt   = parseFloat(document.getElementById('f-loan_amount')?.value || 0);
  const subTotal  = sonarSubCases.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
  const diff      = mainAmt - subTotal;
  const ok        = mainAmt > 0 && Math.abs(diff) < 0.01;
  const color     = ok ? 'var(--mint-a)' : 'var(--rose-a)';
  const bg        = ok ? 'var(--mint)'   : 'var(--rose)';

  el.innerHTML = '<div class="son-total-bar" style="background:' + bg + ';border-color:' + color + '">'
    + '<span style="color:' + color + ';font-weight:800">Sub-case Total: ₹' + subTotal.toLocaleString('en-IN') + '</span>'
    + (mainAmt > 0
        ? '<span style="color:' + color + '">'
          + (ok ? '✅ Matches main loan' : '❌ Main loan: ₹' + mainAmt.toLocaleString('en-IN') + ' | Difference: ₹' + Math.abs(diff).toLocaleString('en-IN'))
          + '</span>'
        : '<span style="color:var(--textl);font-size:9px">Enter main loan amount above to validate</span>')
    + '</div>';
}

function esc(s) { return String(s||'').replace(/"/g,'&quot;'); }

// Build a dropdown multi-check widget for sonar sub-case ornament fields
function sonarMchk(letter, field, opts, currentVal) {
  var id = 'smchk-' + letter + '-' + field;
  var curVals = currentVal ? currentVal.split(', ').filter(Boolean) : [];
  var optHtml = opts.map(function(o) {
    var checked = curVals.includes(o) ? 'checked' : '';
    return '<label class="mchk-item"><input type="checkbox" value="' + esc(o) + '" ' + checked + ' onchange="sonarMchkUpdate(\'' + letter + '\',\'' + field + '\',\'' + id + '\')">'
      + '<span>' + o + '</span></label>';
  }).join('');
  var tagHtml = curVals.length
    ? curVals.map(function(o){ return '<span class="mchk-tag">' + o + '</span>'; }).join('')
    : '<span style="font-size:12px;color:var(--textl)">Select ornaments…</span>';
  return '<div class="mchk-wrap">'
    + '<button type="button" class="mchk-trigger" id="' + id + '-btn" onclick="sonarMchkToggle(\'' + id + '\')">'
    + '<span id="' + id + '-lbl" style="font-size:12px">' + tagHtml + '</span>'
    + '<span style="font-size:10px;color:var(--textl)">▼</span>'
    + '</button>'
    + '<div class="mchk-dropdown" id="' + id + '-drop">'
    + '<input type="text" id="' + id + '-custom" placeholder="Custom ornament name…" oninput="sonarMchkUpdate(\'' + letter + '\',\'' + field + '\',\'' + id + '\')" style="width:calc(100% - 24px);margin:6px 12px;padding:6px 9px;border-radius:6px;border:1px solid var(--border);font-size:12px;font-family:Nunito,sans-serif">'
    + optHtml
    + '</div>'
    + '<input type="hidden" id="' + id + '-val" value="' + esc(currentVal || '') + '">'
    + '</div>';
}

function sonarMchkToggle(id) {
  var drop = document.getElementById(id + '-drop');
  var btn = document.getElementById(id + '-btn');
  if (!drop || !btn) return;
  var isOpen = drop.classList.contains('open');
  document.querySelectorAll('.mchk-dropdown.open').forEach(function(d){ d.classList.remove('open'); });
  document.querySelectorAll('.mchk-trigger.open').forEach(function(b){ b.classList.remove('open'); });
  if (!isOpen) { drop.classList.add('open'); btn.classList.add('open'); }
}

function sonarMchkUpdate(letter, field, id) {
  var drop = document.getElementById(id + '-drop');
  if (!drop) return;
  var sel = [...drop.querySelectorAll('input[type=checkbox]:checked')].map(function(c){ return c.value; });
  var custom = (document.getElementById(id + '-custom')?.value || '').trim();
  var all = [...sel, custom].filter(Boolean);
  var hidEl = document.getElementById(id + '-val');
  if (hidEl) hidEl.value = all.join(', ');
  var lblEl = document.getElementById(id + '-lbl');
  if (lblEl) {
    lblEl.innerHTML = all.length
      ? all.map(function(o){ return '<span class="mchk-tag">' + o + '</span>'; }).join('')
      : '<span style="font-size:12px;color:var(--textl)">Select ornaments…</span>';
  }
  // Update the sonarSubCases state
  sonarSubField(letter, field, all.join(', '));
}

// ─────────────────────────────────
//  Validate before save
// ─────────────────────────────────
function sonarValidate() {
  if (!sonarSubCases.length) return true; // no sub-cases = fine

  // Validate each sub-case has name + amount
  for (const sc of sonarSubCases) {
    if (!sc.name.trim()) { toast('Sub-case ' + sc.sub_no + ': Customer Name required', 'err'); return false; }
    if (!sc.amount || parseFloat(sc.amount) <= 0) { toast('Sub-case ' + sc.sub_no + ': Loan Amount required', 'err'); return false; }
  }

  // Validate total matches main
  const mainAmt  = parseFloat(document.getElementById('f-loan_amount')?.value || 0);
  const subTotal = sonarSubCases.reduce((s, c) => s + (parseFloat(c.amount) || 0), 0);
  if (mainAmt > 0 && Math.abs(mainAmt - subTotal) > 0.01) {
    toast('Sub-case amounts (₹' + subTotal.toLocaleString('en-IN') + ') must equal main loan (₹' + mainAmt.toLocaleString('en-IN') + ')', 'err');
    return false;
  }
  return true;
}

// ─────────────────────────────────
//  Save sub-cases to DB (no PDF)
// ─────────────────────────────────
async function sonarSaveSubCases(mainData, section, txArr, groupNo) {
  if (!sonarSubCases.length) return 0;
  let saved = 0;
  for (const sc of sonarSubCases) {
    const payload = {
      date:           mainData.date || new Date().toISOString().split('T')[0],
      name:           sc.name.trim(),
      customer_id:    mainData.customer_id || '',
      customer_type:  'sonar',
      aadhar:         mainData.aadhar || '',
      mobile:         mainData.mobile || '',
      account_no:     sc.sub_no || '',  // e.g. '4456-A', '4456-B'
      section,
      tx_types:       txArr,
      data:           Object.assign({}, mainData, { customer_name: sc.name.trim(), loan_amount: sc.amount, loan_amount_words: '', metal_type: sc.metal_type||'Gold', ornament_qty: sc.ornament_qty||'', ornament_weight: sc.ornament_weight||'', gold_ornaments: sc.gold_ornaments||'', silver_ornaments: sc.silver_ornaments||'' }),
      remarks:        'Sub-case of ' + groupNo,
      sonar_parent_no: groupNo,
      sonar_sub_no:    sc.sub_no,
      sonar_group_no:  groupNo,
    };
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) saved++;
    } catch {}
  }
  return saved;
}
