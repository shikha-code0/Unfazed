const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    totalSessions: {
      type: Number,
      required: true,
      min: 1,
    },
    usedSessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingSessions: {
      type: Number,
      default: function() {
        return this.totalSessions;
      },
    },
    price: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({ therapistId: 1, clientId: 1 });

// Automatically update remaining sessions
packageSchema.pre('save', function(next) {
  this.remainingSessions = this.totalSessions - this.usedSessions;
  if (this.remainingSessions <= 0) {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Package', packageSchema);
