const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: [true, 'Therapist ID is required'],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ['Individual Therapy', 'Couples Therapy', 'Initial Consultation'],
      required: [true, 'Service type is required'],
    },
    sessionMode: {
      type: String,
      enum: ['Online', 'In-person'],
      default: 'Online',
    },
    startTime: {
      type: Date, // Stored in UTC
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date, // Stored in UTC
      required: [true, 'End time is required'],
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'completed', 'cancelled', 'no_show'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    intakeSummary: {
      type: String,
      trim: true,
    },
    presentingConcern: {
      type: String,
      trim: true,
    },
    consentGiven: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
sessionSchema.index({ therapistId: 1, startTime: 1 });
sessionSchema.index({ clientEmail: 1 });

module.exports = mongoose.model('Session', sessionSchema);
