const sendEmailNotification = require('../utils/emailservice');
const userService = require('../services/userService');
const attendanceService = require('../services/teachUpdateAttendanceService');
const { insertActivity, insertEmailActivity } = require('../utils/activityService');

const updateAttendance = async (req, res) => {
  try {
    const { subjectCode, attendanceDate, lecture, attendanceList } = req.body;
    const user_id = req.user.user_id;

    if (!subjectCode || !attendanceDate || !lecture || !attendanceList) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await attendanceService.updateMultipleAttendance(subjectCode, attendanceDate, lecture, attendanceList);
    
    const studentIds = await attendanceService.getStudentId(attendanceList);
    const extractedStudentIds = studentIds.map(student => student.student_id);
    const subjectName = await attendanceService.getSubjectNameByCode(subjectCode);

    const studentData = await userService.getUserId(extractedStudentIds);
    const emailList = studentData.map(student => student.email);
    const student = studentData.map(student => student.student_name);
    try {
      const text = `Dear Student,\n\nAttendance for ${subjectName} have been updated.\n\nRegards,\nXYZ University`;
      const subject = `Attendance Updated!`;
      insertActivity( user_id, 'Attendance updated', `Attendance of ${student} in ${subjectName} for ${attendanceDate} lecture- ${lecture} have been updated.`);
      const emailResponse = await sendEmailNotification(emailList, text, subject);
      insertEmailActivity(emailList, subject, `Attendance for ${subjectName} have been updated.`);
      if (emailResponse) {
        console.log('Emails sent successfully:', emailResponse);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
      return res.status(500).json({ message: 'Error sending email notifications' });
    }

    return res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateAttendance,
};
