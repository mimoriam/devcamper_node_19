const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        // secureConnection: 'false',
        // tls: {
        //     ciphers: 'SSLv3',
        //     rejectUnauthorized: false
        // },
        // debug: true, // show debug output
        // logger: true // log information in console
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message, function (error, info) {
        if (error) {
            return console.log("ERROR----" + error);
        }
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;