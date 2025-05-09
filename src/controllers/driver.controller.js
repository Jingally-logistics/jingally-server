const jwt = require('jsonwebtoken');
const emailVerificationService = require('../services/email-verification.service');
const { Driver, Shipment } = require('../models');

// Generate JWT token
const generateToken = (driver) => {
  return jwt.sign(
    { id: driver.id, email: driver.email, role: driver.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// User login
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await Driver.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = generateToken(user);
      if(user.isVerified === false){
        await emailVerificationService.sendVerificationEmail(user);
      }
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        },
        token
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
};

// get profile
const getProfile = async (req, res)=>{
    try {
        const driver = await Driver.findByPk(req.user.id);  
        res.json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        });
    }
}
// getting all shipments assigned
const getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
          where: { driverId: req.user.id },
          order: [['createdAt', 'DESC']]
        });
  
        res.json({
          success: true,
          data: shipments
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error retrieving shipments',
          error: error.message
        });
      }
}

// getting shipment by ID
const getSingleShipment = async (req, res)=>{
    try {
        const shipment = await Shipment.findOne({
          where: { id: req.params.id }
        });
  
        res.json({
          success: true,
          data: shipment
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error retrieving shipment',
          error: error.message
        });
    }
}

// update profile
const updateProfile = async (req, res)=>{
    try {
        const { firstName, lastName, phoneNumber, address } = req.body;
        const driver = await Driver.findByPk(req.user.id);
        if(!driver){
            return res.status(404).json({ error: 'Driver not found' });
        }
        driver.firstName = firstName;
        driver.lastName = lastName;
        driver.phoneNumber = phoneNumber;
        driver.address = address;
        await driver.save();
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: driver
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
}

// update password
const updatePassword = async (req, res)=>{
    try {
        const { oldPassword, newPassword } = req.body;
        const driver = await Driver.findByPk(req.user.id);
        if(!driver){
            return res.status(404).json({ error: 'Driver not found' });
        }
        const isValidPassword = await driver.validatePassword(oldPassword);
        if(!isValidPassword){
            return res.status(401).json({ error: 'Invalid old password' });
        }
        driver.password = newPassword;
        await driver.save();
        return res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
}

module.exports = {
    login,
    getAllShipments,
    getSingleShipment,
    updateProfile,
    updatePassword,
    getProfile
};