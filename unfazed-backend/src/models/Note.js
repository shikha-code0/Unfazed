const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // HTML or JSON from Tiptap
      default: '',
    },
    type: {
      type: String,
      enum: ['progress', 'intake', 'treatment_plan', 'general'],
      default: 'progress',
    },
    status: {
      type: String,
      enum: ['draft', 'signed'],
      default: 'draft',
    },
    signedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ therapistId: 1, clientId: 1 });

module.exports = mongoose.model('Note', noteSchema);
