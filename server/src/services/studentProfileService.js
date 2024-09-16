const db = require('../db');

// Get Student Profile Service
exports.getStudentProfile = async (userId) => {
    // const profile = await model.getStudentDetailsById(userId);
    // return profile;
    console.log(userId);
    try {
        const student = await db.getStudentDetailsById(userId);
        
        
        return student;
    } catch (error) {
        throw new Error('Error fetching student profile');
    }
};
