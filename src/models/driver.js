const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('driver', 'admin'),
    defaultValue: 'driver'
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (driver) => {
      if (driver.password) {
        const salt = await bcrypt.genSalt(10);
        driver.password = await bcrypt.hash(driver.password, salt);
      }
    },
    beforeUpdate: async (driver) => {
      if (driver.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        driver.password = await bcrypt.hash(driver.password, salt);
      }
    }
  },
  timestamps: true
});

// Instance method to check password
Driver.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Driver;