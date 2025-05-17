const { ValidationError } = require('sequelize');
const { User, Shipment, Address, Settings, Driver, Container, BookShipment } = require('../models');
const emailVerificationService = require('../services/email-verification.service');

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

  // Get all Admins
  async getAllAdmins(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const admins = await User.findAll({
        where: { role: 'admin' }
      });
      return res.json(admins);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching admins' });
    }
  }

  // create Admin
  async createAdmin(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const { firstName, lastName, email, phone } = req.body;
      // Check if driver already exists
      const existingAdmin = await User.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this email already exists' });
      }
      const password = firstName+'jingallyAdmin';
      const admin = await User.create({ firstName, lastName, email, phone, role: 'admin', password });
      // Send verification email
      await emailVerificationService.sendVerificationEmail(admin.email, password);
      return res.status(201).json(admin);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating admin' });
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
      const shipment = await Shipment.findOne({
        where: { id: req.params.id },
        include: [{
          model: User,
          as: 'user'
        }]
      });
      
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const { status } = req.body;
      await shipment.update({ status });
      
      // Send notification to user if status changes
      if (shipment.user) {
        await emailVerificationService.sendBookingConfirmationEmail(shipment.user, shipment);
      }
      
      res.json(shipment);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      res.status(500).json({ error: 'Error updating shipment status' });
    }
  }

  // update bank transfer payment status
  async updateBankTransferPaymentStatus(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const { shipmentId, paymentStatus } = req.body;
      const shipment = await Shipment.findByPk(shipmentId);
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      if(shipment.paymentMethod !== 'bank_transfer') {
        return res.status(400).json({ error: 'Shipment payment method is not bank transfer' });
      }
      
      await shipment.update({ paymentStatus });
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: 'Error updating bank transfer payment status' });
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



  // Shipment Bookings
  
  // Create a new shipment
  async createShipment(req, res) {
    const { serviceType, packageType, packageDescription, fragile } = req.body;
    console.log(req.body);
    try {
      console.log(req.body);

      const shipment = await BookShipment.create({
          serviceType,
          packageType,
          packageDescription,
          adminId: req.user.id,
          fragile,
      });

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
      const shipments = await BookShipment.findAll({
        where: { adminId: req.user.id },
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
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,
          adminId: req.user.id 
        },
        include: [
          {
            model: Driver,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: Container,
            as: 'container',
            attributes: ['containerNumber','type','capacity','location','status']
          }
        ]
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
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,
          adminId: req.user.id
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
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,
          adminId: req.user.id
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
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,  
          adminId: req.user.id
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
        deliveryType: req.body.deliveryType,
      }

      await shipment.update(bodyData); 

      return res.json({
        success: true,
        data: shipment,
        message: 'Shipment delivery address updated successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating shipment delivery address',
        error: error.message
      });
    }
  }

  // update shipment information by ID for Package payment status
  async updateShipmentPaymentStatusById(req, res) {
    try {
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,  
          adminId: req.user.id
        },
        include: [{
          model: User,
          as: 'admin',
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
        price: req.body.amount,
        paymentMethod: req.body.method
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

      return res.json({
        success: true,
        data: shipment,
        message: 'Shipment payment status updated successfully'
      });
    } catch (error) {
      console.error('Error in updateShipmentPaymentStatusById:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating shipment payment status',
        error: error.message
      });
    }
  }

  // Track shipment by tracking number
  async trackShipment(req, res) {
    try {
      const { trackingNumber } = req.params;
      const shipment = await BookShipment.findOne({
        where: { trackingNumber },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Driver,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'phone']
          },
          {
            model: Container,
            as: 'container',
            attributes: ['containerNumber','type','capacity','location','status']
          }
        ]
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
        message: 'Error tracking shipment',
        error: error.message
      });
    }
  }

  // update shipment information by ID for Package pickup date and time
  async updateShipmentPickupDateTimeById(req, res) {
    try {
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,
          adminId: req.user.id
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
      const shipment = await BookShipment.findOne({
        where: {
          id: req.params.id,
          adminId: req.user.id
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

  // Update booking status
  async updateBookingStatus(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
      const shipment = await BookShipment.findOne({where: {id: req.params.id}});
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const { status } = req.body;
      await shipment.update({ status });
      
      // Send notification to user if status changes
      const user = await User.findOne({where: {id: shipment.userId}});
      if (user) {
        await emailVerificationService.sendBookingConfirmationEmail(user, shipment);
      }
      
      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipment status' });
    }
  }

  // assign driver to shipment
  async assignDriverToBooking(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const { shipmentId, driverId } = req.body;
        const shipment = await BookShipment.findByPk(shipmentId);
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
async assignContainerToBooking(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    try {
        const { shipmentId, containerId } = req.body;
        const shipment = await BookShipment.findByPk(shipmentId);
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

}

module.exports = new AdminController();
