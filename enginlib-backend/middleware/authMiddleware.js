const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch the user by ID and attach the user's role to the request
    const user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = {
      id: user.id,
      role: user.role  // Attach the user's role to the request
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

