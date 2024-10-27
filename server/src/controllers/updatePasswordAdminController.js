require('dotenv').config();
const { updatePasswordAdmin }= require('../services/updatePasswordAdminService');
const { insertActivity ,insertEmailActivity } = require('../utils/activityService');
const sendEmailNotification = require('../utils/emailservice');
const userModel = require('../models/userModel');
const CryptoJS = require('crypto-js');

// Login Controller
exports.updatePasswordAdmin = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    
    const decryptedOldPassword =  CryptoJS.AES.decrypt(oldPassword, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const decryptedNewPassword =  CryptoJS.AES.decrypt(newPassword, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decryptedOldPassword === decryptedNewPassword ) {
        return res.status(400).json({ message: 'New password same as old password' });
    }

    try {
        const user_id = req.user.user_id;
        const result = await updatePasswordAdmin(email, decryptedOldPassword, decryptedNewPassword);
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
            return res.status(200).json({ message: 'Password updated- Unable to send email.'});
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