const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');  // Assuming you have a Sequelize user model
require('dotenv').config({ path: 'src/.env' });

// Login Service
exports.login = async (email, password) => {
    try {
        // Fetch user by email using Sequelize model
        const user = await getUserByEmail(email);
        if (!user) {
            return null; // User not found
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null; // Invalid password
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, user_type: user.user_type }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return token;
    } catch (error) {
        console.error('Login Service Error:', error);
        throw new Error('Login Service Error');
    }
};
