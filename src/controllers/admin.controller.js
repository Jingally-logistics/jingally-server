const { User, Shipment, Address, Settings } = require('../models');
const emailVerificationService = require('../services/email-verification.service');

class AdminController {
  // Get all users
  async getAllUsers(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Address,
            attributes: ['street', 'city', 'state', 'country', 'type']
          }
        ]
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  // Update user
  async updateUser(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { firstName, lastName, email, phone, role } = req.body;
      await user.update({ firstName, lastName, email, phone, role });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  // Get all shipments
  async getAllShipments(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const shipments = await Shipment.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          },
          {
            model: User,
            as: 'driver',
            attributes: ['firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ error: 'Error fetching shipments' });
    }
  }

  // Get shipment by ID
  async getShipmentById(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const shipment = await Shipment.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
          }
        ]
      });
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching shipment' });
    }
  }

  // Update shipment status
  async updateShipmentStatus(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const shipment = await Shipment.findByPk(req.params.id);
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const { status } = req.body;
      await shipment.update({ status });
      
      // Send notification to user if status changes
      const user = await User.findByPk(shipment.userId);
      if (user) {
        await emailVerificationService.sendBookingConfirmationEmail(user, shipment);
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipment status' });
    }
  }

    // assign driver to shipment
    async assignDriverToShipment(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        try {
            const { shipmentId, driverId } = req.body;
            const shipment = await Shipment.findByPk(shipmentId);
            if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
            }

            await shipment.update({ driverId });
            return res.json(shipment);
        } catch (error) {
            return res.status(500).json({ error: 'Error assigning driver to shipment' });
        }
    }

  // Get all addresses
  async getAllAddresses(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const addresses = await Address.findAll({
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
          }
        ]
      });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching addresses' });
    }
  }

  // Verify address
  async verifyAddress(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const address = await Address.findByPk(req.params.id);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      const { isVerified, verificationDetails } = req.body;
      await address.update({ isVerified, verificationDetails });
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: 'Error verifying address' });
    }
  }

  // Get user settings
  async getUserSettings(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const settings = await Settings.findOne({
        where: { userId: req.params.userId }
      });
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching settings' });
    }
  }

  // Update user settings
  async updateUserSettings(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const settings = await Settings.findOne({
        where: { userId: req.params.userId }
      });
      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      const {
        notificationPreferences,
        defaultCurrency,
        language,
        theme,
        measurementSystem,
        timeZone
      } = req.body;

      await settings.update({
        notificationPreferences,
        defaultCurrency,
        language,
        theme,
        measurementSystem,
        timeZone
      });

      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Error updating settings' });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const [
        totalUsers,
        totalShipments,
        pendingShipments,
        completedShipments,
        totalRevenue
      ] = await Promise.all([
        User.count(),
        Shipment.count(),
        Shipment.count({ where: { status: 'pending' } }),
        Shipment.count({ where: { status: 'delivered' } }),
        Shipment.sum('price', { where: { paymentStatus: 'paid' } })
      ]);

      res.json({
        totalUsers,
        totalShipments,
        pendingShipments,
        completedShipments,
        totalRevenue: totalRevenue || 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching dashboard statistics' });
    }
  }
}

module.exports = new AdminController();
