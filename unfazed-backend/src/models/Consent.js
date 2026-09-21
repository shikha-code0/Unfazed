const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    consentVersion: {
      type: String,
      required: true,
      default: '1.0',
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    acceptedAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

consentSchema.index({ clientId: 1, therapistId: 1 });

module.exports = mongoose.model('Consent', consentSchema);
