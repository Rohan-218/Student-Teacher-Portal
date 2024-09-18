const express = require('express');
const router = express.Router();
const studentRecordController = require('../controllers/studentRecordController');

// Define route to get student records
router.get('/students', studentRecordController.getAllStudents);

// New route for fetching students by branch and semester
router.get('/students/branch-semester', studentRecordController.getStudentsByBranchAndSemester);

// New route for searching students by name
router.get('/student/search', studentRecordController.searchStudentsByName);

module.exports = router;
