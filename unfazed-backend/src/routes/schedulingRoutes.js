const express = require('express');
const router = express.Router();
const {
  getPublicSlots,
  bookSession,
  getMySchedule,
  getMySession,
  updateMySession,
  cancelMySession,
} = require('../controllers/schedulingController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/public/:slug/slots', getPublicSlots);
router.post('/book', bookSession);

// Protected routes (therapist only)
router.get('/me', protect, getMySchedule);
router.get('/me/:sessionId', protect, getMySession);
router.patch('/me/:sessionId', protect, updateMySession);
router.patch('/me/:sessionId/cancel', protect, cancelMySession);

module.exports = router;
