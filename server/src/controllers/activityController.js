const { fetchUserLogs, fetchUserActivity, fetchEmailActivity } = require('../services/activityService');

exports.getUserLogs = async (req, res) => {
    try {
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
        const activity = await fetchUserActivity();

        return res.status(200).json({ success: true, data: activity });
    } catch (error) {
        console.error(`Get User Activity Controller Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getEmailActivity = async (req, res) => {
    try {
        const emailActivity = await fetchEmailActivity();

        return res.status(200).json({ success: true, data: emailActivity });
    } catch (error) {
        console.error(`Get Email Activity Controller Error: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
