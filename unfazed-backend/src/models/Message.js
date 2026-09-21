const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
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
    senderModel: {
      type: String,
      enum: ['Therapist', 'Client'],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ therapistId: 1, clientId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
