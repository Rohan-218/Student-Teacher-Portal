require('dotenv').config({ path: 'src/.env' });

module.exports = {
    secretKey: process.env.JWT_SECRET, // Make sure this is stored securely in .env
};