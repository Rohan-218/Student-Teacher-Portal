const attendanceService = require('../services/attendanceBelowService');

const getStudentsBelowAttendanceThreshold = async (req, res) => {
  const { subjectId, threshold } = req.query; // Accept subjectId and threshold from query parameters

  try {
    const students = await attendanceService.fetchStudentsBelowThreshold(subjectId, threshold);
    res.status(200).json({
      status: 'success',
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  getStudentsBelowAttendanceThreshold,
};