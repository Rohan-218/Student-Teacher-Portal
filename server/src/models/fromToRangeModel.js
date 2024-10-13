const sequelize = require('../config/dbConfig');

// Model to interact with attendance-related data in the database
const AttendanceModel = {
  // Fetch attendance records between the given dates
  fetchAttendanceBetweenDates: async (fromDate, toDate, subjectID) => {
    try {
      const attendanceData = await sequelize.query(
        `WITH date_series AS (
          SELECT generate_series(:fromDate::date, :toDate::date, '1 day') AS date
        ),
        attendance_summary AS (
          SELECT
            s.student_id,
            COUNT(CASE WHEN a.attended_lecture = 1 THEN 1 END) AS present_count,
            COUNT(*) AS total_lectures
          FROM
            attendance a
          JOIN
            attendance_record b ON a.attendance_record_id = b.attendance_record_id
          JOIN
            student s ON a.student_id = s.student_id
          WHERE
            b.subject_id = :subjectID
            AND b.date BETWEEN :fromDate AND :toDate
          GROUP BY
            s.student_id
        ),
        latest_attendance AS (
          SELECT
            student_id,
            COALESCE(
              ROUND(
                (present_count::decimal / NULLIF(total_lectures, 0)) * 100, 2
              ),
              0
            ) AS calculated_percentage
          FROM
            attendance_summary
        )
        SELECT 
          s.student_name, 
          s.enrollment_no,
          ds.date,
          COALESCE(
            CASE 
             WHEN a.attendance = true THEN 'P'      -- Present when attendance is true
            WHEN a.attendance = false THEN 'A'     -- Absent when attendance is false
            WHEN a.attendance IS NULL THEN 'No Lecture' -- No lecture if attendance is NULL
            END, 
            'N/A'
          ) AS attendance,
          COALESCE(la.calculated_percentage, NULL) AS percentage  -- Use calculated percentage
        FROM 
          date_series ds
        CROSS JOIN 
          student s  -- Use CROSS JOIN to get all students for each date
        LEFT JOIN 
          attendance_record b ON ds.date = b.date AND b.subject_id = :subjectID
        LEFT JOIN 
          attendance a ON b.attendance_record_id = a.attendance_record_id AND a.student_id = s.student_id  -- Join to get attendance for each student
        LEFT JOIN 
          latest_attendance la ON s.student_id = la.student_id  -- Join calculated percentage
        WHERE 
          s.student_id IN (
            SELECT DISTINCT a.student_id 
            FROM attendance a
            JOIN attendance_record b ON a.attendance_record_id = b.attendance_record_id
            WHERE b.subject_id = :subjectID
          )
        ORDER BY 
          ds.date, s.student_name;`,
//         `SELECT date, subject_id, lecture, total_lectures 
// FROM attendance_record
// WHERE date BETWEEN :fromDate AND :toDate
// ORDER BY date;`,
//         `select student_name, attendance, date, enrollment_no from (select a.student_id, b.date, sum(b.lecture)\
//          as attendance FROM attendance_record b inner join attendance a on b.attendance_record_id = a.attendance_record_id \
//          WHERE date between :fromDate and :toDate and b.subject_id = :subjectID group by (a.student_id, b."date") \
//          order by b."date") query1 join (select student_name, student_id, enrollment_no from \
//          student) s on s.student_id = query1.student_id;`,
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
