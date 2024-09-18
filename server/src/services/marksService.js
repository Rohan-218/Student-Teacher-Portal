const { getMarks} = require('../models/studentMarksModel'); // Import the Marks model directly
const { getMarksPerformance } = require('../models/studentMarksPerformanceModel'); // Import the Performance model directly

// Service method to get student marks by student ID and subject ID
exports.getStudentMarks = async (studentId, subjectId, examId) => {
  try {
    // Fetch marks from the database
    const marks = await getMarks(studentId, subjectId, examId);
    return marks;
  } catch (error) {
    console.error('Error in getStudentMarks service:', error);
    throw new Error('Unable to retrieve student marks');
  }
};

exports.getStudentPerformance = async (studentId) => {
  try {
    // Fetch marks from the database
    const marks = await getMarksPerformance(studentId);
    return marks;
  } catch (error) {
    console.error('Error in getStudentMarks service:', error);
    throw new Error('Unable to retrieve student marks');
  }
};
