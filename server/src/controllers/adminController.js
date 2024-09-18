// adminController.js
const adminService = require('../services/adminService');

// Controller to handle fetching all admins
const getAdmins = async (req, res) => {
  const requesting_user_id = req.user.user_id;  // Extract user_id from req.user

  try {
    // Fetch admin data from the service
    const admins = await adminService.getAdmins(requesting_user_id);
    
    // Return the data as a JSON response
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admin data:', error.message);
    res.status(500).json({ error: error.message });  // Changed to 500 for internal server errors
  }
};

module.exports = { getAdmins };
