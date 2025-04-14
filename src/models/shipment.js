const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  packageType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  pickupAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  scheduledPickupTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of Cloudinary image URLs'
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (shipment) => {
      // Generate tracking number
      shipment.trackingNumber = 'TRK' + Date.now() + Math.floor(Math.random() * 1000);
    }
  }
});

module.exports = Shipment;