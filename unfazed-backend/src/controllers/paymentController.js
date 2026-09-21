const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

// @desc    Get all invoices for therapist
// @route   GET /api/payments/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ therapistId: req.therapist._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new invoice
// @route   POST /api/payments/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    const { clientId, sessionId, amount, dueDate, items, notes } = req.body;
    
    // Generate Invoice Number (Mock)
    const count = await Invoice.countDocuments({ therapistId: req.therapist._id });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    const invoice = await Invoice.create({
      therapistId: req.therapist._id,
      clientId,
      sessionId,
      invoiceNumber,
      amount,
      dueDate,
      items,
      notes,
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark invoice as paid
// @route   PATCH /api/payments/invoices/:id/pay
// @access  Private
const markAsPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, therapistId: req.therapist._id },
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  createInvoice,
  markAsPaid,
};
