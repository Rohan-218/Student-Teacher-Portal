const teacherRecordService = require('../services/teacherRecordService');

// Fetch all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherRecordService.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch teachers by branch and semester
exports.getTeachersByBranchAndSemester = async (req, res) => {
  const { branchName, semester } = req.query;

  try {
    const teachers = await teacherRecordService.getTeachersByBranchAndSemester(branchName, semester);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search teachers by name
exports.searchTeachersByName = async (req, res) => {
  let { name } = req.query;

  // Trim any extra spaces from the name input
  const trimmedName = name.trim();

  try {
    const teachers = await teacherRecordService.searchTeachersByName(trimmedName);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
