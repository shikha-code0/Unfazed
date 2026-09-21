const mongoose = require('mongoose');
const Session = require('../models/Session');
const moment = require('moment-timezone');

class SlotService {
  /**
   * Convert time string (HH:mm) to minutes since midnight
   */
  static timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes since midnight to time string (HH:mm)
   */
  static minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Get day of week (0-6) for a date in a specific timezone
   */
  static getDayOfWeek(date, timezone) {
    return moment(date).tz(timezone).day();
  }

  /**
   * Generate available slots for a given date
   * @param {Object} availability - Availability document
   * @param {Date} date - Date to generate slots for (in UTC)
   * @param {string} timezone - Therapist's timezone
   * @returns {Array} Array of slot objects with startTime and endTime (in UTC)
   */
  static generateSlots(availability, date, timezone) {
    if (!availability) return [];

    const slotDuration = availability.slotDuration || 50;
    const bufferMinutes = availability.bufferMinutes || 0;
    const dateStr = moment(date).tz(timezone).format('YYYY-MM-DD');

    // Check if date is blocked
    if (availability.blockedDates?.includes(dateStr)) {
      return [];
    }

    // Get day of week (0-6)
    const dayOfWeek = this.getDayOfWeek(date, timezone);
    const dayName = dayOfWeek;

    // Check for date override
    if (availability.dateOverrides?.has(dateStr)) {
      const override = availability.dateOverrides.get(dateStr);
      if (!override.enabled) return [];
      return this.generateSlotsFromTimeRanges(
        override.periods,
        date,
        timezone,
        slotDuration,
        bufferMinutes
      );
    }

    // Get weekly schedule
    const daySchedule = availability.weeklySchedule?.find(
      (d) => d.dayOfWeek === dayName
    );

    if (!daySchedule || !daySchedule.enabled || !daySchedule.periods) {
      return [];
    }

    return this.generateSlotsFromTimeRanges(
      daySchedule.periods,
      date,
      timezone,
      slotDuration,
      bufferMinutes
    );
  }

  /**
   * Generate slots from time ranges
   */
  static generateSlotsFromTimeRanges(
    timeRanges,
    date,
    timezone,
    slotDuration,
    bufferMinutes
  ) {
    const slots = [];
    const dateStr = moment(date).tz(timezone).format('YYYY-MM-DD');

    for (const range of timeRanges) {
      const startMinutes = this.timeToMinutes(range.startTime);
      const endMinutes = this.timeToMinutes(range.endTime);

      for (let current = startMinutes; current + slotDuration <= endMinutes; current += slotDuration + bufferMinutes) {
        const slotStart = this.minutesToTime(current);
        const slotEnd = this.minutesToTime(current + slotDuration);

        // Convert to UTC
        const startUTC = moment.tz(`${dateStr} ${slotStart}`, 'YYYY-MM-DD HH:mm', timezone).utc().toDate();
        const endUTC = moment.tz(`${dateStr} ${slotEnd}`, 'YYYY-MM-DD HH:mm', timezone).utc().toDate();

        slots.push({
          startTime: startUTC,
          endTime: endUTC,
          localStart: slotStart,
          localEnd: slotEnd,
        });
      }
    }

    return slots;
  }

  /**
   * Get available slots for a date, excluding booked sessions
   */
  static async getAvailableSlots(availability, date, timezone, therapistId) {
    // Generate all possible slots
    const allSlots = this.generateSlots(availability, date, timezone);

    if (allSlots.length === 0) return [];

    // Get booked sessions for this date (only confirmed/pending)
    const dateStart = moment(date).tz(timezone).startOf('day').utc().toDate();
    const dateEnd = moment(date).tz(timezone).endOf('day').utc().toDate();

    const bookedSessions = await Session.find({
      therapistId: new mongoose.Types.ObjectId(therapistId),
      startTime: { $gte: dateStart, $lte: dateEnd },
      status: { $in: ['confirmed', 'pending'] },
    });

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => {
      return !bookedSessions.some((session) => {
        // Check if slot overlaps with booked session
        return (
          slot.startTime < session.endTime &&
          slot.endTime > session.startTime
        );
      });
    });

    // Don't show past slots
    const now = new Date();
    return availableSlots.filter((slot) => slot.startTime > now);
  }

  /**
   * Check if a time slot is available (no conflicts)
   */
  static async isSlotAvailable(therapistId, startTime, endTime) {
    const conflict = await Session.findOne({
      therapistId: new mongoose.Types.ObjectId(therapistId),
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          // Existing session starts before new slot ends and ends after new slot starts
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    return !conflict;
  }

  /**
   * Validate that a booking doesn't exceed therapist's availability
   */
  static async validateBookingTime(availability, therapistId, startTime, endTime, timezone) {
    // Check if slot is available (no conflicts)
    const isAvailable = await this.isSlotAvailable(therapistId, startTime, endTime);
    if (!isAvailable) {
      return { valid: false, reason: 'Slot is already booked' };
    }

    // Generate slots for this day and check if booking time matches
    const date = moment(startTime).tz(timezone).toDate();
    const allSlots = this.generateSlots(availability, date, timezone);

    const isValidSlot = allSlots.some(
      (slot) =>
        slot.startTime.getTime() === startTime.getTime() &&
        slot.endTime.getTime() === endTime.getTime()
    );

    if (!isValidSlot) {
      return { valid: false, reason: 'Not a valid time slot for this availability' };
    }

    return { valid: true };
  }
}

module.exports = SlotService;
