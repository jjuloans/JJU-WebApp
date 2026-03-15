// ═══════════════════════════════════════════════════════════════
//  JJU PDF GENERATOR v17
//  - Gold Loan: exact 6-col table, full rules, customer name replaces signature text
//  - Slips: clean tabular 3-slip format
//  - Sub-cases: 1234-A style (suffix-letter, not full number)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  ORNAMENT ITEMS FORM BUILDER
//  Call renderOrnamentItemsForm(containerId) to inject a dynamic
//  add-row form. Returns current items via getOrnamentItems().
//
//  Data format expected in data.ornament_items:
//  [ { name: "Gold Chain", qty: 1, weight: 22 }, ... ]
// ═══════════════════════════════════════════════════════════════
function renderOrnamentItemsForm(containerId) {
  var wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML =
    "<style>" +
    ".orn-form-table{width:100%;border-collapse:collapse;margin-top:4px}" +
    ".orn-form-table th{background:#1a3a5c;color:#fff;padding:5px 8px;font-size:9pt;border:1px solid #999;text-align:left}" +
    ".orn-form-table td{padding:4px 6px;border:1px solid #ccc;vertical-align:middle}" +
    ".orn-inp{width:100%;padding:4px 6px;border:1px solid #bbb;border-radius:3px;font-size:9.5pt;box-sizing:border-box}" +
    ".orn-del{background:#c62828;color:#fff;border:none;border-radius:3px;padding:3px 10px;cursor:pointer;font-size:9pt}" +
    ".orn-add-btn{margin-top:6px;background:#1a3a5c;color:#fff;border:none;border-radius:4px;padding:6px 16px;cursor:pointer;font-size:9.5pt;font-weight:700}" +
    ".orn-summary{font-size:8.5pt;color:#2e7d52;font-weight:700;margin-top:4px}" +
    "</style>" +
    '<table class="orn-form-table">' +
    "<thead><tr>" +
    '<th style="width:45%">दागिन्याचे नाव / Ornament Name</th>' +
    '<th style="width:20%">नग / Qty</th>' +
    '<th style="width:25%">वजन / Weight (gm)</th>' +
    '<th style="width:10%"></th>' +
    "</tr></thead>" +
    '<tbody id="' +
    containerId +
    '_tbody"></tbody>' +
    "</table>" +
    '<button class="orn-add-btn" onclick="window._ornAddRow(\'' +
    containerId +
    "')\">+ दागिना जोडा / Add Ornament</button>" +
    '<div class="orn-summary" id="' +
    containerId +
    '_summary"></div>';

  window._ornAddRow = function (cid) {
    var tbody = document.getElementById(cid + "_tbody");
    var idx = tbody.rows.length;
    var tr = document.createElement("tr");
    tr.setAttribute("data-idx", idx);
    tr.innerHTML =
      '<td><input class="orn-inp" type="text" placeholder="e.g. Gold Chain / गोल्ड चेन" data-field="name"></td>' +
      '<td><input class="orn-inp" type="number" min="1" placeholder="1" data-field="qty" style="text-align:center"></td>' +
      '<td><input class="orn-inp" type="number" min="0" step="0.01" placeholder="0.00" data-field="weight" style="text-align:center"></td>' +
      '<td style="text-align:center"><button class="orn-del" onclick="this.closest(&quot;tr&quot;).remove();window._ornUpdateSummary(\'' +
      cid +
      "')\">✕</button></td>";
    tbody.appendChild(tr);
    window._ornUpdateSummary(cid);
    tr.querySelector('[data-field="name"]').focus();
    tr.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        window._ornUpdateSummary(cid);
      });
    });
  };

  window._ornUpdateSummary = function (cid) {
    var items = window.getOrnamentItems(cid);
    var totalQty = 0,
      totalWt = 0;
    items.forEach(function (r) {
      totalQty += parseInt(r.qty) || 0;
      totalWt += parseFloat(r.weight) || 0;
    });
    var el = document.getElementById(cid + "_summary");
    if (el && items.length)
      el.textContent =
        "एकूण: " +
        items.length +
        " प्रकार | " +
        totalQty +
        " नग | " +
        totalWt.toFixed(2) +
        " gm";
    else if (el) el.textContent = "";
  };

  window.getOrnamentItems = function (cid) {
    var tbody = document.getElementById((cid || containerId) + "_tbody");
    if (!tbody) return [];
    var items = [];
    Array.from(tbody.rows).forEach(function (tr) {
      var name = (tr.querySelector('[data-field="name"]').value || "").trim();
      var qty = tr.querySelector('[data-field="qty"]').value;
      var weight = tr.querySelector('[data-field="weight"]').value;
      if (name)
        items.push({
          name: name,
          qty: parseFloat(qty) || 1,
          weight: parseFloat(weight) || 0,
        });
    });
    return items;
  };

  // Add first empty row automatically
  window._ornAddRow(containerId);
}

function generateTemplatePDF(txArr, data) {
  const pages = txArr.map((tx) => buildHTMLPage(tx, data)).join("");
  const html = wrapHTML(pages, data.customer_name || "record");
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank");
  if (!tab) {
    toast("Please allow popups to open PDF", "err");
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "JJU_" + (data.customer_name || "record").replace(/\s+/g, "_") + ".html";
    a.click();
  }
}

function wrapHTML(body, name) {
  return `<!DOCTYPE html>
<html lang="mr">
<head>
<meta charset="UTF-8">
<title>JJU — ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@600;700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Noto Sans Devanagari',Arial,sans-serif; background:#ddd; color:#000; font-size:10pt; }

/* PAGE */
.page { background:#fff; width:210mm; min-height:297mm; margin:2mm auto; padding:0;
        box-shadow:0 2px 14px rgba(0,0,0,.25); page-break-after:always; overflow:visible; height:auto; }

/* ORG HEADER */
.ohdr { text-align:center; padding:7px 10px 5px; border-bottom:2.5px solid #000; }
.ohdr-name { font-family:'Noto Serif Devanagari',serif; font-size:13pt; font-weight:700; line-height:1.35; }

/* FORM TITLE */
.ftitle { text-align:center; font-family:'Noto Serif Devanagari',serif;
          font-size:11.5pt; font-weight:700; padding:5px 8px 4px; border-bottom:2px solid #000; background:#fafafa; }

/* ════ INFO TABLE ════
   Fixed 6-col layout matching reference PDF exactly
   col%: 17 | 25 | 13 | 21 | 12 | 12  */
.it { width:100%; border-collapse:collapse; table-layout:fixed; font-size:10pt; }
.it td { border:2px solid #000; padding:5px 8px; vertical-align:middle; overflow-wrap:break-word; line-height:1.5; color:#000; font-weight:700; }
.it .lbl { background:#e0e0e0; font-weight:800; color:#000; font-size:9pt; border-right:2px solid #000; }
.it .val { font-weight:800; font-size:10pt; color:#000; }
.it .vbig { font-weight:900; font-size:12pt; }

/* BODY PARAGRAPH */
.bp { padding:5px 12px; font-size:9pt; line-height:1.7; text-align:justify; color:#000; font-weight:600; }
.bp.yl { background:#fffbee; border-top:1px solid #e5d98a; }
.bp.gr { background:#f9f9f9; border-top:1px dashed #bbb; }

/* VACHANCHITHI */
.vach { border:1.5px solid #000; border-radius:3px; margin:4px 12px; padding:7px 12px; font-size:9pt; line-height:1.8; background:#fff; color:#000; font-weight:600; }
.vach-t { text-align:center; font-weight:700; font-size:10.5pt; padding-bottom:4px; margin-bottom:5px;
          border-bottom:1px solid #bbb; font-family:'Noto Serif Devanagari',serif; }

/* RULES */
.rules { border-top:2px solid #000; padding:5px 14px 5px; }
.rules-t { text-align:center; font-weight:700; font-size:9.5pt; margin-bottom:4px;
           font-family:'Noto Serif Devanagari',serif; padding-bottom:3px; border-bottom:1px solid #000; }
.rule { font-size:7.5pt; line-height:1.55; padding:1px 0 1px 12px; text-indent:-12px; border-bottom:1px dotted #ccc; color:#000; font-weight:600; }
.rule::before { content:"* "; font-weight:700; }

/* RECEIPT SECTION */
.receipt { border-top:1.5px solid #000; padding:5px 14px 6px; font-size:8.5pt; line-height:1.75; color:#000; font-weight:600; }

/* DASHED DIVIDER */
.hrdash { border:none; border-top:1.5px dashed #000; margin:0; }

/* ORNAMENT PHOTO */
.orn-box { border-top:1.5px solid #000; padding:8px 14px; text-align:center; }
.orn-box .olbl { font-size:9pt; font-weight:700; text-align:left; margin-bottom:6px; }
.orn-box img { max-width:140mm; max-height:60mm; border:1.5px solid #555; border-radius:4px; display:block; margin:0 auto; object-fit:contain; }

/* CUSTOMER NAME STAMP (replaces signature line) */
.nm-stamp { display:inline-block; font-weight:800; font-size:10pt; border-bottom:1.5px solid #000;
            padding:0 10px 1px; min-width:80px; text-align:center; color:#000; }

/* ════ SLIP PAGE ════ */
.spage { background:#fff; width:210mm; margin:2mm auto; padding:4px 8px;
         box-shadow:0 2px 14px rgba(0,0,0,.25); page-break-after:always; break-after:always; }
/* Blank page inserted after each slip to prevent backside printing */
.spage-blank { background:#fff; width:210mm; min-height:297mm; margin:2mm auto;
               box-shadow:0 2px 14px rgba(0,0,0,.25); display:block; page-break-after:always; }
.sblock { border:2px solid #000; border-radius:3px; overflow:hidden; margin-bottom:0; }
/* ════ RECEIPT PAGE ════ */
.rpage { background:#fff; width:210mm; margin:2mm auto; padding:3mm 6mm;
         box-sizing:border-box; box-shadow:0 2px 14px rgba(0,0,0,.25); page-break-after:always; }

/* Slip org header */
.sohdr { text-align:center; padding:5px 8px 4px; border-bottom:1.5px solid #000; background:#f0f0f0; }
.sohdr-name { font-family:'Noto Serif Devanagari',serif; font-size:10.5pt; font-weight:800; line-height:1.3; color:#000; }

/* Slip title bar */
.stbar { display:flex; justify-content:space-between; align-items:center;
         padding:3px 10px; border-bottom:1px solid #000; background:#e0e0e0; font-size:9.5pt; font-weight:800; color:#000; }
.stbar .scode { font-size:10pt; font-weight:900; color:#000; }

/* Slip scroll table */
.sst { width:100%; border-collapse:collapse; table-layout:fixed; font-size:9pt; border-top:1px solid #000; }
.sst th { border:1px solid #000; padding:3px 7px; background:#d0d0d0; font-weight:800; font-size:8.5pt; text-align:left; color:#000; }
.sst td { border:1px solid #000; padding:3px 7px; font-weight:800; color:#000; }

/* Slip content table */
.sct { width:100%; border-collapse:collapse; font-size:9.5pt; border-top:1px solid #ddd; }
.sct td { padding:5px 12px; border-bottom:1px solid #ccc; vertical-align:middle; color:#000; font-weight:700; }
.sct tr:last-child td { border-bottom:none; }
.sct .sl { font-weight:800; color:#000; width:40%; font-size:9pt; }
.sct .sv { font-weight:700; }
/* Compact 4-col tabular slip layout */
.compact-slip th { padding:4px 8px; font-size:9pt; font-weight:800; border:1px solid #000; vertical-align:middle; color:#000; }
.compact-slip td { padding:4px 8px; font-size:9.5pt; border:1px solid #000; vertical-align:middle; color:#000; font-weight:700; }
.compact-slip { border-top:none; }

/* Slip body text */
.sbody { padding:5px 12px 7px; font-size:9.5pt; line-height:1.75; color:#000; font-weight:700; }

/* Slip footer */
.sftr { display:flex; justify-content:space-between; align-items:flex-end;
        padding:5px 14px 7px; border-top:1.5px solid #000; font-size:8.5pt; color:#000; font-weight:800; }
.sftr .si { text-align:center; color:#000; font-weight:800; }
.sftr .si-name { font-weight:900; font-size:9pt; border-top:1.5px solid #000; padding-top:3px; margin-top:14px; min-width:50mm; display:block; color:#000; }

/* Dashed separator between slips */
.sdiv { border:none; border-top:2.5px dashed #555; margin:8px 0; }

@media print {
  body { background:none; }
  .page, .spage { margin:0; box-shadow:none; width:100%; }
  .no-print { display:none; }
  .mis-slip-page { margin:0 !important; padding:4mm 6mm !important; page-break-after:avoid !important; page-break-inside:avoid !important; }
}
</style>
<script>window.onload=function(){setTimeout(function(){window.print();},1500);};</script>
</head>
<body>
<div class="no-print" style="background:#1a5c2a;color:#fff;padding:10px 18px;text-align:center;font-size:11pt;font-weight:700;position:sticky;top:0;z-index:99">
  🖨️ Printing automatically &nbsp;|&nbsp;
  <button onclick="window.print()" style="background:#fff;color:#1a5c2a;border:none;border-radius:6px;padding:5px 18px;cursor:pointer;font-weight:800;font-size:10pt;margin-left:8px">🖨️ Print / Save PDF</button>
</div>
${body}
</body></html>`;
}

// ─── Helpers ─────────────────────────────────────────────────
function fv(val, fallback) {
  fallback = fallback === undefined ? "—" : fallback;
  var v = (val || "").toString().trim();
  return v || fallback;
}
function fmtDate(d) {
  if (!d || d === "—") return d;
  try {
    var o = new Date(d);
    if (isNaN(o.getTime())) return d;
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var mons = [
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
    ];
    return (
      days[o.getDay()] +
      ", " +
      String(o.getDate()).padStart(2, "0") +
      "-" +
      mons[o.getMonth()] +
      "-" +
      o.getFullYear()
    );
  } catch (e) {
    return d;
  }
}
// ── Signature line: "Rohit ............. (customer name) ............."
function sigLine(nm, label) {
  // label param kept for API compatibility but no longer shown
  return (
    '<div style="display:inline-flex;flex-direction:column;align-items:center;min-width:60mm;text-align:center">' +
    '<span style="font-weight:800;font-size:10pt">' +
    nm +
    " .................</span>" +
    "</div>"
  );
}
// Full-width signature row (right-aligned applicant sig, left blank line)
function sigRow(nm, label, leftLabel) {
  leftLabel = leftLabel || "";
  return (
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 20px 8px">' +
    '<div style="text-align:center;min-width:55mm">' +
    (leftLabel
      ? '<div style="border-bottom:1px solid #000;height:18px;margin-bottom:4px"></div><div style="font-size:9pt">' +
        leftLabel +
        "</div>"
      : "") +
    "</div>" +
    '<div style="text-align:center">' +
    sigLine(nm) +
    "</div>" +
    "</div>"
  );
}
// Compact photo grid — shows all available photos (shorter to fit on page)
function photoGrid(photos) {
  var valid = photos.filter(function (p) {
    return p && p.src;
  });
  if (!valid.length) return "";
  var items = valid
    .map(function (p) {
      return (
        '<div style="text-align:center;flex:0 0 auto">' +
        '<img src="' +
        p.src +
        '" style="width:42mm;height:45mm;object-fit:cover;border:1px solid #888;border-radius:3px;display:block">' +
        '<div style="font-size:7.5pt;color:#444;margin-top:2px">' +
        p.label +
        "</div>" +
        "</div>"
      );
    })
    .join("");
  return (
    '<div style="border-top:1.5px solid #000;padding:4px 12px 5px">' +
    '<div style="font-size:9pt;font-weight:700;margin-bottom:4px">📷 Documents / Photos</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:6px">' +
    items +
    "</div>" +
    "</div>"
  );
}
// customer name stamp — kept for Gold Loan vachanchithi internal use
function nmStamp(nm) {
  return '<span class="nm-stamp">' + nm + "</span>";
}

// Declaration line added at bottom of all forms and slips
function declLine() {
  return (
    '<div style="border-top:1px dashed #bbb;margin:4px 10px 2px;padding:3px 4px 2px">' +
    '<span style="font-size:7pt;color:#555;line-height:1.4;">' +
    "संपूर्ण माहिती ऑनलाईन पद्धतीने माझ्या समोर भरली असून ती मला माझ्या मातृभाषेत वाचून व समजावून सांगण्यात आली आहे. " +
    "या फॉर्मवर भरलेली सर्व माहिती मला समजली असून ती बरोबर असल्याची खात्री करून मी सही करत आहे." +
    "</span></div>"
  );
}

