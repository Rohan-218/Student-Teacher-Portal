// attendanceController.js
const sendEmailNotification = require('../utils/emailservice');
const userService = require('../services/userService');
const attendanceService = require('../services/teachUpdateAttendanceService');

const updateAttendance = async (req, res) => {
  try {
    const { subjectCode, attendanceDate, lecture, attendanceList } = req.body;
    
    // Validate the request body
    if (!subjectCode || !attendanceDate || !lecture || !attendanceList) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await attendanceService.updateMultipleAttendance(subjectCode, attendanceDate, lecture, attendanceList);
    
    const studentIds = await attendanceService.getStudentId(attendanceList);
    const extractedStudentIds = studentIds.map(student => student.student_id);

    const studentEmails = await userService.getUserId(extractedStudentIds); 
     // Now that we have student emails, we can send them notifications
     const emailList = studentEmails.map(student => student.email);
   
   // Now that we have student emails, we can send them notifications
   try {
    const text = `Dear Student,\n\nAttendance for subject code - ${subjectCode} have been updated.\n\nRegards,\nXYZ University`;
    const subject = `Attendance Updated!`;
    const emailResponse = await sendEmailNotification(emailList, text, subject);
    if (emailResponse) {
      console.log('Emails sent successfully:', emailResponse);  // Log the successful response from SendGrid
    }
  } catch (error) {
    // Log detailed error from SendGrid
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
