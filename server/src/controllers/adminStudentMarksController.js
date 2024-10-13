const { getStudentMarks, getStudentPerformance } = require('../services/studentMarksService');

// Controller method to get student marks by student ID, subject ID, and exam ID
exports.getStudentMarks = async (req, res) => {
  const { userId, examId } = req.params;

  // Validate input parameters
  if (!userId || !examId) {
    return res.status(400).json({ message: 'Missing required parameters: userId, or examId' });
  }

  try {

    const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
        }

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

// Controller method to get student performance by student ID
exports.getStudentPerformance = async (req, res) => {
  const { userId } = req.params;

  // Validate input parameters
  if (!userId) {
    return res.status(400).json({ message: 'No reference to this student found!!!' });
  }

  try {

    const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
        }
        
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
