const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');

// For notifications, we need a flexible middleware that allows either therapist OR client
// We will create a flexible one or just use existing protect if we update it.
// Assuming we have a unified protect or specific routes, for now we will assume the updated protect middleware handles both, or we can use it.
const { protectAny } = require('../middleware/authMiddleware');

router.use(protectAny);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;
