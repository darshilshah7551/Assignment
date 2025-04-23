
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: String,
email: { type: String, unique: true, required: true },
password: { type: String, required: true },
token: String
});

// module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema, 'users');