// ═══════════════════════════════════════════════════════
//  INT RECEIVED ON GOLD LOAN — ACCOUNT VOUCHER
//  Shows all closed GL cases in tabular format
// ═══════════════════════════════════════════════════════
function glIntVoucherPage(closedLoans, dtFmt) {
  var intRows = closedLoans || [];

  // Step 1: Build creditMap and debitMap indexed by scroll_no — mirrors GAS logic
  var creditMap = {};
  var debitMap = {};
  var totalCreditAmount = 0;
  var totalDebitAmount = 0;

  intRows.forEach(function(r) {
    var txType  = (r.tx_type || r.txType || '').trim();
    var scrollNo = String(r.scroll_no || '').trim();
    var name    = (r.name || '—').trim();
    var accNo   = (r.acc_no || '').trim();
    var amount  = parseFloat(r.amount) || 0;
    var loanDate = r.loan_date || '';

    if (txType === 'Credit') {
      creditMap[scrollNo] = { scrollNo: scrollNo, name: name, amount: amount, accNo: '83-1', loanDate: loanDate };
      totalCreditAmount += amount;
    } else if (txType === 'Debit') {
      debitMap[scrollNo] = { scrollNo: scrollNo, name: name, amount: amount, accNo: accNo || '03', loanDate: loanDate };
      totalDebitAmount += amount;
    }
  });

  // Step 2: Match credit and debit by scroll number — only include matched pairs
  var creditData = [];
  var debitData  = [];
  Object.keys(creditMap).forEach(function(scrollNo) {
    if (debitMap[scrollNo]) {
      // Use the loan acc_no from debit row for the credit row's Acc No column (loan account)
      creditMap[scrollNo].loanAccNo = debitMap[scrollNo].accNo;
      creditData.push(creditMap[scrollNo]);
      debitData.push(debitMap[scrollNo]);
    }
  });

  // Step 3: If totals don't match, force debit = credit (mirrors GAS)
  if (totalCreditAmount !== totalDebitAmount) {
    totalDebitAmount = totalCreditAmount;
  }

  function fmtRs(n) {
    return '\u20b9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  function mkRows(rows, useGLAcc) {
    return rows.map(function(r, i) {
      return (
        '<tr style="' + (i % 2 === 0 ? 'background:#fff' : 'background:#f9f9f9') + '">' +
        '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center;font-size:8.5pt">' + (r.scrollNo || (i + 1)) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;font-weight:700">' + (r.name || '—') + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:right">' + fmtRs(r.amount) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:center">' + (useGLAcc ? r.accNo : (r.loanAccNo || r.accNo)) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:center">' + (r.loanDate || '—') + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function mkTable(rows, total, useGLAcc) {
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:6px">' +
      '<tr style="background:#1a3a5c;color:#fff">' +
      '<th style="border:1px solid #000;padding:4px 8px;width:8%;text-align:center">Scroll No</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:35%;text-align:left">Name</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:15%;text-align:right">Int Amt</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:20%;text-align:center">Acc No</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:22%;text-align:center">Loan Date</th>' +
      '</tr>' +
      (mkRows(rows, useGLAcc) || '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;color:#aaa">No entries</td></tr>') +
      '<tr style="background:#fffde7;font-weight:800">' +
      '<td colspan="2" style="border:1px solid #999;padding:4px 8px;text-align:right;font-size:8.5pt">Total Amount:</td>' +
      '<td style="border:1px solid #999;padding:4px 8px;text-align:right;font-size:8.5pt">' + fmtRs(total) + '</td>' +
      '<td colspan="2" style="border:1px solid #999;padding:4px 8px;font-size:8pt;color:#555">(' + numberToWords(total) + ')</td>' +
      '</tr>' +
      '</table>'
    );
  }

  var sigBlock =
    '<div style="display:flex;justify-content:space-between;padding:16px 20px 8px;border-top:1.5px solid #000;margin-top:12px">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:20px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">लेखापाल / खातेपाल</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:20px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">व्यवस्थापक / अधिकारी</div></div>' +
    '</div>';

  var hdr = '** जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव जामोद र.नं. १०६७ **';

  // Page 1 — Credit Voucher (Acc 83-1) — useGLAcc=true shows 83-1
  var page1 =
    '<div class="page">' +
    '<div style="text-align:center;font-weight:800;font-size:10pt;margin-bottom:2px">' + hdr + '</div>' +
    '<div style="text-align:center;font-size:9pt;margin-bottom:6px">Date - ' + (dtFmt || '—') + '</div>' +
    '<div style="font-size:9pt;margin-bottom:4px"><strong>Credit Voucher</strong> by 12 % Int - <strong>Interest Received On Gold Loan TRF</strong> &nbsp;&nbsp; Acc Code - <strong>83-1</strong></div>' +
    mkTable(creditData, totalCreditAmount, true) +
    sigBlock +
    '<div style="border-top:1px dashed #aaa;margin-top:10px"></div>' +
    '</div>';

  // Page 2 — Debit Voucher (Acc 03) — useGLAcc=false shows loan acc_no
  var page2 =
    '<div class="page">' +
    '<div style="text-align:center;font-weight:800;font-size:10pt;margin-bottom:2px">' + hdr + '</div>' +
    '<div style="text-align:center;font-size:9pt;margin-bottom:6px">Date - ' + (dtFmt || '—') + '</div>' +
    '<div style="font-size:9pt;margin-bottom:4px"><strong>Debit Voucher</strong> by 12 % Int - <strong>Gold Loan TRF</strong> &nbsp;&nbsp; Acc Code - <strong>03</strong></div>' +
    mkTable(debitData, totalDebitAmount, false) +
    sigBlock +
    '<div style="border-top:1px dashed #aaa;margin-top:10px"></div>' +
    '</div>';

  return page1 + page2;
}

// ─── FD-OD Interest Voucher (Acc 277-1 Credit / Acc 17 Debit) ───────────────
function fdodIntVoucherPage(intRows, dtFmt) {
  intRows = intRows || [];

  // Build maps indexed by scroll_no — same logic as GL voucher
  var creditMap = {}, debitMap = {};
  var totalCreditAmount = 0, totalDebitAmount = 0;

  intRows.forEach(function(r) {
    var txType   = (r.tx_type || r.txType || '').trim();
    var scrollNo = String(r.scroll_no || '').trim();
    var name     = (r.name || '—').trim();
    var accNo    = (r.acc_no || '').trim();
    var amount   = parseFloat(r.amount) || 0;
    var loanDate = r.loan_date || '';

    if (txType === 'Credit') {
      creditMap[scrollNo] = { scrollNo: scrollNo, name: name, amount: amount, accNo: '277-1', loanDate: loanDate };
      totalCreditAmount += amount;
    } else if (txType === 'Debit') {
      debitMap[scrollNo] = { scrollNo: scrollNo, name: name, amount: amount, accNo: accNo || '17', loanDate: loanDate };
      totalDebitAmount += amount;
    }
  });

  // Match credit & debit by scroll number
  var creditData = [], debitData = [];
  Object.keys(creditMap).forEach(function(scrollNo) {
    if (debitMap[scrollNo]) {
      creditMap[scrollNo].loanAccNo = debitMap[scrollNo].accNo;
      creditData.push(creditMap[scrollNo]);
      debitData.push(debitMap[scrollNo]);
    }
  });

  // Force totals to match
  if (totalCreditAmount !== totalDebitAmount) totalDebitAmount = totalCreditAmount;

  function fmtRs(n) {
    return '\u20b9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }

  function mkRows(rows, useGLAcc) {
    return rows.map(function(r, i) {
      return (
        '<tr style="' + (i % 2 === 0 ? 'background:#fff' : 'background:#f9f9f9') + '">' +
        '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center;font-size:8.5pt">' + (r.scrollNo || (i + 1)) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;font-weight:700">' + (r.name || '—') + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:right">' + fmtRs(r.amount) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:center">' + (useGLAcc ? r.accNo : (r.loanAccNo || r.accNo)) + '</td>' +
        '<td style="border:1px solid #ccc;padding:4px 8px;font-size:8.5pt;text-align:center">' + (r.loanDate || '—') + '</td>' +
        '</tr>'
      );
    }).join('');
  }

  function mkTable(rows, total, useGLAcc) {
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:6px">' +
      '<tr style="background:#1a3a5c;color:#fff">' +
      '<th style="border:1px solid #000;padding:4px 8px;width:8%;text-align:center">Scroll No</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:35%;text-align:left">Name</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:15%;text-align:right">Int Amt</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:20%;text-align:center">Acc No</th>' +
      '<th style="border:1px solid #000;padding:4px 8px;width:22%;text-align:center">Loan Date</th>' +
      '</tr>' +
      (mkRows(rows, useGLAcc) || '<tr><td colspan="5" style="border:1px solid #ccc;padding:8px;text-align:center;color:#aaa">No entries</td></tr>') +
      '<tr style="background:#fffde7;font-weight:800">' +
      '<td colspan="2" style="border:1px solid #999;padding:4px 8px;text-align:right;font-size:8.5pt">Total Amount:</td>' +
      '<td style="border:1px solid #999;padding:4px 8px;text-align:right;font-size:8.5pt">' + fmtRs(total) + '</td>' +
      '<td colspan="2" style="border:1px solid #999;padding:4px 8px;font-size:8pt;color:#555">(' + numberToWords(total) + ')</td>' +
      '</tr>' +
      '</table>'
    );
  }

  var sigBlock =
    '<div style="display:flex;justify-content:space-between;padding:16px 20px 8px;border-top:1.5px solid #000;margin-top:12px">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:20px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">लेखापाल / खातेपाल</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:20px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">व्यवस्थापक / अधिकारी</div></div>' +
    '</div>';

  var hdr = '** जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव जामोद र.नं. १०६७ **';

  // Page 1 — Credit Voucher (Acc 277-1)
  var page1 =
    '<div class="page">' +
    '<div style="text-align:center;font-weight:800;font-size:10pt;margin-bottom:2px">' + hdr + '</div>' +
    '<div style="text-align:center;font-size:9pt;margin-bottom:6px">Date - ' + (dtFmt || '—') + '</div>' +
    '<div style="font-size:9pt;margin-bottom:4px"><strong>Credit Voucher</strong> - <strong>Interest Received On FD-OD TRF</strong> &nbsp;&nbsp; Acc Code - <strong>277-1</strong></div>' +
    mkTable(creditData, totalCreditAmount, true) +
    sigBlock +
    '<div style="border-top:1px dashed #aaa;margin-top:10px"></div>' +
    '</div>';

  // Page 2 — Debit Voucher (Acc 17)
  var page2 =
    '<div class="page">' +
    '<div style="text-align:center;font-weight:800;font-size:10pt;margin-bottom:2px">' + hdr + '</div>' +
    '<div style="text-align:center;font-size:9pt;margin-bottom:6px">Date - ' + (dtFmt || '—') + '</div>' +
    '<div style="font-size:9pt;margin-bottom:4px"><strong>Debit Voucher</strong> - <strong>FD OD TRF</strong> &nbsp;&nbsp; Acc Code - <strong>17</strong></div>' +
    mkTable(debitData, totalDebitAmount, false) +
    sigBlock +
    '<div style="border-top:1px dashed #aaa;margin-top:10px"></div>' +
    '</div>';

  return page1 + page2;
}

// ─── Bank TRF Vouchers (individual voucher per transaction) ──────────────────
function bankTRFVoucherPage(bankRows, dtFmt) {
  bankRows = bankRows || [];

  // Separate Debit and Credit — GAS processes Debit first, then Credit
  var debitRows  = bankRows.filter(function(r) { return (r.tx_type || '').trim() === 'Debit'; });
  var creditRows = bankRows.filter(function(r) { return (r.tx_type || '').trim() === 'Credit'; });

  var hdr = '** जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव जामोद र.नं. १०६७ **';

  function fmtRs(n) {
    return '\u20b9' + Number(n || 0).toFixed(2);
  }

  function mkVoucher(r, transMode) {
    var accType  = (r.acc_type || r.task || '—').trim();
    var scrollNo = r.scroll_no || '—';
    var name     = r.name || '—';
    var accNo    = r.acc_no || '—';
    var amount   = parseFloat(r.amount) || 0;
    var upiId    = r.upi_rrn || '';

    return (
      '<div class="page">' +
      '<div style="text-align:center;font-weight:800;font-size:10pt;margin-bottom:1mm">' + hdr + ' &nbsp;&nbsp;&nbsp; Date - ' + (dtFmt || '—') + '</div>' +
      '<div style="font-size:9pt;margin-bottom:3mm">Voucher for Bank Transactions - <strong>' + accType + '</strong> (<strong>' + transMode + '</strong>)' +
        (upiId ? ' (* UPI Id- ' + upiId + ')' : '') + '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-bottom:4mm">' +
      '<tr style="background:#d9d9d9;font-weight:700">' +
      '<th style="border:1px solid #999;padding:4px 8px">Scroll No</th>' +
      '<th style="border:1px solid #999;padding:4px 8px;text-align:left">Name</th>' +
      '<th style="border:1px solid #999;padding:4px 8px;text-align:left">Acc Type</th>' +
      '<th style="border:1px solid #999;padding:4px 8px;text-align:center">Acc No</th>' +
      '<th style="border:1px solid #999;padding:4px 8px;text-align:right">Amount</th>' +
      '</tr>' +
      '<tr>' +
      '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center">' + scrollNo + '</td>' +
      '<td style="border:1px solid #ccc;padding:4px 8px;font-weight:700"> ' + name + '</td>' +
      '<td style="border:1px solid #ccc;padding:4px 8px"> ' + accType + '</td>' +
      '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center"> ' + accNo + '</td>' +
      '<td style="border:1px solid #ccc;padding:4px 8px;text-align:right;font-weight:700">' + fmtRs(amount) + '</td>' +
      '</tr>' +
      '</table>' +
      '<div style="font-size:8.5pt;margin-bottom:6mm">Total Amount: ' + fmtRs(amount) + ' (' + numberToWords(amount) + ')</div>' +
      '<div style="height:12mm"></div>' +
      '<div style="display:flex;justify-content:space-between;padding:0 20px;border-top:1.5px solid #000;padding-top:6px">' +
      '<div style="text-align:center;font-size:9pt">लेखापाल / खातेपाल</div>' +
      '<div style="text-align:center;font-size:9pt">व्यवस्थापक / अधिकारी</div>' +
      '</div>' +
      '<div style="border-top:1px dashed #aaa;margin-top:8mm"></div>' +
      '</div>'
    );
  }

  // Debit vouchers first, then Credit vouchers — mirrors GAS order
  var pages = '';
  debitRows.forEach(function(r)  { pages += mkVoucher(r, 'Debit'); });
  creditRows.forEach(function(r) { pages += mkVoucher(r, 'Credit'); });

  return pages || '<div class="page"><p style="text-align:center;padding:20mm;color:#aaa">No Bank TRF entries found</p></div>';
}

// Helper: number to words for voucher total
function numberToWords(n) {
  var num = Math.round(n || 0);
  if (num === 0) return 'Zero';
  var ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  var tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function hw(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + hw(n%100) : '');
    if (n < 100000) return hw(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + hw(n%1000) : '');
    if (n < 10000000) return hw(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + hw(n%100000) : '');
    return hw(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + hw(n%10000000) : '');
  }
  return hw(num);
}

// ─── Dispatch ────────────────────────────────────────────────
function buildHTMLPage(txType, data) {
  var nm = fv(data.customer_name);
  var addr = fv(data.address);
  var dtFmt = fmtDate(fv(data.date));
  var mob = fv(data.mobile);
  var aadh = fv(data.aadhar);
  var cid = fv(data.customer_id);
  var savAcc = fv(data.saving_acc_no);
  var shrAcc = fv(data.share_acc_no);
  var lnAcc = fv(data.loan_acc_no);
  var fdAcc = fv(data.fd_acc_no);
  var fdPv = fv(data.fd_parvati_no);
  var pan = fv(data.pan);
  var dob = fv(data.dob);
  var nom = fv(data.nominee_name);
  var nomRel = fv(data.nominee_relation);
  var ref = fv(data.referral);
  var lnAmt = fv(data.loan_amount);
  var lnWrd = fv(data.loan_amount_words);
  var fdAmt = fv(data.fd_amount);
  var fdWrd = fv(data.fd_amount_words);
  var fdPrd = fv(data.fd_period);
  var fdRate = fv(data.fd_interest_rate);
  var fdMat = fv(data.fd_maturity_date);
  var fdMatAmt = fv(data.fd_maturity_amount);
  var fdMatWrd = fv(data.fd_maturity_words);
  var ornWt = fv(data.ornament_weight);
  var ornQty = fv(data.ornament_qty);
  var goldOrn = fv(data.gold_ornaments);
  var silvOrn = fv(data.silver_ornaments);
  // New per-item ornament list: data.ornament_items = [{name, qty, weight}, ...]
  var ornItems =
    data.ornament_items &&
    Array.isArray(data.ornament_items) &&
    data.ornament_items.length
      ? data.ornament_items.filter(function (r) {
          return r.name && r.name.trim();
        })
      : null;
  // Compute totals from items if available
  if (ornItems && ornItems.length) {
    var _totalQty = 0,
      _totalWt = 0,
      _goldNames = [],
      _silvNames = [];
    ornItems.forEach(function (r) {
      _totalQty += parseInt(r.qty) || 0;
      _totalWt +=
        r.weight !== null && r.weight !== undefined
          ? parseFloat(r.weight) || 0
          : 0;
      var nm_lower = (r.name || "").toLowerCase();
      if (nm_lower.indexOf("silver") !== -1 || nm_lower.indexOf("चांदी") !== -1)
        _silvNames.push(r.name);
      else _goldNames.push(r.name);
    });
    if (data.ornament_qty == null)
      ornQty = _totalQty > 0 ? String(_totalQty) : ornQty;
    if (data.ornament_weight == null)
      ornWt = _totalWt != null ? String(_totalWt) : ornWt;
    if (!data.gold_ornaments) goldOrn = _goldNames.join(", ") || goldOrn;
    if (!data.silver_ornaments) silvOrn = _silvNames.join(", ") || silvOrn;
  }
  var metal = fv(data.metal_type, "Gold");
  var comments = fv(data.comments);
  var misAccNo = fv(data.mis_acc_no);
  var misMonth = fv(data.mis_month_select);
  var intAmt = fv(data.interest_amount);
  var intWrd = fv(data.interest_amount_words);
  var depAmt = fv(data.deposit_amount); // saving deposit/withdrawal amount
  var depWrd = fv(data.deposit_amount_words);
  var savBal = data.saving_balance != null ? String(data.saving_balance) : null;
  var bankName = data.bank_acc_name ? String(data.bank_acc_name).trim() : "";
  var photoOrn = data.photo_ornament || null;
  var photoCust = data.photo_customer || null;
  var photoAF = data.photo_aadhar_front || null;
  var photoAB = data.photo_aadhar_back || null;
  var photoPan = data.photo_pan || null;

  // Build compact photo array for non-gold forms
  var docPhotos = [
    { src: photoCust, label: "Customer Photo" },
    { src: photoAF, label: "Aadhar Front" },
    { src: photoAB, label: "Aadhar Back" },
    { src: photoPan, label: "PAN Card" },
  ];

  if (txType === "Int Recv GL Voucher")
    return glIntVoucherPage(data._closedLoans || [], dtFmt);

  if (txType === "Int Recv FDOD Voucher")
    return fdodIntVoucherPage(data._closedLoans || [], dtFmt);

  if (txType === "Bank TRF Voucher")
    return bankTRFVoucherPage(data._bankRows || [], dtFmt);

  if (txType === "Gold Loan")
    return goldLoanPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      lnAcc,
      pan,
      nom,
      nomRel,
      lnAmt,
      lnWrd,
      ornWt,
      ornQty,
      goldOrn,
      silvOrn,
      metal,
      comments,
      photoOrn,
      null,
      ornItems,
    );
  if (txType === "Slips - Loan")
    return loanSlipPage(
      nm,
      dtFmt,
      lnAmt,
      lnWrd,
      lnAcc,
      savAcc,
      photoCust,
      ornItems,
      ornWt,
      ornQty,
      goldOrn,
      silvOrn,
    );
  if (txType === "Gold Receipt")
    return goldReceiptPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      lnAcc,
      lnAmt,
      lnWrd,
      ornWt,
      ornQty,
      goldOrn,
      silvOrn,
      metal,
      ornItems,
    );
  if (txType === "Sadasya")
    return sadasya_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      pan,
      dob,
      nom,
      nomRel,
      ref,
      comments,
      docPhotos,
    );
  if (txType === "Sadasya - Slips")
    return sadasya_SlipsPage(nm, dtFmt, savAcc, shrAcc);
  if (txType === "Naammatr Sabhasad Account")
    return naammatr_FormPage(nm, addr, dtFmt, dob, shrAcc, ref, docPhotos);
  if (txType === "Naammatr Sabhasad - Slips")
    return naammatr_SlipsPage(nm, dtFmt, savAcc, shrAcc);
  if (txType === "Saving Account")
    return savingAccount_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      pan,
      dob,
      nom,
      nomRel,
      ref,
      comments,
      docPhotos,
    );
  if (txType === "Saving - Deposit Slip") {
    // For new saving account opening, saving_balance is the opening deposit amount
    var _sdAmt = depAmt || fdAmt || lnAmt;
    var _sdWrd = depWrd;
    if (!_sdAmt && savBal) {
      var _sdBalNum = parseFloat(String(savBal).replace(/,/g, '')) || 0;
      if (_sdBalNum > 0) {
        _sdAmt = _sdBalNum.toLocaleString('en-IN');
        if (!_sdWrd) _sdWrd = numberToWords(_sdBalNum);
      }
    }
    return savingDepositSlipPage(nm, dtFmt, savAcc, _sdAmt, _sdWrd, bankName, savBal, true);
  }
  if (txType === "Saving - Withdrawal Slip")
    return savingWithdrawalSlipPage(
      nm,
      dtFmt,
      savAcc,
      depAmt || fdAmt || lnAmt,
      depWrd,
      bankName,
      savBal,
    );
  if (txType === "Saving Deposit")
    return savingDepositSlipPage(
      nm,
      dtFmt,
      savAcc,
      depAmt || fdAmt || lnAmt,
      depWrd,
      bankName,
      savBal,
    );
  if (txType === "Saving Withdrawal")
    return savingWithdrawalSlipPage(
      nm,
      dtFmt,
      savAcc,
      depAmt || fdAmt || lnAmt,
      depWrd,
      bankName,
      savBal,
    );
  if (txType === "Fixed Deposit" || txType === "New FD")
    return fd_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      fdAcc,
      fdPv,
      pan,
      dob,
      nom,
      nomRel,
      ref,
      fdAmt,
      fdWrd,
      fdPrd,
      fdRate,
      fdMat,
      fdMatAmt,
      fdMatWrd,
      comments,
      docPhotos,
    );
  if (txType === "FD - Slips")
    return fd_SlipsPage(nm, dtFmt, savAcc, fdAcc, fdPv, fdAmt, fdWrd);
  if (txType === "Form 60-61")
    return form6061Page(nm, addr, dtFmt);
  if (txType === "OD Loan" || txType === "New FD-OD Loan")
    return od_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      fdAcc,
      fdPv,
      lnAcc,
      pan,
      dob,
      nom,
      nomRel,
      lnAmt,
      lnWrd,
      fdAmt,
      fdWrd,
      fdMat,
      comments,
      docPhotos,
    );
  if (txType === "Closing - Loan")
    return loanClosing_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      lnAcc,
      pan,
      nom,
      nomRel,
      lnAmt,
      lnWrd,
      goldOrn,
      silvOrn,
      ornWt,
      comments,
      photoOrn,
      ornItems,
    );
  if (txType === "Closing - FD")
    return fdClosing_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      fdAcc,
      fdPv,
      pan,
      nom,
      nomRel,
      fdAmt,
      fdWrd,
      fdPrd,
      fdMat,
      fdMatAmt,
      fdMatWrd,
      comments,
      docPhotos,
    );
  if (txType === "Closing - FD - Slips")
    return fdClosingSlips_Page(
      nm,
      dtFmt,
      savAcc,
      fdAcc,
      fdMatAmt,
      fdMatWrd,
      fdAmt,
      fdWrd,
    );
  if (txType === "Closing - Saving Account")
    return savingClosing_FormPage(
      nm,
      addr,
      dtFmt,
      mob,
      aadh,
      cid,
      savAcc,
      shrAcc,
      pan,
      comments,
      docPhotos,
    );

  // MIS Interest: only slips, no form page
  if (txType === "MIS Interest") return "";
  if (txType === "MIS Interest - Slips")
    return misInterestSlipsPage(
      nm,
      dtFmt,
      savAcc,
      misAccNo,
      fdAmt,
      fdWrd,
      fdPrd,
      fdRate,
      fdMat,
      intAmt,
      intWrd,
      misMonth,
    );

  // Bank transaction voucher (3 slips: deposit + withdrawal + voucher)
  var bankTxTypes = [
    "Payment Received - Online",
    "Payment Transfer - Online",
    "RTGS",
    "Bank Charges",
    "Other Bank - Cash Withdrawal",
    "Other Bank - Cash Deposit",
    "TDS",
    "Interest Received on FD from Other Bank",
  ];
  if (bankTxTypes.includes(txType)) {
    var expAmt2 = fv(data.expense_amount);
    var expWrd2 = fv(data.expense_amount_words);
    var expAcc2 = fv(data.expense_acc_no);
    var bankNm2 = fv(data.bank_acc_name);
    var upiRrn2 = fv(data.upi_rrn);
    var chqNo2 = fv(data.cheque_no);
    return bankTransactionVoucherPage(
      txType,
      nm,
      dtFmt,
      savAcc,
      bankNm2,
      expAcc2,
      expAmt2,
      expWrd2,
      upiRrn2,
      chqNo2,
      comments,
    );
  }

  if (txType === "Employee Salary") {
    var salAmt = fv(data.expense_amount);
    var salWrd = fv(data.expense_amount_words);
    var salMon = fv(data.salary_month_select, "");
    return employeeSalaryPage(
      nm,
      dtFmt,
      savAcc,
      salAmt,
      salWrd,
      salMon,
      comments,
    );
  }

  return genericPage(
    txType,
    data,
    nm,
    addr,
    dtFmt,
    savAcc,
    shrAcc,
    lnAcc,
    fdAcc,
    fdPv,
    pan,
    dob,
    nom,
    nomRel,
    ref,
    lnAmt,
    lnWrd,
    fdAmt,
    fdWrd,
    fdPrd,
    fdRate,
    fdMat,
    fdMatAmt,
    fdMatWrd,
    ornWt,
    goldOrn,
    silvOrn,
    metal,
    comments,
    cid,
    aadh,
    mob,
  );
}

