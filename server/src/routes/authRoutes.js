const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST request for login (common for both students and teachers)
router.post('/login', login);

module.exports = router;