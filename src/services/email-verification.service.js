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
  async sendVerificationEmail(user) {
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
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Booking Details</h2>
            <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
            <p><strong>Status:</strong> ${shipment.status}</p>
            <p><strong>Service Type:</strong> ${shipment.serviceType}</p>
            <p><strong>Package Type:</strong> ${shipment.packageType}</p>
            ${shipment.packageDescription ? `<p><strong>Description:</strong> ${shipment.packageDescription}</p>` : ''}
            ${shipment.fragile ? '<p><strong>⚠️ Fragile Package</strong></p>' : ''}
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Package Details</h2>
            ${shipment.weight ? `<p><strong>Weight:</strong> ${shipment.weight} kg</p>` : ''}
            ${shipment.dimensions ? `
              <p><strong>Dimensions:</strong></p>
              <ul>
                <li>Length: ${shipment.dimensions.length} cm</li>
                <li>Width: ${shipment.dimensions.width} cm</li>
                <li>Height: ${shipment.dimensions.height} cm</li>
              </ul>
            ` : ''}
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Address Details</h2>
            <div style="margin-bottom: 15px;">
              <h3 style="color: #555; margin-bottom: 5px;">Pickup Address</h3>
              <p>${shipment.pickupAddress.street}<br>
              ${shipment.pickupAddress.city}, ${shipment.pickupAddress.state}<br>
              ${shipment.pickupAddress.country}, ${shipment.pickupAddress.postalCode}</p>
            </div>
            <div>
              <h3 style="color: #555; margin-bottom: 5px;">Delivery Address</h3>
              <p>${shipment.deliveryAddress.street}<br>
              ${shipment.deliveryAddress.city}, ${shipment.deliveryAddress.state}<br>
              ${shipment.deliveryAddress.country}, ${shipment.deliveryAddress.postalCode}</p>
              <p><strong>Receiver:</strong> ${shipment.receiverName}</p>
              <p><strong>Contact:</strong> ${shipment.receiverPhoneNumber}</p>
            </div>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Schedule & Payment</h2>
            ${shipment.scheduledPickupTime ? `<p><strong>Scheduled Pickup:</strong> ${new Date(shipment.scheduledPickupTime).toLocaleString()}</p>` : ''}
            ${shipment.estimatedDeliveryTime ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipment.estimatedDeliveryTime).toLocaleString()}</p>` : ''}
            ${shipment.price ? `<p><strong>Price:</strong> $${shipment.price}</p>` : ''}
            <p><strong>Payment Status:</strong> ${shipment.paymentStatus}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Thank you for choosing our service!</p>
            <p style="color: #666;">You can track your shipment using the tracking number: <strong>${shipment.trackingNumber}</strong></p>
          </div>
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
    const isReceiver = user.id === 'receiver';
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: isReceiver ? 'Payment Received for Your Shipment' : 'Payment Confirmation for Your Shipment',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">${isReceiver ? 'Payment Received' : 'Payment Confirmation'}</h1>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Payment Details</h2>
            <p><strong>Amount:</strong> $${shipment.price}</p>
            <p><strong>Status:</strong> ${shipment.paymentStatus}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #444; margin-bottom: 15px;">Shipment Details</h2>
            <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
            <p><strong>Status:</strong> ${shipment.status}</p>
            ${shipment.scheduledPickupTime ? `<p><strong>Scheduled Pickup:</strong> ${new Date(shipment.scheduledPickupTime).toLocaleString()}</p>` : ''}
            ${shipment.estimatedDeliveryTime ? `<p><strong>Estimated Delivery:</strong> ${new Date(shipment.estimatedDeliveryTime).toLocaleString()}</p>` : ''}
          </div>

          ${isReceiver ? `
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #444; margin-bottom: 15px;">Delivery Information</h2>
              <p><strong>Delivery Address:</strong></p>
              <p>${shipment.deliveryAddress.street}<br>
              ${shipment.deliveryAddress.city}, ${shipment.deliveryAddress.state}<br>
              ${shipment.deliveryAddress.country}, ${shipment.deliveryAddress.postalCode}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Thank you for your payment!</p>
            <p style="color: #666;">You can track your shipment using the tracking number: <strong>${shipment.trackingNumber}</strong></p>
          </div>
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
}

module.exports = new EmailVerificationService();