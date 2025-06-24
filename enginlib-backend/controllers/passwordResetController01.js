const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Setup email transporter (Configure with your email settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// Request password reset (send email with reset token)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour from now

    // Save token and expiration
    await user.save();

    // Send password reset email
    const resetURL = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link to reset your password: ${resetURL}\nLink expires in one hour.`;
    
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    });

    res.json({ msg: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Reset password (update with new password)
exports.resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  try {
    // Hash the token to match stored hashed version
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find the user by token and check expiration
    const user = await User.findOne({ 
      where: {
        resetToken: hashedToken,
        resetTokenExpires: { [Op.gt]: Date.now() }  // Token should not be expired
      }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;  // Clear the reset token
    user.resetTokenExpires = null;

    // Save new password
    await user.save();

    res.json({ msg: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

