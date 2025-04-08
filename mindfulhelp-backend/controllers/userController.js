const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const { username, email, bio, profilePicture } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { username, email, bio, profilePicture },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.userId);
        res.status(200).json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

module.exports = { getProfile, updateProfile, deleteAccount };