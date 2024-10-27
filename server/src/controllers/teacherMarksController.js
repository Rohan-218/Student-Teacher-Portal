const teacherPostMarksService = require('../services/teacherPostMarksService');
const userService = require('../services/userService');
const sendEmailNotification = require('../utils/emailservice');
const { insertActivity ,insertEmailActivity } = require('../utils/activityService');

const uploadMarks = async (req, res) => {
  try {
    const { exam_id, marks } = req.body;
    const user_id = req.user.user_id;

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'Marks data is required' });
    }

    for (const mark of marks) {
      const { student_id, marks_obtained, subject_code } = mark;

      if (!student_id || !marks_obtained || !subject_code) {
        return res.status(400).json({
          message: 'Each mark entry must contain student_id, marks_obtained, and subject_id.'
        });
      }
    }

    if (!exam_id) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    const marksData = await teacherPostMarksService.prepareMarksData(marks, exam_id);
    await teacherPostMarksService.saveMarks(marksData);
    const subjectName = marksData.map(mark => mark.subject_name );
    const studentIds = marks.map(mark => mark.student_id);
    const studentData = await userService.getUserId(studentIds);
    const emailList = studentData.map(student => student.email);

      try {
        const text = `Dear student,\n\nMarks for ${subjectName[0]} have been added.\n\nRegards,\nXYZ University`;
        const subject = `New Marks Added!`;
        insertActivity( user_id, 'Marks uploaded', `Marks for ${subjectName[0]} have been added.`);
        const emailResponse = await sendEmailNotification(emailList, text, subject);
        insertEmailActivity(emailList, subject, `Marks for ${subjectName[0]} have been added.`);
        if (emailResponse) {
          console.log('Emails sent successfully:', emailResponse);
        }
      } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
        return res.status(500).json({ message: 'Error sending email notifications' });
      }

    res.status(200).json({ message: 'Marks uploaded successfully' });
    } catch (error) {
      console.error('Error uploading marks:', error.message);
      res.status(500).json({ message: 'Error uploading marks', error: error.message });
    }
};

const getMarks = async (req, res) => {
  try {
    let { subjectCode } = req.query;
    const trimmedSubjectCode = subjectCode.trim();

    if (!trimmedSubjectCode) {
      return res.status(400).json({ message: 'Subject code is required' });
    }

    const marksData = await teacherPostMarksService.getMarksForSubject(trimmedSubjectCode);

    res.status(200).json(marksData);
  } catch (error) {
    console.error('Error retrieving marks:', error.message);
    res.status(500).json({ message: 'Error retrieving marks', error: error.message });
  }
};

module.exports = {
  uploadMarks,
  getMarks,
};
