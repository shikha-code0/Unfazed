const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getInvoices,
  createInvoice,
  markAsPaid,
} = require('../controllers/paymentController');

router.use(protect); // All payment routes are protected

router.route('/invoices')
  .get(getInvoices)
  .post(createInvoice);

router.patch('/invoices/:id/pay', markAsPaid);

module.exports = router;
