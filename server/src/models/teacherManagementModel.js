const db = require('../config/dbConfig');
require('dotenv').config(); // Load environment variables

// Create a new user in the users table with encrypted password and user_type set to 2
exports.createUser = async (userData) => {
  const { email, password } = userData;
  const userType = 2; // Set user_type to 2 (for teacher)
  
  // Retrieve the secret key from the .env file
  const secretKey = process.env.JWT_SECRET;

  // Check if secretKey is defined
  if (!secretKey) {
    throw new Error("Secret key is not defined in the environment variables");
  }

  // SQL query to encrypt the password using pgp_sym_encrypt
  const query = `
    INSERT INTO users (email, password, user_type)
    VALUES ($1, pgp_sym_encrypt($2, $3), $4) RETURNING user_id
  `;
  const result = await db.query(query, [email, password, secretKey, userType]);
  return result.rows[0].user_id;
};

// Create a new teacher in the teacher table
exports.createTeacher = async (teacherData) => {
  const { teacher_name, designation, user_id, contact_no } = teacherData;
  const query = `
    INSERT INTO teacher (teacher_name, designation, user_id, contact_no)
    VALUES ($1, $2, $3, $4) RETURNING teacher_id
  `;
  const values = [teacher_name, designation, user_id, contact_no];
  const result = await db.query(query, values);
  return result.rows[0].teacher_id;
};

// Get subject_id by subject_code
exports.getSubjectIdByCode = async (subjectCode) => {
  const query = 'SELECT subject_id FROM subject WHERE subject_code = $1';
  const result = await db.query(query, [subjectCode]);
  return result.rows.length > 0 ? result.rows[0].subject_id : null;
};

// Assign a subject to a teacher in the subject_teacher table
exports.assignSubjectToTeacher = async (teacherId, subjectId) => {
  const query = `
    INSERT INTO subject_teacher (teacher_id, subject_id)
    VALUES ($1, $2)
  `;
  await db.query(query, [teacherId, subjectId]);
};
