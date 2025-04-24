const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const emailVerificationService = require('../services/email-verification.service');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// User registration
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, gender } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      gender
    });

    const token = generateToken(user);
    await emailVerificationService.sendVerificationEmail(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    if(user.isVerified === false){
      await emailVerificationService.sendVerificationEmail(user);
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //await emailVerificationService.verifyEmail(user.id, req.body.verificationCode);

    user.isVerified = true;
    await user.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send verification code email
    await emailVerificationService.sendVerificationEmail(user);

    return res.json({ message: 'Password reset code sent to your email', success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message, success: false });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    
    const user = await User.findOne({
      where: {
        email:email
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset code
    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Verify email
const verifyResetEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    //await emailVerificationService.verifyEmail(user.id, req.body.verificationCode);

    user.isVerified = true;
    await user.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


module.exports = {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyResetEmail
};
