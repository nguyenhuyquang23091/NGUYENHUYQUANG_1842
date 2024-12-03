const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/jwt');

// Register function
const register = async (req, res) => {
    const { email, username, password } = req.body;

    // Basic validation for empty fields
    if (!email || !username || !password) {
        return res.status(400).json({ message: 'Please provide email, username, and password.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with the plain password (password will be hashed in pre-save hook)
        const newUser = new User({ email, username, passwordHash: password });

        // Save the user to the database
        await newUser.save();

        // Generate a JSON Web Token (JWT)
        const token = jwt.sign(
            { userId: newUser._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Send success response with the token
        res.status(201).json({
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        // Handle internal server errors
        console.error('Error during user registration:', error);
        res.status(500).json({
            message: 'Error creating account',
            error: 'Internal server error',
        });
    }
};

// Login function
const login = async (req, res) => {
    const { email, username, password } = req.body;

    // Basic validation for email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find the user by email or username
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        // Send the response with the token
        res.json({
            message: 'User logged in successfully',
            token,
        });
    } catch (error) {
        // Handle internal server errors
        console.error('Error during user login:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: 'Internal server error',
        });
    }
};

module.exports = {
    register,
    login
};
