const { getAttendanceAndMarksBySubject } = require('../services/attenMarksService');

const fetchAttendanceAndMarks = async (req, res) => {
  const { subjectId } = req.query;

  if (!subjectId) {
    return res.status(400).json({ message: 'Subject ID is required' });
  }

  try {
    const data = await getAttendanceAndMarksBySubject(subjectId);

    if (!data || data.result.length === 0) {
      return res.status(404).json({ message: 'No data found for the given subject' });
    }
    return res.status(200).json({
      examNames: data.examNames,
      result: data.result,
    });
  } catch (error) {
    console.error('Error in fetching attendance and marks:', error);
    return res.status(500).json({ message: 'An error occurred while fetching data' });
  }
};

module.exports = { fetchAttendanceAndMarks };
