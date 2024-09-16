const express = require('express');
const router = express.Router();
const { getStudentMarks, getStudentPerformance } = require('../controllers/studentController');

// Route to get student marks by student ID and subject ID
router.get('/marks/:studentId/:subjectId/:examId', getStudentMarks);
router.get('/marksPerformance/:studentId', getStudentPerformance);

module.exports = router;
