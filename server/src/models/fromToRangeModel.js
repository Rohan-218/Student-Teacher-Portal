const sequelize = require('../config/dbConfig');

// Model to interact with attendance-related data in the database
const AttendanceModel = {
  // Fetch attendance records between the given dates
  fetchAttendanceBetweenDates: async (fromDate, toDate) => {
    try {
      const attendanceData = await sequelize.query(
        `SELECT date, subject_id, lecture, total_lectures 
FROM attendance_record
WHERE date BETWEEN :fromDate AND :toDate
ORDER BY date;`,
        {
          replacements: { fromDate, toDate },
          type: sequelize.QueryTypes.SELECT
        }
      );
      
      return attendanceData;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};

module.exports = AttendanceModel;
