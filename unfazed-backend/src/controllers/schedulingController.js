const Session = require('../models/Session');
const Availability = require('../models/Availability');
const SlotService = require('../services/slotService');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

// @desc    Get available slots for a therapist on a specific date (public)
// @route   GET /api/scheduling/public/:slug/slots?date=YYYY-MM-DD&duration=50
// @access  Public
const getPublicSlots = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { date, duration } = req.query;

    if (!date || !moment(date, 'YYYY-MM-DD', true).isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    // Find therapist by slug to get ID
    const Therapist = require('../models/Therapist');
    const therapist = await Therapist.findOne({ slug });
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found.',
      });
    }

    // Get availability
    const availability = await Availability.findOne({
      therapistId: therapist._id,
      isPublished: true,
    });

    if (!availability) {
      return res.json({
        success: true,
        slots: [],
      });
    }

    // Get available slots
    const dateObj = moment(date, 'YYYY-MM-DD').toDate();
    const slots = await SlotService.getAvailableSlots(
      availability,
      dateObj,
      availability.timezone,
      therapist._id
    );

    // Format slots for frontend (convert to therapist's timezone)
    const formattedSlots = slots.map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      localStart: slot.localStart,
      localEnd: slot.localEnd,
    }));

    res.json({
      success: true,
      timezone: availability.timezone,
      slots: formattedSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a session (create new session)
// @route   POST /api/scheduling/book
// @access  Public
const bookSession = async (req, res, next) => {
  try {
    const {
      therapistSlug,
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      sessionMode,
      startTime,
      endTime,
      timezone,
      presentingConcern,
      consentGiven,
    } = req.body;

    // Validate required fields
    if (!therapistSlug || !clientName || !clientEmail || !serviceType || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    if (!consentGiven) {
      return res.status(400).json({
        success: false,
        message: 'Client consent is required.',
      });
    }

    // Find therapist
    const Therapist = require('../models/Therapist');
    const therapist = await Therapist.findOne({ slug: therapistSlug });
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found.',
      });
    }

    // Get availability
    const availability = await Availability.findOne({
      therapistId: therapist._id,
    });

    if (!availability) {
      return res.status(400).json({
        success: false,
        message: 'Therapist availability not configured.',
      });
    }

    // Convert times to Date objects if they're strings
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Validate that booking time is within availability
    const validation = await SlotService.validateBookingTime(
      availability,
      therapist._id,
      startDate,
      endDate,
      timezone || availability.timezone
    );

    if (!validation.valid) {
      return res.status(409).json({
        success: false,
        message: validation.reason || 'This time slot is not available.',
      });
    }

    // Create or find client
    const Client = require('../models/Client');
    let client = await Client.findOne({ therapistId: therapist._id, email: clientEmail.toLowerCase().trim() });
    
    if (!client) {
      client = await Client.create({
        therapistId: therapist._id,
        name: clientName.trim(),
        email: clientEmail.toLowerCase().trim(),
        phone: clientPhone?.trim() || '',
        status: 'active',
        consent: {
          given: true,
          timestamp: new Date(),
        }
      });
    }

    // Create new session
    const newSession = new Session({
      therapistId: therapist._id,
      clientId: client._id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.toLowerCase().trim(),
      clientPhone: clientPhone?.trim() || '',
      serviceType,
      sessionMode: sessionMode || 'Online',
      startTime: startDate,
      endTime: endDate,
      timezone: timezone || availability.timezone,
      status: 'confirmed',
      paymentStatus: 'pending',
      presentingConcern: presentingConcern?.trim() || '',
      consentGiven: true,
    });

    await newSession.save();

    res.status(201).json({
      success: true,
      message: 'Session booked successfully!',
      session: newSession,
      client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sessions for logged-in therapist
// @route   GET /api/scheduling/me
// @access  Private
const getMySchedule = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {
      therapistId: req.therapist._id,
    };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startTime.$lte = new Date(endDate);
      }
    }

    const sessions = await Session.find(query).sort({ startTime: 1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific session for logged-in therapist
// @route   GET /api/scheduling/me/:sessionId
// @access  Private
const getMySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      therapistId: req.therapist._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a session (notes, etc.)
// @route   PATCH /api/scheduling/me/:sessionId
// @access  Private
const updateMySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { status, notes, paymentStatus } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      therapistId: req.therapist._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    if (status) session.status = status;
    if (notes) session.notes = notes;
    if (paymentStatus) session.paymentStatus = paymentStatus;

    await session.save();

    res.json({
      success: true,
      message: 'Session updated successfully!',
      session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a session
// @route   PATCH /api/scheduling/me/:sessionId/cancel
// @access  Private
const cancelMySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    const session = await Session.findOne({
      _id: sessionId,
      therapistId: req.therapist._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    if (session.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Session is already cancelled.',
      });
    }

    session.status = 'cancelled';
    if (reason) session.notes = `Cancellation reason: ${reason}`;

    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled successfully!',
      session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicSlots,
  bookSession,
  getMySchedule,
  getMySession,
  updateMySession,
  cancelMySession,
};
