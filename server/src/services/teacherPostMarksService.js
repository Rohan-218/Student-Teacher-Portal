const teacherPostMarksModel = require('../models/teacherPostMarksModel');

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
        subject_name: subjectDetails.subject_name,
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

module.exports = {
  prepareMarksData,
  saveMarks,
  getMarksForSubject
};
