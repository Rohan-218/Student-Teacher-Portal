const attendanceModel = require('../models/attendanceBelowModel');

const fetchStudentsBelowThreshold = async (subjectId, threshold) => {
  try {
    const students = await attendanceModel.getStudentsBelowAttendanceThreshold(subjectId, threshold);
    return students;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchStudentsBelowThreshold,
};