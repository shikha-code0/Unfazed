const Client = require('../models/Client');
const Consent = require('../models/Consent');
const EntitlementService = require('../services/entitlementService');

// @desc    Get all clients for a therapist
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ therapistId: req.therapist._id }).sort({ createdAt: -1 });
    res.json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res, next) => {
  try {
    const canAdd = await EntitlementService.canAddClient(req.therapist._id);
    if (!canAdd) {
      return res.status(403).json({ success: false, message: 'Client limit reached for your subscription tier' });
    }

    const { name, email, phone, dateOfBirth, pronouns, address, tags, status } = req.body;
    const client = await Client.create({
      therapistId: req.therapist._id,
      name,
      email,
      phone,
      dateOfBirth,
      pronouns,
      address,
      tags,
      status,
    });
    res.status(201).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, therapistId: req.therapist._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, therapistId: req.therapist._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, client });
  } catch (error) {
    next(error