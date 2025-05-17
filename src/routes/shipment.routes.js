const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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
 *               - serviceType
 *               - packageType
 *               - packageDescription
 *               - fragile
 *             properties:
 *               serviceType:
 *                 type: string
 *                 description: Type of shipping service (e.g., express, standard)
 *               packageType:
 *                 type: string
 *                 description: Type of package being shipped
 *               packageDescription:
 *                 type: string
 *                 description: Detailed description of the package contents
 *               fragile:
 *                 type: boolean
 *                 description: Whether the package contains fragile items
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
router.get('/:id/cancel', shipmentController.cancelShipment);

/**
 * @swagger
 * /shipments/{id}/package-dimensions:
 *   patch:
 *     tags: [Shipments]
 *     summary: Update shipment package dimensions
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
 *               - dimensions
 *               - weight
 *             properties:
 *               dimensions:
 *                 type: object
 *                 description: Package dimensions (length, width, height)
 *               weight:
 *                 type: number
 *                 description: Package weight
 *     responses:
 *       200:
 *         description: Package dimensions updated successfully
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
 *         description: Error updating package dimensions
 */
router.patch('/:id/package-dimensions', shipmentController.updateShipmentPackageDimensionsById);

/**
 * @swagger
 * /shipments/{id}/photos:
 *   patch:
 *     tags: [Shipments]
 *     summary: Update shipment photos
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
 *         description: Error updating photos
 */
router.patch('/:id/photos', 
  upload.array('file'), // Use 'file' as the field name
  shipmentController.updateShipmentPhotoById
);

/**
 * @swagger
 * /shipments/{id}/delivery-address:
 *   patch:
 *     tags: [Shipments]
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
router.patch('/:id/delivery-address', shipmentController.updateShipmentDeliveryAddressById);

/**
 * @swagger
 * /shipments/{id}/payment-status:
 *   patch:
 *     tags: [Shipments]
 *     summary: Update shipment payment status
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
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 description: Payment status of the shipment
 *     responses:
 *       200:
 *         description: Payment status updated successfully
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
 *         description: Error updating payment status
 */
router.patch('/:id/payment-status', shipmentController.updateShipmentPaymentStatusById);

/**
 * @swagger
 * /shipments/{id}/pickup-date-time:
 *   patch:
 *     tags: [Shipments]
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
router.patch('/:id/pickup-date-time', shipmentController.updateShipmentPickupDateTimeById);
module.exports = router;