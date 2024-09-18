const studentRecordService = require('../services/studentRecordService');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentRecordService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New method to get students by branch and semester
exports.getStudentsByBranchAndSemester = async (req, res) => {
    const { branch_name, semester } = req.query;
  
    try {
      const students = await studentRecordService.getStudentsByBranchAndSemester(branch_name, semester);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// New method to search students by name
exports.searchStudentsByName = async (req, res) => {
   
    let { name } = req.query;

  // Trim any extra spaces from the name input
  const trimmedName = name.trim();

  
    try {
      const students = await studentRecordService.searchStudentsByName(trimmedName);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
