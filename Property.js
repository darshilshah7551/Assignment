const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, },
    phone: { type: String },
    category: { type: String },
    website: { type: String },
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
