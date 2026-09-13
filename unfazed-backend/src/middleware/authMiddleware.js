const jwt = require('jsonwebtoken');
const TherapistService = require('../services/therapistService');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'unfazed_jwt_secret_key_change_in_production_2026'
      );

      req.therapist = await TherapistService.findById(decoded.id);

      if (!req.therapist) {
        return res.status(401).json({ success: false, message: 'User no longer exists.' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
