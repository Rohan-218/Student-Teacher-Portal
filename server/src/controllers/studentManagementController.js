const studentManagementService = require('../services/studentManagementService');

exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const result = await studentManagementService.createStudent(studentData);
    res.status(201).json({ message: 'Student created successfully', student: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
