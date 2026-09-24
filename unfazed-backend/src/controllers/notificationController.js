const Notification = require('../models/Notification');

// @desc    Get all notifications for logged in user (Therapist or Client)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    // Check if therapist or client is logged in
    const userId = req.therapist ? req.therapist._id : req.client._id;
    const userType = req.therapist ? 'therapist' : 'client';

    const notifications = await Notification.find({ userId, userType })
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.therapist ? req.therapist._id : req.client._id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.therapist ? req.therapist._id : req.client._id;
    
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
