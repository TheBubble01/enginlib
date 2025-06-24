const express = require('express');
const { check } = require('express-validator');
const passwordResetController = require('../controllers/passwordResetController');

const router = express.Router();

// Request password reset
router.post(
  '/request-password-reset',
  [check('email', 'Please include a valid email').isEmail()],
  passwordResetController.requestPasswordReset
);

// Reset password
router.post(
  '/reset-password/:resetToken',
  [check('password', 'Password must be at least 6 characters').isLength({ min: 6 })],
  passwordResetController.resetPassword
);

module.exports = router;

