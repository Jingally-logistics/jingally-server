const Shipment = require('../models/shipment');
const { ValidationError } = require('sequelize');
const cloudinary = require('cloudinary').v2;
const emailVerificationService = require('../services/email-verification.service');
const { User } = require('../models');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


class ShipmentController {
  // Create a new shipment
  async createShipment(req, res) {
    try {
      const shipmentData = {
        ...req.body,
        userId: req.user.id
      };

      const shipment = await Shipment.create(shipmentData);

      res.status(201).json({
        success: true,
        data: shipment,
        message: 'Shipment created successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error creating shipment',
        error: error.message
      });
    }
  }

  // Get all shipments for a user
  async getUserShipments(req, res) {
    try {
      const shipments = await Shipment.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: shipments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving shipments',
        error: error.message
      });
    }
  }

  // Get shipment by ID
  async getShipmentById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        data: shipment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving shipment',
        error: error.message
      });
    }
  }

  //update shipment information By ID for Package Dimensions
  async updateShipmentPackageDimensionsById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        }); 
      }

      const bodyData = {
        dimensions: req.body.dimensions,
        weight: req.body.weight,
      }

      await shipment.update(bodyData);

      res.json({
        success: true,
        data: shipment,
        message: 'Shipment package dimensions updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating shipment package dimensions',
        error: error.message
      });
    }
  }

  // update shipment photo by ID
  async updateShipmentPhotoById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      }); 

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });   
      }

      // Debug logging
      console.log('Request files:', req.files);
      console.log('Request body:', req.body);

      // Check if files are provided
      if (!req.files) {
        return res.status(400).json({
          success: false,
          message: 'No files in request',
          details: 'Make sure you are sending files with the correct field name'
        });
      }

      // Handle both single file and multiple files
      const files = Array.isArray(req.files) ? req.files : [req.files];
      
      if (files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files provided',
          details: 'Please select at least one image to upload'
        });
      }

      // Handle image uploads
      const uploadPromises = files.map(async (file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'shipments',
              resource_type: 'auto'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        });
      });

      try {
        const uploadedImages = await Promise.all(uploadPromises);
        shipment.images = [...(shipment.images || []), ...uploadedImages];
        await shipment.save();

        return res.status(200).json({
          success: true,
          data: shipment,
          message: 'Shipment photos updated successfully'
        });
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Error uploading images',
          error: uploadError.message
        });
      }
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating shipment photos',
        error: error.message
      });
    }
  }

  // update shipment information by ID for Package Delivery Address
  async updateShipmentDeliveryAddressById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,  
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({ 
          success: false,
          message: 'Shipment not found'
        });
      }

      const bodyData = {
        deliveryAddress: req.body.deliveryAddress,
        pickupAddress: req.body.pickupAddress,
        receiverName: req.body.receiverName,
        receiverPhoneNumber: req.body.receiverPhoneNumber,
        receiverEmail: req.body.receiverEmail,
      }

      await shipment.update(bodyData); 

      res.json({
        success: true,
        data: shipment,
        message: 'Shipment delivery address updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating shipment delivery address',
        error: error.message
      });
    }
  }

  // update shipment information by ID for Package payment status
  async updateShipmentPaymentStatusById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,  
          userId: req.user.id
        },
        include: [{
          model: User,
          as: 'user',
          attributes: ['email', 'firstName', 'lastName']
        }]
      });

      if (!shipment) {
        return res.status(404).json({ 
          success: false,
          message: 'Shipment not found'
        });
      }

      await shipment.update({ 
        paymentStatus: req.body.paymentStatus, 
        price: req.body.amount 
      });   

      // Send payment confirmation email to the user
      await emailVerificationService.sendBookingConfirmationEmail(
        req.user, 
        shipment
      );

      // If receiver email exists, send payment confirmation to receiver
      if (shipment.receiverEmail) {
        const receiverUser = {
          id: 'receiver',
          email: shipment.receiverEmail,
          firstName: shipment.receiverName?.split(' ')[0] || 'Customer',
          lastName: shipment.receiverName?.split(' ')[1] || ''
        };

        await emailVerificationService.sendPaymentConfirmationEmail(
          receiverUser,
          shipment
        );
      }

      await emailVerificationService.sendAdminBookingNotification(
        'msheliapromise@gmail.com',  // admin email
        req.user,                  // user object
        shipment              // shipment object
      );

      res.json({
        success: true,
        data: shipment,
        message: 'Shipment payment status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateShipmentPaymentStatusById:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating shipment payment status',
        error: error.message
      });
    }
  }

  // Update shipment status
  async updateShipmentStatus(req, res) {
    try {
      const { status } = req.body;
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      await shipment.update({ status });

      res.json({
        success: true,
        data: shipment,
        message: 'Shipment status updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating shipment status',
        error: error.message
      });
    }
  }

  // Track shipment by tracking number
  async trackShipment(req, res) {
    try {
      const { trackingNumber } = req.params;
      const shipment = await Shipment.findOne({
        where: { trackingNumber }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found'
        });
      }

      res.json({
        success: true,
        data: {
          trackingNumber: shipment.trackingNumber,
          status: shipment.status,
          estimatedDeliveryTime: shipment.estimatedDeliveryTime,
          pickupAddress: shipment.pickupAddress,
          deliveryAddress: shipment.deliveryAddress
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error tracking shipment',
        error: error.message
      });
    }
  }

  // update shipment information by ID for Package pickup date and time
  async updateShipmentPickupDateTimeById(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({   
          success: false,
          message: 'Shipment not found'
        });
      }

      // Calculate estimated delivery time (3 days after pickup)
      const scheduledPickupTime = new Date(req.body.scheduledPickupTime);
      const estimatedDeliveryTime = new Date(scheduledPickupTime);
      estimatedDeliveryTime.setDate(estimatedDeliveryTime.getDate() + 3);

      await shipment.update({ 
        scheduledPickupTime,
        estimatedDeliveryTime
      });     

      res.json({
        success: true,
        data: shipment,
        message: 'Shipment pickup date and time updated successfully'
      });   
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating shipment pickup date and time',
        error: error.message
      });
    }
  }
  // Cancel shipment
  async cancelShipment(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found or cannot be cancelled'
        });
      }

      await shipment.update({ status: 'cancelled' });

      return res.json({
        success: true,
        message: 'Shipment cancelled successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error cancelling shipment',
        error: error.message
      });
    }
  }
}

module.exports = new ShipmentController();