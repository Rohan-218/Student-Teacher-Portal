const express = require('express');
const router = express.Router();
const teacherManagementController = require('../controllers/teacherManagementController');

// POST /api/admin/teacher/create - Create a new teacher
//router.post('/create', teacherManagementController.createTeacher);


router.post('/create', (req, res, next) => {
    console.log("POST /create route hit");
    next();
  }, teacherManagementController.createTeacher);

module.exports = router;
