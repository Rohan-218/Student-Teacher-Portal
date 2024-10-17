const { getUserLogs,getUserActivity,getEmailActivity } = require('../models/userLogModel');

exports.fetchUserLogs = async () => {
    try {
        // Call the model method to fetch logs with names
        const logs = await getUserLogs();

        // Return logs data with user names
        return logs;
    } catch (error) {
        console.error(`Fetch User Log info With Names Service Error: ${error.message}`);
        throw new Error('Fetch User Log info With Names Service Error');
    }
};

exports.fetchUserActivity = async () => {
    try {
        const activity = await getUserActivity();

        return activity;
    } catch (error) {
        console.error(`Fetch User Activity info With Names Service Error: ${error.message}`);
        throw new Error('Fetch User Activity info With Names Service Error');
    }
};

exports.fetchEmailActivity = async () => {
    try {
        const emailActivity = await getEmailActivity();

        return emailActivity;
    } catch (error) {
        console.error(`Fetch User Email Activity info With Names Service Error: ${error.message}`);
        throw new Error('Fetch User Email Activity info With Names Service Error');
    }
};