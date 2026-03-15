'use strict';
const router = require('express').Router();
const c = require('../controllers/records.controller');
const { requireAuth } = require('../middleware/auth');

// FIX #2: all records routes require a valid session
router.use(requireAuth);

// ── IMPORTANT: specific routes MUST come before /:id ──────────────────────
router.get ('/stats',                   c.stats);
router.get ('/deleted',                 c.listDeleted);
router.get ('/next-loan-no/:prefix',    c.nextLoanNo);
router.get ('/check-loan-no/:no',       c.checkLoanNo);
router.get ('/next-fd-acc-no/:prefix',  c.nextFdAccNo);
router.get ('/check-fd-acc-no/:no',     c.checkFdAccNo);
router.get ('/next-mis-acc-no/:prefix', c.nextMisAccNo);
router.get ('/check-mis-acc-no/:no',    c.checkMisAccNo);
router.get ('/customers/search',        c.customerSearch);
router.post('/process-transaction',     c.processTransaction);
router.post('/import/bulk',             c.importBulk);

// ── Generic CRUD ──────────────────────────────────────────────────────────
router.get ('/',        c.list);
router.post('/',        c.create);
router.get ('/:id',     c.getOne);
router.put ('/:id',     c.update);
router.delete('/:id',   c.softDelete);

// ── Status mutations ──────────────────────────────────────────────────────
router.patch('/:id/close',       c.close);
router.patch('/:id/reopen',      c.reopen);
router.patch('/:id/soft-delete', c.softDeletePatch);
router.patch('/:id/restore',     c.restore);
// FIX #10: permanentDelete now also requires soft-delete first (enforced in controller)
router.delete('/:id/permanent',  c.permanentDelete);

module.exports = router;
