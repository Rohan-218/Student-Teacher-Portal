const teacherPostMarksService = require('../services/teacherPostMarksService');
const sendEmailNotification = require('../utils/emailservice');
// Controller function to upload marks
const uploadMarks = async (req, res) => {
  try {
    const { exam_id, marks } = req.body;
    const usertype = req.user.user_type;

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
          message: 'Each mark entry must contain student_id, marks_obtained, and subject_id.'
        });
      }
    }

    // Validate exam ID
    if (!exam_id) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    // Prepare marks data
    const marksData = await teacherPostMarksService.prepareMarksData(marks, exam_id);

    // Save marks in the database
    await teacherPostMarksService.saveMarks(marksData);
    const subjectName = marksData.map(mark => mark.subject_name );
    

     const studentIds = marks.map(mark => mark.student_id);

     const studentEmails = await teacherPostMarksService.getStudentEmails(studentIds);
 
     // Log the fetched emails (for debugging purposes)
     console.log('Fetched student emails:', studentEmails);
 
     // Now that we have student emails, we can send them notifications
     const emailList = studentEmails.map(student => student.email);

   // Now that we have student emails, we can send them notifications
   try {
    const emailResponse = await sendEmailNotification(emailList, subjectName);
    if (emailResponse) {
      console.log('Emails sent successfully:', emailResponse);  // Log the successful response from SendGrid
    }
  } catch (error) {
    // Log detailed error from SendGrid
    console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
    return res.status(500).json({ message: 'Error sending email notifications' });
  }

    res.status(200).json({ message: 'Marks uploaded successfully' });
  } catch (error) {
    console.error('Error uploading marks:', error.message);
    res.status(500).json({ message: 'Error uploading marks', error: error.message });
  }
};

// New controller function to get marks for a given subject
const getMarks = async (req, res) => {
  try {
    let { subjectCode } = req.query;
    const usertype = req.user.user_type;

    if (usertype !== 2) {
        return res.status(403).json({ message: 'Unauthorized: Not a teacher!' });
    }
    // Trim the subjectCode to handle extra spaces
    const trimmedSubjectCode = subjectCode.trim();

    if (!trimmedSubjectCode) {
      return res.status(400).json({ message: 'Subject code is required' });
    }

    // Fetch marks for the subject using the service
    const marksData = await teacherPostMarksService.getMarksForSubject(trimmedSubjectCode);

    // Return marks data
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
