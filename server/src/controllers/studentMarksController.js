const { getStudentMarks, getStudentPerformance } = require('../services/studentMarksService');

// Controller method to get student marks by student ID, subject ID, and exam ID
exports.getStudentMarks = async (req, res) => {
  const { studentId, subjectId, examId } = req.params;

  // Validate input parameters
  if (!studentId || !subjectId || !examId) {
    return res.status(400).json({ message: 'Missing required parameters: studentId, subjectId, or examId' });
  }

  try {
    const marks = await getStudentMarks(studentId, subjectId, examId);

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

// Controller method to get student performance by student ID
exports.getStudentPerformance = async (req, res) => {
  const { studentId } = req.params;

  // Validate input parameters
  if (!studentId) {
    return res.status(400).json({ message: 'Missing required parameter: studentId' });
  }

  try {
    const performance = await getStudentPerformance(studentId);

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
