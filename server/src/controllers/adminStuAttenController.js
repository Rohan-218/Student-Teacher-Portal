const studentAttendanceService = require('../services/studentAttendanceService');
const sequelize = require('../config/dbConfig.js'); 

//attendance data
const getStudentAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
        }
        // Fetch the student_id from the student table using user_id with replacements
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :userId`,
            { 
                replacements: { userId }, // Use an object for named replacements
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!studentResult) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id;

        // Fetch the attendance data using the service
        const attendanceData = await studentAttendanceService.fetchAttendanceForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

//attendance trend
const getStudentAttendanceTrend = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user_id and user_type from the decoded JWT

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
        }
        // Fetch the student_id from the student table using user_id
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :user_id`,
            { 
                replacements: { user_id }, // Use an object for named replacements
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (studentResult.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id; // Get the student_id

        // Call the service to fetch the attendance data
        const attendanceData = await studentAttendanceService.fetchAttendanceTrendForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

// New function to get daily attendance
const getStudentDailyAttendance = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
        }
        
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :user_id`,
            { 
                replacements: { user_id }, // Use an object for named replacements
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (studentResult.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id;

        // Fetch the daily attendance for each subject
        const dailyAttendance = await studentAttendanceService.fetchDailyAttendanceForStudent(student_id);
        res.json(dailyAttendance);

    } catch (error) {
        console.error('Error fetching daily attendance:', error);
        res.status(500).json({ message: 'Error fetching daily attendance data' });
    }
};


module.exports = {
    getStudentAttendance,
    getStudentAttendanceTrend,
    getStudentDailyAttendance
};