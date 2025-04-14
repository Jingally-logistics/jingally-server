const Settings = require('../models/settings');
const { ValidationError } = require('sequelize');

class SettingsController {
  // Get user settings
  async getUserSettings(req, res) {
    try {
      const settings = await Settings.findOne({
        where: { userId: req.user.id }
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Settings not found'
        });
      }

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving settings',
        error: error.message
      });
    }
  }

  // Create or update user settings
  async updateSettings(req, res) {
    try {
      const [
        settings,
        created
      ] = await Settings.findOrCreate({
        where: { userId: req.user.id },
        defaults: {
          ...req.body,
          userId: req.user.id
        }
      });

      if (!created) {
        await settings.update(req.body);
      }

      res.json({
        success: true,
        data: settings,
        message: created ? 'Settings created' : 'Settings updated'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating settings',
        error: error.message
      });
    }
  }

  // Update specific notification preferences
  async updateNotificationPreferences(req, res) {
    try {
      const settings = await Settings.findOne({
        where: { userId: req.user.id }
      });

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: 'Settings not found'
        });
      }

      const currentPreferences = settings.notificationPreferences;
      const updatedPreferences = {
        ...currentPreferences,
        ...req.body
      };

      await settings.update({
        notificationPreferences: updatedPreferences
      });

      res.json({
        success: true,
        data: settings,
        message: 'Notification preferences updated'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating notification preferences',
        error: error.message
      });
    }
  }
}

module.exports = new SettingsController();