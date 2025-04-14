const Shipment = require('../models/shipment');
const { ValidationError } = require('sequelize');
const cloudinary = require('cloudinary').v2;

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
        userId: req.user.id,
        images: []
      };

      // Handle image uploads
      if (req.files && Array.isArray(req.files)) {
        const uploadPromises = req.files.map(file => {
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
          shipmentData.images = await Promise.all(uploadPromises);
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            message: 'Error uploading images',
            error: uploadError.message
          });
        }
      }

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

      res.status(500).json({
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

  // Cancel shipment
  async cancelShipment(req, res) {
    try {
      const shipment = await Shipment.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id,
          status: {
            [Op.notIn]: ['delivered', 'cancelled']
          }
        }
      });

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found or cannot be cancelled'
        });
      }

      await shipment.update({ status: 'cancelled' });

      res.json({
        success: true,
        message: 'Shipment cancelled successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error cancelling shipment',
        error: error.message
      });
    }
  }
}

module.exports = new ShipmentController();