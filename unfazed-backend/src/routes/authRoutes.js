const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { registerTherapist, loginTherapist, getMe, loginClient, getClientMe } = require('../controllers/authController');
const { protect, protectClient } = require('../middleware/authMiddleware');

// Validation middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Register validation rules
const registerValidationRules = () => [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Login validation rules
const loginValidationRules = () => [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidationRules(), handleValidationErrors, registerTherapist);
router.post('/login', loginValidationRules(), handleValidationErrors, loginTherapist);
router.get('/me', protect, getMe);

router.post('/client/login', loginValidationRules(), handleValidationErrors, loginClient);
router.get('/client/me', protectClient, getClientMe);

module.exports = router;
