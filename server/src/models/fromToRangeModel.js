const sequelize = require('../config/dbConfig');

// Model to interact with attendance-related data in the database
const AttendanceModel = {
  // Fetch attendance records between the given dates
  fetchAttendanceBetweenDates: async (fromDate, toDate, subjectID) => {
    try {
      const attendanceData = await sequelize.query(
        `
        WITH date_series AS (
          SELECT generate_series(:fromDate::date, :toDate::date, '1 day') AS date
        )
        SELECT 
            s.student_name, 
            COALESCE(
                CASE 
                    WHEN a.attended_lecture = 1 THEN 'P' 
                    WHEN a.attended_lecture IS NULL THEN 'No Lecture' 
                    ELSE 'A' 
                END, 
                'N/A'
            ) AS attendance,
            ds.date,
            s.enrollment_no 
        FROM 
            date_series ds
        LEFT JOIN 
            attendance_record b ON ds.date = b.date AND b.subject_id = :subjectID
        LEFT JOIN 
            attendance a ON b.attendance_record_id = a.attendance_record_id 
        LEFT JOIN 
            student s ON s.student_id = a.student_id 
        ORDER BY 
            ds.date, s.student_name;
        `,
        {
          replacements: { fromDate, toDate, subjectID },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      console.log('Query result:', attendanceData);
      return attendanceData;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
};

module.exports = AttendanceModel;
