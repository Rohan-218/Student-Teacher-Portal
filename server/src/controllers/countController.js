const countService = require('../services/countService');

const countController = {
  getStudentCount: async (req, res) => {
    try {
      const count = await countService.getStudentCount();
      res.status(200).json({ studentCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching student count' });
    }
  },

  getTeacherCount: async (req, res) => {
    try {
      const count = await countService.getTeacherCount();
      res.status(200).json({ teacherCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching teacher count' });
    }
  },

  getSubjectCount: async (req, res) => {
    try {
      const count = await countService.getSubjectCount();
      res.status(200).json({ subjectCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching subject count' });
    }
  },

  getBranchCount: async (req, res) => {
    try {
      const count = await countService.getBranchCount();
      res.status(200).json({ branchCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching branch count' });
    }
  },

  getStudentBranchCount: async (req, res) => {
    try {
      const data = await countService.getStudentBranchCount();
      res.status(200).json({ branchStudentCount: data });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching student branch count' });
    }
  }
};

module.exports = countController;
