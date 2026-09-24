const Package = require('../models/Package');
const Client = require('../models/Client');

// @desc    Get all packages for therapist
// @route   GET /api/packages
// @access  Private
const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ therapistId: req.therapist._id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// @desc    Get packages for a specific client
// @route   GET /api/packages/client/:clientId
// @access  Private
const getClientPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ 
      therapistId: req.therapist._id,
      clientId: req.params.clientId
    }).sort({ createdAt: -1 });
    res.json({ success: true, packages });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private
const createPackage = async (req, res, next) => {
  try {
    const { clientId, name, totalSessions, price, expiryDate } = req.body;
    
    // Validate client belongs to therapist
    const client = await Client.findOne({ _id: clientId, therapistId: req.therapist._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const newPackage = await Package.create({
      therapistId: req.therapist._id,
      clientId,
      name,
      totalSessions,
      price,
      expiryDate,
    });

    res.status(201).json({ success: true, package: newPackage });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a package
// @route   PATCH /api/packages/:id
// @access  Private
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ _id: req.params.id, therapistId: req.therapist._id });
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const { name, totalSessions, usedSessions, price, expiryDate, status } = req.body;

    if (name) pkg.name = name;
    if (totalSessions !== undefined) pkg.totalSessions = totalSessions;
    if (usedSessions !== undefined) pkg.usedSessions = usedSessions;
    if (price !== undefined) pkg.price = price;
    if (expiryDate) pkg.expiryDate = expiryDate;
    if (status) pkg.status = status;

    await pkg.save();

    res.json({ success: true, package: pkg });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getClientPackages,
  createPackage,
  updatePackage,
};
