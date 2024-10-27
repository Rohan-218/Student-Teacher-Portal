const { updateTeacher } = require('../services/updateTeacherDetailsService');
const { insertActivity } = require('../utils/activityService');
exports.updateTeacherDetails = async (req, res) => {
  try {
    const { teacher_name, user_id, designation, contact_no, email } = req.body;
    const userId  = req.user.user_id;
    const result = await updateTeacher(user_id, {
      teacher_name,
      designation,
      contact_no,
      email,
    });

    insertActivity( userId, 'Teacher Details Updated', `Details of ${teacher_name} have been updated.`);

    if (!result.success) {
      return res.status(404).json({ message: 'Teacher not found or no changes detected' });
    }

    return res.status(200).json({ message: 'Teacher details updated successfully', data: result.data });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating teacher details', error: error.message });
  }
};
