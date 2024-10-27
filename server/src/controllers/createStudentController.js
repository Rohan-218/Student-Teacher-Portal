const createStudentService = require('../services/createStudentService');
const { insertActivity, insertEmailActivity } = require('../utils/activityService');
const sendEmailNotification = require('../utils/emailservice');

exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const user_id = req.user.user_id;
    const result = await createStudentService.createStudent(studentData);
    const { name, email, password } = studentData;

    try {
      const text = `Dear ${name},\n\nYour Student account has been successfully created.\nEmail: ${email} \nPassword: ${password} \n\nRegards,\nXYZ University`;
      const subject = `Account created successfully`;
      insertActivity( user_id, 'New Student Added', `New Student - ${name} have been added.`);
      const emailResponse = await sendEmailNotification(email, text, subject);
      insertEmailActivity(email, subject, `New Student Account- ${name} has been Successfully added!`);
      if (emailResponse) {
        console.log('Emails sent successfully:', emailResponse);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
      return res.status(200).json({ message: 'Account created - Unable to send email.' });
    }
    
    res.status(201).json({ message: 'Student created successfully', student: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};