const nodemailer = require('nodemailer');

const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use another service provider
        auth: {
            user: process.env.EMAIL_USER,  // Use your email account credentials
            pass: process.env.EMAIL_PASS,  // Use your email account password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = { sendEmail };
