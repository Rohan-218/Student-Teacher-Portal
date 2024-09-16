const loginService = require('../services/loginService');

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await loginService.login(email, password);
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


