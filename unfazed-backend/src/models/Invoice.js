const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true, // stored as cents/paise
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidAt: {
      type: Date,
    },
    items: [
      {
        description: String,
        amount: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ therapistId: 1, clientId: 1 });
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
