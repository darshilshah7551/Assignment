const mongoose = require('mongoose');

// Define the Property schema
const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  category: { type: String },
  website: { type: String },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Property', PropertySchema);
