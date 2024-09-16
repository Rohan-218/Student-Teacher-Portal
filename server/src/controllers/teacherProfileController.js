const teacherProfileService = require('../services/teacherProfileService');

exports.getProfile = async (req, res) => {
    const usertype = req.user.user_type;

    if (usertype !== 2) {
        return res.status(403).json({ message: 'Unauthorized: Not a teacher' });
    }

    try {
        const teacher = await teacherProfileService.getTeacherProfile(req.user.user_id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};