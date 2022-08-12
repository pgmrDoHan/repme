const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = {
    sendEmail: function (param) {
        var transporter = nodemailer.createTransport({
            service: 'naver',
            prot: 587,
            host: 'smtp.naver.com',
            secureConnection: false,
            auth: {
                user: process.env.mailer_user,
                pass: process.env.mailer_pwd
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        var mailOptions = {
            from: process.env.mailer_user,
            to: param.toEmail,
            subject: param.subject,
            html: param.html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }
}

module.exports = mailSender;