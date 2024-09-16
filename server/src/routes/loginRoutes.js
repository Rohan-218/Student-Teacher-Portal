const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// POST request for login (common for both students and teachers)
router.post('/', loginController.login);

module.exports = router;
