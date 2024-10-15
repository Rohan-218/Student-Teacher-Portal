const {sgMail} = require('../config/config');

// Function to send email notification
const sendEmailNotification = (recipientEmail) => {
  const message = {
    to: recipientEmail,  // recipient's email address
    from: 'surbhi1102gupta@gmail.com',  // verified sender email
    subject: 'New Marks Added!',
    text: `Dear Student,\n\nNew marks for the subject have been added.\n\nRegards,\nXYZ University`,
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
