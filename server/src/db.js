const pool = require('./config/dbConfig');

// Get user by email
exports.getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

// Get student details by user ID
exports.getStudentDetailsById = async (userId) => {
    const query = 'SELECT * FROM student WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};

// Get teacher details by user ID
exports.getTeacherDetailsById = async (userId) => {
    const query = 'SELECT * FROM teacher WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};

