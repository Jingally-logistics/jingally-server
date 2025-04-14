const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  notificationPreferences: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      email: true,
      push: true,
      sms: false,
      shipmentUpdates: true,
      promotionalOffers: false,
      newsletter: false
    }
  },
  defaultCurrency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en'
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'system'),
    allowNull: false,
    defaultValue: 'system'
  },
  defaultPickupAddress: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Addresses',
      key: 'id'
    }
  },
  measurementSystem: {
    type: DataTypes.ENUM('metric', 'imperial'),
    allowNull: false,
    defaultValue: 'metric'
  },
  timeZone: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'UTC'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (settings) => {
      if (typeof settings.notificationPreferences === 'string') {
        settings.notificationPreferences = JSON.parse(settings.notificationPreferences);
      }
    },
    beforeUpdate: (settings) => {
      if (typeof settings.notificationPreferences === 'string') {
        settings.notificationPreferences = JSON.parse(settings.notificationPreferences);
      }
    }
  }
});

module.exports = Settings;