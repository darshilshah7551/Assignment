require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');  // Import auth routes
const propertyRoutes = require('./routes/propertyRoutes');  // Import property routes

const app = express();

// Middleware for parsing JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connect to the database
connectDB();

// Define the routes
app.use('/api/auth', authRoutes);  // Use auth routes for authentication
app.use('/api/properties', propertyRoutes);  // Use property routes for properties

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
