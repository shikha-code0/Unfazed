const Session = require('../models/Session');
const Client = require('../models/Client');
const Payment = require('../models/Payment');
const moment = require('moment-timezone');

// @desc    Get dashboard metrics/analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const therapistId = req.therapist._id;
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    // 1. Today's Sessions
    const todaysSessions = await Session.find({
      therapistId,
      startTime: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['scheduled', 'completed', 'in-progress'] }
    }).populate('clientId', 'name').sort({ startTime: 1 });

    // 2. Upcoming Sessions (Next 7 days, excluding today)
    const upcomingStart = moment().add(1, 'day').startOf('day').toDate();
    const upcomingEnd = moment().add(7, 'days').endOf('day').toDate();
    const upcomingSessions = await Session.find({
      therapistId,
      startTime: { $gte: upcomingStart, $lte: upcomingEnd },
      status: 'scheduled'
    }).populate('clientId', 'name').sort({ startTime: 1 }).limit(5);

    // 3. Total active clients
    const activeClients = await Client.countDocuments({
      therapistId,
      status: 'active'
    });

    // 4. Pending intake
    const pendingIntake = await Client.countDocuments({
      therapistId,
      status: 'active',
      'intakeData.completionPercentage': { $lt: 100 }
    });

    // 5. Pending consent
    const pendingConsent = await Client.countDocuments({
      therapistId,
      status: 'active',
      'consent.given': false
    });

    // 6. Today's revenue
    const todayPayments = await Payment.aggregate([
      {
        $match: {
          therapistId,
          status: 'paid',
          createdAt: { $gte: todayStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const todaysRevenue = todayPayments.length > 0 ? todayPayments[0].total : 0;

    // 7. Outstanding payments
    const outstandingPayments = await Payment.aggregate([
      {
        $match: {
          therapistId,
          status: 'pending'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const outstandingAmount = outstandingPayments.length > 0 ? outstandingPayments[0].total : 0;

    // 8. Recent clients
    const recentClients = await Client.find({ therapistId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status email createdAt');

    // Also get unread notifications count for dashboard
    const Notification = require('../models/Notification');
    const unreadNotifications = await Notification.countDocuments({
      userId: therapistId,
      read: false
    });

    res.json({
      success: true,
      metrics: {
        todaysSessions,
        upcomingSessions,
        activeClients,
        pendingIntake,
        pendingConsent,
        todaysRevenue,
        outstandingAmount,
        recentClients,
        unreadNotifications,
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics
};
