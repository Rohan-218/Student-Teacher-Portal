require('dotenv').config({ path: 'src/.env' });
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    secretKey: process.env.JWT_SECRET,
    sgMail,
};
