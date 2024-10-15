const sequelize = require('../config/dbConfig');

// Get subject details (subject_id, branch_id, semester) from Subject and BranchSemSub tables
const getSubjectDetails = async (subjectCode) => {
  const query = `
    SELECT s.subject_id, b.branch_id, b.semester, s.subject_name
    FROM subject s
    JOIN branch_sem_sub b ON s.subject_id = b.subject_id
    WHERE s.subject_code = :subjectCode;
  `;
  
  try {
    const result = await sequelize.query(query, {
      replacements: { subjectCode },
      type: sequelize.QueryTypes.SELECT,
    });
    
    if (result.length === 0) {
      console.error(`No subject found with code ${subjectCode}`);
      return null;
    }
    return result[0];
  } catch (error) {
    console.error('Error querying subject details:', error);
    throw error;
  }
};

// Fetch marks for a given subject
const getMarksBySubject = async (subjectCode) => {
  const query = `
    SELECT m.student_id, st.enrollment_no, st.student_name, m.subject_id, m.exam_id, m.marks_obtained, m.percentage
    FROM marks m
    JOIN subject s ON m.subject_id = s.subject_id
    JOIN student st ON m.student_id = st.student_id
    WHERE s.subject_code = :subjectCode;
  `;
  
  try {
    const result = await sequelize.query(query, {
      replacements: { subjectCode },
      type: sequelize.QueryTypes.SELECT,
    });
    return result;
  } catch (error) {
    console.error('Error querying marks:', error);
    throw error;
  }
};

// Insert marks for students into the Marks table
const insertMarks = async (marksData) => {
  const transaction = await sequelize.transaction();
  try {
    const query = `
      INSERT INTO marks (student_id, subject_id, exam_id, marks_obtained)
      VALUES (:studentId, :subjectId, :examId, :marksObtained)
      RETURNING *;
    `;

    for (const mark of marksData) {
      await sequelize.query(query, {
        replacements: {
          studentId: mark.student_id,
          subjectId: mark.subject_id,
          examId: mark.exam_id,
          marksObtained: mark.marks_obtained,
        },
        type: sequelize.QueryTypes.INSERT,
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting marks:', error);
    throw error; // Propagate the error to the controller
  }
};

module.exports = {
  getSubjectDetails,
  getMarksBySubject,
  insertMarks,
};
