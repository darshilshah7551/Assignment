const Property = require('../models/property');
const mongoose = require('mongoose');

// Create a new property
const createProperty = async (req, res) => {
  const { name, address, phone, category, website } = req.body;

  if (!name || !address || !phone || !category || !website) {
    return res.status(400).json({ message: 'All fields are required: name, address, phone, category, website' });
  }

  try {
    const newProperty = new Property({ name, address, phone, category, website });
    await newProperty.save();
    res.status(201).json(newProperty);
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

  if (!name && !address && !phone && !category && !website) {
    return res.status(400).json({ message: 'At least one field must be provided to update' });
  }

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.name = name ?? property.name;
    property.address = address ?? property.address;
    property.phone = phone ?? property.phone;
    property.category = category ?? property.category;
    property.website = website ?? property.website;

    await property.save();
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating property', error: err.message });
  }
};

// Get all properties
const getProperties = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || isNaN(limitNum)) {
    return res.status(400).json({ message: 'Page and limit must be valid numbers' });
  }

  try {
    const filteredProperties = await Property.find({
      name: { $regex: search, $options: 'i' }
    });

    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limitNum);
    const paginatedProperties = filteredProperties.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      total,
      totalPages,
      currentPage: pageNum,
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

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const filteredProperties = await Property.find({
      name: { $regex: query, $options: 'i' }
    });
    res.json(filteredProperties);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving properties', error: err.message });
  }
};

// Get property issues
const getPropertyIssues = async (req, res) => {
  try {
    const issues = await Property.aggregate([
      {
        $project: {
          name: 1,
          address: 1,
          phone: 1,
          category: 1,
          website: 1,
          issues: {
            $setUnion: [
              { $cond: [{ $eq: ["$name", ""] }, ["No Name"], []] },
              { $cond: [{ $eq: ["$address", ""] }, ["No Address"], []] },
              { $cond: [{ $eq: ["$phone", ""] }, ["No Phone"], []] },
              { $cond: [{ $eq: ["$category", ""] }, ["No Category"], []] },
              { $cond: [{ $eq: ["$website", ""] }, ["No Website"], []] }
            ]
          }
        }
      }
    ]);

    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching issues', error: err.message });
  }
};

// Dashboard summary data
const getDashboardSummary = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ website: "Available" });
    const unavailableProperties = totalProperties - availableProperties;
    const condoCount = await Property.countDocuments({ category: "Condo" });
    const apartmentComplexCount = totalProperties - condoCount;
    const propertiesWithIssues = await Property.countDocuments({
      $or: [
        { name: "" },
        { address: "" },
        { phone: "" },
        { category: "" },
        { website: "" }
      ]
    });

    res.json({
      totalProperties,
      availableProperties,
      unavailableProperties,
      apartmentComplexCount,
      condoCount,
      propertiesWithIssues
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard summary', error: err.message });
  }
};

module.exports = {
  getProperties,
  searchProperties,
  createProperty,
  updateProperty,
  getPropertyIssues,
  getDashboardSummary
};
