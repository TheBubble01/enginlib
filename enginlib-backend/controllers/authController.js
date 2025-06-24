const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const dotenv = require('dotenv');

const JWT_SECRET = process.env.JWT_SECRET;  // Replace with a strong secret key

// Helper function to generate JWT
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user
exports.register = (role) => async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, fullName, email, password, departmentId } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the role determined by the route
    user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      role,
      departmentId
    });

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = (role) => async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists and has the correct role
    const user = await User.findOne({ where: { email, role } });
    if (!user) {
      return res.status(404).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
