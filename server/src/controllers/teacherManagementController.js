const { getTeacherCount, changeTeacherStatus } = require('../services/teacherManagementService')
const { getTeacherProfile } = require('../services/teacherService');
const userModel = require('../models/userModel');
const { insertActivity } = require('../utils/activityService');

exports.getTeacherCount= async (req, res) => {
    try {

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can see teacher data.' });
        }
        const count = await getTeacherCount();
        res.status(200).json({ teacherCount: count });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching Teacher count' });
    }
};

exports.getTeacherProfile = async (req, res) => {
    const { userId } = req.params;
    console.log('User inside teacherProfileController:', req.user);

    const userType = req.user.user_type;
    if (userType !== 0 && userType !== 3) {
        return sendErrorResponse(res, 403, 'Access denied. Only admins see teacher data.');
    }

    try {
        const teacherData = await getTeacherProfile(userId);

        if (!teacherData) {
            return sendErrorResponse(res, 404, 'teacher not found');
        }

        res.json(teacherData);
    } catch (err) {
        console.error('Error fetching teacher profile:', err);
        sendErrorResponse(res, 500, 'Server error');
    }
};

exports.updateTeacherIsActive = async (req, res) => {
    const { user_id, is_active } = req.body;
  
    try {
      // Check if the user is a super admin (user_type 0)
      const userType = req.user.user_type;
      const userId = req.user.user_id;
      if (userType !== 0 && userType !== 3) {
        return res.status(403).json({ message: 'Access denied. Only admins can update Teacher status.' });
      }
  
      // Call the service to update the status
      const result = await changeTeacherStatus(user_id, is_active);
  
      const status = is_active ? 'active' : 'inactive';
      const userData = await userModel.getUserData(user_id);
      const name = userData.map(user => user.name);
      insertActivity( userId, 'Teacher status updated', `Status of Teacher - ${name} have been set to ${status}.`);
      // Return success response
      return res.status(200).json({
        message: 'Teacher status updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in controller:', error);
      return res.status(500).json({
        message: 'Failed to update Teacher status'
      });
    }
  };