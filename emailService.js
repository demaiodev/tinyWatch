const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  sendEmail: function ({ to, subject, text }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: 'tinymailer420@gmail.com',
      to: process.env.TO_LIST,
      subject,
      text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      }
    });
  },
};
