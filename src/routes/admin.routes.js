const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const shipmentController = require("../controllers/shipment.controller")

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
router.get('/users', auth, adminController.getAllUsers);

/** 
 * @swagger
 * /api/admin/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Admin]    
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all drivers
 *       500:
 *         description: Server error
 */
router.get('/drivers', auth, adminController.getAllDrivers);


/**
 * @swagger
 * /api/admin/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Driver with this email already exists
 *       500:
 *         description: Server error
 */
router.post('/drivers', auth, adminController.createDriver);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/users/:id', auth, adminController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/users/:id', auth, adminController.updateUser);

/**
 * @swagger
 * /api/admin/shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all shipments
 *       500:
 *         description: Server error
 */
router.get('/shipments', auth, adminController.getAllShipments);


/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins
 *       500:
 *         description: Server error
 */
router.get('/admins', auth, adminController.getAllAdmins);

/**
 * @swagger
 * /api/admin/admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully  
 *       400:
 *         description: Admin with this email already exists
 *       500:
 *         description: Server error
 */
router.post('/admins', auth, adminController.createAdmin);


/**
 * @swagger
 * /api/admin/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment details
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.get('/shipments/:id', auth, adminController.getShipmentById);

/**
 * @swagger
 * /api/admin/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated shipment
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/shipments/:id/status', auth, adminController.updateShipmentStatus);

/**
 * @swagger
 * /api/admin/shipments/{id}/payment-status:
 *   put:
 *     summary: Update bank transfer payment status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid payment method
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/shipments/:id/payment-status', auth, adminController.updateBankTransferPaymentStatus);


/**
 * @swagger
 * /api/admin/shipments/assign-driver:
 *   post:
 *     summary: Assign driver to shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.post('/shipments/assign-driver', auth, adminController.assignDriverToShipment);

/**
 * @swagger
 * /api/admin/shipments/assign-container:
 *   post:
 *     summary: Assign container to shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               containerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Container assigned successfully
 *       404:
 *         description: Shipment or container not found
 *       500:
 *         description: Server error
 */
router.post('/shipments/assign-container', auth, adminController.assignContainerToShipment);





/**
 * @swagger
 * /api/admin/addresses:
 *   get:
 *     summary: Get all addresses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all addresses
 *       500:
 *         description: Server error
 */
router.get('/addresses', auth, adminController.getAllAddresses);

/**
 * @swagger
 * /api/admin/addresses/{id}/verify:
 *   put:
 *     summary: Verify address
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVerified:
 *                 type: boolean
 *               verificationDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Address verified
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put('/addresses/:id/verify', auth, adminController.verifyAddress);

/**
 * @swagger
 * /api/admin/settings/{userId}:
 *   get:
 *     summary: Get user settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User settings
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Server error
 */
router.get('/settings/:userId', auth, adminController.getUserSettings);

/**
 * @swagger
 * /api/admin/settings/{userId}:
 *   put:
 *     summary: Update user settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationPreferences:
 *                 type: object
 *               defaultCurrency:
 *                 type: string
 *               language:
 *                 type: string
 *               theme:
 *                 type: string
 *               measurementSystem:
 *                 type: string
 *               timeZone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated settings
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Server error
 */
router.put('/settings/:userId', auth, adminController.updateUserSettings);

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       500:
 *         description: Server error
 */
router.get('/dashboard/stats', auth, adminController.getDashboardStats);


/**
 * @swagger
 * /api/admin/containers:
 *   get:
 *     summary: Get all containers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all containers
 *       500:
 *         description: Server error
 */
router.get('/containers', auth, adminController.getAllContainers);

/**
 * @swagger
 * /api/admin/containers:
 *   post:
 *     summary: Create a new container
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - containerNumber
 *               - type
 *               - capacity
 *               - location
 *             properties:
 *               containerNumber:
 *                 type: string
 *               type:
 *                 type: string
 *               capacity:
 *                 type: string
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Container created successfully
 *       400:
 *         description: Container with this number already exists
 *       500:
 *         description: Server error
 */
