const Address = require('../models/address');
const { ValidationError } = require('sequelize');

class AddressController {
  // Create a new address
  async createAddress(req, res) {
    try {
      const addressData = {
        ...req.body,
        userId: req.user.id
      };

      const address = await Address.create(addressData);

      res.status(201).json({
        success: true,
        data: address,
        message: 'Address created successfully'
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
        message: 'Error creating address',
        error: error.message
      });
    }
  }

  // get all addresses
  async getAllAddresses(req, res) {
    try {
      const addresses = await Address.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving all addresses',
        error: error.message
      });
    }
  }
  
  // Get all addresses for a user
  async getUserAddresses(req, res) {
    try {
      const addresses = await Address.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving addresses',
        error: error.message
      });
    }
  }

  // Get address by ID
  async getAddressById(req, res) {
    try {
      const address = await Address.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      res.json({
        success: true,
        data: address
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving address',
        error: error.message
      });
    }
  }

  // Update address
  async updateAddress(req, res) {
    try {
      const address = await Address.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      await address.update(req.body);

      res.json({
        success: true,
        data: address,
        message: 'Address updated successfully'
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
        message: 'Error updating address',
        error: error.message
      });
    }
  }

  // Delete address
  async deleteAddress(req, res) {
    try {
      const address = await Address.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      await address.destroy();

      res.json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting address',
        error: error.message
      });
    }
  }

  // Verify address
  async verifyAddress(req, res) {
    try {
      const address = await Address.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      // Here you would typically integrate with a third-party address verification service
      // For now, we'll just mark it as verified
      await address.update({
        isVerified: true,
        verificationDetails: {
          verifiedAt: new Date(),
          method: 'manual'
        }
      });

      res.json({
        success: true,
        data: address,
        message: 'Address verified successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verifying address',
        error: error.message
      });
    }
  }
}

module.exports = new AddressController();