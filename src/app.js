const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import route files
// const authRoutes = require('./routes/auth.routes');
// const shipmentRoutes = require('./routes/shipment.routes');
// const settingsRoutes = require('./routes/settings.routes');
// const addressRoutes = require('./routes/address.routes');

// // Import Swagger setup
// const setupSwagger = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Setup Swagger
// setupSwagger(app);

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/shipments', shipmentRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/addresses', addressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;