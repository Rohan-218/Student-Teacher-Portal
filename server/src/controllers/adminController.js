const adminService = require('../services/adminService');
const userModel = require('../models/userModel');
const { insertActivity, insertEmailActivity } = require('../utils/activityService');
const sendEmailNotification = require('../utils/emailservice');

const getAdmins = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const admins = await adminService.getAdmins(user_id);
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admin data:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user_id = req.user.user_id;

    const result = await adminService.registerAdmin(name, email, password);

    try {
      const text = `Dear ${name},\n\nYour Admin account has been successfully created.\nEmail: ${email} \nPassword: ${password} \n\nRegards,\nXYZ University`;
      const subject = `Account created successfully`;
      insertActivity( user_id, 'New Admin Created', `New Admin Account - ${name} have been created.`);
      const emailResponse = await sendEmailNotification(email, text, subject);
      insertEmailActivity(email, subject, `New Admin Account- ${name} has been Successfully added!`);
      if (emailResponse) {
        console.log('Emails sent successfully:', emailResponse); 
      }
    } catch (error) {
      
      console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
      return res.status(200).json({ message: 'Account created - Unable to send email.' });
    }
    
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

const updateAdminIsActive = async (req, res) => {
  const { user_id, is_active } = req.body;

  try {
    const userId = req.user.user_id;

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