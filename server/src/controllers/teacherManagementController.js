const teacherManagementService = require('../services/teacherManagementService');

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, designation, contactNo, subjects } = req.body;

    // Validate request data (you can add more validation as needed)
    if (!name || !email || !password || !designation || !contactNo || !subjects) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Call service function to create the teacher
    const result = await teacherManagementService.createTeacher({ name, email, password, designation, contactNo, subjects });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
};
