const db = require('../config/dbConfig');
require('dotenv').config();

// Get branch_id by branch_name
exports.getBranchIdByName = async (branchName) => {
  const query = 'SELECT branch_id FROM branch WHERE branch_name = $1';
  const result = await db.query(query, [branchName]);
  return result.rows.length > 0 ? result.rows[0].branch_id : null;
};

// Create a new user in the users table with user_type set to 1
exports.createUser = async (userData) => {
    const { email, password } = userData;
    const userType = 1;  // Set user_type to 1 (for student)
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("Secret key is not defined in the environment variables");
    }

    const query = 'INSERT INTO users (email, password, user_type) VALUES ($1, pgp_sym_encrypt($2, $3), $4) RETURNING user_id';
    const result = await db.query(query, [email, password, secretKey, userType]);
    return result.rows[0].user_id;
  };

// Create a new student in the student table
exports.createStudent = async (studentData) => {
  const { student_name, enrollment_no, user_id, branch_id, semester, contact_no } = studentData;
  const query = `
    INSERT INTO student (student_name, enrollment_no, user_id, branch_id, semester, contact_no)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [student_name, enrollment_no, user_id, branch_id, semester, contact_no];
  const result = await db.query(query, values);
  return result.rows[0];
};
