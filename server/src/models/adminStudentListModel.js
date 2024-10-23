const sequelize = require('../config/dbConfig.js'); 
const {secretKey} = require('../config/config.js');

exports.getAllStudents = async () => {
  const query = `
    SELECT s.student_name, s.enrollment_no, u.email, u.user_id, u.is_active
    FROM student s
    JOIN users u ON s.user_id = u.user_id
  `;

  try {
    const result = await sequelize.query(query, {
      replacements: { secretKey },
      type: sequelize.QueryTypes.SELECT
    });
    return result; // Return the rows containing decrypted data
  } catch (error) {
    console.error("Error fetching students:", error.message);
    throw new Error('Error fetching all students: ' + error.message);
  }
};

// Fetch students by branch and semester
exports.getStudentsByBranchAndSemester = async (branchName, semester) => {
  const branchQuery = `
    SELECT branch_id FROM branch WHERE branch_name = :branchName
  `;

  try {
    const branchResult = await sequelize.query(branchQuery, {
      replacements: { branchName },
      type: sequelize.QueryTypes.SELECT
    });

    if (branchResult.length === 0) {
      throw new Error('Branch not found');
    }

    const branchId = branchResult[0].branch_id;

    const studentQuery = `
      SELECT s.student_name, s.enrollment_no, u.email,  u.user_id, u.is_active
      FROM student s
      JOIN users u ON s.user_id = u.user_id
      WHERE s.branch_id = :branchId AND s.semester = :semester
    `;

    const result = await sequelize.query(studentQuery, {
      replacements: { secretKey, branchId, semester },
      type: sequelize.QueryTypes.SELECT
    });

    return result;
  } catch (error) {
    throw new Error('Error fetching students by branch and semester: ' + error.message);
  }
};

// Search students by name
exports.searchStudentsByName = async (name) => {
  const query = `
    SELECT s.student_name, s.enrollment_no, u.email, u.user_id, u.is_active
    FROM student s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.student_name ILIKE :name
  `;

  try {
    const result = await sequelize.query(query, {
      replacements: { secretKey, name: `%${name}%` },
      type: sequelize.QueryTypes.SELECT
    });

    return result;
  } catch (error) {
    throw new Error('Error searching students by name: ' + error.message);
  }
};