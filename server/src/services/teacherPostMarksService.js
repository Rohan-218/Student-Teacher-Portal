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

    // Insert the marks into the teacherPostMarksModel
    await teacherPostMarksModel.insertMarks(marksData);

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
    
    const allResults = []; // Array to hold results for all student IDs

    for (const Id of studentIds) {
      console.log(Id); // Log the current student ID

      // SQL query with the correct syntax
      const query = `
        SELECT u.email 
        FROM student s 
        JOIN users u ON s.user_id = u.user_id 
        WHERE s.student_id = :Id;
      `;

      // Execute the query
      const results = await sequelize.query(query, {
        replacements: { Id }, // This will replace :Id with the current student ID
        type: sequelize.QueryTypes.SELECT,
      });

      console.log('Raw query results:', results); // Log the raw results

      if (results.length === 0) {
        throw new Error(`No emails found for student ID: ${Id}`);
      }

      allResults.push(...results); // Accumulate results in the array
    }

    return allResults; // Return all results after the loop
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
