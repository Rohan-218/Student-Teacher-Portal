const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');

// POST request for login (common for both students and teachers)
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;