const adminService = require('../services/adminService');
const userModel = require('../models/userModel');
const { insertActivity } = require('../utils/activityService');

// Controller to handle fetching all admins
const getAdmins = async (req, res) => {
  const requesting_user_id = req.user.user_id;  // Extract user_id from req.user

  try {

    const userType = req.user.user_type;
    if (userType !== 0 && userType !== 3) {
      return res.status(403).json({ message: 'Access denied. Only admins can get admin data.' });
    }

    // Fetch admin data from the service
    const admins = await adminService.getAdmins(requesting_user_id);
    
    // Return the data as a JSON response
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admin data:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create new admin account (Only user_type 0 can add new admins)
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user is a super admin (user_type 0)
    const { user_type, user_id } = req.user;
    if (user_type !== 0) {
      return res.status(403).json({ message: 'Access denied. Only super admins can create admins.' });
    }

    // Call the service to create the user and admin
    const result = await adminService.registerAdmin(name, email, password);
    insertActivity( user_id, 'New Admin Created', `New Admin - ( ${name} ) have been created.`);
    // Return success response
    return res.status(201).json({
      message: 'Admin created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      message: 'Failed to create admin'
    });
  }
};

// Change admin active status (Only user_type 0 can update admin status)
const updateAdminIsActive = async (req, res) => {
  const { user_id, is_active } = req.body;

  try {
    // Check if the user is a super admin (user_type 0)
    const userType = req.user.user_type;
    const userId = req.user.user_id;

    if (userType !== 0) {
      return res.status(403).json({ message: 'Access denied. Only super admins can update admin status.' });
    }

    // Call the service to update the status
    const result = await adminService.changeAdminStatus(user_id, is_active);

    const status = is_active ? 'active' : 'inactive';
    const userData = await userModel.getUserData(user_id);
    const name = userData.map(user => user.name);
    insertActivity( userId, 'Admin status updated', `Status of Admin - ${name} have been set to ${status}.`);
    // Return success response
    return res.status(200).json({
      message: 'Admin status updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({
      message: 'Failed to update admin status',
    });
  }
};

module.exports = { getAdmins, createAdmin, updateAdminIsActive };