const sequelize = require('../config/dbConfig');

exports.logUserLogin = async (userId, timestamp) => {
    const query = 'INSERT INactivity (user_id, action, timestamp) VALUES ($1, $2, $3)';
    const values = [userId, 'login', timestamp];
    try {
        await sequelize.query(query, { bind: values });
    } catch (error) {
        console.error(`Log User Login Error: ${error.message}`);
        throw new Error('Log User Login Error');
    }
};

exports.logUserLogout = async (userId, timestamp) => {
    const query = 'INSERT INTO user_logs (user_id, action, timestamp) VALUES ($1, $2, $3)';
    const values = [userId, 'logout', timestamp];
    try {
        await sequelize.query(query, { bind: values });
    } catch (error) {
        console.error(`Log User Logout Error: ${error.message}`);
        throw new Error('Log User Logout Error');
    }
};

exports.getUserLogs = async () => {
    const query = `
        SELECT 
            ul.id, ul.user_id, ul.action, u.user_type, ul.timestamp,
            CASE 
                WHEN u.user_type = 0 OR u.user_type = 3 THEN a.name
                WHEN u.user_type = 1 THEN s.student_name
                WHEN u.user_type = 2 THEN t.teacher_name
                ELSE 'Unknown User'
            END AS user_name
        FROM user_logs ul
        INNER JOIN users u ON ul.user_id = u.user_id
        LEFT JOIN admin a ON u.user_id = a.user_id AND (u.user_type = 0 OR u.user_type = 3)
        LEFT JOIN student s ON u.user_id = s.user_id AND u.user_type = 1
        LEFT JOIN teacher t ON u.user_id = t.user_id AND u.user_type = 2
        ORDER BY ul.timestamp DESC
    `; // Query to fetch logs with names based on user_type

    try {
        const logs = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Specify query type
        });
        return logs; // Return logs with user names
    } catch (error) {
        console.error(`Get All Logs With User Names Error: ${error.message}`);
        throw new Error('Get All Logs With User Names Error');
    }
};

exports.getUserActivity = async () => {
    const query = `
        SELECT 
            ua.activity_id, ua.user_id, ua.event_type as action, ua.message, u.user_type, ua.timestamp,
            CASE 
                WHEN u.user_type = 0 OR u.user_type = 3 THEN a.name
                WHEN u.user_type = 1 THEN s.student_name
                WHEN u.user_type = 2 THEN t.teacher_name
                ELSE 'Unknown User'
            END AS user_name
        FROM user_activity ua
        INNER JOIN users u ON ua.user_id = u.user_id
        LEFT JOIN admin a ON u.user_id = a.user_id AND (u.user_type = 0 OR u.user_type = 3)
        LEFT JOIN student s ON u.user_id = s.user_id AND u.user_type = 1
        LEFT JOIN teacher t ON u.user_id = t.user_id AND u.user_type = 2
        ORDER BY ua.timestamp DESC
    `; // Query to fetch logs with names based on user_type

    try {
        const logs = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT // Specify query type
        });
        return logs; // Return logs with user names
    } catch (error) {
        console.error(`Get All Logs With User Names Error: ${error.message}`);
        throw new Error('Get All Logs With User Names Error');
    }
};
