const marksService = require('../services/marksBelowService');

const getStudentsBelowThreshold = async (req, res) => {
  const subjectId = parseInt(req.query.subjectId, 10);
  const threshold = parseFloat(req.query.threshold);
4
  try {
      const students = await marksService.fetchStudentsBelowThreshold(subjectId, threshold);
      res.status(200).json({
          success: true,
          data: students,
      });
  } catch (error) {
      console.error("Error in controller fetching students below threshold:", error);
      res.status(500).json({
          success: false,
          message: "Error fetching students below threshold",
      });
  }
};

module.exports = {
  getStudentsBelowThreshold,
};