router.post('/containers', auth, adminController.createContainer);

/**
 * @swagger
 * /api/admin/containers/{id}:
 *   put:
 *     summary: Update container
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               capacity:
 *                 type: string
 *               location:
 *                 type: string
 *               lastMaintenanceDate:
 *                 type: string
 *                 format: date
 *               nextMaintenanceDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Container updated successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.put('/containers/:id', auth, adminController.updateContainer);

/**
 * @swagger
 * /api/admin/containers/{id}:
 *   delete:
 *     summary: Delete container
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Container deleted successfully
 *       404:
 *         description: Container not found
 *       500:
 *         description: Server error
 */
router.delete('/containers/:id', auth, adminController.deleteContainer);

// ====== SHIPMENT BOOKINGS CONTROLLER ======

/**
 * @swagger
 * /api/admin/shipments:
 *   post:
 *     summary: Create a new shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *               packageType:
 *                 type: string
 *               packageDescription:
 *                 type: string
 *               fragile:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/booking/shipments', auth, adminController.createShipment);

/**
 * @swagger
 * /api/admin/shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get('/booking/shipments', auth, adminController.getUserShipments);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment retrieved successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.get('/booking/shipments/:id', auth, adminController.getBookingById);


/**
 * @swagger
 * /api/admin/booking/shipments/{id}/dimensions:
 *   put:
 *     summary: Update shipment package dimensions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dimensions:
 *                 type: string
 *               weight:
 *                 type: number
 *     responses:
 *       200:
 *         description: Package dimensions updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/dimensions', auth, adminController.updateShipmentPackageDimensionsById);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/photos:
 *   put:
 *     summary: Update shipment photos
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Photos updated successfully
 *       400:
 *         description: No files provided
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/photos', auth, upload.array('files'), adminController.updateShipmentPhotoById);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/delivery-address:
 *   put:
 *     summary: Update shipment delivery address
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *               pickupAddress:
 *                 type: string
 *               receiverName:
 *                 type: string
 *               receiverPhoneNumber:
 *                 type: string
 *               receiverEmail:
 *                 type: string
 *               deliveryType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery address updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/delivery-address', auth, adminController.updateShipmentDeliveryAddressById);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/payment:
 *   put:
 *     summary: Update shipment payment status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/payment', auth, adminController.updateShipmentPaymentStatusById);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/pickup-time:
 *   put:
 *     summary: Update shipment pickup date and time
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledPickupTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Pickup time updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/pickup-time', auth, adminController.updateShipmentPickupDateTimeById);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/cancel:
 *   put:
 *     summary: Cancel shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment cancelled successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/cancel', auth, adminController.cancelShipment);

/**
 * @swagger
 * /api/admin/booking/shipments/track/{trackingNumber}:
 *   get:
 *     summary: Track shipment by tracking number
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment tracking details
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.get('/booking/shipments/track/:trackingNumber', auth, adminController.trackShipment);

/**
 * @swagger
 * /api/admin/booking/shipments/{id}/status:
 *   put:
 *     summary: Update shipment status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, picked_up, in_transit, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/:id/status', auth, adminController.updateBookingStatus);

/**
 * @swagger
 * /api/admin/booking/shipments/assign-driver:
 *   post:
 *     summary: Assign driver to shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.post('/booking/shipments/assign-driver', auth, adminController.assignDriverToBooking);

/**
 * @swagger
 * /api/admin/booking/shipments/assign-container:
 *   post:
 *     summary: Assign container to shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               containerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Container assigned successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Shipment or container not found
 *       500:
 *         description: Server error
 */
router.post('/booking/shipments/assign-container', auth, adminController.assignContainerToBooking);


