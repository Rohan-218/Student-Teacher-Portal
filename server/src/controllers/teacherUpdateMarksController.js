const teacherUpdateMarksService = require('../services/teacherUpdateMarksService');

// Update marks
const updateMarks = async (req, res) => {
  try {
    const { exam_id, marks } = req.body;
    const usertype = req.user.user_type;

    if (usertype !== 2) {
      return res.status(403).json({ message: 'Unauthorized: Not a teacher!' });
    }

    // Validate marks
    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'Marks data is required' });
    }

    // Validate each mark entry
    for (const mark of marks) {
      const { student_id, marks_obtained, subject_code } = mark;

      if (!student_id || !marks_obtained || !subject_code) {
        return res.status(400).json({
          message: 'Each mark entry must contain student_id, marks_obtained, and subject_code.'
        });
      }
    }

    // Validate exam ID
    if (!exam_id) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    // Prepare marks data
    const marksData = await teacherUpdateMarksService.prepareMarksData(marks, exam_id);

    // Update marks in the database
    await teacherUpdateMarksService.updateMarks(marksData);

    res.status(200).json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Error updating marks:', error.message);
    res.status(500).json({ message: 'Error updating marks', error: error.message });
  }
};

module.exports = {
  updateMarks,
};

