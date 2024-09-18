const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { getStudentMarks, getStudentPerformance } = require('../controllers/studentMarksController');
=======
const { getStudentMarks, getStudentPerformance } = require('../controllers/marksController');
>>>>>>> 9f09e082cf38a3a1d6443561eabc727d9741a86a

// Route to get student marks by student ID and subject ID
router.get('/marks/:studentId/:subjectId/:examId', getStudentMarks);
router.get('/marksPerformance/:studentId', getStudentPerformance);

module.exports = router;
