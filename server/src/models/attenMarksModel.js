const sequelize = require('../config/dbConfig');

const AttenMarksModel = {
  // Fetch attendance and marks data for students based on subject_id
  fetchAttendanceAndMarksBySubject: async (subjectId) => {
    try {
      const result = await sequelize.query(`
        WITH TotalLectures AS (
          SELECT 
              subject_id, 
              MAX(total_lectures) AS total_lectures
          FROM 
              attendance_record
          WHERE 
              subject_id = :subjectId
          GROUP BY 
              subject_id
        ),
        LastAttendance AS (
          SELECT 
              a.student_id,
              a.attended_lecture,
              ROW_NUMBER() OVER (PARTITION BY a.student_id ORDER BY a.updated_at DESC) AS rn
          FROM 
              attendance AS a
          WHERE 
              a.subject_id = :subjectId
        )
        SELECT 
            s.student_id,
            s.student_name,
            la.attended_lecture, 
            (la.attended_lecture * 100.0 / tl.total_lectures) AS attendance_percentage,
            MAX(CASE 
                WHEN m.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = 'MidTerm 1') 
                THEN m.marks_obtained 
                ELSE 0 
            END) AS midterm1_marks,
            MAX(CASE 
                WHEN m.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = 'MidTerm 2') 
                THEN m.marks_obtained 
                ELSE 0 
            END) AS midterm2_marks,
            MAX(CASE 
                WHEN m.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = 'Finals') 
                THEN m.marks_obtained 
                ELSE 0 
            END) AS finals_marks
        FROM 
            student AS s
            LEFT JOIN LastAttendance AS la 
                ON s.student_id = la.student_id 
                AND la.rn = 1
            LEFT JOIN TotalLectures AS tl
                ON la.student_id = s.student_id
            LEFT JOIN marks AS m 
                ON s.student_id = m.student_id 
                AND m.subject_id = :subjectId
        GROUP BY 
            s.student_id, 
            s.student_name, 
            la.attended_lecture, 
            tl.total_lectures;
      `, {
        replacements: { subjectId }, // Make sure this matches the parameter in your query
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
