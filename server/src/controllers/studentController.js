const studentProfileService = require('../services/studentService');

exports.getStudentProfile = async (req, res) => {
    console.log('User inside studentProfileController:', req.user);

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