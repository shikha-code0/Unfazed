const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: [true, 'Therapist ID is required'],
      unique: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    weeklySchedule: {
      type: [
        {
          dayOfWeek: {
            type: Number, // 0=Sunday, 1=Monday, ..., 6=Saturday
            required: true,
          },
          enabled: {
            type: Boolean,
            default: false,
          },
          periods: [
            {
              startTime: String, // HH:mm format (e.g., "10:00")
              endTime: String,   // HH:mm format (e.g., "13:00")
            },
          ],
        }
      ],
      default: [
        { dayOfWeek: 0, enabled: false, periods: [] },
        { dayOfWeek: 1, enabled: true, periods: [{ startTime: "09:00", endTime: "17:00" }] },
        { dayOfWeek: 2, enabled: true, periods: [{ startTime: "09:00", endTime: "17:00" }] },
        { dayOfWeek: 3, enabled: true, periods: [{ startTime: "09:00", endTime: "17:00" }] },
        { dayOfWeek: 4, enabled: true, periods: [{ startTime: "09:00", endTime: "17:00" }] },
        { dayOfWeek: 5, enabled: true, periods: [{ startTime: "09:00", endTime: "17:00" }] },
        { dayOfWeek: 6, enabled: false, periods: [] },
      ],
    },
    slotDuration: {
      type: Number,
      default: 50, // in minutes
      enum: [30, 45, 50, 60, 90],
    },
    bufferMinutes: {
      type: Number,
      default: 10,
      enum: [0, 10, 15, 20],
    },
    blockedDates: {
      type: [String], // ISO date strings (YYYY-MM-DD)
      default: [],
    },
    dateOverrides: {
      // Manual overrides for specific dates
      type: Map,
      of: {
        enabled: Boolean,
        periods: [
          {
            startTime: String,
            endTime: String,
          },
        ],
      },
      default: new Map(),
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
