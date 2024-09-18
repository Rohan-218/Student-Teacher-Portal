const adminModel = require('../models/adminModel');

const getAdmins = async (requesting_user_id) => {
  // Fetch admin data from the model
  const admins = await adminModel.getAdmins(requesting_user_id);
  if (!admins || admins.length === 0) {
    throw new Error('No admins found');
  }
  
  return admins;
};

module.exports = { getAdmins };
