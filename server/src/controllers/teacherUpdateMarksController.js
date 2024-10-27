const teacherUpdateMarksService = require('../services/teacherUpdateMarksService');
const userService = require('../services/userService');
const sendEmailNotification = require('../utils/emailservice');
const { insertActivity, insertEmailActivity } = require('../utils/activityService');

const updateMarks = async (req, res) => {
  try {
    const { exam_id, marks } = req.body;
    const user_id = req.user.user_id;
    const studentIds = marks.map(mark => mark.student_id);

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'Marks data is required' });
    }

    for (const mark of marks) {
      const { student_id, marks_obtained, subject_code } = mark;

      if (!student_id || !marks_obtained || !subject_code) {
        return res.status(400).json({
          message: 'Each mark entry must contain student_id, marks_obtained, and subject_code.'
        });
      }
    }

    if (!exam_id) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    const marksData = await teacherUpdateMarksService.prepareMarksData(marks, exam_id);
    const subjectName = marksData.map(mark => mark.subject_name );

    await teacherUpdateMarksService.updateMarks(marksData);

    const studentData = await userService.getUserId(studentIds);
     const emailList = studentData.map(student => student.email);
     console.log(emailList);
     const student = studentData.map(student => student.student_name);
      try {
        const text = `Dear student,\n\nMarks for ${subjectName[0]} have been updated.\n\nRegards,\nXYZ University`;
        const subject = `Marks Updated!`;
        insertActivity( user_id, 'Marks updated', `Marks of ${student} in ${subjectName[0]} have been updated.`);
        const emailResponse = await sendEmailNotification(emailList, text, subject);
        insertEmailActivity(emailList, subject, `Marks for ${subjectName[0]} have been updated.`);
        if (emailResponse) {
          console.log('Emails sent successfully:', emailResponse);  // Log the successful response from SendGrid
        }
      } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
        return res.status(500).json({ message: 'Error sending email notifications' });
      }

    res.status(200).json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Error updating marks:', error.message);
    res.status(500).json({ message: 'Error updating marks', error: error.message });
  }
};

module.exports = {
  updateMarks,
};

