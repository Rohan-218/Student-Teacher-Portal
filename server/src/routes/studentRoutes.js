const express = require('express');
const router = express.Router();
const { getStudentMarks, getStudentPerformance } = require('../controllers/studentMarksController');
const {getStudentProfile } = require('../controllers/studentController');
const { getStudentAttendance, getStudentAttendanceTrend, getStudentDailyAttendance} = require('../controllers/studentAttendanceController');
const { student } = require('../middleware/isAllowed');

router.get('/profile', student, getStudentProfile);
router.get('/marks/:examId', student, getStudentMarks);
router.get('/marksPerformance', student, getStudentPerformance);
router.get('/attendance', student, getStudentAttendance);
router.get('/attendance-trend', student, getStudentAttendanceTrend);
router.get('/attendance-daily-record', student, getStudentDailyAttendance);

module.exports = router;
