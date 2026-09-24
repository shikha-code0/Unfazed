const Client = require('../models/Client');
const Session = require('../models/Session');
const Payment = require('../models/Payment');

// @desc    Global search across clients, sessions, and payments
// @route   GET /api/search?q=query
// @access  Private
const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, results: { clients: [], sessions: [], payments: [] } });
    }

    const therapistId = req.therapist._id;
    const searchRegex = new RegExp(q, 'i');

    // 1. Search Clients
    const clients = await Client.find({
      therapistId,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    }).limit(5).select('name email status');

    // 2. Search Sessions
    const sessions = await Session.find({
      therapistId,
      $or: [
        { clientName: searchRegex },
        { serviceType: searchRegex },
        { notes: searchRegex }
      ]
    }).populate('clientId', 'name').limit(5).select('serviceType startTime status clientId clientName');

    // 3. Search Payments
    const payments = await Payment.find({
      therapistId,
      $or: [
        { transactionId: searchRegex },
        { notes: searchRegex }
      ]
    }).populate('clientId', 'name').limit(5).select('amount status transactionId clientId createdAt');

    res.json({
      success: true,
      results: {
        clients,
        sessions,
        payments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  globalSearch
};
