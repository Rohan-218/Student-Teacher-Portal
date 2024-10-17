const createStudentService = require('../services/createStudentService');
const { insertActivity } = require('../utils/activityService');

exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const  { user_id, user_type } = req.user;

    if (user_type !== 0 && user_type !== 3) {
      return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
    }
    const result = await createStudentService.createStudent(studentData);
    const { name } = studentData;

    insertActivity( user_id, 'New Student Added', `New Student - ( ${name} ) have been added.`);
    res.status(201).json({ message: 'Student created successfully', student: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};