require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const setupSwagger = require('./swagger');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/addresses', require('./routes/address.routes'));
app.use('/api/shipments', require('./routes/shipment.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/drivers', require('./routes/driver.routes'))
app.use('/api/price-guide', require('./routes/priceGuide.routes'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // Sync database models
    await require('./models').syncDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});