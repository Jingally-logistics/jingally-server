const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');

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

module.exports = router;
