const express = require('express');
const router = express.Router();
const { getStudentMarks, getStudentPerformance } = require('../controllers/studentMarksController');
const {getStudentProfile } = require('../controllers/studentController');
const { getStudentAttendance, getStudentAttendanceTrend, getStudentDailyAttendance} = require('../controllers/studentAttendanceController');
const { student } = require('../middleware/isAllowed');

router.use(student);
router.get('/profile', getStudentProfile);
router.get('/marks/:examId', getStudentMarks);
router.get('/marksPerformance', getStudentPerformance);
router.get('/attendance', getStudentAttendance);
router.get('/attendance-trend', getStudentAttendanceTrend);
router.get('/attendance-daily-record', getStudentDailyAttendance);

module.exports = router;
