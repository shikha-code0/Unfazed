const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TherapistService = require('../services/therapistService');
const generateSlug = require('../utils/generateSlug');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'unfazed_jwt_secret_key_change_in_production_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new therapist
// @route   POST /api/auth/register
// @access  Public
const registerTherapist = async (req, res, next) => {
  try {
    const { name, email, password, specialization } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password).',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const emailLower = email.toLowerCase().trim();
    const existingTherapist = await TherapistService.findByEmail(emailLower);

    if (existingTherapist) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Generate unique slug
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await TherapistService.checkSlugExists(slug)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial specializations array
    const specializations = specialization
      ? [specialization]
      : ['Clinical Psychology', 'Anxiety', 'Relationships'];

    // Create therapist
    const therapist = await TherapistService.create({
      name,
      email: emailLower,
      passwordHash,
      slug,
      bio: 'Warm, collaborative, and evidence-based mental health support tailoring care to your personal goals.',
      specializations,
      languages: ['English', 'Hindi'],
      consultationFee: 1500,
      sessionDuration: 50,
    });

    const token = generateToken(therapist._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        bio: therapist.bio,
        specializations: therapist.specializations,
        languages: therapist.languages,
        profileImage: therapist.profileImage,
        consultationFee: therapist.consultationFee,
        sessionDuration: therapist.sessionDuration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate therapist & get token
// @route   POST /api/auth/login
// @access  Public
const loginTherapist = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const emailLower = email.toLowerCase().trim();
    const therapist = await TherapistService.findByEmail(emailLower);

    if (!therapist) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, therapist.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(therapist._id);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        bio: therapist.bio,
        specializations: therapist.specializations,
        languages: therapist.languages,
        profileImage: therapist.profileImage,
        consultationFee: therapist.consultationFee,
        sessionDuration: therapist.sessionDuration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in therapist details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    therapist: req.therapist,
  });
};

module.exports = {
  registerTherapist,
  loginTherapist,
  getMe,
};
