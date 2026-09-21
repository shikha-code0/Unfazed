const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    pronouns: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discharged', 'waitlisted'],
      default: 'active',
    },
    intakeData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    consent: {
      given: {
        type: Boolean,
        default: false,
      },
      timestamp: Date,
      version: String,
      ipAddress: String,
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.index({ therapistId: 1, email: 1 });

module.exports = mongoose.model('Client', clientSchema);
