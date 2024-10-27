const createTeacherService = require('../services/createTeacherService');
const { insertActivity, insertEmailActivity } = require('../utils/activityService');
const sendEmailNotification = require('../utils/emailservice');

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password, designation, contactNo, subjects } = req.body;
    const user_id = req.user.user_id;

    if (!name || !email || !password || !designation || !contactNo || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'All fields are required and subjects must be a non-empty array' });
    }

    const result = await createTeacherService.createTeacher(name, email, password, designation, contactNo, subjects);
    try {
      const text = `Dear ${name},\n\nYour Teacher account has been successfully created.\nEmail: ${email} \nPassword: ${password} \n\nRegards,\nXYZ University`;
      const subject = `Account created successfully`;
      insertActivity( user_id, 'New Teacher Added', `New teacher - ${name} have been added.`);
      const emailResponse = await sendEmailNotification(email, text, subject);
      insertEmailActivity(email, subject, `New Teacher account - ${name} has been Successfully created!`);
      if (emailResponse) {
        console.log('Emails sent successfully:', emailResponse);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
      return res.status(200).json({ message: 'Account created - Unable to send email.' });
    }
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher', details: error.message });
  }
};