/**
 * @swagger
 * /api/admin/booking/shipments/payment-status:
 *   put:
 *     summary: Update booking payment status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/payment-status', auth, adminController.updateBookingPaymentStatus);

/**
 * @swagger
 * /api/admin/booking/shipments/user-info:
 *   put:
 *     summary: Update shipment user information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipmentId:
 *                 type: string
 *               userInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/booking/shipments/user-info', auth, adminController.updateUserInfo);


// ====== PRICE GUIDE CONTROLLER ======
/**
 * @swagger
 * /api/admin/price-guide:
 *   get:
 *     summary: Get all price guides
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of price guides
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/price-guide', auth, adminController.getAllPriceGuides);

/**
 * @swagger
 * /api/admin/price-guide:
 *   post:
 *     summary: Create a new price guide
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Price guide created successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/price-guide', auth, adminController.createPriceGuide);

/**
 * @swagger
 * /api/admin/price-guide/{id}:
 *   put:
 *     summary: Update a price guide
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Price guide updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Price guide not found
 *       500:
 *         description: Server error
 */
router.put('/price-guide/:id', auth, adminController.editPriceGuide);

/**
 * @swagger
 * /api/admin/price-guide/{id}:
 *   delete:
 *     summary: Delete a price guide
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price guide deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Price guide not found
 *       500:
 *         description: Server error
 */
router.delete('/price-guide/:id', auth, adminController.deletePriceGuide);


// ====== ADMIN UPDATING SHIPMENTS =======

/**
 * @swagger
 * /api/admin/shipments/{id}/cancel:
 *   put:
 *     summary: Cancel a shipment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment cancelled successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/shipments/:id/cancel', auth, shipmentController.adminCancelShipment);

/**
 * @swagger
 * /api/admin/shipments/{id}:
 *   put:
 *     summary: Edit shipment details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *               packageType:
 *                 type: string
 *               packageDescription:
 *                 type: string
 *               fragile:
 *                 type: boolean
 *               status:
 *                 type: string
 *               price:
 *                 type: number
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/shipments/:id', auth, shipmentController.adminEditShipment);

/**
 * @swagger
 * /api/admin/shipments/{id}/dimensions:
 *   put:
 *     summary: Update shipment package dimensions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dimensions:
 *                 type: string
 *               weight:
 *                 type: number
 *               priceGuides:
 *                 type: string
 *     responses:
 *       200:
 *         description: Package dimensions updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/shipments/:id/dimensions', auth, shipmentController.adminUpdateShipmentPackageDimensionsById);

/**
 * @swagger
 * /api/admin/shipments/{id}/photos:
 *   patch:
 *     summary: Update shipment photos
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Photos updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/photos', 
    upload.array('file'), // Use 'file' as the field name
    shipmentController.adminUpdateShipmentPhotoById
);

/**
 * @swagger
 * /api/admin/shipments/{id}/delivery-address:
 *   patch:
 *     tags: [Admin]
 *     summary: Update shipment delivery address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryAddress
 *               - pickupAddress
 *               - receiverName
 *               - receiverPhoneNumber
 *             properties:
 *               deliveryAddress:
 *                 type: object
 *                 description: Delivery address details
 *               pickupAddress:
 *                 type: object
 *                 description: Pickup address details
 *               receiverName:
 *                 type: string
 *                 description: Name of the receiver
 *               receiverPhoneNumber:
 *                 type: string
 *                 description: Phone number of the receiver
 *               deliveryType:
 *                 type: string
 *                 description: Delivery type (park or home)
 *     responses:
 *       200:
 *         description: Delivery address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Error updating delivery address
 */
router.patch('/:id/delivery-address', shipmentController.adminUpdateShipmentDeliveryAddressById);

/**
 * @swagger
 * api/admin/shipments/{id}/pickup-date-time:
 *   patch:
 *     tags: [Admin]
 *     summary: Update shipment pickup date and time
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduledPickupTime
 *             properties:
 *               scheduledPickupTime:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled pickup date and time
 *     responses:
 *       200:
 *         description: Shipment pickup date and time updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:    
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string   
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Error updating pickup date and time
 */
router.patch('/:id/pickup-date-time', shipmentController.adminUpdateShipmentPickupDateTimeById);


module.exports = router;
