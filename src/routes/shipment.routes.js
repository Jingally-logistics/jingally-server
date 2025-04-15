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
 *         multipart/form-data:
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Package images (optional)
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     trackingNumber:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       status:
 *                         type: string
 *                       trackingNumber:
 *                         type: string
 *                       pickupAddress:
 *                         type: object
 *                       deliveryAddress:
 *                         type: object
 *                       packageType:
 *                         type: string
 *                       weight:
 *                         type: number
 *                       dimensions:
 *                         type: object
 *                       scheduledPickupTime:
 *                         type: string
 *                         format: date-time
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error retrieving shipments
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     trackingNumber:
 *                       type: string
 *                     pickupAddress:
 *                       type: object
 *                     deliveryAddress:
 *                       type: object
 *                     packageType:
 *                       type: string
 *                     weight:
 *                       type: number
 *                     dimensions:
 *                       type: object
 *                     scheduledPickupTime:
 *                       type: string
 *                       format: date-time
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error retrieving shipment
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error updating shipment status
 */
router.patch('/:id/status', shipmentController.updateShipmentStatus);

/**
 * @swagger
 * /shipments/track/{trackingNumber}:
 *   get:
 *     tags: [Shipments]
 *     summary: Track shipment by tracking number
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment tracking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     trackingNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                     estimatedDeliveryTime:
 *                       type: string
 *                       format: date-time
 *                     pickupAddress:
 *                       type: object
 *                     deliveryAddress:
 *                       type: object
 *       404:
 *         description: Shipment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error tracking shipment
 */
router.get('/track/:trackingNumber', shipmentController.trackShipment);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Shipment cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Shipment not found or cannot be cancelled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Error cancelling shipment
 */
router.post('/:id/cancel', shipmentController.cancelShipment);

module.exports = router;