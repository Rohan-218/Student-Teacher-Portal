const studentAttendanceModel = require('../models/studentAttendanceModel');

//attendanec data
const fetchAttendanceForStudent = async (student_id) => {
    return await studentAttendanceModel.getAttendanceData(student_id);
};

//attendance trend
const fetchAttendanceTrendForStudent = async (student_id) => {
    return await studentAttendanceModel.getAttendanceTrend(student_id);
};

// New function to fetch daily attendance records
const fetchDailyAttendanceForStudent = async (student_id) => {
    return await studentAttendanceModel.getDailyAttendanceData(student_id);
};

module.exports = { fetchAttendanceForStudent ,fetchAttendanceTrendForStudent, fetchDailyAttendanceForStudent};