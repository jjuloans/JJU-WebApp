'use strict';
const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// ── Pure calculation functions (no DB needed) ─────────────────────────────

// Simple interest: I = P × R × T / 100
function simpleInterest(principal, ratePercent, days) {
  const interest = (principal * ratePercent * days) / (100 * 365);
  return { principal, rate: ratePercent, days, interest: round(interest), total: round(principal + interest) };
}

// Compound interest: A = P(1 + R/n)^(nT)
function compoundInterest(principal, ratePercent, months, compoundsPerYear = 4) {
  const r = ratePercent / 100;
  const t = months / 12;
  const n = compoundsPerYear;
  const amount   = principal * Math.pow(1 + r / n, n * t);
  const interest = amount - principal;
  return { principal, rate: ratePercent, months, compounds_per_year: n, interest: round(interest), total: round(amount) };
}

// FD maturity: compound quarterly (standard Indian bank practice)
function fdMaturity(principal, ratePercent, months) {
  return compoundInterest(principal, ratePercent, months, 4);
}

// Gold loan interest: simple, calculated daily
function goldLoanInterest(principal, ratePercent, fromDate, toDate) {
  const from = new Date(fromDate);
  const to   = toDate ? new Date(toDate) : new Date();
  const days = Math.max(0, Math.round((to - from) / (1000 * 60 * 60 * 24)));
  return { ...simpleInterest(principal, ratePercent, days), from_date: fromDate, to_date: to.toISOString().split('T')[0] };
}

// EMI calculator: E = P × r × (1+r)^n / ((1+r)^n - 1)
function emiCalculator(principal, annualRatePercent, tenureMonths) {
  const r = (annualRatePercent / 100) / 12;
  if (r === 0) {
    const emi = principal / tenureMonths;
    return { principal, rate: annualRatePercent, tenure_months: tenureMonths, emi: round(emi), total_payment: round(emi * tenureMonths), total_interest: 0 };
  }
  const emi     = principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
  const total   = emi * tenureMonths;
  const interest = total - principal;
  return { principal, rate: annualRatePercent, tenure_months: tenureMonths, emi: round(emi), total_payment: round(total), total_interest: round(interest) };
}

// Amortization schedule
function amortizationSchedule(principal, annualRatePercent, tenureMonths) {
  const r     = (annualRatePercent / 100) / 12;
  const emi   = principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
  let balance = principal;
  const schedule = [];
  for (let m = 1; m <= tenureMonths; m++) {
    const interest  = balance * r;
    const principal_part = emi - interest;
    balance -= principal_part;
    schedule.push({
      month:          m,
      emi:            round(emi),
      principal_part: round(principal_part),
      interest_part:  round(interest),
      balance:        round(Math.max(0, balance)),
    });
  }
  return schedule;
}

function round(n) { return Math.round(n * 100) / 100; }

// ── Routes ────────────────────────────────────────────────────────────────

// POST /api/interest/simple
// Body: { principal, rate, days }
router.post('/simple', (req, res) => {
  try {
    const { principal, rate, days } = req.body;
    if (!principal || !rate || !days) return res.status(400).json({ error: 'principal, rate, days required' });
    res.json(simpleInterest(parseFloat(principal), parseFloat(rate), parseInt(days)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/interest/gold-loan
// Body: { principal, rate, from_date, to_date? }
router.post('/gold-loan', (req, res) => {
  try {
    const { principal, rate, from_date, to_date } = req.body;
    if (!principal || !rate || !from_date) return res.status(400).json({ error: 'principal, rate, from_date required' });
    res.json(goldLoanInterest(parseFloat(principal), parseFloat(rate), from_date, to_date));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/interest/fd
// Body: { principal, rate, months }
router.post('/fd', (req, res) => {
  try {
    const { principal, rate, months } = req.body;
    if (!principal || !rate || !months) return res.status(400).json({ error: 'principal, rate, months required' });
    res.json(fdMaturity(parseFloat(principal), parseFloat(rate), parseInt(months)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/interest/emi
// Body: { principal, rate, tenure_months }
router.post('/emi', (req, res) => {
  try {
    const { principal, rate, tenure_months } = req.body;
    if (!principal || !rate || !tenure_months) return res.status(400).json({ error: 'principal, rate, tenure_months required' });
    res.json(emiCalculator(parseFloat(principal), parseFloat(rate), parseInt(tenure_months)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/interest/amortization
// Body: { principal, rate, tenure_months }
router.post('/amortization', (req, res) => {
  try {
    const { principal, rate, tenure_months } = req.body;
    if (!principal || !rate || !tenure_months) return res.status(400).json({ error: 'principal, rate, tenure_months required' });
    const schedule = amortizationSchedule(parseFloat(principal), parseFloat(rate), parseInt(tenure_months));
    res.json({ schedule, summary: emiCalculator(parseFloat(principal), parseFloat(rate), parseInt(tenure_months)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
module.exports.simpleInterest  = simpleInterest;
module.exports.fdMaturity      = fdMaturity;
module.exports.goldLoanInterest = goldLoanInterest;
module.exports.emiCalculator   = emiCalculator;

/*
── ADD TO server.js ──────────────────────────────────────────────────────────
  app.use('/api/interest', require('./features/interest/interest.routes'));
*/
