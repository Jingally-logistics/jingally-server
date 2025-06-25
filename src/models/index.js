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
// To avoid the "Too many keys specified; max 64 keys allowed" error during sync,
// skip the `alter` option for User in production and only use it in development.
// You may also want to avoid using `alter` if you are hitting this error in development
// and instead use migrations for schema changes.

const syncDatabase = async () => {
  try {
    // Disable foreign key checks to avoid constraint issues during sync
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Only use { alter: true } in development, and skip it for User if you hit the key limit
    const alterOption = process.env.NODE_ENV === 'development';

    // For the User model, avoid using alter if you are hitting the key limit
    // You can also use { force: false } to just ensure the table exists without altering
    await User.sync({ alter: false }); // Do not alter User table to avoid key limit error
    await Driver.sync({ alter: alterOption });
    await Container.sync({ alter: alterOption });
    await Address.sync({ alter: alterOption });
    await Settings.sync({ alter: alterOption });
    await Shipment.sync({ alter: alterOption });
    await BookShipment.sync({ alter: alterOption });
    await PriceGuide.sync({ alter: alterOption });
    await GuestShipment.sync({ alter: alterOption });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Database synced successfully');
  } catch (error) {
    // Log a more specific message if the error is ER_TOO_MANY_KEYS
    if (error.original && error.original.code === 'ER_TOO_MANY_KEYS') {
      console.error('MySQL key limit reached (max 64 keys per table). Consider cleaning up old indexes or using migrations instead of sync({ alter: true }) for the User table.');
    }
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