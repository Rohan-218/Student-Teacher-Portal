const express = require('express');
const router = express.Router();
const studentManagementController = require('../controllers/studentManagementController');

router.post('/create', studentManagementController.createStudent);

module.exports = router;
