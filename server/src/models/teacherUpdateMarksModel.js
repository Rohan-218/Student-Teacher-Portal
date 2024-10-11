const sequelize = require('../config/dbConfig');

// Get subject details (subject_id, branch_id, semester) from Subject and BranchSemSub tables
const getSubjectDetails = async (subjectCode) => {
  const query = `
    SELECT s.subject_id, b.branch_id, b.semester
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

// Update marks for students in the Marks table
const updateMarks = async (marksData) => {
  const transaction = await sequelize.transaction();
  try {
    const query = `
      UPDATE marks 
      SET marks_obtained = :marksObtained
      WHERE student_id = :studentId AND subject_id = :subjectId AND exam_id = :examId
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
        type: sequelize.QueryTypes.UPDATE,
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating marks:', error);
    throw error; // Propagate the error to the controller
  }
};

module.exports = {
  getSubjectDetails,
  updateMarks,
};
