const nodemailer = require('nodemailer');
const {oauth2Client} = require('../config/auth2Client');

const sendMail = async (email, html) => {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAUTH2',
            user: process.env.MY_GMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: process.env.MY_GMAIL,
        to: email,
        subject: 'Confirmation Email',
        html: html
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId); 
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = {sendMail}