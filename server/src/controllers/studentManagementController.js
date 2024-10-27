const { getStudentCount, changeStudentStatus } = require('../services/studentManagementService');
const { getStudentProfile } = require('../services/studentService');
const userModel = require('../models/userModel');
const { insertActivity } = require('../utils/activityService');

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

exports.getStudentCount = async (req, res) => {
    try {
        const count = await getStudentCount();
        res.status(200).json({ studentCount: count });
    } catch (error) {
        console.error('Error fetching student count:', error);
        sendErrorResponse(res, 500, 'Error fetching student count');
    }
};

exports.getStudentProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const studentData = await getStudentProfile(userId);

        if (!studentData) {
            return sendErrorResponse(res, 404, 'Student not found');
        }

        res.json(studentData);
    } catch (err) {
        console.error('Error fetching student profile:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

exports.updateStudentIsActive = async (req, res) => {
    const { user_id, is_active } = req.body;
  
    try {
      const userId = req.user.user_id;

      const result = await changeStudentStatus(user_id, is_active);
      
      const status = is_active ? 'active' : 'inactive';
      const userData = await userModel.getUserData(user_id);
      const name = userData.map(user => user.name);
      insertActivity( userId, 'Student status updated', `Status of Student - ${name} have been set to ${status}.`);
      return res.status(200).json({
        message: 'Student status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in controller:', error);
      return res.status(500).json({
        message: 'Failed to update student status'
      });
    }
  };