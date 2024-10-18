const sequelize = require('../config/dbConfig');  // Ensure the path to your dbConfig file is correct

exports.getSubjects = async (filters = {}) => {
    try {
        console.log('Executing query to fetch subjects...');

        // Base query with STRING_AGG for teacher names and a method to summarize branches
        let query = `
            SELECT 
                s.subject_id,
                s.subject_name, 
                s.subject_code, 
                s.sub_initials,       
                STRING_AGG(DISTINCT b.branch_name, ', ') AS branches,  -- Aggregate distinct branch names
                bs.semester, 
                STRING_AGG(DISTINCT t.teacher_name, ', ') AS teachers,  -- Aggregate distinct teacher names
                s.is_active
            FROM 
                subject s
            JOIN 
                branch_sem_sub bs ON s.subject_id = bs.subject_id
            LEFT JOIN 
                branch b ON bs.branch_id = b.branch_id
            LEFT JOIN 
                subject_teacher st ON s.subject_id = st.subject_id
            LEFT JOIN 
                teacher t ON st.teacher_id = t.teacher_id
            WHERE 
                1=1
        `;

        // Dynamic conditions
        const replacements = [];
        if (filters.branch_name) {
            query += ' AND b.branch_name = ?';
            replacements.push(filters.branch_name);
        }
        if (filters.semester) {
            query += ' AND bs.semester = ?';
            replacements.push(filters.semester);
        }
        if (filters.subject_name) {
            query += ' AND s.subject_name ILIKE ?';  // Use ILIKE for partial, case-insensitive matching
            replacements.push(`%${filters.subject_name}%`);  // Use % to match any part of the subject name
        }
    
        // Group by unique subject fields
        query += `
            GROUP BY 
                s.subject_id,
                s.subject_name, 
                s.subject_code, 
                s.sub_initials, 
                bs.semester, 
                s.is_active
        `;

        // Execute the raw SQL query
        const results = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });

        return results;
    } catch (error) {
        console.error('Error fetching subjects:', error); // Log full error details
        throw new Error('Error fetching subjects: ' + error.message);
    }
};

exports.getSubjectCount= async () => {
    const result = await sequelize.query('SELECT COUNT(*) AS count FROM subject WHERE is_active = true', {
        type: sequelize.QueryTypes.SELECT
      });
      return result[0].count;
};

exports.getSubjectById = async (subjectId) => {
    try {
      const subjectName = await sequelize.query(
        `SELECT subject_name FROM subject WHERE subject_id = :subjectId`,
        {
          replacements: { subjectId },
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      // Check if no subject found
      if (subjectName.length === 0) {
        throw new Error(`No subject found with id ${subjectId}`);
      }
  
      return subjectName[0].subject_name; // Return the subject name
    } catch (error) {
      console.error('Error fetching subject name:', error);
      throw error;
    }
};