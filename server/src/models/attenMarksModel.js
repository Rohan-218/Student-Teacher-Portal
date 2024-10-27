const sequelize = require('../config/dbConfig');

const AttenMarksModel = {
  // Fetch attendance and marks data for students based on subject_id
  fetchAttendanceAndMarksBySubject: async (subjectId) => {
    try {
      // Fetch exam names dynamically
      const examNamesResult = await sequelize.query(`
        SELECT exam_name FROM exam_type
      `, {
        type: sequelize.QueryTypes.SELECT,
      });
      
      const examNames = examNamesResult.map(exam => exam.exam_name.replace(' ', ''));

      // Dynamically create columns for each exam
      const selectMarks = examNamesResult.map(exam => {
        return `MAX(CASE 
                  WHEN m.exam_id = (SELECT exam_id FROM exam_type WHERE exam_name = '${exam.exam_name}')
                  THEN m.marks_obtained 
                  ELSE NULL 
                END) AS "${exam.exam_name.replace(' ', '')}"`;
      }).join(', ');

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
            COUNT(CASE WHEN a.attendance = true THEN 1 END) AS attended_lecture
          FROM 
            attendance AS a
          WHERE 
            a.subject_id = :subjectId
          GROUP BY 
            a.student_id
        )
        SELECT 
          s.student_id,
          s.student_name,
          la.attended_lecture, 
          ROUND((la.attended_lecture * 100.0 / tl.total_lectures), 0) AS attendance_percentage, 
          ${selectMarks} 
        FROM 
          student AS s
        LEFT JOIN LastAttendance AS la 
          ON s.student_id = la.student_id 
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
        replacements: { subjectId },
        type: sequelize.QueryTypes.SELECT,
      });
    
      // Return both result data and dynamic exam names
      return { result, examNames };
      
    } catch (error) {
      console.error('Error fetching attendance and marks:', error);
      throw error;
    }
  }
};

module.exports = AttenMarksModel;
