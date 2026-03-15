'use strict';
const router = require('express').Router();
const c = require('../controllers/cashbook.controller');
const { requireAuth } = require('../middleware/auth');

// FIX #2: all cashbook routes require a valid session
router.use(requireAuth);

router.get ('/deleted', c.listDeleted);
router.get ('/',        c.list);
router.post('/bulk',    c.bulkInsert);
router.put ('/:id',     c.update);
router.patch('/:id/soft-delete', c.softDelete);
router.patch('/:id/restore',     c.restore);
router.delete('/:id',  c.permanentDelete);

module.exports = router;
