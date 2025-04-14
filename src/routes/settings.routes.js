const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings and preferences management
 */

// Apply authentication middleware to all settings routes
router.use(authMiddleware);

/**
 * @swagger
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get user settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 language:
 *                   type: string
 *                 theme:
 *                   type: string
 *                 notifications:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: boolean
 *                     push:
 *                       type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get('/', settingsController.getUserSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     tags: [Settings]
 *     summary: Update user settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               theme:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.put('/', settingsController.updateSettings);

/**
 * @swagger
 * /settings/notifications:
 *   patch:
 *     tags: [Settings]
 *     summary: Update notification preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.patch('/notifications', settingsController.updateNotificationPreferences);

module.exports = router;