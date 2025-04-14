const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');

class EmailVerificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    this.verificationCodes = new Map(); // Store verification codes in memory
  }

  // Generate 6-digit verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store verification code with expiration
  storeVerificationCode(userId, code) {
    this.verificationCodes.set(userId, {
      code,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  // Send verification email with code
  async sendVerificationEmail(user) {
    const verificationCode = this.generateVerificationCode();
    this.storeVerificationCode(user.id, verificationCode);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Our Shipping Platform!</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${verificationCode}</h2>
        <p>This code will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  // Verify email code
  async verifyEmail(userId, code) {
    try {
      const storedData = this.verificationCodes.get(userId);
      
      if (!storedData) {
        throw new Error('Verification code not found');
      }

      if (Date.now() > storedData.expiresAt) {
        this.verificationCodes.delete(userId);
        throw new Error('Verification code has expired');
      }

      if (storedData.code !== code) {
        throw new Error('Invalid verification code');
      }

      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        throw new Error('Email already verified');
      }

      await user.update({ isVerified: true });
      this.verificationCodes.delete(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        throw new Error('Email already verified');
      }

      return await this.sendVerificationEmail(user);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmailVerificationService();