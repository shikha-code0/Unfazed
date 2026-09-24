const jwt = require('jsonwebtoken');
const TherapistService = require('../services/therapistService');
const Client = require('../models/Client');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'unfazed_jwt_secret_key_change_in_production_2026'
      );

      // Ensure it's not a client token trying to access therapist routes
      if (decoded.role === 'client') {
        return res.status(403).json({ success: false, message: 'Not authorized for therapist access.' });
      }

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

const protectClient = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'unfazed_jwt_secret_key_change_in_production_2026'
      );

      if (decoded.role !== 'client') {
        return res.status(403).json({ success: false, message: 'Not authorized as a client.' });
      }

      req.client = await Client.findById(decoded.id);

      if (!req.client) {
        return res.status(401).json({ success: false, message: 'Client no longer exists.' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }
};

const protectAny = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'unfazed_jwt_secret_key_change_in_production_2026'
      );

      if (decoded.role === 'client') {
        req.client = await Client.findById(decoded.id);
        if (!req.client) {
          return res.status(401).json({ success: false, message: 'Client no longer exists.' });
        }
      } else {
        req.therapist = await TherapistService.findById(decoded.id);
        if (!req.therapist) {
          return res.status(401).json({ success: false, message: 'Therapist no longer exists.' });
        }
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect, protectClient, protectAny };
