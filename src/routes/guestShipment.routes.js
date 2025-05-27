const express = require('express');
const router = express.Router();
const guestShipmentController = require('../controllers/guestShipment.controller');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Guest Shipment
 *   description: Guest shipment management endpoints
 */

/**
 * @swagger
 * /api/guest-shipments:
 *   post:
 *     summary: Create a new guest shipment
 *     tags: [Guest Shipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - packageType
 *               - packageDescription
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
router.post('/', guestShipmentController.createShipment);

/**
 * @swagger
 * /api/guest-shipments:
 *   get:
 *     summary: Get all guest shipments
 *     tags: [Guest Shipment]
 *     responses:
 *       200:
 *         description: List of guest shipments retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', guestShipmentController.getShipments);


/**
 * @swagger
 * /api/guest-shipments/track/{trackingNumber}:
 *   get:
 *     summary: Track a shipment by tracking number
 *     tags: [Guest Shipment]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment details retrieved successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.get('/track/:trackingNumber', guestShipmentController.trackShipment);

/**
 * @swagger
 * /api/guest-shipments/{id}/dimensions:
 *   put:
 *     summary: Update shipment package dimensions
 *     tags: [Guest Shipment]
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
 *                 type: object
 *               weight:
 *                 type: number
 *               priceGuides:
 *                 type: object
 *     responses:
 *       200:
 *         description: Dimensions updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/:id/dimensions', guestShipmentController.updateShipmentPackageDimensions);

/**
 * @swagger
 * /api/guest-shipments/{id}/photos:
 *   post:
 *     summary: Upload shipment photos
 *     tags: [Guest Shipment]
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
 *         description: Photos uploaded successfully
 *       400:
 *         description: No files provided
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.post('/:id/photos', upload.array('files'), guestShipmentController.updateShipmentPhoto);

/**
 * @swagger
 * /api/guest-shipments/{id}/address:
 *   put:
 *     summary: Update shipment delivery address
 *     tags: [Guest Shipment]
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
 *                 type: object
 *               pickupAddress:
 *                 type: object
 *               receiverName:
 *                 type: string
 *               receiverPhoneNumber:
 *                 type: string
 *               receiverEmail:
 *                 type: string
 *               deliveryType:
 *                 type: string
 *                 enum: [park, home]
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/:id/address', guestShipmentController.updateShipmentDeliveryAddress);

/**
 * @swagger
 * /api/guest-shipments/{id}/payment:
 *   put:
 *     summary: Update shipment payment status
 *     tags: [Guest Shipment]
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
 *                 enum: [pending, paid, failed, unpaid]
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [paypal, bank_transfer, cash, part_payment]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/:id/payment', guestShipmentController.updateShipmentPaymentStatus);

/**
 * @swagger
 * /api/guest-shipments/{id}/pickup:
 *   put:
 *     summary: Update shipment pickup date and time
 *     tags: [Guest Shipment]
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
router.put('/:id/pickup', guestShipmentController.updateShipmentPickupDateTime);

/**
 * @swagger
 * /api/guest-shipments/{id}/cancel:
 *   put:
 *     summary: Cancel a shipment
 *     tags: [Guest Shipment]
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
router.put('/:id/cancel', guestShipmentController.cancelShipment);

/**
 * @swagger
 * /api/guest-shipments/user-info:
 *   put:
 *     summary: Update user information for a shipment
 *     tags: [Guest Shipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipmentId
 *               - userInfo
 *             properties:
 *               shipmentId:
 *                 type: string
 *               userInfo:
 *                 type: object
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Server error
 */
router.put('/user-info', guestShipmentController.updateUserInfo);

/**
 * @swagger
 * /api/guest-shipments/price-guides:
 *   get:
 *     summary: Get all price guides
 *     tags: [Guest Shipment]
 *     responses:
 *       200:
 *         description: Price guides retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/price-guides', guestShipmentController.getPriceGuides);


module.exports = router;