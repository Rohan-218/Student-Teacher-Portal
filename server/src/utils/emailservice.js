const { sgMail } = require('../config/config');

const sendEmailNotification = async (recipientEmails, text, subject) => {
  try {
    const recipients = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];

    for (const recipientEmail of recipients) {
      const message = {
        to: recipientEmail,
        from: 'surbhi1102gupta@gmail.com',
        subject: subject,
        text: text,
      };

      await sgMail.send(message);
      console.log(`Email sent successfully to: ${recipientEmail}`);
    }
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
  }
};

module.exports = sendEmailNotification;
