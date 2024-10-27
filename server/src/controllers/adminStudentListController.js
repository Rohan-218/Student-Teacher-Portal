const { getAllStudents, getStudentsByBranchAndSemester, searchStudentsByName } = require('../services/adminStudentListService');

exports.getAllStudents = async (req, res) => {
    try {
      const students = await getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getStudentsByBranchAndSemester = async (req, res) => {
      const { branch_name, semester } = req.query;
      
      try {
        const students = await getStudentsByBranchAndSemester(branch_name, semester);
        res.status(200).json(students);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  };
  
  exports.searchStudentsByName = async (req, res) => {
     
      let { name } = req.query;
      if (!name) {
        return res.status(400).json({ message: "Name parameter is required" });
      }
      const trimmedName = name.trim();
  
      try {
        const students = await searchStudentsByName(trimmedName);
        res.status(200).json(students);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  };