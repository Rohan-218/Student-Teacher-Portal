
const attendanceService = require('../services/studentAttendanceService');
const pool = require('../config/dbConfig'); 

//attendance data
const getStudentAttendance = async (req, res) => {
    try {
        const { user_id, user_type } = req.user; // Extract user_id and user_type from the decoded JWT

        if (user_type !== 1) {
            return res.status(403).json({ message: 'Unauthorized access for non-students' });
        }

        // Fetch the student_id from the student table using user_id
        const studentQuery = `SELECT student_id FROM student WHERE user_id = $1`;
        const studentResult = await pool.query(studentQuery, [user_id]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.rows[0].student_id; // Get the student_id

        // Call the service to fetch the attendance data
        const attendanceData = await attendanceService.fetchAttendanceForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

//attendance trend
const getStudentAttendanceTrend = async (req, res) => {
    try {
        const { user_id, user_type } = req.user; // Extract user_id and user_type from the decoded JWT

        if (user_type !== 1) {
            return res.status(403).json({ message: 'Unauthorized access for non-students' });
        }

        // Fetch the student_id from the student table using user_id
        const studentQuery = `SELECT student_id FROM student WHERE user_id = $1`;
        const studentResult = await pool.query(studentQuery, [user_id]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.rows[0].student_id; // Get the student_id

        // Call the service to fetch the attendance data
        const attendanceData = await attendanceService.fetchAttendanceTrendForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

// New function to get daily attendance
const getStudentDailyAttendance = async (req, res) => {
    try {
        const { user_id, user_type } = req.user;

        if (user_type !== 1) {
            return res.status(403).json({ message: 'Unauthorized access for non-students' });
        }

        const studentQuery = `SELECT student_id FROM student WHERE user_id = $1`;
        const studentResult = await pool.query(studentQuery, [user_id]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.rows[0].student_id;

        // Fetch the daily attendance for each subject
        const dailyAttendance = await attendanceService.fetchDailyAttendanceForStudent(student_id);
        res.json(dailyAttendance);

    } catch (error) {
        console.error('Error fetching daily attendance:', error);
        res.status(500).json({ message: 'Error fetching daily attendance data' });
    }
};


module.exports = { getStudentAttendance , getStudentAttendanceTrend, getStudentDailyAttendance};
