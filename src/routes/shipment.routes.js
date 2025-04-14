const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const auth = require('../middleware/auth');

// All shipment routes require authentication
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Shipment management endpoints
 */

/**
 * @swagger
 * /shipments:
 *   post:
 *     tags: [Shipments]
 *     summary: Create a new shipment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupAddress
 *               - deliveryAddress
 *               - packageType
 *               - weight
 *               - dimensions
 *               - scheduledPickupTime
 *               - price
 *             properties:
 *               pickupAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               packageType:
 *                 type: string
 *                 description: Type of package being shipped
 *               weight:
 *                 type: number
 *                 description: Weight of the package in kg
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                   width:
 *                     type: number
 *                   height:
 *                     type: number
 *               scheduledPickupTime:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled time for package pickup
 *               price:
 *                 type: number
 *                 description: Shipping price
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.post('/', shipmentController.createShipment);
/**
 * @swagger
 * /shipments:
 *   get:
 *     tags: [Shipments]
 *     summary: Get all shipments for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   status:
 *                     type: string
 *                   trackingNumber:
 *                     type: string
 *       401:
 *         description: Not authenticated
 */
router.get('/', shipmentController.getUserShipments);

/**
 * @swagger
 * /shipments/{id}:
 *   get:
 *     tags: [Shipments]
 *     summary: Get shipment by ID
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
 *         description: Shipment details retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 */
router.get('/:id', shipmentController.getShipmentById);
/**
 * @swagger
 * /shipments/{id}/status:
 *   patch:
 *     tags: [Shipments]
 *     summary: Update shipment status
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_transit, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 */
router.patch('/:id/status', shipmentController.updateShipmentStatus);

/**
 * @swagger
 * /shipments/{id}/cancel:
 *   post:
 *     tags: [Shipments]
 *     summary: Cancel a shipment
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
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 *       400:
 *         description: Shipment cannot be cancelled
 */
router.post('/:id/cancel', shipmentController.cancelShipment);

module.exports = router;