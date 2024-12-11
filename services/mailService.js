const nodemailer = require('nodemailer');
const {oauth2Client} = require('../config/auth2Client');

const sendMail = async (username, email, token) => {
    const accessToken = await oauth2Client.getAccessToken();
    const html = `<p>Hi <strong>${username}</strong>,</p> 
    <p>Thank you for registering with <strong>[fitMate]</strong>.</p> 
    <p>Please use the following link to complete your registration:</p> 
    <p style="font-size: 18px; color: blue;"> 
        <a href="http://localhost:3000/api/user/register/confirm/${token}" target="_blank">
            Complete Registration
        </a>
    </p> 
    <p>If you did not request this, please ignore this email.</p> 
    <p>Best regards,<br>fitMate</p>`;

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