const teacherUpdateMarksService = require('../services/teacherUpdateMarksService');
const teacherPostMarksService = require('../services/teacherPostMarksService');
const sendEmailNotification = require('../utils/emailservice');

// Update marks
const updateMarks = async (req, res) => {
  try {
    const { exam_id, marks } = req.body;
    const usertype = req.user.user_type;

    const studentIds = marks.map(mark => mark.student_id);

    if (usertype !== 2) {
      return res.status(403).json({ message: 'Unauthorized: Not a teacher!' });
    }

    // Validate marks
    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'Marks data is required' });
    }

    // Validate each mark entry
    for (const mark of marks) {
      const { student_id, marks_obtained, subject_code } = mark;

      if (!student_id || !marks_obtained || !subject_code) {
        return res.status(400).json({
          message: 'Each mark entry must contain student_id, marks_obtained, and subject_code.'
        });
      }
    }

    // Validate exam ID
    if (!exam_id) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    // Prepare marks data
    const marksData = await teacherUpdateMarksService.prepareMarksData(marks, exam_id);
    const subjectName = marksData.map(mark => mark.subject_name );

    await teacherUpdateMarksService.updateMarks(marksData);

    const studentEmails = await teacherPostMarksService.getUserId(studentIds);
    console.log('Fetched student emails:', studentEmails);
 
     // Now that we have student emails, we can send them notifications
     const emailList = studentEmails.map(student => student.email);

      // Now that we have student emails, we can send them notifications
      try {
        const text = `Dear Student,\n\nMarks for ${subjectName[0]} have been updated.\n\nRegards,\nXYZ University`;
        const emailResponse = await sendEmailNotification(emailList, text);
        if (emailResponse) {
          console.log('Emails sent successfully:', emailResponse);  // Log the successful response from SendGrid
        }
      } catch (error) {
        // Log detailed error from SendGrid
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

