const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');

const getStudentsBelowAttendanceThreshold = async (subjectId, threshold) => {
  try {
    // Query to calculate attendance percentage for each student
    const students = await sequelize.query(
      `
       SELECT 
        student_id,
        (COUNT(CASE WHEN attendance = 'true' THEN 1 END) * 100.0) / COUNT(*) AS percentage
      FROM 
        attendance
      WHERE 
        subject_id = :subjectId
      GROUP BY 
        student_id
      HAVING 
        (COUNT(CASE WHEN attendance = 'true' THEN 1 END) * 100.0) / COUNT(*) < :threshold
      `,
      {
        replacements: { subjectId, threshold },
        type: QueryTypes.SELECT,
      }
    );
    return students;
  } catch (error) {
    throw new Error('Error fetching students below threshold');
  }
};

module.exports = {
  getStudentsBelowAttendanceThreshold,
};