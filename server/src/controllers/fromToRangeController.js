// const AttendanceModel = require('../models/fromToRangeModel');

// // Controller to fetch attendance records between dates
// const getAttendanceByDateRange = async (req, res) => {
//   const { fromDate, toDate } = req.query; // Make sure these match the URL

//   try {
//     // Call the model's function to fetch attendance data
//     const attendanceData = await AttendanceModel.fetchAttendanceBetweenDates(fromDate, toDate);

//     if (!attendanceData.length) {
//       return res.status(404).json({ message: 'No attendance data found for the given date range' });
//     }

//     return res.status(200).json(attendanceData);
//   } catch (error) {
//     console.error('Error fetching attendance:', error);
//     return res.status(500).json({ message: 'An error occurred while fetching attendance data' });
//   }
// };

// module.exports = { getAttendanceByDateRange };
const AttendanceModel = require('../models/fromToRangeModel');

// Controller to fetch attendance records between dates
const getAttendanceByDateRange = async (req, res) => {
  const { fromDate, toDate } = req.query;

  try {
    // Call the model's function to fetch attendance data
    const attendanceData = await AttendanceModel.fetchAttendanceBetweenDates(fromDate, toDate);

    if (!attendanceData.length) {
      return res.status(404).json({ message: 'No attendance data found for the given date range' });
    }

    return res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ message: 'An error occurred while fetching attendance data' });
  }
};

module.exports = { getAttendanceByDateRange };
