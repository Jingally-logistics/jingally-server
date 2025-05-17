const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookShipment = sequelize.define('BookShipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  userInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  packageType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  packageDescription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fragile: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  pickupAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  deliveryAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  deliveryType: {
    type: DataTypes.ENUM('park', 'home'),
    allowNull: true,
    defaultValue: 'home'
  },
  scheduledPickupTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  receiverPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  receiverEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'unpaid'),
    defaultValue: 'unpaid'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('paypal', 'bank_transfer', 'cash'),
    allowNull: true,
    defaultValue: 'paypal'
  },
  driverId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Drivers',
      key: 'id'
    }
  },
  containerID: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Containers',
      key: 'id'
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of Cloudinary image URLs'
  }
}, {
  timestamps: true,
  tableName: 'BookShipments',
  hooks: {
    beforeCreate: (shipment) => {
      // Generate tracking number
      shipment.trackingNumber = 'TRK' + Date.now() + Math.floor(Math.random() * 1000);
    }
  }
});

module.exports = BookShipment;