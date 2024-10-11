// controllers/attenMarksController.js
const { getAttendanceAndMarksBySubject } = require('../services/attenMarksService');

const fetchAttendanceAndMarks = async (req, res) => {
  const { subjectId } = req.query;

  try {
    const data = await getAttendanceAndMarksBySubject(subjectId);
    if (!data.length) {
      return res.status(404).json({ message: 'No data found for the given subject' });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in fetching attendance and marks:', error);
    return res.status(500).json({ message: 'An error occurred while fetching data' });
  }
};

module.exports = { fetchAttendanceAndMarks };
