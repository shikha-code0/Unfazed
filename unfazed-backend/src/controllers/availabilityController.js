const Availability = require('../models/Availability');
const Session = require('../models/Session');
const SlotService = require('../services/slotService');
const moment = require('moment-timezone');

// @desc    Get logged-in therapist's availability
// @route   GET /api/availability/me
// @access  Private
const getMyAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({
      therapistId: req.therapist._id,
    });

    if (!availability) {
      // Return default availability if not set
      availability = new Availability({
        therapistId: req.therapist._id,
      });
    }

    res.json({ success: true, availability });
  } catch (error) {
    next(error);
  }
};

// @desc    Update therapist availability settings
// @route   PUT /api/availability/me
// @access  Private
const updateMyAvailability = async (req, res, next) => {
  try {
    const { timezone, weeklySchedule, slotDuration, bufferMinutes, blockedDates, dateOverrides } = req.body;

    // Validate inputs
    if (slotDuration && ![30, 45, 50, 60, 90].includes(slotDuration)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slot duration. Must be 30, 45, 50, 60, or 90 minutes.',
      });
    }

    if (bufferMinutes && ![0, 10, 15, 20].includes(bufferMinutes)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid buffer minutes. Must be 0, 10, 15, or 20 minutes.',
      });
    }

    let overridesMap = dateOverrides;

    if (dateOverrides && typeof dateOverrides === 'object' && !(dateOverrides instanceof Map)) {
      overridesMap = new Map(Object.entries(dateOverrides));
    }

    let availability = await Availability.findOne({
      therapistId: req.therapist._id,
    });

    if (!availability) {
      availability = new Availability({
        therapistId: req.therapist._id,
      });
    }

    if (timezone) availability.timezone = timezone;
    if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
    if (slotDuration) availability.slotDuration = slotDuration;
    if (bufferMinutes !== undefined) availability.bufferMinutes = bufferMinutes;
    if (blockedDates) availability.blockedDates = blockedDates;
    if (overridesMap) availability.dateOverrides = overridesMap;

    await availability.save();

    res.json({
      success: true,
      message: 'Availability updated successfully!',
      availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public availability for a therapist
// @route   GET /api/availability/public/:slug
// @access  Public
const getPublicAvailability = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Find therapist by slug
    const Therapist = require('../models/Therapist');
    const therapist = await Therapist.findOne({ slug }).select('_id');
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found.',
      });
    }

    const availability = await Availability.findOne({
      therapistId: therapist._id,
      isPublished: true,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found.',
      });
    }

    // Return only public info (no sensitive data)
    const publicAvailability = {
      timezone: availability.timezone,
      slotDuration: availability.slotDuration,
      weeklySchedule: availability.weeklySchedule,
    };

    res.json({
      success: true,
      availability: publicAvailability,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAvailability,
  updateMyAvailability,
  getPublicAvailability,
};
