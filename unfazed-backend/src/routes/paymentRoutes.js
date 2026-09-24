const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
} = require('../controllers/paymentController');

router.use(protect); // All payment routes are protected

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPaymentById)
  .patch(updatePayment);

module.exports = router;
