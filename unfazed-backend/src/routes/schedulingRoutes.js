const express = require('express');
const router = express.Router();
const {
  getPublicSlots,
  bookSession,
  getMySchedule,
  getMySession,
  updateMySession,
  cancelMySession,
  createMySession,
} = require('../controllers/schedulingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/public/:slug/slots', getPublicSlots);
router.post('/book', bookSession);

// Protected routes (therapist only)
router.route('/me')
  .get(protect, getMySchedule)
  .post(protect, createMySession);

router.get('/me/:sessionId', protect, getMySession);
router.patch('/me/:sessionId', protect, updateMySession);
router.patch('/me/:sessionId/cancel', protect, cancelMySession);

module.exports = router;
