const { User, Shipment, Address, Settings, Driver, Container } = require('../models');
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

  // Get all drivers
  async getAllDrivers(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try { 
      const drivers = await Driver.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching drivers' });
    }
  }

  // create Driver
  async createDriver(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const { firstName, lastName, email, phone } = req.body;
      
      // Check if driver already exists
      const existingDriver = await Driver.findOne({ where: { email } });
      if (existingDriver) {
        return res.status(400).json({ error: 'Driver with this email already exists' });
      }

      const password = firstName+'20jingally';

      // Create new driver
      const driver = await Driver.create({
        firstName,
        lastName,
        email,
        phone,
        password, // Note: Password should be hashed in the model
        role: 'driver'
      });

      // Send verification email
      await emailVerificationService.sendVerificationEmail(driver.email, password);

      res.status(201).json({
        message: 'Driver created successfully',
        driver: {
          id: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          phone: driver.phone,
          role: driver.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating driver' });
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
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Driver,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Container,
            as: 'container',
            attributes: ['containerNumber','type','capacity','location','status']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      res.status(500).json({ error: 'Error fetching shipments', details: error.message });
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
          },
          {
            model: Container,
            attributes: ['containerNumber','type','capacity','location','status']
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

    // assign container to shipment
    async assignContainerToShipment(req, res) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        try {
            const { shipmentId, containerId } = req.body;
            const shipment = await Shipment.findByPk(shipmentId);
            if (!shipment) {
                return res.status(404).json({ error: 'Shipment not found' });
            }

            const container = await Container.findByPk(containerId);
            if (!container) {
                return res.status(404).json({ error: 'Container not found' });
            }

            await shipment.update({ containerID:containerId });
            return res.json(shipment);
        } catch (error) {
            return res.status(500).json({ error: 'Error assigning container to shipment' });
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

  // Get all containers
  async getAllContainers(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const containers = await Container.findAll();
      res.json(containers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching containers' });
    }
  }

  // Create new container
  async createContainer(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const {
        containerNumber,
        type,
        capacity,
        location,
        notes
      } = req.body;

      if (!containerNumber.startsWith('JL1/JLC')) {
        return res.status(400).json({ error: 'Invalid container number. Must start with JL1/JLC' });
      }
      // Check if container already exists
      const existingContainer = await Container.findOne({ 
        where: { containerNumber } 
      });

      if (existingContainer) {
        return res.status(400).json({ error: 'Container with this number already exists' });
      }

      const container = await Container.create({
        containerNumber,
        type,
        capacity,
        location,
        notes,
        status: 'available'
      });

      res.status(201).json({
        message: 'Container created successfully',
        container
      });
    } catch (error) {
      console.error('Error creating container:', error);
      res.status(500).json({ error: 'Error creating container', details: error.message });
    }
  }

  // Update container
  async updateContainer(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const { id } = req.params;
      const {
        type,
        status,
        capacity,
        location,
        lastMaintenanceDate,
        nextMaintenanceDate,
        notes
      } = req.body;

      const container = await Container.findByPk(id);
      if (!container) {
        return res.status(404).json({ error: 'Container not found' });
      }

      await container.update({
        type,
        status,
        capacity,
        location,
        lastMaintenanceDate,
        nextMaintenanceDate,
        notes
      });

      res.json({
        message: 'Container updated successfully',
        container
      });
    } catch (error) {
      res.status(500).json({ error: 'Error updating container' });
    }
  }

  // Delete container
  async deleteContainer(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const { id } = req.params;
      const container = await Container.findByPk(id);
      
      if (!container) {
        return res.status(404).json({ error: 'Container not found' });
      }

      await container.destroy();
      res.json({ message: 'Container deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting container' });
    }
  }
}

module.exports = new AdminController();
