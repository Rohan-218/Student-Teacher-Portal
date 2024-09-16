const express = require('express');
const router = express.Router();
const studentProfileController = require('../controllers/studentProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// GET request for student profile (JWT protected)
//router.get('/profile', authMiddleware, studentProfileController.getProfile);

router.get('/profile', authMiddleware, (req, res) => {
    console.log('Student Profile Route Hit'); // Log this to check if the route is being called
    studentProfileController.getProfile(req, res);
});


module.exports = router;
