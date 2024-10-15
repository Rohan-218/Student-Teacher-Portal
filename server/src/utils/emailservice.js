const {sgMail} = require('../congif/config');

// Function to send email notification
const sendEmailNotification = (recipientEmail, studentName, subject, marks) => {
  const message = {
    to: recipientEmail,  // recipient's email address
    from: 'surbhi1102@gmail.com',  // verified sender email
    subject: 'New Marks Added!',
    text: `Dear ${studentName},\n\nNew marks for the subject ${subject} have been added. Your marks: ${marks}.\n\nRegards,\nXYZ University`,
  };

  sgMail
    .send(message)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

module.exports = sendEmailNotification;
