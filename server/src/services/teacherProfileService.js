const db = require('../db');

// Get Teacher Profile Service
exports.getTeacherProfile = async (userId) => {
    // const profile = await model.getTeacherDetailsById(userId);
    // return profile;
    try {
        const teacher = await db.getTeacherDetailsById(userId);
        return teacher;
    } catch (error) {
        throw new Error('Error fetching teacher profile');
    }
};
