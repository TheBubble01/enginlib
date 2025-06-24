const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Update user profile (only for authenticated users)
router.put(
  '/profile',
  authMiddleware,  // Protect the route with authentication middleware
  [
    check('username', 'Username is required').not().isEmpty(),
    check('fullName', 'Full name is required').not().isEmpty()
  ],
  userController.updateProfile
);

module.exports = router;

