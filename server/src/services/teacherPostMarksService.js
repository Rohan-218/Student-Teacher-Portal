const teacherPostMarksModel = require('../models/teacherPostMarksModel');
const sequelize = require('../config/dbConfig');

// Prepare marks data by fetching subject details
// Prepare marks data by fetching subject details
const prepareMarksData = async (marks, examId) => {
  try {
    const marksData = [];

    // Fetch subject details for each mark entry
    for (const mark of marks) {
      const { subject_code } = mark;

      // Fetch subject details using subject_code
      const subjectDetails = await teacherPostMarksModel.getSubjectDetails(subject_code);

      if (!subjectDetails) {
        throw new Error(`Invalid subject code provided: ${subject_code}`);
      }

      marksData.push({
        student_id: mark.student_id,
        subject_id: subjectDetails.subject_id,
        exam_id: examId,
        marks_obtained: mark.marks_obtained,
      });
    }

    return marksData;
  } catch (error) {
    console.error('Error preparing marks data:', error);
    throw error;
  }
};


// Save marks into the database
const saveMarks = async (marksData) => {
  try {
    if (!marksData || marksData.length === 0) {
      throw new Error('No marks data provided to save');
    }
    await teacherPostMarksModel.insertMarks(marksData);
    console.log('Marks saved successfully');

  } catch (error) {
    console.error('Error saving marks:', error.message);
    throw error; // Propagate error to the controller
  }
};

// Get marks for a specific subject
const getMarksForSubject = async (subjectCode) => {
  if (!subjectCode) {
    throw new Error('Subject code is required to fetch marks');
  }

  const marksData = await teacherPostMarksModel.getMarksBySubject(subjectCode);
  return marksData;
};

const getStudentEmails = async (studentIds) => {
  try {
    if (!studentIds || studentIds.length === 0) {
      throw new Error('No student IDs provided');
    }

    // SQL query with the correct IN syntax
    const query = `
      SELECT s.student_id, u.email 
      FROM student s 
      JOIN users u ON s.user_id = u.user_id 
      WHERE s.student_id IN (:studentIds);
    `;

    // Execute the query
    const [results, metadata] = await sequelize.query(query, {
      replacements: { studentIds }, // This will replace :studentIds with the array
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('Raw query results:', results); // Log the raw results

    if (results.length === 0) {
      throw new Error('No emails found for the provided student IDs');
    }

    return results; // Return the fetched emails
  } catch (error) {
    console.error('Error fetching student emails:', error);
    throw error;
  }
};



module.exports = {
  prepareMarksData,
  saveMarks,
  getMarksForSubject,
  getStudentEmails,
};
