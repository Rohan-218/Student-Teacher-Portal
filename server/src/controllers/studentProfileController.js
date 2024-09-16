const studentProfileService = require('../services/studentProfileService');

// Get Student Profile Controller
// exports.getStudentProfile = async (req, res) => {
//     try {
//         const userId = req.user.id; // userId is extracted from the token by the middleware
//         const profile = await studentProfileService.getStudentProfile(userId);
//         if (profile) {
//             res.status(200).json(profile);
//         } else {
//             res.status(404).json({ message: 'Profile not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };

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

