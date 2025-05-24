const sequelize = require('../config/database');
const User = require('./user');
const Shipment = require('./shipment');
const BookShipment = require('./bookShipment');
const Settings = require('./settings');
const Address = require('./address');
const Driver = require('./driver');
const Container = require('./containers');
const PriceGuide = require('./priceGuide');
const GuestShipment = require("./guestShipment");

// Define associations
User.hasMany(Shipment, {
  foreignKey: 'userId',
  as: 'shipments'
});

Shipment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(BookShipment, {
  foreignKey: 'adminId',
  as: 'bookShipments'
});

BookShipment.belongsTo(User, {
  foreignKey: 'adminId',
  as: 'admin'
});

Container.hasMany(Shipment, {
  foreignKey: 'containerID',
  as: 'shipments'
});

Container.hasMany(BookShipment, {
  foreignKey: 'containerID',
  as: 'bookShipments'
});

BookShipment.belongsTo(Container, {
  foreignKey: 'containerID',
  as: 'container'
});

GuestShipment.belongsTo(Container, {
  foreignKey: 'containerID',
  as: 'container'
});

Shipment.belongsTo(Container, {
  foreignKey: 'containerID',
  as: 'container'
});

Driver.hasMany(Shipment, {
  foreignKey: 'driverId',
  as: 'shipments'
});

Driver.hasMany(BookShipment, {
  foreignKey: 'driverId',
  as: 'bookShipments'
});

BookShipment.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver'
});

GuestShipment.belongsTo(Driver, {
  foreignKey: 'driverId',
  as: 'driver'
});

Shipment.belongsTo(Driver, {
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
const models = { User, Shipment, Settings, Address, Driver, Container, BookShipment, PriceGuide, GuestShipment };
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Sync all models with database
const syncDatabase = async () => {
  try {
    // Force sync in specific order to handle foreign key constraints
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // First create tables without foreign key constraints
    await User.sync({ alter: process.env.NODE_ENV === 'development' });
    await Driver.sync({ alter: process.env.NODE_ENV === 'development' });
    await Container.sync({ alter: process.env.NODE_ENV === 'development' });
    await Address.sync({ alter: process.env.NODE_ENV === 'development' });
    await Settings.sync({ alter: process.env.NODE_ENV === 'development' });
    await Shipment.sync({ alter: process.env.NODE_ENV === 'development' });
    await BookShipment.sync({ alter: process.env.NODE_ENV === 'development' });
    await PriceGuide.sync({ alter: process.env.NODE_ENV === 'development' });
    await GuestShipment.sync({ alter: process.env.NODE_ENV === 'development' });
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
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
  Driver,
  Container,
  BookShipment,
  PriceGuide,
  GuestShipment,
  syncDatabase
};