const express = require('express');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();



// Register User
router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        //Not hashing the password here, letting the presave hook in the User model handle it
        user = new User({
            username, 
            email, 
            password // Passing the plain text password here
        });
        
        await user.save();
        
        console.log('User saved to database:', user);

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during signup:', err.message); // Debugging log
        res.status(500).send('Server Error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        console.log('Stored Hashed Password:', user.password); // Debugging log
        console.log('Provided Password:', password); // Debugging log

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match Result:', isMatch); // Debugging log
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during login:', err.message); // Debugging log
        res.status(500).send('Server Error');
    }
});

module.exports = router;