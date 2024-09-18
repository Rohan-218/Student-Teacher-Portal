const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, isTokenBlacklisted, blacklistToken } = require('../models/userModel');
const TokenBlacklist = require('../models/tokenBlacklistModel');  // Assuming you have a Sequelize user model
require('dotenv').config({ path: 'src/.env' });

// Login Service
exports.login = async (email, password) => {
  try {
      // Fetch user by email with decrypted password
      const user = await getUserByEmail(email);
      if (!user) {
          return null; // User not found
      }

      // Verify decrypted password matches provided password
      if (user.decrypted_password !== password) {
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

exports.logout = async (token) => {
    try {
      // Check if the token is already blacklisted
      const tokenExists = await isTokenBlacklisted(token);
      if (tokenExists) {
        return { success: false, message: 'Token already blacklisted' }; // Token is already blacklisted
      }
      
      // Blacklist the token
      const now = new Date(); // Current date and time
      const expiresAt = new Date(now.getTime() + 30 * 60000); // Set expiration to 30 minutes from now
      await blacklistToken(token, expiresAt); // Insert token into blacklist
  
      return { success: true, message: 'Logged out successfully' }; // Successful logout
    } catch (error) {
      throw new Error(`Logout Service Error: ${error.message}`); // Handle errors
    }
  };