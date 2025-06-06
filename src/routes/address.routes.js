const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: User address management and verification
 */

// Apply authentication middleware to all address routes
router.use(authMiddleware);

/**
 * @swagger
 * /addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Create a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - country
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.post('/', addressController.createAddress);

/**
 * @swagger
 * /addresses/all:
 *   get:
 *     tags: [Addresses]
 *     summary: Get all addresses (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   type:
 *                     type: string
 *                   isVerified:
 *                     type: boolean
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 */
router.get('/all', addressController.getAllAddresses);




/**
 * @swagger
 * /addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: Get all addresses for authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   isDefault:
 *                     type: boolean
 *                   isVerified:
 *                     type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get('/', addressController.getUserAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     tags: [Addresses]
 *     summary: Get specific address by ID
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
 *         description: Address details retrieved successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 */
router.get('/:id', addressController.getAddressById);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     tags: [Addresses]
 *     summary: Update address
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
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 */
router.put('/:id', addressController.updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete address
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
 *         description: Address deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 */
router.delete('/:id', addressController.deleteAddress);

/**
 * @swagger
 * /addresses/{id}/verify:
 *   post:
 *     tags: [Addresses]
 *     summary: Verify address
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
 *         description: Address verified successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Address not found
 */
router.post('/:id/verify', addressController.verifyAddress);

module.exports = router;