const teacherSubStudentService = require('../services/teacherSubStudentService');

const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectCode } = req.query;
    if (!subjectCode) {
      return res.status(400).json({ error: 'subjectCode is required' });
    }
    const students = await teacherSubStudentService.fetchStudentsBySubject(subjectCode);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

module.exports = {
  getStudentsBySubject,
};
