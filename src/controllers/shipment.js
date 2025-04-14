const { Shipment, User } = require('../models');

// Create new shipment
const createShipment = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      packageType,
      weight,
      dimensions,
      specialInstructions,
      status = 'pending'
    } = req.body;

    const shipment = await Shipment.create({
      userId: req.user.id,
      pickupAddress,
      deliveryAddress,
      packageType,
      weight,
      dimensions,
      specialInstructions,
      status
    });

    res.status(201).json({ shipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all shipments for current user
const getUserShipments = async (req, res) => {
  try {
    const shipments = await Shipment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ shipments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    res.json({ shipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update shipment status
const updateShipmentStatus = async (req, res) => {
  try {
    const { status, currentLocation } = req.body;

    const shipment = await Shipment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    shipment.status = status;
    if (currentLocation) {
      shipment.currentLocation = currentLocation;
    }

    await shipment.save();

    res.json({ shipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel shipment
const cancelShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        status: 'pending'
      }
    });

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found or cannot be cancelled' });
    }

    shipment.status = 'cancelled';
    await shipment.save();

    res.json({ message: 'Shipment cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  cancelShipment
};