const Property = require('../models/property');

// Get all properties
const getProperties = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  try {
    const filteredProperties = await Property.find({
      name: { $regex: search, $options: 'i' }
    });

    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedProperties = filteredProperties.slice((page - 1) * limit, page * limit);

    res.json({
      total,
      totalPages,
      currentPage: parseInt(page),
      properties: paginatedProperties,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching properties', error: err.message });
  }
};

// Search properties by query
const searchProperties = async (req, res) => {
  const { query } = req.query;
  
  try {
    const filteredProperties = await Property.find({
      name: { $regex: query, $options: 'i' }
    });
    res.json(filteredProperties);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving properties', error: err.message });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  const { name, address, phone, category, website } = req.body;
  
  try {
    const newProperty = new Property({ name, address, phone, category, website });
    await newProperty.save();
    res.json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating property', error: err.message });
  }
};

// Update property by ID
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, category, website } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid property ID' });
  }
  
  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.name = name || property.name;
    property.address = address || property.address;
    property.phone = phone || property.phone;
    property.category = category || property.category;
    property.website = website || property.website;

    await property.save();
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating property', error: err.message });
  }
};

module.exports = {
  getProperties,
  searchProperties,
  createProperty,
  updateProperty,
};
