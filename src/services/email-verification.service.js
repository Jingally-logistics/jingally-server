const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models');

class EmailVerificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
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
  async sendVerificationEmail(user, password) {
    const verificationCode = this.generateVerificationCode();
    this.storeVerificationCode(user.id, verificationCode);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Verify Your Email Address',
      html: `
        <h1>Welcome to Jingally Logistics!</h1>
        <p>Your verification code is:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${verificationCode}</h2>
        ${password ? `<p>Your password is: ${password}</p>` : ''}
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

  // Send booking confirmation email
  async sendBookingConfirmationEmail(user, shipment) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Your Shipment Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Shipment Booking Confirmation</h1>
          
          <p>Dear ${user.firstName},</p>
          <p>Thank you for choosing Jingally Logistic! We're excited to confirm that your booking has been successfully processed.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Payment Details</h2>
            <p><strong>Amount:</strong> $${shipment.price || 'N/A'}</p>
            <p><strong>Status:</strong> ${shipment.paymentStatus || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Booking Details</h2>
            <p><strong>Booking ID:</strong> ${shipment.trackingNumber}</p>
            <p><strong>Pickup Location:</strong> ${shipment.pickupAddress.street}, ${shipment.pickupAddress.city}, ${shipment.pickupAddress.state}, ${shipment.pickupAddress.country}</p>
            <p><strong>Delivery Location:</strong> ${shipment.deliveryAddress.street}, ${shipment.deliveryAddress.city}, ${shipment.deliveryAddress.state}, ${shipment.deliveryAddress.country}</p>
            <p><strong>Scheduled Date & Time:</strong> ${shipment.scheduledPickupTime ? new Date(shipment.scheduledPickupTime).toLocaleString() : 'N/A'}</p>
          </div>

          <p>Our team is committed to ensuring a seamless and reliable delivery experience for you. Should you have any questions or require assistance, please don't hesitate to contact us at info@jingally.com or reply to this email.</p>

          <p>Stay connected with us via our app for live updates on your booking status.</p>

          <p>Once again, thank you for trusting Jingally Logistic with your logistics needs.</p>

          <p>Best regards,<br>Jingally Logistic Support Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      return false;
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmationEmail(user, shipment) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Payment Confirmation</h1>
          
          <p>Dear ${user.firstName},</p>
          <p>Thank you for choosing Jingally Logistic! We're excited to confirm that your payment has been successfully processed.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Payment Details</h2>
            <p><strong>Amount:</strong> $${shipment.price || 'N/A'}</p>
            <p><strong>Status:</strong> ${shipment.paymentStatus || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Booking Details</h2>
            <p><strong>Booking ID:</strong> ${shipment.trackingNumber}</p>
            <p><strong>Pickup Location:</strong> ${shipment.pickupAddress.street}, ${shipment.pickupAddress.city}, ${shipment.pickupAddress.state}, ${shipment.pickupAddress.country}</p>
            <p><strong>Delivery Location:</strong> ${shipment.deliveryAddress.street}, ${shipment.deliveryAddress.city}, ${shipment.deliveryAddress.state}, ${shipment.deliveryAddress.country}</p>
            <p><strong>Scheduled Date & Time:</strong> ${shipment.scheduledPickupTime ? new Date(shipment.scheduledPickupTime).toLocaleString() : 'N/A'}</p>
          </div>

          <p>Our team is committed to ensuring a seamless and reliable delivery experience for you. Should you have any questions or require assistance, please don't hesitate to contact us at info@jingally.com or reply to this email.</p>

          <p>Stay connected with us via our app for live updates on your booking status.</p>

          <p>Once again, thank you for trusting Jingally Logistic with your logistics needs.</p>

          <p>Best regards,<br>Jingally Logistic Support Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      return false;
    }
  }

  // Send admin notification for new booking
  async sendAdminBookingNotification(adminEmail, user, shipment) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: 'User Booking Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">User Booking Notification</h1>
          
          <p>Dear Admin,</p>
          <p>I hope this email finds you well. I'm writing to inform you that a new booking has been successfully processed through Jingally Logistics.</p>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Payment Information</h2>
            <p><strong>Amount:</strong> $${shipment.price || 'N/A'}</p>
            <p><strong>Status:</strong> ${shipment.paymentStatus || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Booking Details</h2>
            <p><strong>User Name:</strong> ${user.firstName} ${user.lastName} </p>
            <p><strong>User Email:</strong> ${user.email} </p>
            <p><strong>Booking ID:</strong> ${shipment.trackingNumber}</p>
            <p><strong>Item Booked:</strong> ${shipment.packageDescription || 'N/A'}</p>
            <p><strong>Pickup Location:</strong> ${shipment.pickupAddress.street}, ${shipment.pickupAddress.city}, ${shipment.pickupAddress.state}, ${shipment.pickupAddress.country}</p>
            <p><strong>Delivery Location:</strong> ${shipment.deliveryAddress.street}, ${shipment.deliveryAddress.city}, ${shipment.deliveryAddress.state}, ${shipment.deliveryAddress.country}</p>
            <p><strong>Scheduled Date & Time:</strong> ${shipment.scheduledPickupTime ? new Date(shipment.scheduledPickupTime).toLocaleString() : 'N/A'}</p>
          </div>

          <p>Kindly review the booking details and ensure that all arrangements are in place for a smooth execution of the delivery. Should there be any issues or additional requirements, please feel free to reach out.</p>

          <p>Thank you for your support and dedication to maintaining excellent service standards.</p>

          <p>Best regards,<br>Jingally Logistic Support Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending admin booking notification:', error);
      return false;
    }
  }
}

module.exports = new EmailVerificationService();