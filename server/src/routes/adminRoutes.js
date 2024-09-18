const express = require('express');
const {getAdmins} = require('../controllers/adminController');
const router = express.Router();

// Define the route to get all admins
router.get('/admins', getAdmins);

module.exports = router;
