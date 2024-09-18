const express = require('express');
const router = express.Router();
const { getStudentAttendance , getStudentAttendanceTrend, getStudentDailyAttendance} = require('../controllers/studentAttendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Define the route for fetching attendance
router.get('/attendance',authMiddleware, getStudentAttendance);
// Define the route for fetching attendance trend
router.get('/attendance-trend',authMiddleware, getStudentAttendanceTrend);
// Route for fetching daily attendance records
router.get('/attendance-daily-record', authMiddleware, getStudentDailyAttendance);

module.exports = router;
