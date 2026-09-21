const Session = require('../models/Session');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const moment = require('moment-timezone');

// @desc    Get dashboard metrics/analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const therapistId = req.therapist._id;
    
    // Get start of current month
    const startOfMonth = moment().startOf('month').toDate();

    // Active Clients count
    const activeClients = await Client.countDocuments({
      therapistId,
      status: 'active'
    });

    // Total Sessions this month
    const sessionsThisMonth = await Session.countDocuments({
      therapistId,
      startTime: { $gte: startOfMonth },
      status: 'completed'
    });

    // Revenue this month (Invoices Paid)
    const paidInvoices = await Invoice.aggregate([
      {
        $match: {
          therapistId,
          status: 'paid',
          paidAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const revenueThisMonth = paidInvoices.length > 0 ? paidInvoices[0].total : 0;

    res.json({
      success: true,
      metrics: {
        activeClients,
        sessionsThisMonth,
        revenueThisMonth,
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics
};
