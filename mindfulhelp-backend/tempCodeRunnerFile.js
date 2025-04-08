    require('dotenv').config(); // Load environment variables
    const express = require('express');
    const connectDB = require('./config/db');
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const User = require('./models/User'); 

    // Import Routes
    const protectedRoutes = require('./routes/protected');
    const userRoutes = require('./routes/user');
    const authRoutes = require('./routes/auth');

    const app = express();
    const PORT = process.env.PORT || 5000;


    // Connect to Database
    connectDB();

    // Middleware
    app.use(cors()); // Enable CORS
    app.use(express.json()); // Parse JSON request bodies
    app.use(bodyParser.json());

    // Routes
    app.use('/api/auth', authRoutes); // Authentication routes
    app.use('/api/protected', protectedRoutes); // Protected routes
    app.use('/api/user', userRoutes); // User routes
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error('MongoDB Connection Error:', err));

    
    // Signup route
    app.post('/signup', async (req, res) => {
        const { username, email, password } = req.body;
    
        try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error creating user' });
        }
    });
    
    // Login route
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
    
        try {
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in' });
        }
    });

    // Basic Route
    app.get('/', (req, res) => {
        res.send('MindfulHelp Backend is Running');
    });

    // Error Handling Middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
    });


    // Start Server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });