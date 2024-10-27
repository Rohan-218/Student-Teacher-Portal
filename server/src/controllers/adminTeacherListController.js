const { getAllTeachers, getTeachersByBranchAndSemester, searchTeachersByName } = require('../services/adminTeacherListService');

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await getAllTeachers();
        res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getTeachersByBranchAndSemester = async (req, res) => {
    const { branchName, semester } = req.query;
  
    try {
        const teachers = await getTeachersByBranchAndSemester(branchName, semester);
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };
  
  exports.searchTeachersByName = async (req, res) => {
    let { name } = req.query;
    const trimmedName = name.trim();
  
    try {
        const teachers = await searchTeachersByName(trimmedName);
        res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
