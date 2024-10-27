const {updateStudent} = require('../services/updateStudentDetailsService');
const { insertActivity } = require('../utils/activityService');

exports.updateStudentDetails = async (req, res) => {
  try {
    const { student_name, user_id, enrollment_no, branch_name, semester, contact_no, email } = req.body;
    const userId  = req.user.user_id;
    const result = await updateStudent(user_id, {
      student_name,
      enrollment_no,
      branch_name,
      semester,
      contact_no,
      email,
    });

    insertActivity( userId, 'Student Details Updated', `Details of ${student_name} have been updated.`);

    if (!result.success) {
      return res.status(404).json({ message: 'Student not found or no changes detected' });
    }

    return res.status(200).json({ message: 'Student details updated successfully', data: result.data });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating student details', error: error.message });
  }
};