const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Container = sequelize.define('Container', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
  containerNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'in_use', 'maintenance'),
    defaultValue: 'available'
  },
  capacity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Container.associate = (models) => {
  Container.hasMany(models.Shipment, {
    foreignKey: 'containerID',
    as: 'shipments'
  });
};

module.exports = Container;
