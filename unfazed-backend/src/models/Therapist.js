const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Therapist name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    specializations: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    consultationFee: {
      type: Number,
      default: 1500,
    },
    sessionDuration: {
      type: Number,
      default: 50, // in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Prevent returning passwordHash in JSON queries by default
therapistSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('Therapist', therapistSchema);
