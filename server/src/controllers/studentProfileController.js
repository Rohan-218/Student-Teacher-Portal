const studentProfileService = require('../services/studentProfileService');


exports.getProfile = async (req, res) => {
    console.log('User inside studentProfileController:', req.user); // Log user info to debug
    const usertype = req.user.user_type;

    if (usertype !== 1) {
        return res.status(403).json({ message: 'Unauthorized: Not a student' });
    }

    try {
        const student = await studentProfileService.getStudentProfile(req.user.user_id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

