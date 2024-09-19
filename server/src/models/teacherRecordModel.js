const db = require('../config/dbConfig');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

// Fetch all teachers
exports.getAllTeachers = async () => {
  const query = `
    SELECT t.teacher_name, u.email, 
           pgp_sym_decrypt(u.password::bytea, $1) AS decrypted_password
    FROM teacher t
    JOIN users u ON t.user_id = u.user_id
  `;
  try {
    const result = await db.query(query, [secretKey]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch teachers by branch and semester
exports.getTeachersByBranchAndSemester = async (branchName, semester) => {
  const query = `
    SELECT t.teacher_name, u.email, 
           pgp_sym_decrypt(u.password::bytea, $1) AS decrypted_password
    FROM teacher t
    JOIN users u ON t.user_id = u.user_id
    WHERE t.teacher_id IN (
      SELECT st.teacher_id
      FROM subject_teacher st
      WHERE st.subject_id IN (
        SELECT bss.subject_id
        FROM branch_sem_sub bss
        WHERE bss.branch_id = (
          SELECT b.branch_id FROM branch b WHERE b.branch_name = $2
        ) AND bss.semester = $3
      )
    )
  `;
  try {
    const result = await db.query(query, [secretKey, branchName, semester]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Search teachers by name
exports.searchTeachersByName = async (name) => {
  const query = `
    SELECT t.teacher_name, u.email, 
           pgp_sym_decrypt(u.password::bytea, $1) AS decrypted_password
    FROM teacher t
    JOIN users u ON t.user_id = u.user_id
    WHERE t.teacher_name ILIKE $2
  `;
  try {
    const result = await db.query(query, [secretKey, `%${name}%`]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
};
