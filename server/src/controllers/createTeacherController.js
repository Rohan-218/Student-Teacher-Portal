const createTeacherService = require('../services/createTeacherService');
const { insertActivity } = require('../utils/activityService');

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, designation, contactNo, subjects } = req.body;
    const  { user_id, user_type } = req.user;

    if (user_type !== 0 && user_type !== 3) {
      return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
    }
    // Validate request data
    if (!name || !email || !password || !designation || !contactNo || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'All fields are required and subjects must be a non-empty array' });
    }

    // Call service function to create the teacher
    const result = await createTeacherService.createTeacher(name, email, password, designation, contactNo, subjects);
    insertActivity( user_id, 'New teacher Created', `New teacher - ( ${name} ) have been added.`);
    return res.status(201).json(result);  // Return success response
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher', details: error.message });
  }
};
