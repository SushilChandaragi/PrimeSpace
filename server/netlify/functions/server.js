const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../../config/db');

// Load env vars - use explicit path for serverless environment
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('../../routes/auth'));
app.use('/api/properties', require('../../routes/properties'));

// Health check route
app.get('/api', (req, res) => {
  res.json({ message: 'PrimeSpace API is running...' });
});

// Export the serverless function
module.exports.handler = serverless(app);
