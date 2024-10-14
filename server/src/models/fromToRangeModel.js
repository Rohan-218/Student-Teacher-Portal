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
        COUNT(CASE WHEN a.attendance = true THEN 1 END) AS present_count,  -- Check if attendance is true
        COUNT(CASE WHEN a.attendance IS NOT NULL THEN 1 END) AS total_lectures -- Count all attendance records (not NULL)
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
            WHEN a.attendance = true THEN 'P'      
            WHEN a.attendance = false THEN 'A'     
            WHEN a.attendance IS NULL THEN 'No Lecture' 
        END, 
        'N/A'
    ) AS attendance,
    COALESCE(la.calculated_percentage, NULL) AS percentage  
FROM 
    date_series ds
CROSS JOIN 
    student s  
LEFT JOIN 
    attendance_record b ON ds.date = b.date AND b.subject_id = :subjectID
LEFT JOIN 
    attendance a ON b.attendance_record_id = a.attendance_record_id AND a.student_id = s.student_id  
LEFT JOIN 
    latest_attendance la ON s.student_id = la.student_id  
WHERE 
    s.student_id IN (
        SELECT DISTINCT a.student_id 
        FROM attendance a
        JOIN attendance_record b ON a.attendance_record_id = b.attendance_record_id
        WHERE b.subject_id = :subjectID
    )
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
