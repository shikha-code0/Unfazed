const express = require('express');
const router = express.Router();
const {
  getMyAvailability,
  updateMyAvailability,
  getPublicAvailability,
} = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/public/:slug', getPublicAvailability);

// Protected routes
router.get('/me', protect, getMyAvailability);
router.put('/me', protect, updateMyAvailability);

module.exports = router;
