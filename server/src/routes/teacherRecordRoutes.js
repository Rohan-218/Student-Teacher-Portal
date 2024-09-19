const express = require('express');
const router = express.Router();
const teacherRecordController = require('../controllers/teacherRecordController');

// API to get all teachers
router.get('/teachers', teacherRecordController.getAllTeachers);

// API to get teachers by branch and semester
router.get('/teachers/branch-semester', teacherRecordController.getTeachersByBranchAndSemester);

// API to search teachers by name
router.get('/teacher/search', teacherRecordController.searchTeachersByName);

module.exports = router;