// ═══════════════════════════════════════════════════════
//  GOLD LOAN PAGE
// ═══════════════════════════════════════════════════════
function goldLoanPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  lnAcc,
  pan,
  nom,
  nomRel,
  lnAmt,
  lnWrd,
  ornWt,
  ornQty,
  goldOrn,
  silvOrn,
  metal,
  comments,
  photoOrn,
  docPhotos,
  ornItems,
) {
  var sabNo = cid !== "—" ? "#" + cid : "—";

  // ── 6-column info table (fixed layout) ──
  // Widths: 17% | 25% | 13% | 21% | 12% | 12%
  // Rows match reference PDF exactly:
  // 1: पूर्ण नाव [val colspan3] | कर्ज खाते क्र. | val
  // 2: पत्ता [val colspan3]     | बचत खाते क्र.  | val
  // 3: कर्ज दि. [val colspan3] | सभासद क्र.     | val
  // 4: आधार कार्ड | val | शेअर खाते क्र. | val [colspan3]
  // 5: कर्ज रक्कम | val(words) | कर्ज रक्कम | val(Rs.) [colspan3]
  // 6: पॅन कार्ड | val | मो.न. | val | वारसदाराचे नाव | val+नाते
  var infoTbl =
    '<table class="it" style="margin:0">' +
    '<colgroup><col style="width:17%"><col style="width:25%"><col style="width:13%"><col style="width:21%"><col style="width:12%"><col style="width:12%"></colgroup>' +
    "<tr>" +
    '<td class="lbl">पूर्ण नाव</td>' +
    '<td class="vbig" colspan="3">' +
    nm +
    "</td>" +
    '<td class="lbl">कर्ज खाते क्र.</td>' +
    '<td class="vbig">' +
    lnAcc +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">पत्ता</td>' +
    '<td class="val" colspan="3">' +
    addr +
    "</td>" +
    '<td class="lbl">बचत खाते क्र.</td>' +
    '<td class="vbig">' +
    savAcc +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">कर्ज दि.</td>' +
    '<td class="vbig" colspan="3">' +
    dtFmt +
    "</td>" +
    '<td class="lbl">सभासद क्र.</td>' +
    '<td class="val">' +
    sabNo +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">आधार कार्ड</td>' +
    '<td class="val">' +
    aadh +
    "</td>" +
    '<td class="lbl" style="font-size:8.5pt">वारसदाराचे नाव</td>' +
    '<td class="val" colspan="3">' +
    nom +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">पॅन कार्ड</td>' +
    '<td class="val">' +
    pan +
    "</td>" +
    '<td class="lbl">मो.न.</td>' +
    '<td class="val">' +
    mob +
    "</td>" +
    '<td class="lbl" style="font-size:8pt">शेअर खाते क्र.</td>' +
    '<td class="val" style="font-size:8.5pt">' +
    shrAcc +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl" style="white-space:nowrap">कर्ज रक्कम (Rs.)</td>' +
    '<td class="val" colspan="5" style="font-weight:800">रू. ' +
    lnAmt +
    ' /- <span style="font-weight:400;font-size:9pt">( अक्षरी रू. ' +
    lnWrd +
    " )</span></td>" +
    "</tr>" +
    "</table>";

  // ── Request Letter ──
  var reqLetter =
    '<div class="bp yl" style="padding:4px 10px;font-size:8.5pt;line-height:1.65">' +
    "प्रति,<br>" +
    "व्यवस्थापक , जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसायटी लि., जळगाव जामोद<br><br>" +
    "महोदय, मी खालील सही करणार आपणाकडे खालील दिलेल्या तपशिलाप्रमाणे माझ्या मालकीचे सोने/ चांदी , सोन्या - चांदी चे दागीने, चिजवस्तू आपणाकडे " +
    "तारण ठेवत आहे. त्याच्या तारणावर मला <strong>रू." +
    lnAmt +
    "/- (अक्षरी रू. " +
    lnWrd +
    ")</strong> कर्ज द्यावे ही विनंती. माझे वार्षिक उत्पन्न " +
    "रुपये______ इतके आहे. सदर रक्कम_______ कामाकरीता पाहीजे आहे. कर्जाची परतफेड मी दरमहा रू……….... प्रमाणे करेल. कर्ज प्रकारणात तारण देत " +
    "असलेले सोने, चांदी, सोनेचांदीचे दागिने / चिजवस्तू पूर्णपणे माझ्या मालकीचे आहेत. भविष्यात त्याबाबत कोणताही वाद उपस्थित झाल्यास त्यास मी वैयक्तिक " +
    "त्याचप्रमाणे माझी मालमत्ता माझे इस्टेट वारस जबाबदार राहील. ह्या कर्ज योजनेबाबत आपल्या संस्थेला लागू असलेले नियम व अटी, शर्ती बाबत मी वाचून " +
    "समजून घेतल्या असून त्या मला मान्य आहेत. ह्या मध्ये संस्थेचे सचालक मंडळाच्या शासनाच्या धोरणामुळे वेळोवेळी होणारे बदल मला मान्य राहतील. व " +
    "माझेवर व माझ्या ईस्टेट वारसास लागू राहतील. मी हे शपथेवर नमुद करतो, वर नमुद केलेल्या सोने, चांदी व सोनेचांदी चे आभूषण , चिजवस्तू ह्या माझे " +
    "वैयक्तिक मालकीचे आहेत ते स्त्रीधन नाही. प्रस्तुत कर्ज प्रकरणामध्ये नमुद केलेली कोणतीही माहिती व वस्तस्थिती नमुद केल्याप्रमाणे नसल्यास मी फौजदारी " +
    "कायद्याप्रमाणे कारवाईस पात्र राहील." +
    '<div style="text-align:right;margin-top:7px">' +
    sigLine(nm, "कर्जदाराची सही") +
    "</div>" +
    "</div>";

  // ── Approval section ──
  var approval =
    '<div class="bp gr" style="padding:4px 10px;font-size:8.5pt;line-height:1.65">' +
    "श्री/श्रीमती <strong>" +
    nm +
    "</strong> याना मागील तपशिलाप्रमाणे सोने/चांदी च्या बाजारभाव किंमत /- इतकी " +
    "असून त्यावर 85 टक्के प्रमाणे तारण कर्ज रक्कम रूपये <strong>" +
    lnAmt +
    "/- मंजूर करण्यात येत आहे</strong>. " +
    "ते संचालक मंडळाच्या दि.&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;/2025 सभेतील ठराव क्र……......नुसार कर्ज प्रकरण मंजूर/कायम करण्यात येत आहे." +
    '<div style="display:flex;justify-content:space-between;margin-top:8px">' +
    '<div>परिचय करून देणाऱ्याचे नाव व पत्ता<br><span style="display:inline-block;border-bottom:1px solid #000;min-width:130px;height:18px">&nbsp;</span></div>' +
    '<div style="text-align:center">सही<br><span style="display:inline-block;border-bottom:1px solid #000;min-width:80px;height:18px">&nbsp;</span></div>' +
    '<div style="text-align:right">प्राधिकृत अधिकारी…..…………………………</div>' +
    "</div>" +
    "</div>";

  // ── Vachanchithi ──
  var vach =
    '<div class="vach" style="margin:3px 8px;padding:4px 10px;font-size:8.5pt;line-height:1.7">' +
    '<div class="vach-t" style="font-size:9.5pt;padding-bottom:2px;margin-bottom:3px">* वचनचिठ्ठी *</div>' +
    "मी <strong>" +
    nm +
    "</strong> , 'जळगाव जामोद अर्बन को-ऑप क्रेडीट सोसा मर्या जळगाव (जा) यास<br>" +
    "अगर ती लिहून देईल त्यास मी कर्ज घेतलेली रक्कम <strong>Rs. " +
    lnAmt +
    " /-</strong><br>" +
    "अक्षरी रू.<strong>" +
    lnWrd +
    "</strong>&nbsp;&nbsp; द.सा.द.शे. रू.………… प्रमाणे दरमहा व्याज आकारणी<br>" +
    "पध्दतीनुसार माझेकडे मागणी केली जाईल त्यावेळी व त्या ठिकाणी परत करण्याचे वचन देतो." +
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>कर्जदाराची सही........................</strong>' +
    "</div>";

  // ── Full Rules (from reference document) ──
  var rules =
    '<div class="rules" style="padding:3px 10px 3px">' +
    '<div class="rules-t" style="font-size:8.5pt;margin-bottom:2px;padding-bottom:2px">* सोने किंवा चांदी चे तारणावर दिल्या जाणाऱ्या कर्ज बाबत चे नियम *</div>' +
    '<div class="rule">सोने किंवा चांदीचे तारणावर कर्ज घेणारा इसम या संस्थेचा कायम, मानद किंवा नाममात्र सभासद असावा.</div>' +
    '<div class="rule">हे कर्ज जास्तीत जास्त १२ महिने मुदतीचे राहील. प्रत्येक खात्याला स्टेशनरी चार्जेस संस्थेच्या नियमाप्रमाणे लागु असतील.</div>' +
    '<div class="rule">या कर्ज साठी तारण ठेवण्याच्या सोने किंवा चांदीच्या वस्तु, दागिनेची शुद्धता किंमत व वजन संस्थेने नेमलेल्या अधिकृत सराफाकडून किंवा संस्थेचे अधिकारी ला मान्य झाल्यानंतरच कर्ज मंजुर करण्यात येईल.</div>' +
    '<div class="rule">सराफाने ठरवून दिलेल्या किंमतीच्या संस्थेचे निश्चित केलेल्या टक्केवारीप्रमाणे कर्ज कर्जदारास दिले जाईल. परंतु असे कर्ज कमीत कमीत रुपये ५००/- व जास्तीत जास्त संस्थेच्या नियमानुसार असावे.</div>' +
    '<div class="rule">तारण वस्तुची शुद्धता ठरविण्याबाबत सराफास द्यावयाची फी संस्थेच्या नियमाप्रमाणे देणे आवश्यक आहे.</div>' +
    '<div class="rule">कर्ज परतफेडीच्या मुदतीत कर्जदाराचे कर्जचे पूर्णपणे व्याजासह फेड करुन तारण दिलेल्या वस्तु सोडवून घेतल्या पाहिजे. मुदतीपूर्वी कर्जफेड न केल्यास कर्जदारास १५ दिवसाची रजिस्टर्ड नोटीस द्वारे याबाबत जाणीव करुन दिली जाईल. तरी देखील कर्जदाराने परतफेड न केल्यास तारण सोने, सोन्याचे किंवा चांदीचे दागिने जाहीर लिलावाने किंवा अधिकृत परवानाधारक सराफास सोने बाजारात विक्री करण्यात येईल. अशा रितीने विक्री करून आलेली रक्कम मुदत व्याज यापेक्षा कमी असल्यास उरलेली रक्कम सभासदाकडून वसुल करण्यात येईल व ही कमी रक्कम भरण्याची जबाबदारी सभासदाची राहील. कर्जदार सभासदाच्या पत्त्यामध्ये व मोबाईल नंबरमध्ये बदल झाल्यास तो कळविण्याची जबाबदारी कर्जदाराची राहील. असे न केल्यास व त्यामुळे पत्रव्यवहार अपूर्ण राहिल्यास त्यासाठी संस्था जबाबदार राहणार नाही.</div>' +
    '<div class="rule">मौल्यवान तारण वस्तुची अधिकृत किंमत, वजन व त्याची प्रत तारणावर दिलेले कर्ज वगैरे दर्शविणारे रजिस्टर ठेवले जाईल.</div>' +
    '<div class="rule">कर्जदराला या कर्जबाबत संस्थेकडे डिमाड प्रोमिसरी नोट लिहून द्यावी लागेल. कर्जफेडीनंतर कर्जदारास माल ताब्यात मिळ्याबात पोच पावती यादी लागेल.</div>' +
    '<div class="rule">तारण द्यावयाचे सोने, चांदी किंवा सोन्या-चांदीचे दागिने एकापेक्षा जास्त व्यक्तीचे, मालकीचे असल्यास तसा उल्लेख कर्जदारास अर्जत करावा लागेल व अर्ज वर हक्कदार व्यक्तीच्या सह्या घ्याव्या लागतील. माल परत करताना तो कोणास द्यावा याचाही अर्जत खुलासा करावा लागेल.</div>' +
    '<div class="rule">कर्ज मंजुर करण्याचे अधिकार अध्यक्ष / डायरेक्टर / व व्यवस्थापक / प्राधिकृत अधिकारी यास राहील. या कर्जस अंतिम मंजुरी संचालक मंडळाची राहील.</div>' +
    '<div class="rule">तारण वस्तु सोडविण्यापूर्वी अर्जदाराचा मृत्यु झाल्यास संस्था कर्जदाराकडून येणे असलेली रक्कम व्याजासह व खर्च सह वारसदाराकडून वसुल करेल.</div>' +
    '<div class="rule">कर्जदारास कर्ज मागणी अर्जत नामनिर्देशित व्यक्तीचे नाव नमुद करावे लागेल. म्हणजे संस्था घेणे असलेली कर्जची रकम व्याजासह वसुल करुन तारण ठेवलेल्या वस्तु कायदेशीर वारसदार अथवा प्रतिनिधीस परत करता येतील. अशावेळी आवश्यकतेनुसार कायदेशीर दस्ताची पूर्तता करुन घ्यावी लागेल.</div>' +
    '<div class="rule">कोणत्याही इसमास कर्ज नाकारण्यात तसेच या नियमात फेरबदल करण्याचा अधिकार संस्थेला राहील.</div>' +
    '<div class="rule">सदरहू व्यवहाराबाबत कोणताही वाद झाल्यास अथवा थकीत वसुल पात्र रकमेकरिता किंवा उर्वरित बाकी कर्ज रकमेकरीता संस्थेच्या कायदेस अधीन राहुन सर्व अधिकार संस्थेस राहतील.</div>' +
    '<div class="rule">संस्थेकडे जे दागिने गहाण ठेवले जातील त्या दागिन्याच्या पाकिटावर कर्जदाराची संस्थेच्या व्यवस्थापकाची सही व सिल राहील. त्याबाबत वाद उपस्थित करण्याचा अधिकार कर्जदारास राहणार नाही.</div>' +
    '<div class="rule">सोनेचांदी तारण वस्तु सील केलेले पाकीटअंतर्गत तपासणीच्या दृष्टीने आवश्यक वाटल्यास संस्थेचे अधिकारी तज्ञ याचे समक्ष सील / पाकीट फोडून तपासणी केली जाईल व त्याच सहिने पुन्हा रितसर सील केले जातील यास माझी / आमची काही हरकत नाही व त्याबाबत कर्जदारास वाद उपस्थित करण्याचा अधिकार राहणार नाही.</div>' +
    '<div class="rule">कोणत्या कारणाने कर्ज तारण ठेवलेल्या दागिण्याबाबत कर्जदार याने दिलेल्या माहिती अथवा दागिण्याच्या मुदतेबाबत केलेले विधाने ही वस्तुस्थितीप्रमाणे नसल्यास कर्जदार हे फौजदारी कायद्यांतर्गत कारवाईस पात्र राहतील.</div>' +
    '<div class="rule">कर्ज वर रू….. द.सा.द.शे. प्रमाणे व्याज आकारले जाईल. सभासदास हे कर्ज दरमहा व्याज जमा न केल्यास ते कर्ज खाती नावे टाकले जाईल.</div>' +
    '<div class="rule" style="border-bottom:none">वरील सर्व नियम मी वाचून, समजुन घेतले असून ते मला व माझ्या वारसास मान्य आहेत व राहतील.</div>' +
    '<div style="text-align:right;margin-top:5px;padding-right:4px;font-size:9pt">' +
    sigLine(nm, "कर्जदाराची सही") +
    "</div>" +
    "</div>";

  // ── Receipt / Ornament return section ──
  var receipt =
    '<div class="receipt" style="padding:3px 10px 4px;font-size:8pt;line-height:1.6">' +
    '<hr style="border:none;border-top:1.5px dashed #000;margin-bottom:5px">' +
    "मी <strong>" +
    nm +
    "</strong> पावती लिहून देतो की, मी/आम्ही संस्थेमध्ये सोन्याचे दागिने गहाण ठेवले व कर्ज प्रकरणात मालाचा " +
    "तपशील ह्यामध्ये नमुद केलेले ते मला/आम्हाला परत मिळाले, मालाचे लावलेले सिल माझे/आमचे समोर उघडले. कोणत्याच प्रकारची तक्रार राहिलेली नाही." +
    '<div style="display:flex;justify-content:space-between;margin-top:7px">' +
    "<span>प्राधिकृत अधिकारी..……………………………</span>" +
    "<span>कर्जदाराची सही &nbsp; " +
    sigLine(nm, "कर्जदाराची सही") +
    "</span>" +
    "</div>" +
    "</div>";

  // Single continuous page — all sections flow together, no forced page break
  var page =
    '<div class="page" style="min-height:297mm;overflow:visible;height:auto;padding-left:6mm;padding-top:0;padding-bottom:0">' +
    '<div class="ohdr" style="padding:4px 8px 3px"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>' +
    '<div class="ftitle" style="padding:3px 8px 3px">– सोने / चांदी तारण कर्ज मागणीचा अर्ज –</div>' +
    infoTbl +
    reqLetter +
    '<hr class="hrdash">' +
    approval +
    '<hr class="hrdash">' +
    vach +
    rules +
    receipt;

  // Build ornament table rows for gold loan form
  var glOrnRows = "";
  var glTotalQty = 0,
    glTotalWt = 0;
  if (ornItems && ornItems.length) {
    ornItems.forEach(function (item, i) {
      var q = parseInt(item.qty) || 0;
      var w =
        item.weight !== null && item.weight !== undefined
          ? parseFloat(item.weight)
          : null;
      glTotalQty += q;
      glTotalWt += w;
      glOrnRows +=
        "<tr>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (i + 1) +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;font-size:8pt">' +
        item.name +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (q || "—") +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (w ? w + " gm" : "—") +
        "</td>" +
        "</tr>";
    });
  } else {
    var glOrnList = [];
    if (goldOrn)
      goldOrn.split(",").forEach(function (s) {
        s = s.trim();
        if (s) glOrnList.push(s);
      });
    if (silvOrn)
      silvOrn.split(",").forEach(function (s) {
        s = s.trim();
        if (s) glOrnList.push(s);
      });
    glTotalQty = parseInt(ornQty) || 0;
    glTotalWt = parseFloat(ornWt) || 0;
    glOrnList.forEach(function (name, i) {
      glOrnRows +=
        "<tr>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (i + 1) +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;font-size:8pt">' +
        name +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (i === 0 && ornQty ? ornQty : "—") +
        "</td>" +
        '<td style="border:1px solid #ccc;padding:3px 6px;text-align:center;font-size:8pt">' +
        (i === 0 && ornWt ? ornWt + " gm" : "—") +
        "</td>" +
        "</tr>";
    });
  }
  var glOrnTable =
    '<table style="width:100%;border-collapse:collapse;font-size:8pt">' +
    '<tr style="background:#1a3a5c;color:#fff">' +
    '<th style="border:1px solid #000;padding:4px 6px;text-align:center;width:8%">#</th>' +
    '<th style="border:1px solid #000;padding:4px 6px;text-align:left">दागिन्याचे नाव / Ornament Name</th>' +
    '<th style="border:1px solid #000;padding:4px 6px;text-align:center;width:18%">नग / Qty</th>' +
    '<th style="border:1px solid #000;padding:4px 6px;text-align:center;width:22%">वजन / Weight</th>' +
    "</tr>" +
    (glOrnRows ||
      '<tr><td colspan="4" style="border:1px solid #ccc;padding:6px;text-align:center;color:#aaa;font-size:8pt">—</td></tr>') +
    '<tr style="background:#fef9e7;font-weight:800">' +
    '<td colspan="2" style="border:1px solid #999;padding:3px 6px;font-size:8pt;text-align:right">एकूण / Total</td>' +
    '<td style="border:1px solid #999;padding:3px 6px;text-align:center">' +
    (glTotalQty || ornQty || "—") +
    "</td>" +
    '<td style="border:1px solid #999;padding:3px 6px;text-align:center">' +
    (glTotalWt ? glTotalWt + " gm" : ornWt ? ornWt + " gm" : "—") +
    "</td>" +
    "</tr>" +
    "</table>";

  // Combined ornament section: photo left + table right (always shown)
  var ornSection =
    '<div style="border-top:1.5px solid #000;padding:4px 10px">' +
    '<div style="font-size:8.5pt;font-weight:700;color:#1a3a5c;margin-bottom:4px">📷 दागिन्यांचा फोटो व तपशील / Ornament Photo & Details</div>' +
    '<div style="display:flex;gap:8px;align-items:flex-start">' +
    '<div style="flex:0 0 auto;width:65mm;min-height:52mm;border:1.5px solid #555;border-radius:4px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f8f8f8">' +
    (photoOrn
      ? '<img src="' + photoOrn + '" style="width:100%;height:52mm;object-fit:contain">'
      : '<div style="text-align:center;color:#bbb;font-size:9pt"><div style="font-size:18pt;margin-bottom:4px">📷</div><div>Ornament Photo</div></div>') +
    "</div>" +
    '<div style="flex:1;min-width:0">' +
    glOrnTable +
    "</div>" +
    "</div>" +
    "</div>";

  if (docPhotos && docPhotos.some((p) => p && p.src)) {
    page += photoGrid(docPhotos);
  }

  page += ornSection;
  page += declLine();
  page += "</div>";
  return page;
}

