const { getStudentMarks, getStudentPerformance } = require('../services/studentMarksService');

exports.getStudentMarks = async (req, res) => {
  const { userId, examId } = req.params;
  if (!userId || !examId) {
    return res.status(400).json({ message: 'Missing required parameters: userId, or examId' });
  }
  try {
    const marks = await getStudentMarks(userId, examId);

    if (marks) {
      return res.status(200).json(marks);
    } else {
      return res.status(404).json({ message: 'Marks not found for the provided parameters' });
    }
  } catch (error) {
    console.error('Error fetching student marks:', error);
    return res.status(500).json({ message: 'Failed to retrieve student marks due to server error' });
  }
};

exports.getStudentPerformance = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'No reference to this student found!!!' });
  }

  try {  
    const performance = await getStudentPerformance(userId);

    if (performance) {
      return res.status(200).json(performance);
    } else {
      return res.status(404).json({ message: 'Performance data not found for the student' });
    }
  } catch (error) {
    console.error('Error fetching student performance:', error);
    return res.status(500).json({ message: 'Failed to retrieve student performance due to server error' });
  }
};
