const { login, logout }= require('../services/authService');

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await login(email, password);
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

const authService = require('../services/authService');

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from Bearer scheme
        
        // Call the logout service
        const response = await logout(token);

        return res.status(200).json(response);
    } catch (error) {
        console.error('Logout Controller Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


