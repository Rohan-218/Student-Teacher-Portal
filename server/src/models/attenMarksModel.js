// models/attenMarksModel.js
const sequelize = require('../config/dbConfig');

const AttenMarksModel = {
  // Fetch attendance and marks data for students based on subject_id
  fetchAttendanceAndMarksBySubject: async (subjectId) => {
    try {
      const result = await sequelize.query(`
        SELECT 
          s.student_id,
          s.student_name,
          COUNT(DISTINCT ar.date) AS attended_lecture, 
          (COUNT(DISTINCT ar.date) * 100.0 / MAX(ar.total_lectures)) AS attendance_percentage, 
          MAX(CASE WHEN m1.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = 'Midterm 1') THEN m1.marks_obtained ELSE NULL END) AS midterm1_marks, 
          MAX(CASE WHEN m2.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = 'Midterm 2') THEN m2.marks_obtained ELSE NULL END) AS midterm2_marks  
        FROM student AS s
        LEFT JOIN attendance AS a ON s.student_id = a.student_id AND a.subject_id = :subjectId
        LEFT JOIN attendance_record AS ar ON a.attendance_record_id = ar.attendance_record_id AND ar.subject_id = :subjectId
        LEFT JOIN marks AS m1 ON s.student_id = m1.student_id AND m1.subject_id = :subjectId 
        LEFT JOIN marks AS m2 ON s.student_id = m2.student_id AND m2.subject_id = :subjectId
        WHERE ar.subject_id = :subjectId
        GROUP BY s.student_id, s.student_name;
      `, {
        replacements: { subjectId },
        type: sequelize.QueryTypes.SELECT,
      });

      return result;
    } catch (error) {
      console.error('Error fetching attendance and marks:', error);
      throw error;
    }
  }
};

module.exports = AttenMarksModel;
