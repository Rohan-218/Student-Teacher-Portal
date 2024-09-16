const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access Denied, No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Verified User:', verified); // Log the decoded token
        req.user = verified; // Attach the user info to the request
        console.log('Decoded JWT:', req.user); // Log to verify the decoded token
        next(); // Move to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
