const TherapistService = require('../services/therapistService');

// @desc    Get logged in therapist profile
// @route   GET /api/therapists/me
// @access  Private
const getLoggedInProfile = async (req, res, next) => {
  try {
    const therapist = await TherapistService.findById(req.therapist._id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }
    res.json({ success: true, therapist });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in therapist profile
// @route   PUT /api/therapists/me
// @access  Private
const updateLoggedInProfile = async (req, res, next) => {
  try {
    const updates = {};
    const { name, bio, specializations, languages, profileImage, consultationFee, sessionDuration } = req.body;

    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (specializations !== undefined) updates.specializations = specializations;
    if (languages !== undefined) updates.languages = languages;
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (consultationFee !== undefined) updates.consultationFee = consultationFee;
    if (sessionDuration !== undefined) updates.sessionDuration = sessionDuration;

    const updatedTherapist = await TherapistService.update(req.therapist._id, updates);

    if (!updatedTherapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      therapist: updatedTherapist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public therapist profile by slug
// @route   GET /api/therapists/public/:slug
// @access  Public
const getPublicProfile = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const therapist = await TherapistService.findBySlug(slug);

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist profile not found.' });
    }

    res.json({
      success: true,
      therapist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLoggedInProfile,
  updateLoggedInProfile,
  getPublicProfile,
};
