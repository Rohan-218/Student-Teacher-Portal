const express = require('express');
const router = express.Router();
const { updateUserPassword } = require('../controllers/userController');

router.patch('/reset-password', updateUserPassword);

module.exports = router;