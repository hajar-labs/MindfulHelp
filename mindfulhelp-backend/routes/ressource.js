const express = require('express');
const resourceController = require('../controllers/resourceController'); // Import the controller
const auth = require('../middleware/authMiddleware'); // Import authentication middleware
const router = express.Router();

// Use the controller methods
router.post('/', auth, resourceController.createResource);
router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResourceById);
router.put('/:id', auth, resourceController.updateResource);
router.delete('/:id', auth, resourceController.deleteResource);

module.exports = router;