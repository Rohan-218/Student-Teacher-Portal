// model.js
const sequelize = require('../config/dbConfig'); // Database configuration

// Function to get total lectures for a particular subject
const getTotalLecturesBySubjectId = async (subjectId) => {
    try {
        const result = await sequelize.query(`
            SELECT total_lectures 
            FROM attendance_record 
            WHERE subject_id = :subjectId
            ORDER BY total_lectures DESC 
            LIMIT 1
        `, {
            replacements: { subjectId }, // Using named replacements
            type: sequelize.QueryTypes.SELECT,
        });

        // Return the total lectures if found, otherwise return 0
        return result.length > 0 ? result[0].total_lectures : 0; 
    } catch (error) {
        throw new Error('Database query failed: ' + error.message); // Error handling
    }
};

// Function to get updated_last for a particular subject
const getUpdatedLastBySubjectId = async (subjectId) => {
    try {
        const result = await sequelize.query(`
            SELECT updated_last 
            FROM attendance_record 
            WHERE subject_id = :subjectId
            ORDER BY updated_last DESC 
            LIMIT 1
        `, {
            replacements: { subjectId }, // Using named replacements
            type: sequelize.QueryTypes.SELECT,
        });

        // Return the updated_last if found, otherwise return null
        return result.length > 0 ? result[0].updated_last : null; 
    } catch (error) {
        throw new Error('Database query failed: ' + error.message); // Error handling
    }
};

// Export the functions to be used in services
module.exports = {
    getTotalLecturesBySubjectId,
    getUpdatedLastBySubjectId, // Export the new function
};
