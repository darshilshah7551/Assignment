const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
