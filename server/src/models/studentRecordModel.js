// Import database configuration and dotenv for environment variables
const db = require('../config/dbConfig');
require('dotenv').config();

// Load the secret key from environment variables
const secretKey = process.env.JWT_SECRET;

exports.getAllStudents = async () => {
  // SQL query with parameterized key for decryption
  const query = `
    SELECT s.student_name, s.enrollment_no, u.email, 
           pgp_sym_decrypt(u.password::bytea, $1) AS decrypted_password
    FROM student s
    JOIN users u ON s.user_id = u.user_id
  `;

  try {
    // Execute the query, passing in the secret key as a parameter
    const result = await db.query(query, [secretKey]);
    return result.rows; // Return the rows containing decrypted data
  } catch (error) {
    // Log and throw error if query fails
    console.error("Error fetching students:", error.message);
    throw new Error(error.message);
  }
};

// New method to get students by branch and semester
exports.getStudentsByBranchAndSemester = async (branchName, semester) => {
    // First, get the branch_id from the branch name
    const branchQuery = `
      SELECT branch_id FROM branch WHERE branch_name = $1
    `;
  
    try {
      const branchResult = await db.query(branchQuery, [branchName]);
      
      if (branchResult.rows.length === 0) {
        throw new Error('Branch not found');
      }
  
      const branchId = branchResult.rows[0].branch_id;
  
      // Now, fetch the students with matching branch_id and semester
      const studentQuery = `
        SELECT s.student_name, s.enrollment_no, u.email, 
               pgp_sym_decrypt(u.password::bytea, $2) AS decrypted_password
        FROM student s
        JOIN users u ON s.user_id = u.user_id
        WHERE s.branch_id = $1 AND s.semester = $3
      `;
  
      const result = await db.query(studentQuery, [branchId, secretKey, semester]);
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
};

// New method to search students by name
exports.searchStudentsByName = async (name) => {
    const query = `
      SELECT s.student_name, s.enrollment_no, u.email, 
             pgp_sym_decrypt(u.password::bytea, $1) AS decrypted_password
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.student_name ILIKE $2
    `;
    try {
        // Log the input to check
        console.log("Search query name:", name);
      // Use ILIKE for case-insensitive search
      const result = await db.query(query, [secretKey, `%${name}%`]);

      // Log the query result to check
        console.log("Query result:", result.rows);

      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
};