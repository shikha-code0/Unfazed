const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Can refer to Therapist or Client
    },
    userType: {
      type: String,
      enum: ['therapist', 'client'],
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'intake', 'consent', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, userType: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
