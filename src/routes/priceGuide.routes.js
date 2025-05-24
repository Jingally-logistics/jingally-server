const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const auth = require('../middleware/auth');
// All price guide routes require authentication
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Price Guides
 *   description: Price guide management endpoints
 */


// get price guides
/**
 * @swagger
 * /price-guide:
 *   get:
 *     tags: [Price Guides]
 *     summary: Get all price guides
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Price guides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   guideName:
 *                     type: string
 *                   guideNumber:
 *                     type: string
 *                   price:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error retrieving price guides
 */
router.get('/', shipmentController.getPriceGuides);

module.exports = router;