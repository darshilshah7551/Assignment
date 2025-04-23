const express = require('express');
const router = express.Router();
const {
  getProperties,
  searchProperties,
  createProperty,
  updateProperty,
  getPropertyIssues,
  getDashboardSummary
} = require('../controllers/propertyController');

router.get('/properties', getProperties);
router.get('/search', searchProperties);
router.post('/properties', createProperty);
router.put('/:id', updateProperty);
router.get('/issues', getPropertyIssues);
router.get('/dashboard/summary', getDashboardSummary);

module.exports = router;
