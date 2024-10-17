// userLogController.js
const { fetchUserLogs, fetchUserActivity, fetchEmailActivity } = require('../services/activityService');

// Controller to handle fetching all user logs
exports.getUserLogs = async (req, res) => {
    try {

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins access user log data.'});
        }
        // Call service to fetch all logs
        const logs = await fetchUserLogs();

        // Send the logs in response
        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error(`Get User Log info Controller Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getUserActivity = async (req, res) => {
    try {

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied. Only admins access user activity data.'});
        }
        const activity = await fetchUserActivity();

        return res.status(200).json({ success: true, data: activity });
    } catch (error) {
        console.error(`Get User Activity Controller Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getEmailActivity = async (req, res) => {
    try {

        const userType = req.user.user_type;
        if (userType !== 0 && userType !== 3) {
            return res.status(403).json({ message: 'Access denied.'});
        }
        const emailActivity = await fetchEmailActivity();

        return res.status(200).json({ success: true, data: emailActivity });
    } catch (error) {
        console.error(`Get Email Activity Controller Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
