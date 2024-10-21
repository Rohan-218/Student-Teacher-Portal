const { sgMail } = require('../config/config');

// Function to send email notification
const sendEmailNotification = async (recipientEmails, text, subject) => {
  try {
    console.log("jhfdgj", recipientEmails);

    // Ensure recipientEmails is always an array
    const recipients = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];

    for (const recipientEmail of recipients) {
      const message = {
        to: recipientEmail,  // recipient's email address
        from: 'surbhi1102gupta@gmail.com',  // verified sender email
        subject: subject,
        text: text,
      };

      await sgMail.send(message); // Await the send operation
      console.log(`Email sent successfully to: ${recipientEmail}`);
    }
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
  }
};

module.exports = sendEmailNotification;
