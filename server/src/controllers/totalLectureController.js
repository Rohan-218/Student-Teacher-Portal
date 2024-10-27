const { fetchTotalLectures, fetchUpdatedLast } = require('../services/totalLectureService'); // Import the service functions

const getTotalLectures = async (req, res) => {
    const { subjectId } = req.query;

    try {
        const totalLectures = await fetchTotalLectures(subjectId);
        return res.status(200).json({ totalLectures });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUpdatedLast = async (req, res) => {
    const { subjectId } = req.query;

    try {
        const updatedLast = await fetchUpdatedLast(subjectId);
        return res.status(200).json({ updatedLast });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTotalLectures,
    getUpdatedLast,
};
