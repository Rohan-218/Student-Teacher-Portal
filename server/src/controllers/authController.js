const { login, logout }= require('../services/authService');
require('dotenv').config();
const CryptoJS = require('crypto-js');

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const decryptedPassword =  CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const token = await login(email, decryptedPassword);
        if (token) {
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);  // Log the error
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.logout = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        // Call the logout service
        const response = await logout(token);

        // Return the appropriate response
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);  // Use 400 for client errors
        }
    } catch (error) {
        console.error('Logout Controller Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


