const express = require('express');
const router = express.Router();
const { getTeacherProfile, uploadAttendance, getUploadedAttendance } = require('../controllers/teacherController.js');
const teacherSubController = require('../controllers/teacherSubController');
const teacherSubStudentController = require('../controllers/teacherSubStudentController');
const teacherMarksController = require('../controllers/teacherMarksController.js');
const marksController = require('../controllers/marksBelowController');
const teacherUpdateMarksController = require('../controllers/teacherUpdateMarksController');
const teachUpdateAttendanceController = require('../controllers/teachUpdateAttendanceController');
const  {getAttendanceByDateRange}  = require('../controllers/fromToRangeController');
const { fetchAttendanceAndMarks } = require('../controllers/attenMarksController');

// Define the route to get attendance and marks based on subject
router.get('/atten/marks', fetchAttendanceAndMarks);



// Teacher profile route
router.get('/profile', getTeacherProfile);

// Route to get subjects for a specific teacher
router.get('/subjects', teacherSubController.getSubjectsByTeacher);

// Route to get students by subject
router.get('/subject-students', teacherSubStudentController.getStudentsBySubject);

// POST route to upload attendance
router.post('/attendance/upload', uploadAttendance);

// GET route to retrieve uploaded attendance
router.get('/attendance/get', getUploadedAttendance);

// PUT route to update attendance
router.put('/attendance/update', teachUpdateAttendanceController.updateAttendance);

// Define the route for fetching attendance by date range
router.get('/attendance/range', getAttendanceByDateRange);

// Route to upload marks
router.post('/marks/upload', teacherMarksController.uploadMarks);

// Route to get marks by subject
router.get('/marks', teacherMarksController.getMarks);

// Route to update marks
router.put('/marks/update', teacherUpdateMarksController.updateMarks);

// Route to fetch students below marks threshold
router.get('/students/below-threshold', marksController.getStudentsBelowThreshold);

module.exports = router;
