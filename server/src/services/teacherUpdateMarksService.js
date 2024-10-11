const teacherUpdateMarksModel = require('../models/teacherUpdateMarksModel');

// Prepare marks data for updating
const prepareMarksData = async (marks, examId) => {
  try {
    const marksData = [];

    // Fetch subject details for each mark entry
    for (const mark of marks) {
      const { subject_code } = mark;

      // Fetch subject details using subject_code
      const subjectDetails = await teacherUpdateMarksModel.getSubjectDetails(subject_code);

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

// Update marks in the database
const updateMarks = async (marksData) => {
  try {
    if (!marksData || marksData.length === 0) {
      throw new Error('No marks data provided to update');
    }

    await teacherUpdateMarksModel.updateMarks(marksData);
    console.log('Marks updated successfully');
  } catch (error) {
    console.error('Error updating marks:', error.message);
    throw error; // Propagate error to the controller
  }
};

module.exports = {
  prepareMarksData,
  updateMarks,
};

