const { updateUserPassword }= require('../services/updatePasswordService');
const { insertActivity } = require('../utils/activityService');

// Login Controller
exports.updateUserpassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if ( oldPassword === newPassword ) {
        return res.status(400).json({ message: 'New password same as old password' });
    }

    try {

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins can update user password.' });
        }

        const token = await updateUserPassword(email, oldPassword, newPassword);
        if (token) {
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);  // Log the error
        res.status(500).json({ message: error.message, error });
    }
};