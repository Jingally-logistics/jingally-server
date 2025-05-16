const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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


module.exports = router;
