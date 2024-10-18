const sequelize = require('../config/dbConfig');  // Ensure the path to your dbConfig file is correct

exports.getBranch = async (filters = {}) => {
    try {
        console.log('Executing query to fetch branches...');

        // Base query
        let query = `
            SELECT 
                b.branch_id,
                b.branch_name, 
                COALESCE(COUNT(DISTINCT CASE WHEN u.is_active = true THEN s.student_id END), 0) AS student_count,
                COALESCE(COUNT(DISTINCT bs.subject_id), 0) AS subject_count,
                b.is_active
            FROM 
                branch b
            LEFT JOIN 
                student s ON b.branch_id = s.branch_id
            LEFT JOIN 
                users u ON s.user_id = u.user_id
            LEFT JOIN 
                branch_sem_sub bs ON b.branch_id = bs.branch_id
            WHERE 
                1=1
        `;

        // Dynamic conditions
        const replacements = [];
        if (filters.branch_name) {
            query += ' AND b.branch_name ILIKE ?';
            replacements.push(`%${filters.branch_name}%`);
        }
        if (filters.semester) {
            query += ' AND bs.semester = ?';
            replacements.push(filters.semester);
        }
        if (filters.semester) {
            query += ' AND s.semester = ?';
            replacements.push(filters.semester);
        }

        // Group by clause
        query += `
            GROUP BY 
                b.branch_id,b.branch_name, b.is_active
        `;

        // Execute the raw SQL query
        const results = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        throw new Error('Error fetching branch: ' + error.message);
    }
};


exports.getBranchCount= async () => {
    const result = await sequelize.query('SELECT COUNT(*) AS count FROM branch WHERE is_active = true', {
        type: sequelize.QueryTypes.SELECT
      });
      return result[0].count;
};

exports.getBranchStudentCount= async () => {
    const result = await sequelize.query(`
      SELECT b.branch_name, 
             COUNT(CASE WHEN u.is_active = true THEN s.student_id END) AS student_count
      FROM branch b
      LEFT JOIN student s ON b.branch_id = s.branch_id
      LEFT JOIN users u ON s.user_id = u.user_id
      GROUP BY b.branch_name
    `, {
        type: sequelize.QueryTypes.SELECT
      });
      return result;
};

exports.getBranchById = async (branchId) => {
    try {
      const branchName = await sequelize.query(
        `SELECT branch_name FROM branch WHERE branch_id = :branchId`,
        {
          replacements: { branchId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (branchName.length === 0) {
        throw new Error(`No branch found with id ${branchId}`);
      }
  
      return branchName[0].branch_name;
    } catch (error) {
      console.error('Error fetching branch name:', error);
      throw error;
    }
};