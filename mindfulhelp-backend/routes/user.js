// routes/user.js
const express = require('express');
const User = require('../models/User');

const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Protected routes (require authentication)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.delete('/profile', auth, userController.deleteAccount);

module.exports = router;