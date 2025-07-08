const dotenv = require('dotenv');

const nodemailer = require('nodemailer');

dotenv.config({ path: './config.env' });
const sendEmail = async (options) => {
  //1. Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2.state enail options
  const emailOptions = {
    from: 'Adoyi Owoicho <adoyiowoicho@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3. send emails
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
