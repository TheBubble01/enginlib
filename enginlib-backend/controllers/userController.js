const { User } = require('../models');
const { validationResult } = require('express-validator');

// Update user profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Retrieve the user by ID from the authenticated user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's profile details
    const { username, fullName, profilePicture } = req.body;
    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.profilePicture = profilePicture || user.profilePicture;  // Optional field

    // Save updated details
    await user.save();

    res.json({ msg: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

