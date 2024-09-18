const sequelize = require('../config/dbConfig');  

exports.getMarksPerformance = async (studentId) => {
    try {
        console.log('Executing query to fetch student marks...');
        const results = await sequelize.query(`
            SELECT 
                m.percentage,
                s.subject_name,
                e.exam_name,
                e.exam_id,
                e.maximum_marks
            FROM 
                marks m
            JOIN 
                subject s ON m.subject_id = s.subject_id
            JOIN 
                exam_type e ON m.exam_id = e.exam_id
            WHERE 
                m.student_id = :studentId
        `, {
            replacements: { studentId },
            type: sequelize.QueryTypes.SELECT  // Ensure QueryTypes is used correctly
        });

        return results;
    } catch (error) {
        throw new Error('Error fetching student marks: ' + error.message);
    }
};
