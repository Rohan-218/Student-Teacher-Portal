const AttendanceModel = require('../models/fromToRangeModel');

const getAttendanceByDateRange = async (req, res) => {
  const { fromDate, toDate, subjectID } = req.query;

  if (!fromDate || !toDate || !subjectID) {
    return res.status(400).json({ message: 'Missing required query parameters: fromDate, toDate, and subjectID' });
  }

  try {
    const attendanceData = await AttendanceModel.fetchAttendanceBetweenDates(fromDate, toDate, subjectID);
    if (!attendanceData.length) {
      return res.status(404).json({ message: 'No attendance data found for the given date range' });
    }
    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ message: 'An error occurred while fetching attendance data', error: error.message });
  }
};

module.exports = { getAttendanceByDateRange };
