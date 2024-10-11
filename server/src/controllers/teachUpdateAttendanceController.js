// attendanceController.js

const attendanceService = require('../services/teachUpdateAttendanceService');

const updateAttendance = async (req, res) => {
  try {
    const { subjectCode, date, lecture, attendanceRecords } = req.body;
    
    // Validate the request body
    if (!subjectCode || !date || !lecture || !attendanceRecords) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await attendanceService.updateMultipleAttendance(subjectCode, date, lecture, attendanceRecords);
    return res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateAttendance,
};
