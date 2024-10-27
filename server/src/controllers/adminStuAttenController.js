const studentAttendanceService = require('../services/studentAttendanceService');
const sequelize = require('../config/dbConfig.js'); 

const getStudentAttendance = async (req, res) => {
    try {
        const { userId } = req.params;
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :userId`,
            { 
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!studentResult) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id;

        const attendanceData = await studentAttendanceService.fetchAttendanceForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

const getStudentAttendanceTrend = async (req, res) => {
    try {
        const { user_id } = req.params;
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :user_id`,
            { 
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (studentResult.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id;

        const attendanceData = await studentAttendanceService.fetchAttendanceTrendForStudent(student_id);
        res.json(attendanceData);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Error fetching attendance data' });
    }
};

const getStudentDailyAttendance = async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const [studentResult] = await sequelize.query(
            `SELECT student_id FROM student WHERE user_id = :user_id`,
            { 
                replacements: { user_id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (studentResult.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student_id = studentResult.student_id;

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