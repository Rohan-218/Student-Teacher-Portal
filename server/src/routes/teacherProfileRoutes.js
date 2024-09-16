const express = require('express');
const router = express.Router();
const teacherProfileController = require('../controllers/teacherProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// GET request for teacher profile (JWT protected)
router.get('/profile', authMiddleware, teacherProfileController.getProfile);

module.exports = router;
