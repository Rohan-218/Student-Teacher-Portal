// service.js
 // Importing the model

const { getTotalLecturesBySubjectId, getUpdatedLastBySubjectId } =  require('../models/totalLectureModel');// Import the model functions

// Function to handle the logic for getting total lectures by subject ID
const fetchTotalLectures = async (subjectId) => {
    try {
        const totalLectures = await getTotalLecturesBySubjectId(subjectId);
        return totalLectures; // Return the result
    } catch (error) {
        throw new Error('Service error: ' + error.message);
    }
};

// Function to handle the logic for getting updated_last by subject ID
const fetchUpdatedLast = async (subjectId) => {
    try {
        const updatedLast = await getUpdatedLastBySubjectId(subjectId);
        return updatedLast; // Return the result
    } catch (error) {
        throw new Error('Service error: ' + error.message);
    }
};

// Export the service functions
module.exports = {
    fetchTotalLectures,
    fetchUpdatedLast, // Export the new function
};
