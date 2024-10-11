const AttendanceModel = require('../models/fromToRangeModel');

// Controller to fetch attendance records between dates
const getAttendanceByDateRange = async (req, res) => {
  const { fromDate, toDate, subjectID } = req.query;

  // Input validation
  if (!fromDate || !toDate || !subjectID) {
    return res.status(400).json({ message: 'Missing required query parameters: fromDate, toDate, and subjectID' });
  }

  try {
    // Call the model's function to fetch attendance data
    const attendanceData = await AttendanceModel.fetchAttendanceBetweenDates(fromDate, toDate, subjectID);

    // Check if data is found
    if (!attendanceData.length) {
      return res.status(404).json({ message: 'No attendance data found for the given date range' });
    }

    // Return attendance data
    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance:', error);

    // Return internal server error with more specific error details
    return res.status(500).json({ message: 'An error occurred while fetching attendance data', error: error.message });
  }
};

module.exports = { getAttendanceByDateRange };