// ═══════════════════════════════════════════════════════
//  LOAN SLIP PAGE — 3 tabular slips on one page
// ═══════════════════════════════════════════════════════
function loanSlipPage(nm, dtFmt, lnAmt, lnWrd, lnAcc, savAcc, photoCust, ornItems, ornWt, ornQty, goldOrn, silvOrn) {
  function orgHdr() {
    return '<div style="padding:6px 10px 4px;border-bottom:1.5px solid #000"><div style="font-family:\'Noto Serif Devanagari\',serif;font-size:12pt;font-weight:700;color:#8b0000;line-height:1.3">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.<span style="font-size:9.5pt;color:#000">मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</span></div></div>';
  }
  function titleBar(leftText, code) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px;border-bottom:1px solid #000;font-size:9.5pt;font-weight:700"><span>' + leftText + '</span><span style="font-weight:800;font-size:10pt">( ' + code + ' )</span></div>';
  }
  function scrollTbl(col3Label, col3Val, dcLabel) {
    var th = "border:2px solid #000;padding:5px 7px;font-weight:800;text-align:left;font-size:9pt;background:#fff";
    var td = "border:1px solid #000;padding:6px 7px;font-weight:800;font-size:9.5pt";
    return '<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt;border-top:1px solid #000"><tr><th style="' + th + ';width:13%">Scroll No</th><th style="' + th + ';width:20%">कर्ज खाते क्र.</th><th style="' + th + ';width:20%">' + col3Label + '</th><th style="' + th + '">तारीख</th><th style="' + th + ';width:13%">' + dcLabel + '</th></tr><tr><td style="' + td + '">&nbsp;</td><td style="' + td + '">' + lnAcc + '</td><td style="' + td + '">' + col3Val + '</td><td style="' + td + '">' + dtFmt + '</td><td style="' + td + '">&nbsp;</td></tr></table>';
  }
  function sigFooter3() {
    return '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:6px 14px 8px;border-top:1px solid #ddd;font-size:8.5pt"><div style="text-align:center"><div style="border-top:1.5px solid #000;padding-top:3px;margin-top:32px;min-width:60mm">रोखपाल/खातेपाल / व्यवस्थापक/अधिकारी</div></div><div style="text-align:center"><div style="border-top:1.5px solid #000;padding-top:3px;margin-top:32px;min-width:50mm;font-weight:800;font-size:9.5pt">' + nm + '</div></div></div>';
  }

  // SLIP 1: GL-DB-TRF
  var slip1Body = '<div style="padding:6px 12px 4px;font-size:9.5pt;line-height:1.9;position:relative"><div style="position:absolute;top:6px;right:12px;width:14mm;height:16mm;border:1.5px solid #aaa;background:#f0f0f0;display:flex;align-items:center;justify-content:center"><span style="font-size:7pt;color:#aaa">Photo</span></div><div style="margin-right:18mm">श्री / श्रीमती <strong>' + nm + '</strong> यास अगर<br>घेऊन येणाऱ्यास ……………………………………कर्ज रक्कम रू. <strong>' + lnAmt + ' /-</strong><br><strong>(अक्षरी ' + lnWrd + ' )</strong> देण्याचे करावे.<br>खातेदाराचे नाव <strong>' + nm + '</strong></div></div><div style="text-align:right;padding:0 14px 6px;font-size:9pt;font-weight:800">' + nm + ' ………</div>';
  var slip1 = '<div class="sblock">' + orgHdr() + titleBar("** पैसे काढण्याचा फॉर्म **", "GL - DB - TRF") + scrollTbl("बचत खाते क्र.", savAcc, "Debit") + slip1Body + "</div>";

  // SLIP 2: SAV-CR-TRF
  var lbl2 = "background:#e8f8f0;font-weight:600;text-align:center;border:1px solid #000;padding:8px 10px;font-size:9pt;vertical-align:middle";
  var val2 = "font-weight:800;border:1px solid #000;padding:8px 10px;font-size:10.5pt;vertical-align:middle";
  var slip2Table = '<table style="width:100%;border-collapse:collapse;font-size:9.5pt"><tr><td style="' + lbl2 + ';width:38%">खातेदाराचे नाव</td><td style="' + val2 + '">' + nm + '</td></tr><tr><td style="' + lbl2 + '">कर्ज रक्कम</td><td style="' + val2 + '">रू. ' + lnAmt + ' /- <span style="font-size:9pt;font-weight:600">( अक्षरी रू. ' + lnWrd + ' )</span></td></tr></table>';
  var slip2 = '<div class="sblock">' + orgHdr() + titleBar("प्रवेश फि / स्टेशनरी / लघुबचत / मुदती / <u>बचत ठेव</u> / सभासद ठेव", "SAV - CR - TRF") + scrollTbl("बचत खाते क्र.", savAcc, "Credit") + slip2Table + sigFooter3() + "</div>";

  // SLIP 3: GL-FORM-FEE-CR-CASH
  var slip3ScrollTbl = '<table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt;border-top:1px solid #000"><tr><th style="width:13%;border:1px solid #000;padding:4px 7px;font-weight:700;text-align:left">Scroll No</th><th style="width:20%;border:1px solid #000;padding:4px 7px;font-weight:700;text-align:left">कर्ज खाते क्र.</th><th style="width:20%;border:1px solid #000;padding:4px 7px;font-weight:700;text-align:left">खाते क्र.</th><th style="border:1px solid #000;padding:4px 7px;font-weight:700;text-align:left">तारीख</th><th style="width:12%;border:1px solid #000;padding:4px 7px;font-weight:800;text-align:left">Credit</th></tr><tr><td style="border:1px solid #000;padding:5px 7px">&nbsp;</td><td style="border:1px solid #000;padding:5px 7px;font-weight:800">' + lnAcc + '</td><td style="border:1px solid #000;padding:5px 7px;font-weight:800">935 / 1</td><td style="border:1px solid #000;padding:5px 7px;font-weight:800">' + dtFmt + '</td><td style="border:1px solid #000;padding:5px 7px">&nbsp;</td></tr></table>';
  var slip3Table = '<table style="width:100%;border-collapse:collapse;font-size:9.5pt;border-top:1px solid #ddd"><tr><td style="border:1px solid #000;padding:5px 10px;font-weight:700;width:30%;background:#f8f8f8">खातेदाराचे नाव</td><td style="border:1px solid #000;padding:5px 10px;font-weight:800;font-size:11pt" colspan="2">' + nm + '</td></tr><tr><td style="border:1px solid #000;padding:5px 10px;font-weight:700;background:#f8f8f8">स्टेशनरी फि</td><td style="border:1px solid #000;padding:5px 10px;font-weight:800">रू. 50 /-</td><td style="border:1px solid #000;padding:5px 10px;font-weight:700">( अक्षरी पन्नास फक्त )</td></tr></table>';
  var slip3 = '<div class="sblock">' + orgHdr() + titleBar("प्रवेश फि / <u>स्टेशनरी</u> / लघुबचत / मुदती / बचत ठेव / सभासद ठेव", "GL - FORM FEE - CR - CASH") + slip3ScrollTbl + slip3Table + sigFooter3() + "</div>";

  return (
    '<div class="spage">' +
    slip1 +
    '<div class="sdiv"></div>' +
    slip2 +
    '<div class="sdiv"></div>' +
    slip3 +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  GOLD RECEIPT PAGE — 3 copies (Bank / Customer / Office)
// ═══════════════════════════════════════════════════════
function goldReceiptPage(nm, addr, dtFmt, mob, aadh, cid, savAcc, lnAcc, lnAmt, lnWrd, ornWt, ornQty, goldOrn, silvOrn, metal, ornItems) {
  var totalQty = 0, totalWt = 0;
  var itemRows;
  if (ornItems && ornItems.length) {
    itemRows = ornItems.map(function(item, i) {
      var q = parseInt(item.qty) || 0;
      var w = (item.weight !== null && item.weight !== undefined) ? parseFloat(item.weight) : null;
      totalQty += q;
      if (w !== null && !isNaN(w)) totalWt += w;
      return '<tr><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (i+1) + '</td><td style="border:1px solid #ccc;padding:2px 4px;font-size:8.5pt;color:#000;font-weight:700">' + item.name + '</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (q||"—") + '</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (w !== null && !isNaN(w) ? w+" gm" : "—") + '</td></tr>';
    }).join("");
  } else {
    var ornList = [];
    if (goldOrn) goldOrn.split(",").forEach(function(s){ s=s.trim(); if(s) ornList.push({name:s}); });
    if (silvOrn) silvOrn.split(",").forEach(function(s){ s=s.trim(); if(s) ornList.push({name:s}); });
    if (!ornList.length) ornList.push({name:"—"});
    totalQty = parseInt(ornQty)||0; totalWt = parseFloat(ornWt)||0;
    itemRows = ornList.map(function(item,i){
      return '<tr><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (i+1) + '</td><td style="border:1px solid #ccc;padding:2px 4px;font-size:8.5pt;color:#000;font-weight:700">' + item.name + '</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (i===0&&ornQty?ornQty:"") + '</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000;font-weight:700">' + (i===0&&ornWt?ornWt+" gm":"") + '</td></tr>';
    }).join("");
  }
  var totRow = '<tr style="background:#e8e8e8;font-weight:900"><td colspan="2" style="border:1px solid #ccc;padding:2px 4px;text-align:right;font-size:8.5pt;color:#000">एकूण / Total</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000">' + (totalQty||ornQty||"") + '</td><td style="border:1px solid #ccc;padding:2px 4px;text-align:center;font-size:8.5pt;color:#000">' + (totalWt?totalWt+" gm":ornWt?ornWt+" gm":"") + '</td></tr>';
  var lnAmtFmt = lnAmt && lnAmt !== "—" ? "रू. " + lnAmt + " /- ( अक्षरी रू. " + lnWrd + " )" : "—";

  function makeReceipt(copyLabel) {
    var sigRow = "<tr>" +
      '<td colspan="2" style="border:1px solid #ccc;padding:18px 10px 5px;vertical-align:bottom;text-align:left;"><div style="border-top:1px dashed #aaa;padding-top:4px;font-size:8.5pt;font-weight:400;color:#444;">' + nm + '</div></td>' +
      '<td colspan="2" style="border:1px solid #ccc;padding:18px 10px 5px;vertical-align:bottom;text-align:center;"><div style="border-top:1px dashed #aaa;padding-top:4px;font-size:9pt;font-weight:900;color:#000;">प्राधिकृत अधिकारी</div></td>' +
      "</tr>";
    return '<div style="border:1px solid #bbb;margin-bottom:0;page-break-inside:avoid;break-inside:avoid;">' +
      '<div style="background:#000;color:#fff;padding:3px 7px;display:flex;justify-content:space-between;align-items:center;"><div style="font-size:9pt;font-weight:800;line-height:1.25;color:#fff;">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. <span style="font-size:7.5pt;font-weight:500;">जळगाव (जा.) जि. बुलढाणा र.नं.१०६७</span></div><div style="background:#fff;color:#000;font-size:8pt;font-weight:800;padding:1px 7px;border-radius:2px;white-space:nowrap;">' + copyLabel + '</div></div>' +
      '<div style="border-bottom:1px solid #ccc;border-top:1px solid #ccc;text-align:center;padding:2px 6px;font-size:9.5pt;font-weight:800;color:#000;">सोने / चांदी तारण कर्ज पावती &nbsp;<span style="font-size:8pt;font-weight:600;color:#000;">Gold / Silver Loan Receipt</span></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #ccc;">' +
      '<div style="padding:3px 7px;border-right:1px solid #ccc;"><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">कर्जदाराचे नाव</span><span style="font-weight:800;">' + nm + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">पत्ता</span><span style="font-weight:700;">' + addr + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">मोबाईल</span><span style="font-weight:700;">' + mob + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">आधार क्र.</span><span style="font-weight:700;">' + aadh + '</span></div></div>' +
      '<div style="padding:3px 7px;"><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">कर्ज खाते क्र.</span><span style="font-weight:800;">' + lnAcc + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">बचत खाते क्र.</span><span style="font-weight:800;">' + savAcc + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">तारीख</span><span style="font-weight:700;">' + dtFmt + '</span></div><div style="display:flex;gap:3px;margin-bottom:2px;font-size:8.5pt;line-height:1.3;color:#000;"><span style="font-weight:700;min-width:76px;flex-shrink:0;">कर्ज रक्कम</span><span style="font-weight:800;">' + lnAmtFmt + '</span></div></div>' +
      "</div>" +
      '<div style="padding:2px 6px 3px;"><table style="width:100%;border-collapse:collapse;"><thead><tr><th style="background:#555;color:#fff;border:1px solid #ccc;padding:2px 4px;text-align:center;width:5%;font-size:8pt;">#</th><th style="background:#555;color:#fff;border:1px solid #ccc;padding:2px 4px;text-align:left;width:53%;font-size:8pt;">दागिन्याचे नाव / Ornament Name</th><th style="background:#555;color:#fff;border:1px solid #ccc;padding:2px 4px;text-align:center;width:18%;font-size:8pt;">नग / Qty</th><th style="background:#555;color:#fff;border:1px solid #ccc;padding:2px 4px;text-align:center;width:24%;font-size:8pt;">वजन / Weight</th></tr></thead><tbody>' + itemRows + '</tbody>' + totRow + sigRow + '</table></div>' +
      "</div>";
  }

  var cutLine = '<div style="border:none;border-top:2px dashed #000;margin:2.5mm 0;"></div>';
  return '<div class="rpage">' + makeReceipt("🏦 Bank Copy") + cutLine + makeReceipt("👤 Customer Copy") + cutLine + makeReceipt("📁 Office Copy") + declLine() + "</div>" +
    '<div class="spage-blank"></div>';
}

// ═══════════════════════════════════════════════════════
function genericPage(
  txType,
  data,
  nm,
  addr,
  dtFmt,
  savAcc,
  shrAcc,
  lnAcc,
  fdAcc,
  fdPv,
  pan,
  dob,
  nom,
  nomRel,
  ref,
  lnAmt,
  lnWrd,
  fdAmt,
  fdWrd,
  fdPrd,
  fdRate,
  fdMat,
  fdMatAmt,
  fdMatWrd,
  ornWt,
  goldOrn,
  silvOrn,
  metal,
  comments,
  cid,
  aadh,
  mob,
) {
  var TITLES = {
    "Closing - Loan": "-- सोने/चांदी तारण कर्ज बंद करण्याबाबत अर्ज --",
    "Fixed Deposit": "-- मुदत ठेव खाते उघडण्याचा फॉर्म --",
    "FD - Slips": "** मुदत ठेव — पैसे काढण्याचा / जमा फॉर्म **",
    "Closing - FD": "-- मुदत ठेव रक्कम परत मिळण्याबाबत अर्ज --",
    "Closing - FD - Slips": "** FD बंद — पैसे काढण्याचा फॉर्म **",
    "Saving Account": "-- दै. लघुबचत / बचत खाते उघडण्याचा फॉर्म --",
    Sadasya: "– सदस्य होण्यासाठी करावयाचा अर्ज [नियम १९ (१)] –",
    "Sadasya - Slips": "** सदस्य — पैसे काढण्याचा / जमा फॉर्म **",
    "OD Loan": "-- मुदत ठेव तारण कर्ज अर्ज (OD Loan) --",
    "Slips - OD": "** OD Loan — पैसे काढण्याचा / जमा फॉर्म **",
    "Closing - OD": "-- OD Loan बंद करण्याबाबत अर्ज --",
    "Current Account": "-- चालू खाते उघडण्याचा फॉर्म --",
    "Current - Slips": "** चालू खाते — पैसे काढण्याचा / जमा फॉर्म **",
    "Shares Account": "-- शेअर / सभासद खाते उघडण्याचा फॉर्म --",
    "Shares - Transfer": "-- शेअर हस्तांतरण अर्ज --",
    "Naammatr Sabhasad Account":
      "-- नाममात्र सभासद होण्यासाठी करावयाचा अर्ज --",
    "Naammatr Sabhasad - Slips": "** नाममात्र सभासद — पैसे काढण्याचा फॉर्म **",
  };

  function row2(lbl, val) {
    if (!val || val === "—") return "";
    return (
      '<tr><td class="lbl" style="width:35%">' +
      lbl +
      '</td><td class="val">' +
      val +
      "</td></tr>"
    );
  }

  var tbl =
    '<table class="it" style="margin:0"><colgroup><col style="width:35%"><col style="width:65%"></colgroup>' +
    row2("पूर्ण नाव / Name", nm) +
    row2("पत्ता / Address", addr) +
    row2("दिनांक / Date", dtFmt) +
    row2("आधार / Aadhar", aadh) +
    row2("मो.न. / Mobile", mob) +
    (savAcc !== "—" ? row2("बचत खाते / Saving Acc", savAcc) : "") +
    (shrAcc !== "—" ? row2("शेअर खाते / Share Acc", shrAcc) : "") +
    (lnAcc !== "—" ? row2("कर्ज खाते / Loan Acc", lnAcc) : "") +
    (fdAcc !== "—" ? row2("FD खाते / FD Acc", fdAcc) : "") +
    (fdPv !== "—" ? row2("FD पावती / FD Parvati", fdPv) : "") +
    (lnAmt !== "—"
      ? row2("कर्ज रक्कम / Loan Amount", "रू. " + lnAmt + "/- (" + lnWrd + ")")
      : "") +
    (fdAmt !== "—"
      ? row2("FD रक्कम / FD Amount", "रू. " + fdAmt + "/- (" + fdWrd + ")")
      : "") +
    (nom !== "—"
      ? row2(
          "वारसदार / Nominee",
          nom + (nomRel !== "—" ? " (" + nomRel + ")" : ""),
        )
      : "") +
    "</table>";

  var body =
    '<div class="page">' +
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>' +
    '<div class="ftitle">' +
    (TITLES[txType] || txType) +
    "</div>" +
    tbl;

  if (comments && comments !== "—") {
    body += '<div class="bp"><strong>शेरा:</strong> ' + comments + "</div>";
  }

  body +=
    '<div style="display:flex;justify-content:space-between;padding:18px 20px 12px;border-top:1px solid #000;margin-top:auto">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">' +
    nm +
    "</div></div>" +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">प्राधिकृत अधिकारी</div></div>' +
    "</div>" +
    "</div>";

  return body;
}

// ═══════════════════════════════════════════════════════
//  SADASYA FORM PAGE  (सदस्य होण्यासाठी करावयाचा अर्ज)
// ═══════════════════════════════════════════════════════
function sadasya_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  pan,
  dob,
  nom,
  nomRel,
  ref,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div><div style="font-size:9pt;margin-top:2px">र.नं.१०६७</div></div>';

  var ftitle =
    '<div class="ftitle">– सदस्य होण्यासाठी करावयाचा अर्ज [नियम १९ (१)] –</div>';

  // Date + salutation line
  var intro =
    '<div class="bp">मा. अध्यक्ष साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; प्राप्तीची दि. : <strong>' +
    dtFmt +
    "</strong><br>" +
    "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)<br>" +
    "<br>महोदय,<br>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;मी खालील सही करणार श्री / सौ / श्रीमती <strong>" +
    nm +
    "</strong> हल्लीचा पता: <strong>" +
    addr +
    "</strong> ता. जळगाव जामोद जी. बुलढाणा. आपले संस्थेचे सदस्य होण्याकरीता हा अर्ज करीत आहे. माझ्या संबंधी खालील प्रमाणे तपशिलवार माहिती मी देत आहे." +
    "</div>";

  // 6-column info table matching Word doc layout
  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:14%"><col style="width:22%"><col style="width:15%"><col style="width:17%"><col style="width:15%"><col style="width:17%">' +
    "</colgroup>" +
    "<tr>" +
    '<td class="lbl">पूर्ण नाव</td><td class="val vbig" colspan="1">' +
    nm +
    "</td>" +
    '<td class="lbl">शेअर खाते क्र.</td><td class="val vbig">' +
    shrAcc +
    "</td>" +
    '<td class="lbl">बचत ठेव खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">पत्ता</td><td class="val" colspan="1">' +
    addr +
    " ह.मु.जळगाव जामोद तालुका</td>" +
    '<td class="lbl">मो.न.</td><td class="val">' +
    mob +
    "</td>" +
    '<td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    "</td>" +
    '<td class="lbl">प्रवेश फी ची रक्कम</td><td class="val">रू. 50 /-</td>' +
    '<td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">जन्म तारीख</td><td class="val">' +
    dob +
    "</td>" +
    '<td class="lbl">माझे राष्ट्रीयत्व</td><td class="val">भारतीय</td>' +
    '<td class="lbl">व्यवसाय</td><td class="val">शेती</td>' +
    "</tr>" +
    "<tr>" +
    '<td class="lbl">सदस्यत्वाचा प्रकार</td><td class="val">सामान्य सभासद</td>' +
    '<td class="lbl">भागांचे खरेदीबद्दल भरलेली रक्कम</td><td class="val" colspan="3">रु. 500 /-</td>' +
    "</tr>" +
    "</table>";

  // Items 1-5
  var items =
    '<div class="bp" style="font-size:9pt">' +
    "१) मालक अगर कुळ या नात्याने धारण केलेल्या स्थावर जिंदगीचा तपशिल: .................................................................................................................................................................<br><br>" +
    "२) संस्थेकडे जास्तीत जास्त रक्कम कर्ज घेण्याची मी इच्छीतो रू.: ......................................................................................................................<br><br>" +
    "३) दुसऱ्या सहकारी संस्थेचा / संस्थाचा सदस्य असल्यास त्याबद्दलचा व संस्थेचे / संस्थांचा किती कर्ज देणे अगर थकले आहे (तसेच असल्यास) या माहिती चा तपशिल: .....................................................<br><br>" +
    "४) संस्थेचे उपविधी अन्वये लागणारी इतर माहिती: .............................................................................................<br><br>" +
    "५) संस्थेच्या अर्जदाराच्या कुटुंबातील (महाराष्ट्र सहकारी संस्था अधिनियम कलम क्र.६ मध्ये 'कुटुंब' या शब्दाच्या केलेल्या अर्थानुसार) हल्ली संस्थेत सदस्य असणाऱ्या इसमांची नावे." +
    "</div>";

  // Declaration paragraph
  var decl =
    '<div class="bp" style="font-size:9pt">' +
    "मी <strong>" +
    nm +
    "</strong> प्रतिज्ञेवर असे जाहीर करतो की, आपल्या संस्थेचे उपविधी व अधिनियम मी वाचले असून संस्थेशी होणाऱ्या माझ्या व्यवहारासंबंधीच्या अशा सर्व बाबतीत त्या उपविधीला अनुसरून मी या अर्जाद्वारे कबुली देत आहे. मी प्रतिज्ञेवर असे जाहीर करतो की, वर दिलेली माहिती माझे उत्तम माहिती प्रमाणे खरी व बिनचुक अशी आहे. मी माझ्या नावे होणाऱ्या शेअर्स बावत खालीलप्रमाणे वारस नेमून देत आहे." +
    "</div>";

  // Nominee table
  var nomTbl =
    '<table class="it" style="margin:4px 14px;width:calc(100% - 28px)"><colgroup><col style="width:5%"><col style="width:20%"><col style="width:35%"><col style="width:20%"><col style="width:20%"></colgroup>' +
    '<tr><td class="lbl">अ.क्र.</td><td class="lbl">वारसदाराचे नाव</td><td class="val"><strong>' +
    nom +
    '</strong></td><td class="lbl">वारसदाराचे नाते</td><td class="val"><strong>' +
    nomRel +
    "</strong></td></tr>" +
    "</table>";

  // Guarantees section
  var guarnt =
    '<div class="bp" style="font-size:9pt">' +
    "वरील प्रमाणे नेमून दिलेल्या वारसांची नोंद आपल्या दफ्तरी करण्यात यावी.<br><br>" +
    "मी अशी हमी देतो की,<br>" +
    "&nbsp;&nbsp;• मी धारण केलेली स्थावर व जगम जिंदगी, माझे कुटुंबातील आपले संस्थेचे सदस्य, इत्यादींची उपविधी अन्वये लागणारी माहिती पुरवीन<br>" +
    "&nbsp;&nbsp;• आपली संस्था मला आदेश देईल त्याप्रमाणे कोणतही प्रतिज्ञापत्र, रोखा, करार अगर इतर दस्ताऐवज मी करून देईन<br><br>" +
    "७) मी एकापेक्षा अधिक पतपेढ्याचा सदस्य आहे / झाली आहे. त्या पक्षपद्र्यांचे नाव खाली देण्यात आले आहे.<br>" +
    "&nbsp;&nbsp;१) ............................................................................बँक म..............................................<br>" +
    "&nbsp;&nbsp;२) .............................................................................संस्था म............................................<br>" +
    "&nbsp;&nbsp;३) नागरी सहकारी पतपेढी म......................................................................................................" +
    "</div>";

  // Maharashtra law declaration
  var mhdecl =
    '<div class="bp" style="font-size:9pt">' +
    "महाराष्ट्र सहकारी संस्था नियम १९६१ मधील नियम ४५ अन्वये आवश्यक असल्याप्रमाणे मी या द्वारे असे जाहीर करतो की मी केवळ जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसायटी मर्या. जळगाव (जा.) कडूनच कर्ज घेईल. वर नमदू केलेली पूर्ण माहिती मी <strong>" +
    nm +
    "</strong>, वाचली असून ती बरोबर आहे.<br><br>" +
    "दि. : <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "साक्षीदाराचे नाव: <strong>" +
    ref +
    "</strong>" +
    "</div>";

  // Signature row
  var sadasya_sigRow =
    '<div style="display:flex;justify-content:space-between;padding:10px 20px 8px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">साक्षीदाराची सही</div></div>' +
    '<div style="text-align:center">' +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Special notes
  var notes =
    '<div class="bp" style="font-size:8.5pt;background:#fafafa;border-top:1px dashed #bbb">' +
    "<strong>* विशेष सूचना *</strong><br>" +
    "१) अर्जदार हा एखाद्या संस्थेचा प्रतिनिधी असेल तर अर्जावर सही करणारा इसम हा संस्थेचा आहे काय हे अर्जात नमूद करावे. या अर्जावर सही करण्यास त्याला अधिकृत करणाऱ्या त्या संस्थेच्या समितीच्या ठरावाची प्रत अर्जासोबत जोडावी.<br>" +
    "२) अर्जदार हा एखादा एक व्यक्ती संस्था (कार्पोरेट बॉडी) असेल तर त्या एक व्यक्तीभूत संस्थेतर्फे अर्जावर सही करणाऱ्या इसमाचा दर्जा (हुद्दा) दर्शविला पाहिजे. तसेच त्या संस्थेतर्फे या अर्जावर सही करणाऱ्या इसमास अधिकृत करणाऱ्या वस्ताऐवजांची निगडित कागद पत्रांची (डॉक्युमेंट) प्रत या अर्जासोबत जोडली पाहिजे.<br><br>" +
    "समितीच्या ता.......................................च्या सभेत ठराव क्र............... ने मंजूर / नामंजूर" +
    "</div>";

  // Footer
  var ftFooter =
    '<div style="display:flex;justify-content:space-between;padding:8px 20px 10px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">कार्यकारी संचालक / व्यवस्थापक</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div><div style="font-size:9pt">अध्यक्ष</div></div>' +
    "</div>" +
    '<div class="bp" style="text-align:center;font-size:8.5pt;border-top:1px solid #ccc">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसायटी मर्यादित जळगाव (जा.) जि. बुलढाणा र.नं. १०६७, शाखा-जळगाव जा.</div>';

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    items +
    decl +
    nomTbl +
    guarnt +
    mhdecl +
    sadasya_sigRow +
    notes +
    ftFooter +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  SADASYA SLIPS PAGE  (3 slips: SAV-DB, SHR-CR, FORM FEE-CR)
// ═══════════════════════════════════════════════════════
function sadasya_SlipsPage(nm, dtFmt, savAcc, shrAcc) {
  function orgHdr() {
    return '<div class="sohdr"><div class="sohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  }

  function scrollTbl(shrNo, savNo, date) {
    return (
      '<table class="sst"><tr>' +
      '<th style="width:18%">Scroll No</th>' +
      '<th style="width:22%">सभासद खाते क्र.</th>' +
      '<th style="width:22%">बचत खाते क्र.</th>' +
      '<th style="width:25%">तारीख</th>' +
      '<th style="width:13%">Debit/Credit</th>' +
      "</tr><tr>" +
      "<td></td>" +
      "<td><strong>" +
      shrNo +
      "</strong></td>" +
      "<td><strong>" +
      savNo +
      "</strong></td>" +
      "<td><strong>" +
      date +
      "</strong></td>" +
      "<td></td>" +
      "</tr></table>"
    );
  }

  // Slip 1: SAV-DB-TRF — Debit ₹550 from saving
  var slip1 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>पैसे काढण्याचा फॉर्म</span><span class="scode">SAV - DB - TRF</span></div>' +
    scrollTbl(shrAcc, savAcc, dtFmt) +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0f4ff;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff">रक्कम</th><td class="sv" colspan="3"><strong>रक्कम रू. 550 /-</strong> <span style="font-size:9pt;font-weight:600">(अक्षरी रू. पाचशे पन्नास फक्त)</span></td></tr>' +
    '<tr><th class="sl" style="background:#f0f4ff;font-size:8.5pt">Transfer</th><td class="sv" colspan="3" style="font-size:8.5pt;color:#000">Saving Account → Shares Account</td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 2: SHR-CR-TRF — Credit ₹500 to Share Account (सभासद ठेव)
  var slip2 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / मुदती / बचत ठेव / <u>सभासद ठेव</u> / नाममात्र फि</span><span class="scode">SHR - CR - TRF</span></div>' +
    scrollTbl(shrAcc, savAcc, dtFmt) +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0fff4;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0fff4">सभासद ठेव</th><td class="sv" colspan="3"><strong>रक्कम रू. 500 /-</strong> <span style="font-size:9pt;font-weight:600">(अक्षरी रू. पाचशे फक्त)</span></td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 3: FORM FEE-CR-TRF — Credit ₹50 form fee (account 129/1)
  var slip3 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>प्रवेश फि / <u>स्टेशनरी</u> / लघुबचत / मुदती / बचत ठेव / सभासद ठेव / नाममात्र फि</span><span class="scode">FORM FEE - CR - TRF</span></div>' +
    scrollTbl(shrAcc, savAcc, dtFmt) +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#fffbf0;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#fffbf0">सभासद फॉर्म फी</th><td class="sv" colspan="3"><strong>रक्कम रू. 50 /-</strong> <span style="font-size:9pt;font-weight:600">(अक्षरी रू. पन्नास फक्त)</span></td></tr>' +
    '<tr><th class="sl" style="background:#fffbf0">फॉर्म फी खाते क्र.</th><td class="sv" colspan="3"><strong>129 / 1</strong></td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="spage">' +
    slip1 +
    '<hr class="sdiv">' +
    slip2 +
    '<hr class="sdiv">' +
    slip3 +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  NAAMMATR SABHASAD FORM PAGE
//  (नाममात्र सभासद होण्यासाठी करावयाचा अर्ज)
// ═══════════════════════════════════════════════════════
function naammatr_FormPage(nm, addr, dtFmt, dob, shrAcc, ref, docPhotos) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle =
    '<div class="ftitle">-- नाममात्र सभासद होण्यासाठी करावयाचा अर्ज --</div>';

  // Header: date + नाममात्र सभासद क्र.
  var hdrRow =
    '<div style="display:flex;justify-content:space-between;padding:6px 16px 4px;border-bottom:1px solid #ddd;font-size:9.5pt">' +
    "<span>प्रति, &nbsp;&nbsp;&nbsp; दि. : <strong>" +
    dtFmt +
    "</strong></span>" +
    "<span>नाममात्र सभासद क्र. : <strong>" +
    shrAcc +
    "</strong></span>" +
    "</div>";

  // Salutation + applicant line
  var salut =
    '<div class="bp">' +
    "मे. अध्यक्ष / उपाध्यक्ष / सरव्यवस्थापक<br>" +
    "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)<br><br>" +
    "श्री. / श्रीमती / <strong>" +
    nm +
    "</strong>, वय / जन्म तारीख : <strong>" +
    dob +
    "</strong>, रा. <strong>" +
    addr +
    "</strong> ता. जळगाव जामोद" +
    "</div>";

  // Main request paragraph
  var reqPara =
    '<div class="bp yl">' +
    "&nbsp;&nbsp;&nbsp;&nbsp;मी आपले संस्थेचा नाममात्र सभासद होण्याकरिता हा अर्ज करित आहे. संस्थेचे सर्व नियम वाचले असून ते मला मान्य आहेत. नियमाप्रमाणे प्रवेश फी रुपये शंभर फक्त (रू. <strong>100 /-</strong>) भरली आहे. तरी मला नाममात्र सभासद करुन घेण्याची विनंती आहे. वर नमूद केलेली पूर्ण माहिती मी <strong>" +
    nm +
    "</strong>, वाचली असनू ती बरोबर आहे." +
    "</div>";

  // Applicant signature
  var sigAppl =
    '<div style="display:flex;justify-content:flex-end;padding:6px 20px 10px;border-bottom:1.5px dashed #aaa">' +
    '<div style="text-align:center">' +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Referral paragraph
  var refPara =
    '<div class="bp gr">' +
    "&nbsp;&nbsp;&nbsp;&nbsp;मी <strong>" +
    ref +
    "</strong>, असून अर्जदार हे माझ्या पूर्ण परिचयाचे असून ते या संस्थेचे नाममात्र सभासद होण्यास पात्र आहेत. <strong>" +
    nm +
    "</strong>ला नाममात्र सभासद करुन घेण्यात यावे. करीता मी शिफारस करीत आहे. तरी मान्यता मिळावी." +
    "</div>";

  // Date + officer signature row
  var officerRow =
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 20px 10px;border-bottom:1.5px dashed #aaa">' +
    '<div style="font-size:9.5pt">दि. : <strong>' +
    dtFmt +
    "</strong></div>" +
    '<div style="text-align:center">' +
    '<div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div>' +
    '<div style="font-size:9pt">लिपीक/अधिकारी</div>' +
    "</div>" +
    "</div>";

  // Report to committee section
  var reportSection =
    '<div style="padding:6px 16px 4px;border-bottom:1px solid #ddd">' +
    "<div style=\"text-align:center;font-weight:700;font-size:10pt;padding-bottom:4px;font-family:'Noto Serif Devanagari',serif\">** मे अध्यक्ष/व्यवस्थापक समिती कडे रिपोर्ट सादर **</div>" +
    '<div class="bp" style="padding-top:4px">' +
    "नियमाप्रमाणे प्रवेश फी रू <strong>100 /-</strong> जमा केले असून दि. <strong>" +
    dtFmt +
    "</strong> रोजी अर्जदारास नाममात्र सभासद करुन घेण्यात आले आहे तरी मान्यता मिळावी." +
    "</div>" +
    "</div>";

  // Authority signature
  var authSig =
    '<div style="display:flex;justify-content:flex-end;padding:8px 20px 10px;border-bottom:1.5px dashed #aaa">' +
    '<div style="text-align:center">' +
    '<div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div>' +
    '<div style="font-size:9pt">अधिकाऱ्याची सही</div>' +
    "</div>" +
    "</div>";

  // Committee resolution
  var committee =
    '<div class="bp">' +
    "कार्यकारी मंडळ सभा दि. : &nbsp;&nbsp;/&nbsp;&nbsp;/&nbsp;&nbsp;२०&nbsp;&nbsp;&nbsp;&nbsp; ठराव क्र. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ने नोंद घेतली." +
    "</div>";

  // Chairman signature
  var chairSig =
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 20px 12px">' +
    '<div style="font-size:9.5pt">दि. : &nbsp;&nbsp;/&nbsp;&nbsp;/&nbsp;&nbsp;२०</div>' +
    '<div style="text-align:center">' +
    '<div style="border-bottom:1px solid #000;height:18px;min-width:55mm;margin-bottom:4px"></div>' +
    '<div style="font-size:9pt">अध्यक्ष / उपाध्यक्ष</div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    hdrRow +
    salut +
    reqPara +
    sigAppl +
    refPara +
    officerRow +
    reportSection +
    authSig +
    committee +
    chairSig +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  NAAMMATR SABHASAD SLIPS PAGE
//  (2 slips: SAV-DB-TRF ₹100 + NOM FEE-CR-TRF ₹100)
// ═══════════════════════════════════════════════════════
function naammatr_SlipsPage(nm, dtFmt, savAcc, shrAcc) {
  function orgHdr() {
    return '<div class="sohdr"><div class="sohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  }

  function scrollTbl(nomAccLabel, shrNo, savNo, date, debitCredit) {
    return (
      '<table class="sst"><tr>' +
      '<th style="width:15%">Scroll No</th>' +
      '<th style="width:22%">' +
      nomAccLabel +
      "</th>" +
      '<th style="width:22%">बचत खाते क्र.</th>' +
      '<th style="width:28%">तारीख</th>' +
      '<th style="width:13%">' +
      debitCredit +
      "</th>" +
      "</tr><tr>" +
      "<td></td>" +
      "<td><strong>" +
      shrNo +
      "</strong></td>" +
      "<td><strong>" +
      savNo +
      "</strong></td>" +
      "<td><strong>" +
      date +
      "</strong></td>" +
      "<td></td>" +
      "</tr></table>"
    );
  }

  // Slip 1: SAV-DB-TRF — ₹100 debit from saving → nominal member account
  var slip1 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>पैसे काढण्याचा फॉर्म</span><span class="scode">SAV - DB - TRF</span></div>' +
    scrollTbl("नाममात्र खाते क्र.", shrAcc, savAcc, dtFmt, "Debit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0f4ff;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff">रक्कम</th><td class="sv"><strong>रू. 100 /-</strong></td><th class="sl" style="background:#f0f4ff;width:22%">अक्षरी</th><td class="sv">शंभर फक्त</td></tr>' +
    '<tr><th class="sl" style="background:#f0f4ff">बचत खाते क्र.</th><td class="sv"><strong>' +
    savAcc +
    '</strong></td><th class="sl" style="background:#f0f4ff">नाममात्र खाते क्र.</th><td class="sv"><strong>' +
    shrAcc +
    "</strong></td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff;font-size:8.5pt">Transfer</th><td class="sv" colspan="3" style="font-size:8.5pt;color:#555">Saving Account → Nominal Member Account</td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 2: NOM FEE-CR-TRF — ₹100 credit nominal member fee
  var slip2 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / मुदती / बचत ठेव / सभासद ठेव / <u>नाममात्र सदस्य फि</u></span><span class="scode">NOM FEE - CR - TRF</span></div>' +
    scrollTbl("नाममात्र खाते क्र.", shrAcc, savAcc, dtFmt, "Credit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0fff4;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0fff4">नाममात्र सदस्य फि</th><td class="sv"><strong>रू. 100 /-</strong></td><th class="sl" style="background:#f0fff4;width:22%">अक्षरी</th><td class="sv">शंभर फक्त</td></tr>' +
    '<tr><th class="sl" style="background:#f0fff4">नाममात्र खाते क्र.</th><td class="sv" colspan="3"><strong>' +
    shrAcc +
    "</strong></td></tr>" +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="spage">' +
    slip1 +
    '<hr class="sdiv">' +
    slip2 +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  SAVING ACCOUNT FORM PAGE
//  (दै. लघुबचत / बचत खाते उघडण्याचा फॉर्म)
// ═══════════════════════════════════════════════════════
function savingAccount_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  pan,
  dob,
  nom,
  nomRel,
  ref,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle =
    '<div class="ftitle">-- दै. लघुबचत/बचत खाते उघडण्याचा फॉर्म --</div>';

  // Intro
  var intro =
    '<div class="bp">' +
    "प्रति, शाखा व्यवस्थापक साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; दि. : <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "महोदय, मी आपणास विनंती करतो की, आपल्या संस्थेत श्री./सौ. <strong>" +
    nm +
    "</strong> या नावाने लघु बचत/बचत खाते उघडण्याची कृपा करावी. मी/आम्ही आज रोजी रू........(अक्षरी रु ......................) सोबत दिले आहेत. माझी सही/ आमच्या सह्या खालील प्रमाणे दिल्या आहेत. मी / आम्ही आपल्या खात्यातून पैसे काढण्याचा अधिकार मला/आमचे पैकी एकास किंवा संयुक्त मिळून राहील. अशा प्रकारच्या खात्यासंबंधीचे संस्थेचे हल्लीचे नियम व पुढे होणारे नियम मला/आम्हाला मान्य आहेत तसेच संस्थेच्या ठेवीचे व्याज दराच्या नियमामध्ये वेळोवेळी झालेले/होणारे बदल व संस्थेच्या उपविधीचे नियम मला/आम्हाला बंधनकारक आहेत. या ठेवीची मुदत संपत असल्याबद्दल मला/आम्हाला सुचना देण्याची आवश्यकता नाही. सदर ठेवीच्या रक्कमेची देय तारखेस मागणी न केल्यास नंतरच्या कालावधीचे व्याज संस्थेच्या नियमाप्रमाणे राहील ते मला / आम्हाला मान्य राहील." +
    "</div>";

  // 4-column info table matching Word doc
  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:14%"><col style="width:36%"><col style="width:15%"><col style="width:35%">' +
    "</colgroup>" +
    "<tr>" +
    '<td class="lbl">पूर्ण नाव</td><td class="val vbig">' +
    nm +
    "</td>" +
    '<td class="lbl">बचत खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td>" +
    "</tr><tr>" +
    '<td class="lbl">पत्ता</td><td class="val">' +
    addr +
    " ह.मु.जळगाव जामोद तालुका</td>" +
    '<td class="lbl">शेअर खाते क्र.</td><td class="val">' +
    shrAcc +
    "</td>" +
    "</tr><tr>" +
    '<td class="lbl">मो.न.</td><td class="val">' +
    mob +
    "</td>" +
    '<td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td>" +
    "</tr><tr>" +
    '<td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    "</td>" +
    '<td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    "</td>" +
    "</tr>" +
    "</table>";

  // Interest notice
  var intNote =
    '<div class="bp" style="font-size:9pt">' +
    "* व्याजाबाबत सुचना :- माझे / आमचे एकत्रित बचत खाते क्र. <strong>" +
    savAcc +
    "</strong> मध्ये तिमाही, सहामाही वार्षिक होणारे व्याजाची रक्कम जमा करावी. तसेच अज्ञान व्यक्तीचे नावाने केलेल्या गुंतवणूकीबद्दलचे पूर्ण व्यवहार करण्याचे अधिकार अज्ञान पालनकर्ता म्हणून मला / आम्हाला राहतील." +
    "</div>";

  // Referral row
  var refRow =
    '<table class="it" style="margin:4px 14px;width:calc(100% - 28px)"><colgroup><col style="width:25%"><col style="width:60%"><col style="width:15%"></colgroup>' +
    "<tr>" +
    '<td class="lbl">परिचय करून देणाऱ्याचे नाव व पत्ता</td>' +
    '<td class="val">' +
    ref +
    "</td>" +
    '<td style="text-align:center;font-size:9pt">सही</td>' +
    "</tr>" +
    "</table>";

  // Declaration + signature
  var declSig =
    '<div class="bp" style="font-size:9.5pt">' +
    "वर नमूद केलेली पूर्ण माहिती मी <strong>" +
    nm +
    "</strong>, वाचली असनू ती बरोबर आहे." +
    "</div>" +
    '<div style="display:flex;justify-content:flex-end;padding:6px 20px 8px;border-bottom:1px dashed #aaa">' +
    '<div style="text-align:center">' +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Nominee row
  var nomRow =
    '<div class="bp" style="font-size:9pt">* सदर खाते माझे वारसदारास लागू / मान्य राहील.</div>' +
    '<table class="it" style="margin:4px 14px;width:calc(100% - 28px)"><colgroup><col style="width:20%"><col style="width:30%"><col style="width:20%"><col style="width:30%"></colgroup>' +
    "<tr>" +
    '<td class="lbl">वारसदाराचे नाव</td><td class="val"><strong>' +
    nom +
    "</strong></td>" +
    '<td class="lbl">वारसदाराचे नाते</td><td class="val"><strong>' +
    nomRel +
    "</strong></td>" +
    "</tr>" +
    "</table>";

  // Specimen signatures (3 boxes)
  var specSig =
    '<div class="bp" style="font-size:9pt;margin-bottom:2px">* अर्जदाराच्या / खातेदाराच्या सहीचा नमुना :</div>' +
    '<div style="display:flex;justify-content:space-between;padding:4px 14px 8px;gap:8px">' +
    '<div style="flex:1;text-align:center;border:1px solid #bbb;min-height:28px;padding:4px 0 2px"><div style="border-bottom:1px solid #000;height:22px;margin:0 8px"></div><div style="font-size:8pt;color:#555">सही १</div></div>' +
    '<div style="flex:1;text-align:center;border:1px solid #bbb;min-height:28px;padding:4px 0 2px"><div style="border-bottom:1px solid #000;height:22px;margin:0 8px"></div><div style="font-size:8pt;color:#555">सही २</div></div>' +
    '<div style="flex:1;text-align:center;border:1px solid #bbb;min-height:28px;padding:4px 0 2px"><div style="border-bottom:1px solid #000;height:22px;margin:0 8px"></div><div style="font-size:8pt;color:#555">सही ३</div></div>' +
    "</div>";

  // Instructions + staff signatures
  var instFooter =
    '<div class="bp" style="font-size:8.5pt;background:#fafafa;border-top:1px dashed #bbb">' +
    "* ठेव खाते चालविणे बाबत सुचना :<br>" +
    "* सर्व माहीती माझ्या समक्ष लिहीली व सह्या केल्या आहेत." +
    "</div>" +
    '<div style="display:flex;justify-content:space-between;padding:8px 20px 10px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">लिपीक</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">शाखा व्यवस्थापक / अधिकारी</div></div>' +
    "</div>" +
    '<div class="bp" style="font-size:8pt;border-top:1px solid #eee">' +
    "फॉर्म सोबत घ्यावयाची कागदपत्रे :- १) ओळख पत्र, २) रहिवाशी दाखला, ३) पासपोर्ट फोटो २, (४) पॅन कार्ड नसल्यास फॉर्म नं. ६० किंवा ६१ भरून घ्यावे." +
    "</div>";

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    intNote +
    refRow +
    declSig +
    nomRow +
    specSig +
    instFooter +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  FIXED DEPOSIT FORM PAGE
//  (मुदत ठेव / दै. लघुबचत खाते उघडण्याचा फॉर्म)
// ═══════════════════════════════════════════════════════
function fd_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  fdAcc,
  fdPv,
  pan,
  dob,
  nom,
  nomRel,
  ref,
  fdAmt,
  fdWrd,
  fdPrd,
  fdRate,
  fdMat,
  fdMatAmt,
  fdMatWrd,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle =
    '<div class="ftitle">-- मुदत ठेव / दै. लघुबचत खाते उघडण्याचा फॉर्म --</div>';

  var intro =
    '<div class="bp">' +
    "प्रति, शाखा व्यवस्थापक साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ठेव प्राप्तीची दि. : <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "महोदय, मी आपणास विनंती करतो की, आपल्या संस्थेत श्री./सौ. <strong>" +
    nm +
    "</strong> या नावाने लघु बचत/बचत/मुदत ठेव खाते उघडण्याची कृपा करावी. माझी सही/ आमच्या सह्या खालील प्रमाणे दिल्या आहेत. मी / आम्ही आपल्या खात्यातून पैसे काढण्याचा अधिकार मला/आमचे पैकी एकास किंवा संयुक्त मिळून राहील. अशा प्रकारच्या खात्यासंबंधीचे संस्थेचे हल्लीचे नियम व पुढे होणारे नियम मला/आम्हाला मान्य आहेत तसेच संस्थेच्या ठेवीचे व्याज दराच्या नियमांमध्ये वेळोवेळी झालेले/होणारे बदल व संस्थेच्या उपविधीचे नियम मला/आम्हाला बंधनकारक आहेत. या ठेवीची मुदत संपत असल्याबद्दल मला/आम्हाला सुचना देण्याची आवश्यकता नाही. सदर ठेवीच्या रक्कमेची देय तारखेस मागणी न केल्यास नंतरच्या कालावधीचे व्याज संस्थेच्या नियमाप्रमाणे राहील ते मला / आम्हाला मान्य राहील." +
    "</div>";

  // 8-row, 4-col info table matching the Word doc
  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:13%"><col style="width:37%"><col style="width:16%"><col style="width:34%">' +
    "</colgroup>" +
    '<tr><td class="lbl">पूर्ण नाव</td><td class="val vbig">' +
    nm +
    '</td><td class="lbl">शेअर खाते क्र.</td><td class="val vbig">' +
    shrAcc +
    "</td></tr>" +
    '<tr><td class="lbl">पत्ता</td><td class="val">' +
    addr +
    '</td><td class="lbl">बचत खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td></tr>" +
    '<tr><td class="lbl">मो.न.</td><td class="val">' +
    mob +
    '</td><td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td></tr>" +
    '<tr><td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    '</td><td class="lbl">ठेव खाते क्र.</td><td class="val vbig">' +
    fdAcc +
    "</td></tr>" +
    '<tr><td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    '</td><td class="lbl">ठेवीची मुदत</td><td class="val"><strong>' +
    fdPrd +
    " महिने</strong></td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम</td><td class="val vbig">रू. ' +
    fdAmt +
    '</td><td class="lbl">मुदत अंती रक्कम</td><td class="val vbig">रू. ' +
    fdMatAmt +
    "</td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम अक्षरी</td><td class="val">' +
    fdWrd +
    '</td><td class="lbl">मुदत अंती रक्कम अक्षरी</td><td class="val">' +
    fdMatWrd +
    "</td></tr>" +
    '<tr><td class="lbl">ठेवीचे व्याज दर</td><td class="val"><strong>' +
    fdRate +
    '%</strong></td><td class="lbl">ठेवीची मुदत दि.</td><td class="val"><strong>' +
    fdMat +
    "</strong></td></tr>" +
    "</table>";

  var intNote =
    '<div class="bp" style="font-size:9pt">' +
    "व्याजाबाबत सुचना :- माझे आमचे संयुक्त बचत खाते क्र. <strong>" +
    savAcc +
    "</strong> मध्ये तिमाही, सहामाही वार्षिक होणारे व्याजाची रक्कम जमा करावी. तसेच अज्ञान व्यक्तीचे नावाने केलेल्या गुंतवणूकीबद्दलचे पूर्ण व्यवहार करण्याचे अधिकार अज्ञान पालनकर्ता म्हणून मला / आम्हाला राहतील. सदर खाते माझे वारसदारास बंधनकारक राहील." +
    "</div>";

  var nomRow =
    '<table class="it" style="margin:4px 14px;width:calc(100% - 28px)"><colgroup><col style="width:20%"><col style="width:30%"><col style="width:20%"><col style="width:30%"></colgroup>' +
    '<tr><td class="lbl">वारसदाराचे नाव</td><td class="val"><strong>' +
    nom +
    '</strong></td><td class="lbl">वारसदाराचे नाते</td><td class="val"><strong>' +
    nomRel +
    "</strong></td></tr>" +
    "</table>";

  var pavti =
    '<div class="bp" style="font-size:9pt">' +
    "मुदत ठेव पावती क्र.: <strong>" +
    fdPv +
    "</strong>. वर नमूद केलेली पूर्ण माहिती मी <strong>" +
    nm +
    "</strong>, वाचली असनू ती बरोबर आहे.<br>" +
    "* ठेव खाते चालविणे बाबत सुचना :" +
    "</div>";

  var sigBlock =
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 20px 8px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">लिपीक</div></div>' +
    '<div style="text-align:center">' +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">शाखा व्यवस्थापक/अधिकारी</div></div>' +
    "</div>";

  var footer =
    '<div class="bp" style="font-size:8pt;border-top:1px solid #eee">' +
    "** सर्व माहीती माझ्या समक्ष लिहीली व सह्या केल्या आहेत.<br>" +
    "फॉर्म सोबत घ्यावयाची कागदपत्रे :- १) ओळख पत्र, २) रहिवाशी दाखला, ३) पासपोर्ट फोटो २, (४) पॅन कार्ड नसल्यास फॉर्म नं. ६० किंवा ६१ भरून घ्यावे." +
    "</div>";

  return (
    '<div class="page" style="padding-left:8mm">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    intNote +
    nomRow +
    pavti +
    sigBlock +
    footer +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  FORM NO. 60 + 61
// ═══════════════════════════════════════════════════════
function form6061Page(nm, addr, dtFmt) {
  var U = 'border-bottom:1px solid #000;display:inline-block;padding-bottom:1px';
  function instrList() {
    return '<div style="font-size:8pt;margin-top:3mm"><strong>Instructions:</strong> Documents which can be produced in support of the address are:<br>' +
      '<div style="margin-top:1mm;line-height:1.7">' +
      'a) Ration card &nbsp;&nbsp; b) Passport &nbsp;&nbsp; c) Driving licence &nbsp;&nbsp; d) Identity card issued by any institution<br>' +
      'e) Copy of electricity bill or telephone bill showing residential address<br>' +
      'f) Any document issued by Central/State Govt or local bodies showing address<br>' +
      'g) Any other documentary evidence in support of address.' +
      '</div></div>';
  }
  function verifyBlock() {
    return '<div style="margin-top:3mm">' +
      '<div style="font-weight:700;text-align:center;margin-bottom:2mm">Verification</div>' +
      '<div style="line-height:2">I, <span style="' + U + ';min-width:80mm">&nbsp;<strong>' + (nm||'') + '</strong></span> ' +
      'do hereby declare that what is stated above is true to the best of my knowledge and belief.</div>' +
      '<div style="margin:2mm 0">Verified today, the <span style="' + U + ';min-width:18mm">&nbsp;</span> day of <span style="' + U + ';min-width:30mm">&nbsp;</span>.</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:4mm">' +
        '<div>Place: <span style="' + U + ';min-width:40mm">&nbsp;</span></div>' +
        '<div style="text-align:center"><div style="border-bottom:1.5px solid #000;min-width:50mm;height:16px;margin-bottom:2px"></div>' +
        '<div style="font-size:8pt;font-weight:700">Signature of the declarant</div></div>' +
      '</div></div>';
  }
  var form60 =
    '<div style="font-family:Arial,sans-serif;font-size:8.5pt;color:#000;border:1px solid #000;padding:2mm 5mm;margin-bottom:2mm">' +
    '<div style="text-align:center;font-weight:900;font-size:10pt">FORM No. 60</div>' +
    '<div style="text-align:center;font-size:7.5pt">[See second proviso to rule 114B]</div>' +
    '<div style="text-align:center;font-weight:700;font-size:8pt;margin:1mm 0 2mm;line-height:1.3">Form of declaration to be filed by a person who does not have a permanent account number<br>and who enters into any transaction specified in rule 114 B</div>' +
    '<div style="line-height:1.7;font-size:8.5pt">' +
      '1.&nbsp; Full name and address &nbsp;<span style="' + U + ';min-width:70mm">&nbsp;<strong>' + (nm||'') + (addr?', '+addr:'') + '</strong></span><br>' +
      '2.&nbsp; Particulars of transaction &nbsp;<span style="' + U + ';min-width:90mm">&nbsp;</span><br>' +
      '3.&nbsp; Amount of the transaction &nbsp;<span style="' + U + ';min-width:80mm">&nbsp;</span><br>' +
      '4.&nbsp; Are you assessed to tax? &nbsp; Yes / No<br>' +
      '5.&nbsp; If yes, &nbsp; i) Ward/Circle/Range &nbsp;<span style="' + U + ';min-width:30mm">&nbsp;</span> &nbsp; ii) Reasons for no PAN &nbsp;<span style="' + U + ';min-width:40mm">&nbsp;</span><br>' +
      '6.&nbsp; Details of documents in support of address<br>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin:2mm 0">' +
      '<div>Date: <span style="' + U + ';min-width:38mm">&nbsp;' + dtFmt + '</span><br><br>Place: <span style="' + U + ';min-width:38mm">&nbsp;</span></div>' +
      '<div style="text-align:center"><div style="border-bottom:1.5px solid #000;min-width:50mm;height:16px;margin-bottom:2px"></div><div style="font-size:8pt;font-weight:700">Signature of the declarant</div></div>' +
    '</div>' +
    verifyBlock() + instrList() + '</div>';
  var form61 =
    '<div style="font-family:Arial,sans-serif;font-size:8.5pt;color:#000;border:1px solid #000;padding:2mm 5mm">' +
    '<div style="text-align:center;font-weight:900;font-size:10pt">FORM No. 61</div>' +
    '<div style="text-align:center;font-size:7.5pt">[See proviso to clause (a) of rule 114 C(1)]</div>' +
    '<div style="text-align:center;font-weight:700;font-size:8pt;margin:1mm 0 2mm;line-height:1.3">Form of declaration to be filed by a person who has agricultural income and is not in receipt<br>any other income chargeable to income-tax in respect of specified in rule 114 B</div>' +
    '<div style="line-height:1.7;font-size:8.5pt">' +
      '1.&nbsp; Full name and address &nbsp;<span style="' + U + ';min-width:70mm">&nbsp;<strong>' + (nm||'') + (addr?', '+addr:'') + '</strong></span><br>' +
      '2.&nbsp; Particulars of transaction &nbsp;<span style="' + U + ';min-width:90mm">&nbsp;</span><br>' +
      '3.&nbsp; Details of documents in support of address &nbsp; Yes / No<br>' +
    '</div>' +
    '<div style="margin:2mm 0;font-size:8.5pt">I hereby declare that my source of income is from agriculture and I am not required to pay income tax on any other income if any.</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin:2mm 0">' +
      '<div>Date: <span style="' + U + ';min-width:38mm">&nbsp;' + dtFmt + '</span><br><br>Place: <span style="' + U + ';min-width:38mm">&nbsp;</span></div>' +
      '<div style="text-align:center"><div style="border-bottom:1.5px solid #000;min-width:50mm;height:16px;margin-bottom:2px"></div><div style="font-size:8pt;font-weight:700">Signature of the declarant</div></div>' +
    '</div>' +
    verifyBlock() + instrList() + '</div>';
  return '<div class="page" style="padding:3mm 6mm">' + form60 + form61 + '</div>';
}

// ═══════════════════════════════════════════════════════
//  FD SLIPS PAGE  (2 slips: SAV-DB-TRF + FD-CR-TRF)
// ═══════════════════════════════════════════════════════
function fd_SlipsPage(nm, dtFmt, savAcc, fdAcc, fdPv, fdAmt, fdWrd) {
  function orgHdr() {
    return '<div class="sohdr"><div class="sohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  }

  function scrollTbl(col2Label, col2Val, col3Label, col3Val, dcLabel) {
    return (
      '<table class="sst"><tr>' +
      '<th style="width:15%">Scroll No</th>' +
      '<th style="width:22%">' +
      col2Label +
      "</th>" +
      '<th style="width:22%">' +
      col3Label +
      "</th>" +
      '<th style="width:28%">तारीख</th>' +
      '<th style="width:13%">' +
      dcLabel +
      "</th>" +
      "</tr><tr>" +
      "<td></td>" +
      "<td><strong>" +
      col2Val +
      "</strong></td>" +
      "<td><strong>" +
      col3Val +
      "</strong></td>" +
      "<td><strong>" +
      dtFmt +
      "</strong></td>" +
      "<td></td>" +
      "</tr></table>"
    );
  }

  // Slip 1: SAV-DB-TRF — debit saving → FD account
  var slip1 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>** पैसे काढण्याचा फॉर्म **</span><span class="scode">SAV - DB - TRF &nbsp; Debit</span></div>' +
    scrollTbl("मुदत ठेव खाते क्र.", fdAcc, "बचत खाते क्र.", savAcc, "Debit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0f4ff;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff">रक्कम</th>' +
    '<td class="sv" colspan="3"><strong>रक्कम रू. ' +
    fdAmt +
    ' /-</strong> <span style="font-size:9pt;font-weight:600">(अक्षरी रू. ' +
    fdWrd +
    ")</span></td>" +
    "</tr>" +
    '<tr><th class="sl" style="background:#f0f4ff;font-size:8.5pt">Transfer</th><td class="sv" colspan="3" style="font-size:8.5pt;color:#555">Saving Account → Fixed Deposit Account</td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 2: FD-CR-TRF — credit to FD
  var slip2 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / <u>मुदत ठेव</u> / बचत ठेव / सभासद ठेव / नाममात्र सदस्य फि</span><span class="scode">FD - CR - TRF &nbsp; Credit</span></div>' +
    scrollTbl("मुदत ठेव खाते क्र.", fdAcc, "खाते क्र.", savAcc, "Credit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0fff4;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0fff4">रक्कम</th>' +
    '<td class="sv" colspan="3"><strong>रक्कम रू. ' +
    fdAmt +
    ' /-</strong> <span style="font-size:9pt;font-weight:600">(अक्षरी रू. ' +
    fdWrd +
    ")</span></td>" +
    "</tr>" +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="spage">' +
    slip1 +
    '<hr class="sdiv">' +
    slip2 +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  OD LOAN (FD Collateral) FORM PAGE
//  (मुदत ठेव तारण कर्ज अर्ज)
// ═══════════════════════════════════════════════════════
function od_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  fdAcc,
  fdPv,
  lnAcc,
  pan,
  dob,
  nom,
  nomRel,
  lnAmt,
  lnWrd,
  fdAmt,
  fdWrd,
  fdMat,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle = '<div class="ftitle">-- मुदत ठेव तारण कर्ज अर्ज --</div>';

  var hdrLine =
    '<div class="bp">मा. अध्यक्ष, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; प्राप्तीची दि. : <strong>' +
    dtFmt +
    "</strong><br>" +
    "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७<br><br>" +
    "मी अर्जदार <strong>" +
    nm +
    "</strong> खालील स्वाक्षरी करणार विनंती करतो की, खाली वर्णन केल्याप्रमाणे मुदत ठेवीचे / पावतीचे तारणावर रु. <strong>" +
    lnAmt +
    "/-</strong> कर्ज मंजूर करण्याची कृपा करावी. याबाबत अस्तित्वात असणारे नियम व भविष्यात संचालक मंडळ तथा कायद्यातील तरतुदीप्रमाणे बदल होणारे नियम मला व माझे इस्टेटीस व वारसदारास बंधनकारक राहतील. सदरहू पावती आपल्या संस्थेच्या नावाने तबदील करून देण्यास तयार आहोत." +
    "</div>";

  // 8-row info table
  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:13%"><col style="width:37%"><col style="width:16%"><col style="width:34%">' +
    "</colgroup>" +
    '<tr><td class="lbl">पूर्ण नाव</td><td class="val vbig">' +
    nm +
    '</td><td class="lbl">कर्ज खाते क्र.</td><td class="val vbig">' +
    lnAcc +
    "</td></tr>" +
    '<tr><td class="lbl">पत्ता</td><td class="val">' +
    addr +
    '</td><td class="lbl">बचत खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td></tr>" +
    '<tr><td class="lbl">मो.न.</td><td class="val">' +
    mob +
    '</td><td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td></tr>" +
    '<tr><td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    '</td><td class="lbl">ठेव खाते क्र.</td><td class="val vbig">' +
    fdAcc +
    "</td></tr>" +
    '<tr><td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    '</td><td class="lbl">पावती क्र.</td><td class="val vbig">' +
    fdPv +
    "</td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम</td><td class="val">रू. <strong>' +
    fdAmt +
    '</strong></td><td class="lbl">कर्ज रक्कम</td><td class="val vbig">रू. ' +
    lnAmt +
    "</td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम अक्षरी</td><td class="val">' +
    fdWrd +
    '</td><td class="lbl">कर्ज रक्कम अक्षरी</td><td class="val">' +
    lnWrd +
    "</td></tr>" +
    '<tr><td class="lbl">वारसदाराचे नाव</td><td class="val"><strong>' +
    nom +
    '</strong></td><td class="lbl">वारसदाराचे नाते</td><td class="val"><strong>' +
    nomRel +
    "</strong></td></tr>" +
    "</table>";

  // Declaration (घोषणापत्र)
  var ghoshna =
    '<div class="bp yl">' +
    '<div style="text-align:center;font-weight:700;font-size:10pt;padding-bottom:4px">** घोषणापत्र **</div>' +
    "मी / आम्ही घोषित करतो, मुदती ठेव पावती तारणावरील कर्ज नियम वाचले, ते मला / आम्हाला मान्य असून आमचेवर बंधनकारक आहेत. कायद्यामध्ये किंवा शासनाच्या धोरणामध्ये वेळोवेळी झालेल्या बदलामुळे संस्थेने कोणतेही निर्णय घेतल्यास ते मला मान्य राहील. मी खालील सही करणार मुदत ठेव पावती पत्राद्वारे निवेदन करतो की, आज रोजी मी वरील वर्णन केल्याप्रमाणे मुदत ठेव पावती संस्थेस तारण देत आहे. संबंधित वर्णन केल्याप्रमाणे रोखे, पावती माझे स्वतःचे मालकीची असून त्यात कोणत्याही प्रकारचा बोझा नाही. याबाबत काही वाद झाल्यास त्याला मी सर्वस्वी जबाबदार राहील. सदर मुदत ठेव पावती ही माझी स्वकष्टार्जित रकमेमधून घेतली असून, सदर मुदत ठेव पावती ही तारण देऊन कर्ज घेण्याचा मला संपूर्ण अधिकार असून त्यावर कोणत्याही प्रकारचा प्रत्यक्ष व अप्रत्यक्ष निर्बंध नाही. कळावे," +
    '<div style="text-align:right;margin-top:6px">' +
    sigLine(nm, "कर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Vachanchithi
  var vach =
    '<div class="vach">' +
    '<div class="vach-t">** वचनचिठ्ठी **</div>' +
    "मुदत ठेव पावती क्र. - <strong>" +
    fdPv +
    "</strong> &nbsp;&nbsp; दि. <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "मी <strong>" +
    nm +
    "</strong>,<br>" +
    "'जळगाव जामोद अर्बन को-ऑप क्रेडीट सोसा मर्या जळगाव (जा) र.नं.१०६७ यास अगर ती लिहून देईल त्यास आज तारखेपासून कर्ज घेतलेली रक्कम <strong>Rs. " +
    lnAmt +
    "/-</strong><br>" +
    "अक्षरी रू.<strong>" +
    lnWrd +
    "</strong> &nbsp; द.सा.द.शे. रूपये ....... टक्के प्रमाणे माझेकडे मागणी केली जाईल त्यावेळी व त्या ठिकाणी परत करण्याचे वचन देतो." +
    '<div style="text-align:right;margin-top:6px">' +
    sigLine(nm, "कर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Adhikar Patra
  var adhikar =
    '<div class="bp gr">' +
    '<div style="text-align:center;font-weight:700;font-size:10pt;padding-bottom:4px">** अधिकार पत्र **</div>' +
    "मी खालील सही करणार, जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७ यास अधिकार पत्र लिहून देतो की, मी आपल्या संस्थेकडून मुदती ठेवी पावती चे तारणावर आपल्याकडून रु.<strong>" +
    lnAmt +
    "/-</strong> (अक्षरी <strong>" +
    lnWrd +
    "</strong>) कर्ज घेतले असून तारण पा.क्र.<strong>" +
    fdPv +
    "</strong> ची मुदत दि.<strong>" +
    fdMat +
    "</strong> ला संपते. वरील मुदतीचे आत मी घेतलेल्या कर्जावर व्याजासह परतफेड करू न शकल्यास माझेकडील संपूर्ण कर्ज व व्याज मुदती ठेवीतून मुदत संपताच वटवून घेण्यास माझी कोणतीही हरकत राहणार नाही. अशा वेळी माझा व माझे इस्टेट वारसदाराचा सदर ठेवींवर कोणताही हक्क राहणार नाही. त्यास अनुसरून मी हे अधिकारपत्र आपणास देत आहे. सदर कर्जाच्या संपूर्ण रकमेची परतफेड होईपावतो सदरचे अधिकारपत्र रद्द करण्याचा अथवा अधिकार इतरत्र हस्तांतरित करण्याचा मला कोणताही अधिकार राहणार नाही." +
    '<div style="text-align:right;margin-top:6px">' +
    sigLine(nm, "कर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Office report
  var officeRpt =
    '<div style="border-top:1.5px solid #000;padding:6px 14px">' +
    "<div style=\"text-align:center;font-weight:700;font-size:10pt;padding-bottom:4px;font-family:'Noto Serif Devanagari',serif\">** कार्यालयीन अहवाल **</div>" +
    '<div class="bp" style="padding-top:4px">' +
    "श्री / श्रीमती <strong>" +
    nm +
    "</strong> संस्थेकडे त्यांच्या मुदती ठेव पावती क्र. <strong>" +
    fdPv +
    "</strong> ठेव रु. <strong>" +
    fdAmt +
    "</strong> चे तारणावर रु. <strong>" +
    lnAmt +
    "/-</strong> मागणी केले आहे. पावतीचे विक्रय मूल्याचे रु. ______________ रक्कमेच्या ______% प्रमाणे रु.<strong>" +
    lnAmt +
    "/-</strong> करिता ______% व्याजदराने मंजुरीसाठी शिफारस करण्यात येत आहे. मंजूर कर्ज रक्कम - रु. <strong>" +
    lnAmt +
    "/-</strong>" +
    "</div>" +
    '<div style="text-align:right;padding:8px 20px 8px">' +
    '<div style="border-bottom:1px solid #000;height:18px;min-width:70mm;margin-bottom:4px;margin-left:auto"></div>' +
    '<div style="font-size:9pt">अध्यक्ष / कार्यकारी संचालक / अधिकारी</div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    hdrLine +
    itbl +
    ghoshna +
    '<hr class="hrdash">' +
    vach +
    '<hr class="hrdash">' +
    adhikar +
    '<hr class="hrdash">' +
    officeRpt +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  LOAN CLOSING FORM  (सोने/चांदी तारण कर्ज बंद)
//  Photo: ornament only (no doc photos)
// ═══════════════════════════════════════════════════════
function loanClosing_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  lnAcc,
  pan,
  nom,
  nomRel,
  lnAmt,
  lnWrd,
  goldOrn,
  silvOrn,
  ornWt,
  comments,
  photoOrn,
  ornItems,
) {
  var orgHdr =
    '<div class="ohdr" style="padding:4px 10px 3px"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle =
    '<div class="ftitle" style="padding:3px 8px">-- सोने / चांदी तारण कर्ज बंद करण्याबाबत अर्ज / डिलिव्हरी ऑर्डर --</div>';

  // Compact intro paragraph
  var intro =
    '<div style="padding:4px 12px;font-size:8pt;line-height:1.55;color:#000;font-weight:600;text-align:justify">' +
    "प्रति, शाखा व्यवस्थापक साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; अर्ज दि. : <strong>" +
    dtFmt +
    "</strong><br>" +
    "मी <strong>" +
    nm +
    "</strong>, सोने/चांदी तारण कर्जाची संपूर्ण थकबाकी अदा करून कर्ज परतफेड केली आहे. तारण दागिन्यांचा ताबा मला परत मिळाला असून ते पूर्णतः योग्य स्थितीत असल्याची खात्री केली आहे. भविष्यात कोणताही दावा/तक्रार राहणार नाही." +
    "</div>";

  // Compact 8-row info table — reduce padding
  var itbl =
    '<table class="it" style="margin:0;font-size:8.5pt"><colgroup>' +
    '<col style="width:14%"><col style="width:36%"><col style="width:14%"><col style="width:36%">' +
    "</colgroup>" +
    '<tr><td class="lbl" style="padding:3px 6px">पूर्ण नाव</td><td class="val vbig" style="padding:3px 6px">' +
    nm +
    '</td><td class="lbl" style="padding:3px 6px">कर्ज खाते क्र.</td><td class="val vbig" style="padding:3px 6px">' +
    lnAcc +
    "</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">पत्ता</td><td class="val" style="padding:3px 6px">' +
    addr +
    '</td><td class="lbl" style="padding:3px 6px">बचत खाते क्र.</td><td class="val vbig" style="padding:3px 6px">' +
    savAcc +
    "</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">कर्ज समाप्ती दि.</td><td class="val vbig" style="padding:3px 6px">' +
    dtFmt +
    '</td><td class="lbl" style="padding:3px 6px">सभासद क्र.</td><td class="val" style="padding:3px 6px">' +
    cid +
    "</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">आधार कार्ड</td><td class="val" style="padding:3px 6px">' +
    aadh +
    '</td><td class="lbl" style="padding:3px 6px">शेअर खाते क्र.</td><td class="val" style="padding:3px 6px">' +
    shrAcc +
    "</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">कर्ज रक्कम</td><td class="val" style="padding:3px 6px">' +
    lnWrd +
    '</td><td class="lbl" style="padding:3px 6px">कर्ज रक्कम (रू.)</td><td class="val vbig" style="padding:3px 6px">' +
    lnAmt +
    " /-</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">पॅन कार्ड</td><td class="val" style="padding:3px 6px">' +
    pan +
    '</td><td class="lbl" style="padding:3px 6px">मो.न.</td><td class="val" style="padding:3px 6px">' +
    mob +
    "</td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">वारसदाराचे नाव</td><td class="val" style="padding:3px 6px"><strong>' +
    nom +
    '</strong></td><td class="lbl" style="padding:3px 6px">वारसदाराचे नाते</td><td class="val" style="padding:3px 6px"><strong>' +
    nomRel +
    "</strong></td></tr>" +
    '<tr><td class="lbl" style="padding:3px 6px">दागिन्यांची विवरण</td><td class="val" style="padding:3px 6px">' +
    ((goldOrn || "") + (silvOrn ? " / " + silvOrn : "")) +
    '</td><td class="lbl" style="padding:3px 6px">एकूण वजन (ग्रा.)</td><td class="val" style="padding:3px 6px"><strong>' +
    (ornWt || "—") +
    "</strong></td></tr>" +
    "</table>";

  // Compact receipt
  var receipt =
    '<div style="border-top:1.5px dashed #000;padding:4px 12px 5px">' +
    '<div style="font-size:8pt;line-height:1.5;color:#000;font-weight:600">' +
    "मी <strong>" +
    nm +
    "</strong> पावती लिहून देतो की, सोन्याचे दागिने गहाण ठेवले व ते मला/आम्हाला परत मिळाले. सिल माझ्यासमोर उघडले. कोणतीही तक्रार नाही." +
    "</div>" +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:6px 6px 2px">' +
    '<div style="text-align:center"><div style="border-bottom:1.5px solid #000;height:16px;min-width:55mm;margin-bottom:3px"></div><div style="font-size:8.5pt;font-weight:800;color:#000">प्राधिकृत अधिकारी</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1.5px solid #000;height:16px;min-width:55mm;margin-bottom:3px"></div><div style="font-size:8.5pt;font-weight:800;color:#000">कर्जदाराची सही — ' +
    nm +
    "</div></div>" +
    "</div>" +
    "</div>";

  // Build compact ornament rows
  var clOrnRows = "";
  var clTotalQty = 0,
    clTotalWt = 0;
  if (ornItems && ornItems.length) {
    ornItems.forEach(function (item, i) {
      var q = parseInt(item.qty) || 0;
      var w =
        item.weight !== null && item.weight !== undefined
          ? parseFloat(item.weight)
          : null;
      clTotalQty += q;
      if (w !== null && !isNaN(w)) clTotalWt += w;
      clOrnRows +=
        "<tr>" +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">' +
        (i + 1) +
        "</td>" +
        '<td style="border:1px solid #000;padding:2px 5px;font-size:8pt;color:#000;font-weight:700">' +
        item.name +
        "</td>" +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">' +
        (q || "—") +
        "</td>" +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">' +
        (w !== null && !isNaN(w) ? w + " gm" : "—") +
        "</td>" +
        "</tr>";
    });
  } else {
    var clOrnList = [];
    if (goldOrn)
      goldOrn.split(",").forEach(function (s) {
        s = s.trim();
        if (s) clOrnList.push(s);
      });
    if (silvOrn)
      silvOrn.split(",").forEach(function (s) {
        s = s.trim();
        if (s) clOrnList.push(s);
      });
    if (!clOrnList.length && ornWt) clOrnList.push("सोने/चांदी दागिने");
    clTotalWt = parseFloat(ornWt) || 0;
    clOrnList.forEach(function (name, i) {
      clOrnRows +=
        "<tr>" +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">' +
        (i + 1) +
        "</td>" +
        '<td style="border:1px solid #000;padding:2px 5px;font-size:8pt;color:#000;font-weight:700">' +
        name +
        "</td>" +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">—</td>' +
        '<td style="border:1px solid #000;padding:2px 5px;text-align:center;font-size:8pt;color:#000;font-weight:700">' +
        (i === 0 && ornWt ? ornWt + " gm" : "—") +
        "</td>" +
        "</tr>";
    });
  }

  var clOrnTable =
    '<table style="width:100%;border-collapse:collapse;font-size:8pt">' +
    '<tr style="background:#000;color:#fff">' +
    '<th style="border:1px solid #000;padding:2px 5px;text-align:center;width:8%">#</th>' +
    '<th style="border:1px solid #000;padding:2px 5px;text-align:left">दागिन्याचे नाव / Ornament Name</th>' +
    '<th style="border:1px solid #000;padding:2px 5px;text-align:center;width:18%">नग / Qty</th>' +
    '<th style="border:1px solid #000;padding:2px 5px;text-align:center;width:22%">वजन / Weight</th>' +
    "</tr>" +
    (clOrnRows ||
      '<tr><td colspan="4" style="border:1px solid #000;padding:4px;text-align:center;color:#000;font-size:8pt">—</td></tr>') +
    '<tr style="background:#e0e0e0;font-weight:900;color:#000">' +
    '<td colspan="2" style="border:1px solid #000;padding:2px 5px;font-size:8pt;text-align:right">एकूण / Total</td>' +
    '<td style="border:1px solid #000;padding:2px 5px;text-align:center">' +
    (clTotalQty || "—") +
    "</td>" +
    '<td style="border:1px solid #000;padding:2px 5px;text-align:center">' +
    (clTotalWt ? clTotalWt + " gm" : ornWt ? ornWt + " gm" : "—") +
    "</td>" +
    "</tr>" +
    "</table>";

  // Photo + ornament table side-by-side, compact heights
  var photoSection =
    '<div style="border-top:1.5px solid #000;padding:4px 12px 4px">' +
    '<div style="font-size:8pt;font-weight:800;color:#000;margin-bottom:3px">📷 दागिन्यांचा फोटो व तपशील / Ornament Photo & Details</div>' +
    '<div style="display:flex;gap:8px;align-items:flex-start">' +
    '<div style="flex:0 0 48%;width:48%;border:1.5px solid #000;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#f0f0f0;min-height:38mm;max-height:42mm">' +
    (photoOrn
      ? '<img src="' +
        photoOrn +
        '" style="width:100%;max-height:42mm;object-fit:contain">'
      : '<div style="text-align:center;color:#888;font-size:8pt;padding:8px"><div style="font-size:18pt;margin-bottom:2px">📷</div><div>Ornament Photo</div></div>') +
    "</div>" +
    '<div style="flex:1;min-width:0">' +
    clOrnTable +
    "</div>" +
    "</div>" +
    "</div>";

  // ── Single Loan Closing Slip (blank amount, same structure as saving deposit slip) ──
  var loanSlip =
    '<div style="border-top:1.5px dashed #000;padding:4px 12px 4px">' +
    '<div style="border:1px solid #333;padding:10px 12px;page-break-inside:avoid">' +
    '<div style="font-size:7.5pt;font-weight:700;color:#8B1A1A;text-align:right;margin-bottom:3px">— बँक प्रत —</div>' +
    // Top header: title left | acc+scroll right
    '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1a1a6e;padding-bottom:4px;margin-bottom:8px">' +
      '<div>' +
        '<div style="font-size:10.5pt;font-weight:900;color:#1a1a6e">तारण कर्ज खाते जमा / कर्ज बंद पावती</div>' +
        '<div style="font-size:8pt;color:#555;margin-top:1px">🏦 जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)</div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<table style="border-collapse:collapse;font-size:8pt">' +
          '<tr><td style="padding:2px 8px;border:1px solid #333;font-weight:700;white-space:nowrap">कर्ज खाते क्र.&nbsp;<span style="font-weight:400;font-size:9pt">' + lnAcc + '</span></td></tr>' +
          '<tr><td style="padding:2px 8px;border:1px solid #333;font-weight:700">स्क्रोल क्र.</td></tr>' +
          '<tr><td style="padding:10px 8px;border:1px solid #333">&nbsp;</td></tr>' +
        '</table>' +
      '</div>' +
    '</div>' +
    // Body: denom table left | counterfoil right
    '<div style="display:flex;align-items:flex-start;gap:0">' +
      // Denomination table (left)
      '<div style="min-width:52mm">' + _jjuDenomTable("#d4edda", "") + '</div>' +
      // Counterfoil (right)
      '<div style="padding-left:10px;flex:1;font-size:9pt">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
          '<span style="font-weight:700;white-space:nowrap">दिनांक :</span>' +
          '<span style="border-bottom:1px solid #000;flex:1;min-width:40mm;display:inline-block;padding-bottom:1px">&nbsp;' + dtFmt + '</span>' +
        '</div>' +
        '<div style="margin-bottom:2px;font-weight:700">खात्यात जमा केले / नाव :</div>' +
        '<div style="border-bottom:1px solid #000;margin-bottom:2px;padding-bottom:2px;font-weight:800;font-size:10pt">&nbsp;' + nm + '</div>' +
        '<div style="font-size:7.5pt;color:#555;margin-bottom:8px">खातेदाराचे संपूर्ण नांव</div>' +
        '<div style="display:flex;align-items:baseline;gap:4px;margin-bottom:10px">' +
          '<span style="border-bottom:1px solid #000;flex:1;min-width:44mm;display:inline-block;font-family:monospace;font-weight:700">&nbsp;</span>' +
          '<span style="white-space:nowrap;font-size:8.5pt">च्या कर्ज खात्यामध्ये जमा केले.</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
          '<div style="border:1px solid #333;padding:5px 10px;font-size:11pt;font-weight:900;min-width:40mm">रू. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /-</div>' +
        '</div>' +
        '<div style="font-size:8pt;color:#555;margin-bottom:2px">अक्षरी रुपये :</div>' +
        '<div style="border-bottom:1px solid #000;margin-bottom:6px;min-width:80mm;font-style:italic">&nbsp;</div>' +
        '<div style="margin-bottom:6px"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;padding-top:4px">' +
          '<div style="text-align:center"><div style="font-size:8pt;color:#333;border-top:1.5px solid #000;padding-top:3px;margin-top:28px;min-width:55mm;text-align:center">रोखपाल/खातेपाल &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; व्यवस्थापक/अधिकारी</div></div>' +
          '<div style="text-align:center"><div style="font-size:8.5pt;font-weight:600;color:#333;border-top:1.5px solid #000;padding-top:3px;margin-top:28px;min-width:50mm;text-align:center">' + nm + ' / पैसे भरणाऱ्याची सही</div></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '</div>' +
    '</div>';

  var html =
    '<div class="page" style="padding-left:6mm;min-height:unset;height:auto;overflow:hidden">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    receipt +
    photoSection +
    loanSlip +
    declLine() +
    "</div>";

  return html;
}

// ═══════════════════════════════════════════════════════
//  FD CLOSING FORM  (मुदत ठेव रक्कम परत मिळण्याबाबत अर्ज)
// ═══════════════════════════════════════════════════════
function fdClosing_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  fdAcc,
  fdPv,
  pan,
  nom,
  nomRel,
  fdAmt,
  fdWrd,
  fdPrd,
  fdMat,
  fdMatAmt,
  fdMatWrd,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle =
    '<div class="ftitle">-- मुदत ठेव रक्कम परत मिळण्याबाबत अर्ज --</div>';

  var intro =
    '<div class="bp">' +
    "प्रति, शाखा व्यवस्थापक साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; अर्ज दि. : <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "महोदय, मी <strong>" +
    nm +
    "</strong> आपणास विनंती करतो की, आपल्या संस्थेत माझ्या नावावर असलेली मुदत ठेव परत मिळावी. खालील खात्याचा तपशील देण्यात येत आहे. ठेव पूर्णत्वास आली असून, व्याजासह ठेव रक्कम माझ्या खात्यात जमा करावी / रोख स्वरूपात मिळावी, ही नम्र विनंती. मात्र, जर सदर ठेव मुदतपूर्व (Premature) परत मागितली गेली, तर संस्थेच्या नियमांनुसार व्याज रक्कमेत तदनुसार कपात करण्यात येईल व ते मला मान्य राहील. मी माझी ठेव खाते पावती संस्थेकडे सुपूर्त करत आहे. संस्थेचे सर्व नियम व अटी मला मान्य असून, पुढील कोणतीही शिल्लक नसल्याचे मला समजते." +
    "</div>";

  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:14%"><col style="width:36%"><col style="width:16%"><col style="width:34%">' +
    "</colgroup>" +
    '<tr><td class="lbl">पूर्ण नाव</td><td class="val vbig">' +
    nm +
    '</td><td class="lbl">शेअर खाते क्र.</td><td class="val vbig">' +
    shrAcc +
    "</td></tr>" +
    '<tr><td class="lbl">पत्ता</td><td class="val">' +
    addr +
    '</td><td class="lbl">बचत खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td></tr>" +
    '<tr><td class="lbl">मो.न.</td><td class="val">' +
    mob +
    '</td><td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td></tr>" +
    '<tr><td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    '</td><td class="lbl">ठेव खाते क्र.</td><td class="val vbig">' +
    fdAcc +
    "</td></tr>" +
    '<tr><td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    '</td><td class="lbl">ठेवीची मुदत</td><td class="val"><strong>' +
    fdPrd +
    " महिने</strong></td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम</td><td class="val vbig">रू. ' +
    fdAmt +
    '</td><td class="lbl">ठेवीची मुदत दि.</td><td class="val"><strong>' +
    fdMat +
    "</strong></td></tr>" +
    '<tr><td class="lbl">ठेवीची रक्कम अक्षरी</td><td class="val">' +
    fdWrd +
    '</td><td class="lbl">मुदत ठेव पावती क्र.</td><td class="val vbig">' +
    fdPv +
    "</td></tr>" +
    '<tr><td class="lbl">वारसदाराचे नाव</td><td class="val"><strong>' +
    nom +
    '</strong></td><td class="lbl">वारसदाराचे नाते</td><td class="val"><strong>' +
    nomRel +
    "</strong></td></tr>" +
    "</table>";

  // Payment mode checkboxes
  var payMode =
    '<div class="bp" style="font-size:9pt">' +
    "* <strong>रक्कम मिळविण्याची पद्धत:</strong> &nbsp;" +
    "☐ रोख &nbsp;&nbsp; ☐ बचत खात्यात जमा (खाते क्र. <strong>" +
    savAcc +
    "</strong>) &nbsp;&nbsp; ☐ RTGS / UPI" +
    "</div>";

  // TDS declaration
  var tdsDecl =
    '<div class="bp" style="font-size:9pt;background:#fffbee;border-top:1px solid #e5d98a">' +
    "मी, खाली स्वाक्षरी करणारा/करणारी, <strong>" +
    nm +
    "</strong>, सभासद क्र. <strong>" +
    cid +
    "</strong>, आपल्या संस्थेत माझ्या नावे असलेल्या मुदत ठेव खात्यावर मिळणाऱ्या व्याज रकमेवर कायद्यानुसार कर (TDS) वजावट होऊ शकते, याची पूर्ण जाणीव आहे. तरी मी संस्थेला विनंती करतो की, सदर व्याज रकमेवर TDS वजावट करू नये आणि संपूर्ण व्याज रक्कम माझ्या <strong>" +
    savAcc +
    "</strong> या बचत खात्यात जमा करावी. माझ्या या निवेदनानुसार भविष्यात उत्पन्न कर विभागाकडून याबाबत चौकशी झाल्यास त्याची सर्व जबाबदारी माझी राहील." +
    "</div>";

  // Final amount statement (blank fill-in lines)
  var finalStmt =
    '<div class="bp" style="font-size:9pt">' +
    "* <strong>व्याज व अंतिम रक्कम प्राप्ती बाबत निवेदन:</strong> वरील नमूद केल्याप्रमाणे, माझ्या मुदत ठेव खात्यावर दि. <strong>" +
    dtFmt +
    "</strong> रोजी देय व्याज रक्कम रू. .......................... /- (अक्षरी रू. ....................... ......................................) इतकी असून, ती रक्कम मला संस्थेच्या नियमाप्रमाणे मान्य आहे. मला संस्थेकडून पूर्ण रक्कम रू. ............................... /- (अक्षरी रू. ....................... ..............................................फक्त) इतकी प्राप्त झाली असून संस्थेचे नियम मला मान्य आहेत. माझी संस्थेकडे कोणतीही तक्रार नाही." +
    "</div>";

  // Date + signature
  var sigBlock =
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 20px 10px;border-top:1px solid #ccc">' +
    '<div style="font-size:9pt">दि. : <strong>' +
    dtFmt +
    "</strong></div>" +
    "<div>" +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Renewal info (blank)
  var renewal =
    '<div style="border-top:1.5px dashed #aaa;padding:6px 14px 4px">' +
    '<div style="font-size:9pt;font-weight:700;margin-bottom:4px">** सर्व माहीती माझ्या समक्ष लिहीली व सह्या केल्या आहेत. संस्थेने व्याजासह पूर्ण मुदत ठेव देय रक्कम खातेदाराच्या <strong>' +
    savAcc +
    "</strong> या बचत खात्यात जमा केली आहे.</div>" +
    '<div style="font-size:9pt;font-weight:700;color:#333;margin:6px 0 3px">नवीन मुदत ठेव (Renewal FD) ची माहिती (जर लागू असेल):</div>' +
    '<table class="it"><colgroup><col style="width:25%"><col style="width:25%"><col style="width:25%"><col style="width:25%"></colgroup>' +
    '<tr><td class="lbl">ठेवीची रक्कम</td><td class="val">रू. ........................... /-</td><td class="lbl">ठेव सुरु होण्याची दिनांक</td><td class="val">' +
    dtFmt +
    "</td></tr>" +
    '<tr><td class="lbl">नवीन ठेव खाते क्र.</td><td class="val"></td><td class="lbl">नवीन ठेव पावती क्र.</td><td class="val"></td></tr>' +
    "</table>" +
    "</div>";

  var footer =
    '<div style="display:flex;justify-content:space-between;padding:8px 20px 8px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">लिपीक</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">शाखा व्यवस्थापक/अधिकारी</div></div>' +
    "</div>" +
    '<div class="bp" style="font-size:8pt;border-top:1px solid #eee">फॉर्म सोबत घ्यावयाची कागदपत्रे :- १) ठेव पावतीची मूळ प्रत.</div>';

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    payMode +
    tdsDecl +
    finalStmt +
    sigBlock +
    renewal +
    footer +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  FD CLOSING SLIPS  (3 slips: FD-DB-TRF + SAV-CR-TRF + FD INT)
// ═══════════════════════════════════════════════════════
function fdClosingSlips_Page(
  nm,
  dtFmt,
  savAcc,
  fdAcc,
  fdMatAmt,
  fdMatWrd,
  fdAmt,
  fdWrd,
) {
  function orgHdr() {
    return '<div class="sohdr"><div class="sohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  }

  function scrollTbl2(c2l, c2v, c3l, c3v, dc) {
    return (
      '<table class="sst"><tr>' +
      '<th style="width:14%">Scroll No</th><th style="width:22%">' +
      c2l +
      "</th>" +
      '<th style="width:22%">' +
      c3l +
      '</th><th style="width:29%">तारीख</th>' +
      '<th style="width:13%">' +
      dc +
      "</th>" +
      "</tr><tr>" +
      "<td></td><td><strong>" +
      c2v +
      "</strong></td><td><strong>" +
      c3v +
      "</strong></td>" +
      "<td><strong>" +
      dtFmt +
      "</strong></td><td></td>" +
      "</tr></table>"
    );
  }

  // Slip 1: FD-DB-TRF — Debit from FD account → Saving
  var slip1 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>** पैसे काढण्याचा फॉर्म **</span><span class="scode">FD - DB - TRF &nbsp; Debit</span></div>' +
    scrollTbl2("मुदत ठेव खाते क्र.", fdAcc, "बचत खाते क्र.", savAcc, "Debit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0f4ff;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff">FD रक्कम</th><td class="sv"><strong>रू. ' +
    fdAmt +
    ' /-</strong></td><th class="sl" style="background:#f0f4ff;width:22%">अक्षरी</th><td class="sv">' +
    fdWrd +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff">मुदत ठेव खाते क्र.</th><td class="sv"><strong>' +
    fdAcc +
    '</strong></td><th class="sl" style="background:#f0f4ff">बचत खाते क्र.</th><td class="sv"><strong>' +
    savAcc +
    "</strong></td></tr>" +
    '<tr><th class="sl" style="background:#f0f4ff;font-size:8.5pt">Transfer</th><td class="sv" colspan="3" style="font-size:8.5pt;color:#555">FD Account → Saving Account</td></tr>' +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span style="font-size:8pt">लेखापाल / व्यवस्थापक / अधिकारी</span><br><span class="si-name">……………………</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 2: SAV-CR-TRF — Credit maturity amount to Saving (बचत ठेव underlined)
  var slip2 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / मुदत ठेव / <u>बचत ठेव</u> / सभासद ठेव / नाममात्र सदस्य फि</span><span class="scode">SAV - CR - TRF &nbsp; Credit</span></div>' +
    scrollTbl2("मुदत ठेव खाते क्र.", fdAcc, "बचत खाते क्र.", savAcc, "Credit") +
    '<table class="sct compact-slip">' +
    '<tr><th class="sl" style="background:#f0fff4;width:38%">खातेदाराचे नाव</th><td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' +
    nm +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0fff4">FD Maturity रक्कम</th><td class="sv"><strong>रू. ' +
    (fdMatAmt || "_____________") +
    ' /-</strong></td><th class="sl" style="background:#f0fff4;width:22%">अक्षरी</th><td class="sv">' +
    (fdMatWrd || "____________") +
    "</td></tr>" +
    '<tr><th class="sl" style="background:#f0fff4">मुदत ठेव खाते क्र.</th><td class="sv"><strong>' +
    fdAcc +
    '</strong></td><th class="sl" style="background:#f0fff4">बचत खाते क्र.</th><td class="sv"><strong>' +
    savAcc +
    "</strong></td></tr>" +
    "</table>" +
    '<div class="sftr">' +
    '<div class="si"><span style="font-size:8pt">लेखापाल / व्यवस्थापक / अधिकारी</span><br><span class="si-name">……………………</span></div>' +
    '<div class="si"><span class="si-name">' +
    nm +
    '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
    "</div>" +
    "</div>";

  // Slip 3: FD INT-DB-TRF — Interest paid from 163-1
  var slip3 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>** Interest Paid on Fixed Deposit **</span><span class="scode">FD INT - DB - TRF &nbsp; Debit</span></div>' +
    '<table class="sst"><tr>' +
    '<th style="width:14%">Scroll No</th><th style="width:22%">व्याज खाते क्र.</th>' +
    '<th style="width:22%">मुदत ठेव खाते क्र.</th><th style="width:29%">तारीख</th>' +
    '<th style="width:13%">Debit</th>' +
    "</tr><tr>" +
    "<td></td><td><strong>163-1</strong></td><td><strong>" +
    fdAcc +
    "</strong></td>" +
    "<td><strong>" +
    dtFmt +
    "</strong></td><td></td>" +
    "</tr></table>" +
    '<div class="sbody" style="font-size:9.5pt">' +
    "Interest Transfer from Acc No 163-1 To Saving Account <strong>" +
    savAcc +
    "</strong><br>" +
    "ठेव खातेदार श्री / श्रीमती <strong>" +
    nm +
    "</strong> यांचे व्याजाचे ....% प्रमाणे रु. .................. /- अक्षरी रू. ..............................." +
    "</div>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">लेखापाल / लिपिक</span></div>' +
    '<div class="si"><span class="si-name">व्यवस्थापक/अधिकारी</span></div>' +
    "</div>" +
    "</div>";

  // Slip 4: FD INT PROV-DB-TRF — Provisional interest from 194-1
  var slip4 =
    '<div class="sblock">' +
    orgHdr() +
    '<div class="stbar"><span>** Interest Provision on Fixed Deposit **</span><span class="scode">FD INT PROV - DB - TRF &nbsp; Debit</span></div>' +
    '<table class="sst"><tr>' +
    '<th style="width:14%">Scroll No</th><th style="width:22%">खाते क्र.</th>' +
    '<th style="width:22%">बचत खाते क्र.</th><th style="width:29%">तारीख</th>' +
    '<th style="width:13%">Debit</th>' +
    "</tr><tr>" +
    "<td></td><td><strong>194-1</strong></td><td><strong>" +
    savAcc +
    "</strong></td>" +
    "<td><strong>" +
    dtFmt +
    "</strong></td><td></td>" +
    "</tr></table>" +
    '<div class="sbody" style="font-size:9.5pt">' +
    "Provisional Interest received from Acc No 00100194000001 for FD Account <strong>" +
    fdAcc +
    "</strong><br>" +
    "ठेव खातेदार श्री / श्रीमती <strong>" +
    nm +
    "</strong> यांचे Provisional व्याजाचे ....% प्रमाणे रु. _____________ /- अक्षरी रू. ..." +
    "</div>" +
    '<div class="sftr">' +
    '<div class="si"><span class="si-name">लेखापाल / लिपिक</span></div>' +
    '<div class="si"><span class="si-name">व्यवस्थापक/अधिकारी</span></div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="spage">' +
    slip1 +
    '<hr class="sdiv">' +
    slip2 +
    '<hr class="sdiv">' +
    slip3 +
    '<hr class="sdiv">' +
    slip4 +
    declLine() +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  SAVING ACCOUNT CLOSING FORM  (बचत खाते बंद अर्ज)
// ═══════════════════════════════════════════════════════
function savingClosing_FormPage(
  nm,
  addr,
  dtFmt,
  mob,
  aadh,
  cid,
  savAcc,
  shrAcc,
  pan,
  comments,
  docPhotos,
) {
  var orgHdr =
    '<div class="ohdr"><div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  var ftitle = '<div class="ftitle">-- बचत खाते बंद अर्ज --</div>';

  var intro =
    '<div class="bp">' +
    "प्रति, शाखा व्यवस्थापक साहेब, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; दि. : <strong>" +
    dtFmt +
    "</strong><br><br>" +
    "महोदय, मी/आम्ही, श्री./सौ. <strong>" +
    nm +
    "</strong>, आपल्या संस्थेत माझ्या नावाने असलेले लघु बचत/बचत खाते क्र. <strong>" +
    savAcc +
    "</strong> हे खाते बंद करण्याची विनंती करीत आहे. खाते उघडतानाचे सर्व नियम, अटी, व्याजदरातील बदल व संस्थेचे उपविधी मला/आम्हाला पूर्णपणे मान्य होते. खाते बंद करताना कोणतीही शिल्लक रक्कम राहणार नाही, याची मला खात्री आहे." +
    "</div>";

  var itbl =
    '<table class="it"><colgroup>' +
    '<col style="width:14%"><col style="width:36%"><col style="width:16%"><col style="width:34%">' +
    "</colgroup>" +
    '<tr><td class="lbl">पूर्ण नाव</td><td class="val vbig">' +
    nm +
    '</td><td class="lbl">बचत खाते क्र.</td><td class="val vbig">' +
    savAcc +
    "</td></tr>" +
    '<tr><td class="lbl">पत्ता</td><td class="val">' +
    addr +
    ' ह.मु.जळगाव जामोद तालुका</td><td class="lbl">शेअर खाते क्र.</td><td class="val">' +
    shrAcc +
    "</td></tr>" +
    '<tr><td class="lbl">मो.न.</td><td class="val">' +
    mob +
    '</td><td class="lbl">सभासद क्र.</td><td class="val">' +
    cid +
    "</td></tr>" +
    '<tr><td class="lbl">आधार कार्ड</td><td class="val">' +
    aadh +
    '</td><td class="lbl">पॅन कार्ड</td><td class="val">' +
    pan +
    "</td></tr>" +
    "</table>";

  // Declaration line + first signature
  var decl1 =
    '<div class="bp" style="font-size:9.5pt">' +
    "वर नमूद केलेली पूर्ण माहिती मी <strong>" +
    nm +
    "</strong>, वाचली असनू ती बरोबर आहे." +
    "</div>" +
    '<div style="display:flex;justify-content:flex-end;padding:4px 20px 8px;border-bottom:1px dashed #aaa">' +
    "<div>" +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Closure reasons checklist
  var reasons =
    '<div class="bp" style="font-size:9pt">' +
    "<strong>बचत खाते बंद करण्याचे कारण (Reason for Closing the Account):</strong><br>" +
    "(✓ करा योग्य पर्याय)<br>" +
    "☐ आवश्यकतेनुसार निधी काढणे &nbsp;&nbsp; ☐ दुसऱ्या बँकेत खाते उघडले &nbsp;&nbsp; ☐ संस्थेशी असमाधानी<br>" +
    "☐ खाते न वापरणे (Inactivity) &nbsp;&nbsp; ☐ इतर: ________________________________________" +
    "</div>";

  // Closure instructions
  var notes =
    '<div class="bp" style="font-size:9pt;background:#fafafa;border-top:1px dashed #bbb">' +
    "<strong>खाते बंद करताना सूचना:</strong><br>" +
    "1. <strong>स्टेशनरी शुल्क वजावट:</strong> खाते बंद करताना अंतिम शिल्लक रकमेवरून ₹ ........../- इतकी रक्कम स्टेशनरी शुल्क म्हणून वजवण्यात येईल.<br>" +
    "2. <strong>पासबुक परत द्या:</strong> ☐ पासबुक मूळ प्रत परत दिली आहे. &nbsp; ☐ पासबुक हरवले/मिळाले नाही.<br>" +
    "3. <strong>शिल्लक रक्कम जमा करण्याचे माध्यम:</strong> ☐ रोख &nbsp;&nbsp; ☐ खात्यात वळवणे: Acc No: ________________________" +
    "</div>";

  // Final amount + second signature
  var finalAmt =
    '<div class="bp" style="font-size:9pt">' +
    "मी खाली सही करणारा/करणारी, माझ्या खात्यावर दिनांक <strong>" +
    dtFmt +
    "</strong> रोजी शिल्लक रक्कम <strong>₹..................../-</strong> (अक्षरी: ₹ ..... ...............................) इतकी असल्याचे मान्य करतो/करते. ही रक्कम मला संस्थेच्या नियमाप्रमाणे स्वीकार्य आहे. संस्थेने मला खात्यावरील संपूर्ण शिल्लक व व्याज रक्कम दिलेली असून, मला संस्थेकडे कोणतीही तक्रार नाही." +
    "</div>" +
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:6px 20px 8px;border-top:1px solid #ccc">' +
    '<div style="font-size:9pt">दि. : <strong>' +
    dtFmt +
    "</strong></div>" +
    "<div>" +
    sigLine(nm, "अर्जदाराची सही") +
    "</div>" +
    "</div>";

  // Deduction detail
  var deduction =
    '<div class="bp" style="font-size:9pt;border-top:1px dashed #bbb">' +
    "<strong>वजावट तपशील:</strong><br>" +
    "• वजवलेली स्टेशनरी फी: ₹ ___________________________<br>" +
    "• शिल्लक रक्कम: ₹ ___________________________<br>" +
    "• अंतिम देय रक्कम: ₹ ___________________________ (अक्षरी: ₹ .......................................................................)" +
    "</div>";

  var footer =
    '<div style="display:flex;justify-content:space-between;padding:8px 20px 8px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">लिपीक</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:9pt">शाखा व्यवस्थापक / अधिकारी</div></div>' +
    "</div>" +
    '<div class="bp" style="font-size:8pt;border-top:1px solid #eee">फॉर्म सोबत घ्यावयाची कागदपत्रे :- १) आधार कार्ड / पॅन कार्ड छायांकित प्रती, २) पासबुकची मूळ प्रत (अथवा हरवले असल्याची लेखी माहिती)</div>';

  return (
    '<div class="page">' +
    orgHdr +
    ftitle +
    intro +
    itbl +
    decl1 +
    reasons +
    notes +
    finalAmt +
    deduction +
    footer +
    photoGrid(docPhotos || []) +
    declLine() +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  SHARED SLIP HELPERS
// ═══════════════════════════════════════════════════════
function _jjuSlipLogo() {
  return (
    '<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">' +
    '<div style="font-size:26pt;font-weight:900;color:#b8860b;line-height:1;font-family:Georgia,serif;letter-spacing:-1px">JJU</div>' +
    '<div style="line-height:1.25">' +
    '<div style="font-size:10.5pt;font-weight:900;color:#1a1a6e">जळगाव जामोद अर्बन</div>' +
    '<div style="font-size:10.5pt;font-weight:900;color:#1a1a6e">को-ऑप क्रेडीट सोसा.मर्या. जळगाव (जा.)र.नं.१०६७</div>' +
    "</div>" +
    "</div>"
  );
}

function _jjuDenomTable(accentBg, totalStr) {
  var B = "1px solid #333";
  var notes = [2000, 1000, 500, 200, 100, 50, 20, 10, 5];
  var rows = "";
  notes.forEach(function (n) {
    rows +=
      "<tr>" +
      '<td style="padding:3px 6px;border:' +
      B +
      ';text-align:center;font-size:8.5pt">' +
      n +
      " X</td>" +
      '<td style="padding:3px 6px;border:' +
      B +
      ';min-width:14mm">&nbsp;</td>' +
      '<td style="padding:3px 6px;border:' +
      B +
      ';min-width:14mm">&nbsp;</td>' +
      '<td style="padding:3px 6px;border:' +
      B +
      ';min-width:8mm">&nbsp;</td>' +
      "</tr>";
  });
  rows +=
    "<tr>" +
    '<td style="padding:3px 6px;border:' +
    B +
    ';font-size:8pt">सिक्का शिक्के</td>' +
    '<td style="padding:3px 6px;border:' +
    B +
    '">&nbsp;</td>' +
    '<td style="padding:3px 6px;border:' +
    B +
    '">&nbsp;</td>' +
    '<td style="padding:3px 6px;border:' +
    B +
    '">&nbsp;</td>' +
    "</tr>";
  rows +=
    '<tr style="background:' +
    accentBg +
    ';font-weight:700">' +
    '<td style="padding:4px 6px;border:' +
    B +
    ';font-size:8.5pt">एकूण/कुल</td>' +
    '<td style="padding:4px 6px;border:' +
    B +
    '">&nbsp;</td>' +
    '<td style="padding:4px 6px;border:' +
    B +
    ';font-weight:800">' +
    (totalStr || "&nbsp;") +
    "</td>" +
    '<td style="padding:4px 6px;border:' +
    B +
    '">&nbsp;</td>' +
    "</tr>";
  return (
    '<table style="border-collapse:collapse;font-size:8.5pt;width:100%">' +
    '<tr style="background:#1a1a6e;color:#fff">' +
    '<th style="padding:4px 6px;border:' +
    B +
    ';text-align:center">मूल्यांकन</th>' +
    '<th style="padding:4px 6px;border:' +
    B +
    ';text-align:center">संख्या</th>' +
    '<th style="padding:4px 6px;border:' +
    B +
    ';text-align:center">रू.</th>' +
    '<th style="padding:4px 6px;border:' +
    B +
    ';text-align:center">पै.</th>' +
    "</tr>" +
    rows +
    "</table>"
  );
}

// builds one deposit/withdrawal slip panel (bank copy or customer copy)
// mode: 'deposit' | 'withdrawal'  copy: 'bank' | 'customer'
function _jjuSlipPanel(
  mode,
  copy,
  nm,
  dtFmt,
  savAcc,
  amtStr,
  wrdStr,
  bankName,
  balStr,
) {
  var B = "1px solid #333";
  var isDeposit = mode === "deposit";
  var isCust = copy === "customer";
  var accentBg = isDeposit ? "#d4edda" : "#fde0e8";
  var accentClr = isDeposit ? "#155724" : "#721c24";
  var titleText = isDeposit
    ? "बचत खाते जमा / जमा पावती / जमा पर्ची"
    : "बचत खाते काढणे / पैसे काढण्याची पावती";
  var copyLabel = isCust
    ? '<div style="font-size:7.5pt;font-weight:700;color:' +
      accentClr +
      ';text-align:right;margin-bottom:3px">— ग्राहक प्रत —</div>'
    : '<div style="font-size:7.5pt;font-weight:700;color:' +
      accentClr +
      ';text-align:right;margin-bottom:3px">— बँक प्रत —</div>';
  var outerBorder = isCust
    ? "border:2px dashed " + accentClr + ";border-radius:6px;"
    : "border:1px solid #333;";

  // ── TOP HEADER: single line — title left | acc+scroll right ─────────
  var topHeader =
    '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1a1a6e;padding-bottom:4px;margin-bottom:8px">' +
    "<div>" +
    '<div style="font-size:10.5pt;font-weight:900;color:#1a1a6e">' +
    titleText +
    "</div>" +
    '<div style="font-size:8pt;color:#555;margin-top:1px">🏦 जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा. मर्या. जळगाव (जा.)</div>' +
    "</div>" +
    '<div style="text-align:right">' +
    '<table style="border-collapse:collapse;font-size:8pt">' +
    '<tr><td style="padding:2px 8px;border:' +
    B +
    ';font-weight:700;white-space:nowrap">बचत खाते क्र.&nbsp;<span style="font-weight:400;font-size:9pt">' +
    savAcc +
    "</span></td></tr>" +
    '<tr><td style="padding:2px 8px;border:' +
    B +
    ';font-weight:700">स्क्रोल क्र.</td></tr>' +
    '<tr><td style="padding:10px 8px;border:' +
    B +
    '">&nbsp;</td></tr>' +
    "</table>" +
    "</div>" +
    "</div>";

  // ── RIGHT COUNTERFOIL ─────────────────────────────────────────────────
  var counterfoil =
    '<div style="padding-left:10px;flex:1;font-size:9pt">' +
    // Date
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
    '<span style="font-weight:700;white-space:nowrap">दिनांक :</span>' +
    '<span style="border-bottom:1px solid #000;flex:1;min-width:40mm;display:inline-block;padding-bottom:1px">&nbsp;' +
    dtFmt +
    "</span>" +
    "</div>" +
    // Name
    '<div style="margin-bottom:2px;font-weight:700">' +
    (isDeposit ? "खात्यात जमा केले / नाव :" : "खात्यातून काढले / नाव :") +
    "</div>" +
    '<div style="border-bottom:1px solid #000;margin-bottom:2px;padding-bottom:2px;font-weight:800;font-size:10pt">&nbsp;' +
    nm +
    "</div>" +
    '<div style="font-size:7.5pt;color:#555;margin-bottom:8px">खातेदाराचे संपूर्ण नांव</div>' +
    // Acc No line — blank (no value shown)
    '<div style="display:flex;align-items:baseline;gap:4px;margin-bottom:10px">' +
    '<span style="border-bottom:1px solid #000;flex:1;min-width:44mm;display:inline-block;font-family:monospace;font-weight:700">&nbsp;</span>' +
    '<span style="white-space:nowrap;font-size:8.5pt">' +
    (isDeposit ? "च्या खात्यामध्ये जमा केले." : "च्या खात्यामधून काढले.") +
    "</span>" +
    "</div>" +
    // Amount
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
    '<div style="border:' +
    B +
    ';padding:5px 10px;font-size:11pt;font-weight:900;min-width:40mm">रू. &nbsp;' +
    amtStr +
    " /-</div>" +
    "</div>" +
    // Words
    '<div style="font-size:8pt;color:#555;margin-bottom:2px">अक्षरी रुपये :</div>' +
    '<div style="border-bottom:1px solid #000;margin-bottom:6px;min-width:80mm;font-style:italic">&nbsp;' +
    wrdStr +
    "</div>" +
    // Balance calculation row
    (balStr && amtStr ? (function() {
      var balNum = parseFloat(balStr.replace(/,/g, '')) || 0;
      var amtNum2 = parseFloat(amtStr.replace(/,/g, '')) || 0;
      var resultNum = isDeposit ? (balNum + amtNum2) : (balNum - amtNum2);
      var resultStr = resultNum.toLocaleString('en-IN');
      var formula = isDeposit
        ? '₹\u00a0' + balStr + '\u00a0/-\u00a0+\u00a0₹\u00a0' + amtStr + '\u00a0/-\u00a0=\u00a0<strong style="font-size:10pt;color:#155724">₹\u00a0' + resultStr + '\u00a0/-</strong>'
        : '₹\u00a0' + balStr + '\u00a0/-\u00a0−\u00a0₹\u00a0' + amtStr + '\u00a0/-\u00a0=\u00a0<strong style="font-size:10pt;color:#721c24">₹\u00a0' + resultStr + '\u00a0/-</strong>';
      var label = isDeposit ? 'एकूण शिल्लक / Total Balance :' : 'उर्वरित शिल्लक / Remaining Balance :';
      return '<div style="background:' + (isDeposit ? '#eafaf1' : '#fdf2f4') + ';border:1px solid ' + (isDeposit ? '#a3d9b1' : '#f0b8c2') + ';border-radius:4px;padding:5px 10px;margin-bottom:6px;font-size:8.5pt">' +
        '<span style="color:#555;font-weight:700">' + label + '</span>&nbsp;&nbsp;' +
        formula +
        '</div>';
    })() : '<div style="margin-bottom:6px"></div>') +
    // footer: रोखपाल LEFT | customer name RIGHT (swapped)
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;padding-top:4px">' +
    '<div style="text-align:center">' +
    '<div style="font-size:8pt;color:#333;border-top:1.5px solid #000;padding-top:3px;margin-top:28px;min-width:55mm;text-align:center">रोखपाल/खातेपाल &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; व्यवस्थापक/अधिकारी</div>' +
    "</div>" +
    '<div style="text-align:center">' +
    '<div style="font-size:8.5pt;font-weight:600;color:#333;border-top:1.5px solid #000;padding-top:3px;margin-top:28px;min-width:50mm;text-align:center">' +
    nm + " / पैसे भरणाऱ्याची सही" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  var denomLeft =
    '<div style="min-width:52mm">' +
    _jjuDenomTable(accentBg, amtStr) +
    "</div>";

  return (
    '<div style="' +
    outerBorder +
    'padding:10px 12px;margin-bottom:10px;page-break-inside:avoid">' +
    copyLabel +
    topHeader +
    '<div style="display:flex;align-items:flex-start;gap:0">' +
    denomLeft +
    counterfoil +
    "</div>" +
    "</div>"
  );
}

// ═══════════════════════════════════════════════════════
//  SAVING DEPOSIT SLIP PAGE  (बचत खाते जमा)
//  Bank copy + Customer copy
// ═══════════════════════════════════════════════════════
function savingDepositSlipPage(nm, dtFmt, savAcc, amt, wrd, bankName, savBal, singleCopy) {
  var amtNum = parseFloat(amt) || 0;
  var amtStr = amtNum > 0 ? amtNum.toLocaleString("en-IN") : "";
  var wrdStr = wrd || "";
  var balStr = savBal && savBal !== "—" ? parseFloat(String(savBal).replace(/,/g,'')).toLocaleString("en-IN") : "";

  // Use savBal as the deposit amount if amt is blank (new saving account flow)
  if (!amtStr && balStr) {
    amtStr = balStr;
    var balNum2 = parseFloat(balStr.replace(/,/g, '')) || 0;
    if (!wrdStr && balNum2 > 0) wrdStr = numberToWords(balNum2);
  }

  // Notes/details table (shown in both bank slip and customer receipt)
  function mkNotesTable(label) {
    return (
      '<table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:0;border-top:1px solid #ccc">' +
      '<tr style="background:#e8f4fd">' +
      '<th colspan="4" style="border:1px solid #bbb;padding:4px 8px;font-size:8.5pt;font-weight:800;color:#1a3a5c;text-align:left">📋 ' + (label || 'व्यवहाराचा तपशील / Transaction Details') + '</th>' +
      '</tr>' +
      '<tr style="background:#f0f0f0">' +
      '<th style="border:1px solid #bbb;padding:3px 7px;width:25%;text-align:left">तपशील / Particulars</th>' +
      '<th style="border:1px solid #bbb;padding:3px 7px;width:25%;text-align:left">खाते क्र. / Acc No</th>' +
      '<th style="border:1px solid #bbb;padding:3px 7px;width:25%;text-align:left">दिनांक / Date</th>' +
      '<th style="border:1px solid #bbb;padding:3px 7px;width:25%;text-align:right">रक्कम / Amount (₹)</th>' +
      '</tr>' +
      '<tr>' +
      '<td style="border:1px solid #ccc;padding:3px 7px;font-weight:700">बचत जमा / Saving Deposit</td>' +
      '<td style="border:1px solid #ccc;padding:3px 7px;font-weight:700">' + savAcc + '</td>' +
      '<td style="border:1px solid #ccc;padding:3px 7px;font-weight:700">' + dtFmt + '</td>' +
      '<td style="border:1px solid #ccc;padding:3px 7px;font-weight:800;text-align:right">₹ ' + (amtStr || '—') + ' /-</td>' +
      '</tr>' +
      '<tr style="background:#fffde7">' +
      '<td colspan="3" style="border:1px solid #bbb;padding:3px 8px;font-weight:800;text-align:right">एकूण / Total :</td>' +
      '<td style="border:1px solid #bbb;padding:3px 7px;font-weight:900;text-align:right;color:#1a3a5c">₹ ' + (amtStr || '—') + ' /-</td>' +
      '</tr>' +
      (wrdStr ? '<tr><td colspan="4" style="border:1px solid #ccc;padding:3px 8px;font-size:8pt;color:#444;font-style:italic">अक्षरी / In Words: ' + wrdStr + ' Only</td></tr>' : '') +
      '</table>'
    );
  }

  // Bank copy slip (always shown)
  function mkBankSlip() {
    return (
      '<div class="sblock" style="margin-bottom:10px">' +
      '<div style="background:#1a1a6e;color:#fff;text-align:center;font-size:9pt;font-weight:800;padding:4px 8px;letter-spacing:0.3px">' +
      'जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७' +
      '</div>' +
      '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / बचत ठेव / <u>बचत जमा</u> / सभासद ठेव / नाममात्र सदस्य फि</span>' +
      '<span class="scode">SAV - CR &nbsp; Credit</span></div>' +
      '<table class="sst"><tr>' +
      '<th style="width:15%">Scroll No</th>' +
      '<th style="width:25%">बचत खाते क्र.</th>' +
      '<th style="width:25%">खाते क्र.</th>' +
      '<th style="width:22%">तारीख</th>' +
      '<th style="width:13%">Credit</th>' +
      '</tr><tr>' +
      '<td></td>' +
      '<td><strong>' + savAcc + '</strong></td>' +
      '<td><strong>43-1</strong></td>' +
      '<td><strong>' + dtFmt + '</strong></td>' +
      '<td><strong>' + (amtStr || '') + '</strong></td>' +
      '</tr></table>' +
      '<table class="sct compact-slip">' +
      '<tr><th class="sl" style="background:#d4edda;width:38%">खातेदाराचे नाव</th>' +
      '<td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' + nm + '</td></tr>' +
      '<tr><th class="sl" style="background:#d4edda">रक्कम</th>' +
      '<td class="sv" colspan="3"><strong>रक्कम रू. ' + amtStr + ' /-</strong>' +
      (wrdStr ? ' <span style="font-size:9pt;font-weight:600">(अक्षरी रू. ' + wrdStr + ')</span>' : '') +
      '</td></tr>' +
      '</table>' +
      mkNotesTable('बँक प्रत / Bank Copy — व्यवहाराचा तपशील') +
      '<div class="sftr">' +
      '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
      '<div class="si"><span class="si-name">' + nm + '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
      '</div>' +
      '</div>'
    );
  }

  // Customer receipt (only shown when singleCopy is false/undefined)
  function mkCustomerReceipt() {
    return (
      '<div class="sblock" style="margin-bottom:10px;border:2px solid #1a1a6e">' +
      '<div style="background:#1a1a6e;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:4px 10px">' +
      '<span style="font-size:9pt;font-weight:800">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या.</span>' +
      '<span style="font-size:9pt;font-weight:900;background:#fff;color:#1a1a6e;padding:1px 8px;border-radius:3px">ग्राहक पावती / Customer Receipt</span>' +
      '</div>' +
      '<div class="stbar"><span>प्रवेश फि / स्टेशनरी / लघुबचत / बचत ठेव / <u>बचत जमा</u> / सभासद ठेव / नाममात्र सदस्य फि</span>' +
      '<span class="scode">SAV - CR &nbsp; Credit</span></div>' +
      '<table class="sst"><tr>' +
      '<th style="width:15%">Scroll No</th>' +
      '<th style="width:25%">बचत खाते क्र.</th>' +
      '<th style="width:25%">खाते क्र.</th>' +
      '<th style="width:22%">तारीख</th>' +
      '<th style="width:13%">Credit</th>' +
      '</tr><tr>' +
      '<td></td>' +
      '<td><strong>' + savAcc + '</strong></td>' +
      '<td><strong>43-1</strong></td>' +
      '<td><strong>' + dtFmt + '</strong></td>' +
      '<td><strong>' + (amtStr || '') + '</strong></td>' +
      '</tr></table>' +
      '<table class="sct compact-slip">' +
      '<tr><th class="sl" style="background:#d4edda;width:38%">खातेदाराचे नाव</th>' +
      '<td class="sv" style="font-size:11pt;font-weight:800" colspan="3">' + nm + '</td></tr>' +
      '<tr><th class="sl" style="background:#d4edda">रक्कम</th>' +
      '<td class="sv" colspan="3"><strong>रक्कम रू. ' + amtStr + ' /-</strong>' +
      (wrdStr ? ' <span style="font-size:9pt;font-weight:600">(अक्षरी रू. ' + wrdStr + ')</span>' : '') +
      '</td></tr>' +
      '</table>' +
      mkNotesTable('ग्राहक प्रत / Customer Copy — व्यवहाराचा तपशील') +
      '<div class="sftr">' +
      '<div class="si"><span class="si-name">रोखपाल/व्यवस्थापक/अधिकारी</span></div>' +
      '<div class="si"><span class="si-name">' + nm + '</span><span style="font-size:8pt">खातेदाराची सही</span></div>' +
      '</div>' +
      '</div>'
    );
  }

  // singleCopy=true → only 1 bank slip (used for new saving account opening)
  // singleCopy=false/undefined → bank copy + customer receipt (standard deposit)
  return (
    '<div class="spage">' +
    mkBankSlip() +
    (singleCopy ? '' : ('<hr class="sdiv">' + mkCustomerReceipt())) +
    declLine() +
    '</div>'
  );
}

// ═══════════════════════════════════════════════════════
//  SAVING WITHDRAWAL SLIP PAGE  (बचत खाते काढणे)
//  Bank copy + Customer copy
// ═══════════════════════════════════════════════════════
function savingWithdrawalSlipPage(nm, dtFmt, savAcc, amt, wrd, bankName, savBal) {
  var amtNum = parseFloat(amt) || 0;
  var amtStr = amtNum > 0 ? amtNum.toLocaleString("en-IN") : "";
  var wrdStr = wrd || "";
  var balStr = savBal && savBal !== "—" ? parseFloat(savBal).toLocaleString("en-IN") : "";

  var custReceipt = "";
  if (balStr && amtStr) {
    var balNum = parseFloat(balStr.replace(/,/g, '')) || 0;
    var amtNum2 = parseFloat(amtStr.replace(/,/g, '')) || 0;
    var remainNum = balNum - amtNum2;
    var remainStr = remainNum.toLocaleString('en-IN');
    custReceipt =
      '<div style="border:2px dashed #721c24;border-radius:6px;padding:10px 14px;margin-bottom:10px;page-break-inside:avoid;font-size:9pt">' +
      '<table style="width:100%;font-size:9pt">' +
      '<tr><td style="color:#555;width:40%">दिनांक :</td><td><strong>' + dtFmt + '</strong></td></tr>' +
      '<tr><td style="color:#555">नाव :</td><td><strong>' + nm + '</strong></td></tr>' +
      '<tr><td style="color:#555">बचत खाते क्र. :</td><td><strong>' + savAcc + '</strong></td></tr>' +
      '<tr><td style="color:#555">रक्कम :</td><td><strong>₹ ' + amtStr + ' /- (' + wrdStr + ')</strong></td></tr>' +
      '<tr><td style="color:#555">उर्वरित शिल्लक :</td><td><strong style="color:#721c24">₹ ' + balStr + ' /- − ₹ ' + amtStr + ' /- = ₹ ' + remainStr + ' /-</strong></td></tr>' +
      '</table>' +
      '</div>';
  }

  return (
    '<div class="page" style="padding:12px">' +
    _jjuSlipPanel(
      "withdrawal",
      "bank",
      nm,
      dtFmt,
      savAcc,
      amtStr,
      wrdStr,
      bankName,
      balStr,
    ) +
    custReceipt +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  BANK TRANSACTION VOUCHER PAGE
//  Generates: 1) Saving Deposit Slip  2) Saving Withdrawal Slip  3) Bank Voucher
// ═══════════════════════════════════════════════════════
function bankTransactionVoucherPage(
  txType,
  nm,
  dtFmt,
  savAcc,
  bankAccName,
  expAccNo,
  expAmt,
  expWrd,
  upiRrn,
  chequeNo,
  comments,
) {
  var amtNum = parseFloat(expAmt) || 0;
  var amtStr = amtNum > 0 ? amtNum.toLocaleString("en-IN") : "__________";
  var wrdStr = expWrd || "______________________";
  var upiStr = upiRrn
    ? "UPI RRN: " + upiRrn
    : chequeNo
      ? "Cheque No: " + chequeNo
      : "";

  var TXLABELS = {
    "Payment Received - Online": {
      title: "Payment Received - Online",
      dc: "Credit",
      code: "BANK - CR - TRF",
    },
    "Payment Transfer - Online": {
      title: "Payment Transfer - Online",
      dc: "Debit",
      code: "BANK - DB - TRF",
    },
    RTGS: { title: "RTGS Transfer", dc: "Debit", code: "RTGS - DB - TRF" },
    "Bank Charges": {
      title: "Bank Charges",
      dc: "Debit",
      code: "BANK CHG - DB - TRF",
    },
    "Other Bank - Cash Withdrawal": {
      title: "Other Bank Cash Withdrawal",
      dc: "Debit",
      code: "OTHER BANK - DB",
    },
    "Other Bank - Cash Deposit": {
      title: "Other Bank Cash Deposit",
      dc: "Credit",
      code: "OTHER BANK - CR",
    },
    TDS: { title: "TDS", dc: "Debit", code: "TDS - DB - TRF" },
    "Interest Received on FD from Other Bank": {
      title: "Interest Received on FD",
      dc: "Credit",
      code: "INT FD - CR - TRF",
    },
  };
  var lbl = TXLABELS[txType] || {
    title: txType,
    dc: "Credit",
    code: "BANK - TRF",
  };
  var isCredit = lbl.dc === "Credit";

  function orgHdr() {
    return '<div class="sohdr"><div class="sohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div></div>';
  }

  // ── Slip 1: Saving Deposit (Credit to saving acc) ──────────────────────────
  var depSlip = savingDepositSlipPage(
    nm,
    dtFmt,
    savAcc,
    expAmt,
    expWrd,
    bankAccName,
  );

  // ── Slip 2: Saving Withdrawal (Debit from saving acc) ──────────────────────
  var wdSlip = savingWithdrawalSlipPage(
    nm,
    dtFmt,
    savAcc,
    expAmt,
    expWrd,
    bankAccName,
  );

  // ── Slip 3: Bank Voucher ────────────────────────────────────────────────────
  var voucherBg = isCredit ? "#f0f4ff" : "#fff8f0";
  var voucherHdr = isCredit ? "#1e40af" : "#b45309";

  var voucherSlip =
    '<div class="page" style="padding:12px 16px;font-size:9pt">' +
    orgHdr() +
    '<div style="text-align:center;font-weight:900;font-size:10pt;margin:6px 0 4px;border-bottom:2px solid #333;padding-bottom:4px">' +
    "Voucher for Bank Transactions - Transfer (" +
    lbl.dc +
    ")(* " +
    (upiRrn
      ? "UPI RRN- " + upiRrn
      : chequeNo
        ? "Cheque No- " + chequeNo
        : "UPI Id- ") +
    ")" +
    "</div>" +
    // Voucher table matching screenshot
    '<table style="width:100%;border-collapse:collapse;font-size:9pt;margin-top:8px">' +
    '<thead><tr style="background:' +
    voucherHdr +
    ';color:#fff">' +
    '<th style="padding:5px 8px;border:1px solid #999;text-align:left;width:12%">Scroll No</th>' +
    '<th style="padding:5px 8px;border:1px solid #999;text-align:left;width:22%">Name</th>' +
    '<th style="padding:5px 8px;border:1px solid #999;text-align:left;width:30%">Acc Type</th>' +
    '<th style="padding:5px 8px;border:1px solid #999;text-align:left;width:18%">Acc No</th>' +
    '<th style="padding:5px 8px;border:1px solid #999;text-align:right;width:18%">Amount</th>' +
    "</tr></thead>" +
    "<tbody>" +
    "<tr>" +
    '<td style="padding:6px 8px;border:1px solid #ccc;height:40px"></td>' +
    '<td style="padding:6px 8px;border:1px solid #ccc;font-weight:700">' +
    nm +
    "</td>" +
    '<td style="padding:6px 8px;border:1px solid #ccc">' +
    (bankAccName || lbl.code) +
    "</td>" +
    '<td style="padding:6px 8px;border:1px solid #ccc">' +
    (expAccNo || savAcc) +
    "</td>" +
    '<td style="padding:6px 8px;border:1px solid #ccc;text-align:right;font-weight:700">₹' +
    amtStr +
    ".00</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>" +
    '<div style="margin-top:12px;font-size:9pt;font-weight:700">Total Amount: ₹' +
    amtStr +
    ".00 (" +
    wrdStr +
    ")</div>" +
    (comments
      ? '<div style="margin-top:6px;font-size:8.5pt;color:#555"><strong>Comments:</strong> ' +
        comments +
        "</div>"
      : "") +
    '<div style="display:flex;justify-content:space-between;margin-top:30px;padding-top:12px;border-top:1px solid #000">' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:8.5pt">Prepared By</div></div>' +
    '<div style="text-align:center"><div style="border-bottom:1px solid #000;height:18px;min-width:50mm;margin-bottom:4px"></div><div style="font-size:8.5pt">Authorised Signatory</div></div>' +
    "</div>" +
    "</div>";

  return depSlip + wdSlip + voucherSlip;
}

// ═══════════════════════════════════════════════════════
//  MIS INTEREST SLIPS PAGE
//  4 horizontal slips stacked on one A4 page
//  Matches sblock/spage style of other slip pages
// ═══════════════════════════════════════════════════════
function misInterestSlipsPage(
  nm,
  dtFmt,
  savAcc,
  misAccNo,
  fdAmt,
  fdWrd,
  fdPrd,
  fdRate,
  fdMat,
  intAmt,
  intWrd,
  misMonth,
) {
  var BANK =
    "जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७";
  var misAcc = misAccNo && misAccNo !== "—" ? misAccNo : "290-";
  var savingAcc = savAcc && savAcc !== "—" ? savAcc : "43-";
  var monthStr = misMonth && misMonth !== "—" ? misMonth : "";

  var intAmtNum = parseFloat(intAmt) || 0;
  var intAmtFmt =
    intAmtNum > 0
      ? intAmtNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })
      : "__________";
  var intWrdStr =
    intWrd && intWrd !== "—"
      ? intWrd
      : intAmtNum > 0
        ? convertNumberToWords(intAmtNum)
        : "______________________";
  var dateStr = dtFmt && dtFmt !== "—" ? dtFmt : "________";
  var monthLabel = monthStr ? " [" + monthStr + "]" : "";

  // Compact styles inlined so they don't depend on sct/sftr spacings
  var T =
    'style="width:100%;border-collapse:collapse;font-size:8pt;table-layout:fixed"';
  var TH =
    'style="border:1px solid #ccc;padding:3px 6px;font-weight:600;background:';
  var TD = 'style="border:1px solid #ccc;padding:3px 6px;font-weight:700"';
  var TDc = 'style="border:1px solid #ccc;padding:3px 6px"';

  function slip(title, code, accType, accNo, dcLabel, bgColor) {
    return (
      '<div style="border:1.5px solid #000;margin-bottom:0">' +
      // Header
      "<div style=\"text-align:center;padding:2px 6px;border-bottom:1px solid #000;background:#fafafa;font-family:'Noto Serif Devanagari',serif;font-size:8.5pt;font-weight:700;line-height:1.2\">" +
      BANK +
      "</div>" +
      // Title bar
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 8px;border-bottom:1px solid #000;background:#eef8f0;font-size:8pt;font-weight:700">' +
      "<span>" +
      title +
      monthLabel +
      "</span>" +
      '<span style="font-size:8pt;font-weight:800;color:#0a4a1a">' +
      code +
      "</span>" +
      "</div>" +
      // Scroll row
      "<table " +
      T +
      "><tr>" +
      "<th " +
      TH +
      '#ececec;width:12%">Scroll No</th>' +
      "<th " +
      TH +
      '#ececec;width:32%">Acc Type</th>' +
      "<th " +
      TH +
      '#ececec;width:18%">Acc No</th>' +
      "<th " +
      TH +
      '#ececec;width:26%">Date</th>' +
      "<th " +
      TH +
      '#ececec;width:12%">' +
      dcLabel +
      "</th>" +
      "</tr><tr>" +
      "<td " +
      TDc +
      "></td>" +
      "<td " +
      TD +
      ">" +
      accType +
      "</td>" +
      "<td " +
      TD +
      ">" +
      accNo +
      "</td>" +
      "<td " +
      TD +
      ">" +
      dateStr +
      "</td>" +
      "<td " +
      TDc +
      "></td>" +
      "</tr></table>" +
      // Info rows
      "<table " +
      T +
      ">" +
      "<tr>" +
      "<th " +
      TH +
      bgColor +
      ';width:22%">खातेदाराचे नाव</th>' +
      "<td " +
      TDc +
      ' colspan="3" style="border:1px solid #ccc;padding:3px 6px;font-size:9pt;font-weight:800">' +
      nm +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th " +
      TH +
      bgColor +
      '">रक्कम / Amount</th>' +
      "<td " +
      TDc +
      ' colspan="3" style="border:1px solid #ccc;padding:3px 6px"><strong>रू. ' +
      intAmtFmt +
      ' /-</strong> <span style="font-size:8pt">(' +
      intWrdStr +
      ")</span></td>" +
      "</tr>" +
      "</table>" +
      // Signature row
      '<div style="display:flex;justify-content:space-between;padding:4px 14px 5px;border-top:1px solid #ddd">' +
      '<div style="text-align:center;font-size:7.5pt">' +
      "लेखापाल / व्यवस्थापक / अधिकारी" +
      '<div style="border-top:1px solid #000;min-width:55mm;margin-top:10px;padding-top:2px">&nbsp;</div>' +
      "</div>" +
      '<div style="text-align:center">' +
      '<div style="border-top:1px solid #000;min-width:55mm;margin-top:10px;padding-top:2px;font-size:8.5pt;font-weight:800">' +
      nm +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  var SEP = '<div style="border-top:2px dashed #555;margin:4px 0"></div>';

  return (
    '<div style="background:#fff;width:210mm;margin:0 auto;padding:6mm 8mm;box-sizing:border-box;' +
    'page-break-after:avoid;page-break-inside:avoid">' +
    slip(
      "** व्याज प्रदान — MIS Special **",
      "MIS INT - DB - TRF · Debit",
      "Int Paid On MIS Special - TRF",
      "187-1",
      "Debit",
      "#fff3e0",
    ) +
    SEP +
    slip(
      "** MIS Special — जमा (Credit) **",
      "MIS TRF - CR - TRF · Credit",
      "MIS TRF",
      misAcc,
      "Credit",
      "#e8f5e9",
    ) +
    SEP +
    slip(
      "** MIS Special — नावे (Debit) **",
      "MIS TRF - DB - TRF · Debit",
      "MIS TRF",
      misAcc,
      "Debit",
      "#fff3e0",
    ) +
    SEP +
    slip(
      "बचत ठेव — Saving Acc Transfer",
      "SAV - CR - TRF · Credit",
      "Saving Acc TRF",
      savingAcc,
      "Credit",
      "#e8f5e9",
    ) +
    "</div>" +
    '<div class="spage-blank"></div>'
  );
}

// ═══════════════════════════════════════════════════════
//  EMPLOYEE SALARY VOUCHER PAGE
//  Full-page professional voucher with month/year field
// ═══════════════════════════════════════════════════════
function employeeSalaryPage(
  nm,
  dtFmt,
  savAcc,
  salAmt,
  salWrd,
  salMonth,
  comments,
) {
  var amtNum = parseFloat(salAmt) || 0;
  var amtFmt = amtNum > 0 ? amtNum.toLocaleString("en-IN") : salAmt;

  var monthRow =
    salMonth && salMonth !== "—"
      ? '<tr><td class="lbl">पगार महिना / Salary Month</td>' +
        '<td class="val vbig" style="color:#1a3a5c;letter-spacing:0.3px">' +
        salMonth +
        "</td></tr>"
      : '<tr><td class="lbl">पगार महिना / Salary Month</td><td class="val">__________</td></tr>';

  var amtRow =
    amtNum > 0
      ? 'रू. <span style="font-size:13pt;font-weight:900;color:#1a3a5c">₹ ' +
        amtFmt +
        " /-</span>"
      : "रू. " + (salAmt || "___________") + " /-";

  var infoTbl =
    '<table class="it" style="margin:0"><colgroup>' +
    '<col style="width:35%"><col style="width:65%">' +
    "</colgroup>" +
    '<tr><td class="lbl">पूर्ण नाव / Name</td><td class="val vbig">' +
    nm +
    "</td></tr>" +
    '<tr><td class="lbl">दिनांक / Date</td><td class="val">' +
    dtFmt +
    "</td></tr>" +
    monthRow +
    '<tr><td class="lbl">बचत खाते / Saving Acc</td><td class="val vbig">' +
    savAcc +
    "</td></tr>" +
    '<tr style="background:#eef8f0">' +
    '<td class="lbl" style="font-size:10pt;color:#1a3a5c">वेतन रक्कम / Salary Amount</td>' +
    '<td class="val" style="font-size:11pt;font-weight:900">' +
    amtRow +
    "</td>" +
    "</tr>" +
    '<tr><td class="lbl">अक्षरी / In Words</td><td class="val" style="font-style:italic">' +
    (salWrd || "___________") +
    "</td></tr>" +
    (comments && comments !== "—"
      ? '<tr><td class="lbl">शेरा / Notes</td><td class="val">' +
        comments +
        "</td></tr>"
      : "") +
    "</table>";

  // Declaration
  var decl =
    '<div class="bp yl" style="font-size:9.5pt;line-height:2">' +
    "हे प्रमाणपत्र देण्यात येते की, " +
    "<strong>" +
    nm +
    "</strong> यांना " +
    (salMonth && salMonth !== "—"
      ? "<strong>" + salMonth + "</strong> महिन्याचे"
      : "सदर महिन्याचे") +
    " वेतन रू. <strong>₹ " +
    amtFmt +
    " /- (अक्षरी: " +
    (salWrd || "___________") +
    ")</strong> " +
    "संस्थेच्या नियमानुसार त्यांच्या बचत खाते क्र. <strong>" +
    savAcc +
    "</strong> मध्ये जमा करण्यात आले आहे." +
    "<br><br>वरील वेतन रक्कम प्राप्त झाल्याबद्दल मी खालीलप्रमाणे सही करतो/करते." +
    "</div>";

  // Accounts entry section
  var acctEntry =
    '<div class="bp gr" style="font-size:9pt">' +
    "<strong>खाते प्रविष्टी / Journal Entry:</strong><br>" +
    "Dr &nbsp;&nbsp; वेतन व भत्ते खाते (Salary & Allowances A/c 102-1) &nbsp;&nbsp; ₹ " +
    amtFmt +
    " /-<br>" +
    "Cr &nbsp;&nbsp; बचत खाते (Saving A/c " +
    savAcc +
    ") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹ " +
    amtFmt +
    " /-" +
    "</div>";

  // Rules
  var rules =
    '<div class="rules">' +
    '<div class="rules-t">* वेतन अदायगी नियम व अटी *</div>' +
    '<div class="rule">वेतन रक्कम कर्मचाऱ्याच्या बचत खात्यात जमा करण्यात येते.</div>' +
    '<div class="rule">वेतन प्रत्येक महिन्याच्या ठरलेल्या तारखेला अदा केले जाते. तारीख बदलण्याचा अधिकार व्यवस्थापनास राहील.</div>' +
    '<div class="rule">कर वजावट (TDS), भविष्य निर्वाह निधी (PF) आणि इतर वैधानिक कपाती नियमांनुसार लागू राहतील.</div>' +
    '<div class="rule">कर्मचाऱ्याने वेतन पावतीवर सही करणे बंधनकारक आहे. सही नसल्यास वेतन अदायगी अवैध मानण्यात येईल.</div>' +
    '<div class="rule" style="border-bottom:none">कोणत्याही वेतन विषयक तक्रारी लेखी स्वरूपात व्यवस्थापकांकडे सादर कराव्यात.</div>' +
    "</div>";

  // Signature row
  var sigBlock =
    '<div style="display:flex;justify-content:space-between;padding:18px 24px 14px;border-top:1.5px solid #000;margin-top:4px">' +
    '<div style="text-align:center">' +
    '<div style="border-bottom:1.5px solid #000;height:22px;min-width:60mm;margin-bottom:5px"></div>' +
    '<div style="font-size:9.5pt;font-weight:700">' +
    nm +
    "</div>" +
    '<div style="font-size:8pt;color:#555">कर्मचाऱ्याची सही / Employee Signature</div>' +
    "</div>" +
    '<div style="text-align:center">' +
    '<div style="border-bottom:1.5px solid #000;height:22px;min-width:60mm;margin-bottom:5px"></div>' +
    '<div style="font-size:9.5pt;font-weight:700">प्राधिकृत अधिकारी</div>' +
    '<div style="font-size:8pt;color:#555">Authorised Officer</div>' +
    "</div>" +
    "</div>";

  return (
    '<div class="page">' +
    '<div class="ohdr">' +
    '<div class="ohdr-name">जळगाव जामोद अर्बन को-ऑपरेटीव्ह क्रेडीट सोसा.मर्या. जळगाव (जा.)जि.बुलढाणा र.नं.१०६७</div>' +
    "</div>" +
    '<div class="ftitle">✦ Employee Salary Voucher — वेतन पावती ✦</div>' +
    infoTbl +
    decl +
    acctEntry +
    rules +
    sigBlock +
    "</div>"
  );
}
