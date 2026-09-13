const express = require('express');
const router = express.Router();
const {
  getLoggedInProfile,
  updateLoggedInProfile,
  getPublicProfile,
} = require('../controllers/therapistController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/public/:slug', getPublicProfile);

// Protected routes
router.get('/me', protect, getLoggedInProfile);
router.put('/me', protect, updateLoggedInProfile);

module.exports = router;
