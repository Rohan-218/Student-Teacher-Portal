const pool = require('../config/dbConfig');

// Model for counting students, teachers, subjects, and branches
const countModel = {
  getStudentCount: async () => {
    const result = await pool.query('SELECT COUNT(*) FROM student');
    return result.rows[0].count;
  },
  
  getTeacherCount: async () => {
    const result = await pool.query('SELECT COUNT(*) FROM teacher');
    return result.rows[0].count;
  },

  getSubjectCount: async () => {
    const result = await pool.query('SELECT COUNT(*) FROM subject');
    return result.rows[0].count;
  },

  getBranchCount: async () => {
    const result = await pool.query('SELECT COUNT(*) FROM branch');
    return result.rows[0].count;
  },

  getStudentBranchCount: async () => {
    const result = await pool.query(`
      SELECT b.branch_name, COUNT(s.student_id) AS student_count
      FROM branch b
      LEFT JOIN student s ON b.branch_id = s.branch_id
      GROUP BY b.branch_name
    `);
    return result.rows;
  }
};

module.exports = countModel;
