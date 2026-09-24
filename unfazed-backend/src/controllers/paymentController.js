const Payment = require('../models/Payment');
const Client = require('../models/Client');

// @desc    Get all payments for therapist
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ therapistId: req.therapist._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single payment
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, therapistId: req.therapist._id })
      .populate('clientId', 'name email');
      
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const { clientId, bookingId, amount, currency, method, status, transactionId, notes } = req.body;
    
    // Validate client belongs to therapist
    const client = await Client.findOne({ _id: clientId, therapistId: req.therapist._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const payment = await Payment.create({
      therapistId: req.therapist._id,
      clientId,
      bookingId,
      amount,
      currency,
      method,
      status,
      transactionId,
      notes,
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a payment
// @route   PATCH /api/payments/:id
// @access  Private
const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, therapistId: req.therapist._id });
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const { status, transactionId, notes } = req.body;

    if (status) payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (notes !== undefined) payment.notes = notes;

    await payment.save();

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
};
