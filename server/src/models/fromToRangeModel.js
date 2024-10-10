const sequelize = require('../config/dbConfig');

// Model to interact with attendance-related data in the database
const AttendanceModel = {
  // Fetch attendance records between the given dates
  fetchAttendanceBetweenDates: async (fromDate, toDate, subjectID) => {
    try {
      const attendanceData = await sequelize.query(
        `select student_name, attendance, date, enrollment_no from (select a.student_id, b.date, sum(b.lecture)\
         as attendance FROM attendance_record b inner join attendance a on b.attendance_record_id = a.attendance_record_id \
         WHERE date between :fromDate and :toDate and b.subject_id = :subjectID group by (a.student_id, b."date") \
         order by b."date") query1 join (select student_name, student_id, enrollment_no from \
         student) s on s.student_id = query1.student_id; `,
        {
          replacements: { fromDate, toDate, subjectID },
          type: sequelize.QueryTypes.SELECT
        }
      );
      console.log("Query result: ", attendanceData);
      return attendanceData;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};

module.exports = AttendanceModel;
