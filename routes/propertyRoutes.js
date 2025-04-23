const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

// Property routes
router.get('/properties', propertyController.getProperties);
router.get('/properties/search', propertyController.searchProperties);
router.post('/properties', propertyController.createProperty);
router.put('/properties/:id', propertyController.updateProperty);

module.exports = router;
