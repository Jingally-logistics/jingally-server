const sequelize = require('../config/database');
const User = require('./user');
const Shipment = require('./shipment');
const Settings = require('./settings');
const Address = require('./address');

// Define associations
User.hasMany(Shipment, {
  foreignKey: 'userId',
  as: 'shipments'
});

Shipment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});


// Add driver association
User.hasMany(Shipment, {
  foreignKey: 'driverId',
  as: 'assignedShipments'
});

Shipment.belongsTo(User, {
  foreignKey: 'driverId',
  as: 'driver'
});

User.hasOne(Settings, {
  foreignKey: 'userId',
  as: 'settings'
});

Settings.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses'
});

Address.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Settings.belongsTo(Address, {
  foreignKey: 'defaultPickupAddress',
  as: 'pickupAddress'
});

// Call associate methods if they exist
const models = { User, Shipment, Settings, Address };
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sync all models with database
const syncDatabase = async () => {
  try {
    // Force sync in specific order to handle foreign key constraints
    await User.sync({ alter: process.env.NODE_ENV === 'development' });
    await Address.sync({ alter: process.env.NODE_ENV === 'development' });
    await Settings.sync({ alter: process.env.NODE_ENV === 'development' });
    await Shipment.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Shipment,
  Settings,
  Address,
  syncDatabase
};