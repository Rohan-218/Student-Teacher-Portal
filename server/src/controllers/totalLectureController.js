// controller.js
// Import the service
const { fetchTotalLectures, fetchUpdatedLast } = require('../services/totalLectureService'); // Import the service functions

// Controller function to get total lectures
const getTotalLectures = async (req, res) => {
    const { subjectId } = req.query; // Change this line to use req.query

    try {
        const totalLectures = await fetchTotalLectures(subjectId);
        return res.status(200).json({ totalLectures }); // Respond with total lectures
    } catch (error) {
        return res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Controller function to get updated_last
const getUpdatedLast = async (req, res) => {
    const { subjectId } = req.query; // Change this line to use req.query

    try {
        const updatedLast = await fetchUpdatedLast(subjectId);
        return res.status(200).json({ updatedLast }); // Respond with updated_last
    } catch (error) {
        return res.status(500).json({ message: error.message }); // Handle errors
    }
};

// Export the controller functions
module.exports = {
    getTotalLectures,
    getUpdatedLast, // Export the new function
};
