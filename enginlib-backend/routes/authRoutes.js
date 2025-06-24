const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Registration routes
router.post(
  '/register/student',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('departmentId', 'Department is required').not().isEmpty()
  ],
  authController.register('student')
);

router.post(
  '/register/admin',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('departmentId', 'Department ID is required for admin registration').not().isEmpty()
  ],
  authController.register('admin')
);

router.post(
  '/register/tech-admin',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.register('tech-admin')
);

// Login routes
router.post(
  '/login/student',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login('student')
);

router.post(
  '/login/admin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login('admin')
);

router.post(
  '/login/tech-admin',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login('tech-admin')
);

module.exports = router;
