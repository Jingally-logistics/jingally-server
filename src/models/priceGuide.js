const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PriceGuide = sequelize.define('PriceGuide', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  guideNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  guideName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
},{
    timestamps: true,
    hooks: {
      beforeCreate: (priceGuide) => {
        // Generate tracking number
        priceGuide.guideNumber = 'JLP' + Date.now() + Math.floor(Math.random() * 1000);
      }
    }
})

module.exports = PriceGuide;