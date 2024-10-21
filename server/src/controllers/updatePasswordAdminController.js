const { updatePasswordAdmin }= require('../services/updatePasswordAdminService');
const { insertActivity ,insertEmailActivity } = require('../utils/activityService');
const userModel = require('../models/userModel');

// Login Controller
exports.updatePasswordAdmin = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if ( oldPassword === newPassword ) {
        return res.status(400).json({ message: 'New password same as old password' });
    }

    try {

        const { user_id, user_type } = req.user;
        if (user_type !== 0 && user_type !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can update password.' });
        }

        const result = await updatePasswordAdmin(email, oldPassword, newPassword);
        const userId = result.data;

        const userData = await userModel.getUserData(userId);
        const name = userData.map(user => user.name);
        
        try {
            const text = `Dear user,\n\nYour password hass been successfully updated.\n\nRegards,\nXYZ University`;
            const subject = `Password updated Successfully!`;
            insertActivity( user_id, 'Password Updated', `${name} have updated his/her password.`);
            const emailResponse = await sendEmailNotification(email, text, subject);
            insertEmailActivity(email, subject, `Password of ${name} updated Successfully!`);
            if (emailResponse) {
              console.log('Emails sent successfully:', emailResponse);  // Log the successful response from SendGrid
            }
          } catch (error) {
            // Log detailed error from SendGrid
            console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
            return res.status(200).json({ message: 'Password updated- Error sending email notifications' });
          }

        if (result) {
            res.status(200).json({ result });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);  // Log the error
        res.status(500).json({ message: error.message, error });
    }
};