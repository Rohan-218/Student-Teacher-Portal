const { sgMail } = require('../config/config');

// Function to send email notification
const sendEmailNotification = async (recipientEmails, text) => {
  try {
    for (const recipientEmail of recipientEmails) {
      const message = {
        to: recipientEmail,  // recipient's email address
        from: 'surbhi1102gupta@gmail.com',  // verified sender email
        subject: 'New Marks Added!',
        text: text
      };

      await sgMail.send(message); // Await the send operation
      console.log(`Email sent successfully to: ${recipientEmail}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmailNotification;
