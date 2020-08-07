const nodemailer = require('nodemailer');
const { emailSender, appName } = require('../config');

exports.sendMail = (targetAddress, content) => {
  const transporter = nodemailer.createTransport({
    service: emailSender.service,
    port: 587,
    secure: false,
    auth: emailSender.auth,
    requireTLS: true,
  });

  let mailOptions = {
    from: `${appName} <${emailSender.auth.user}>`,
    to: `${targetAddress}`,
    subject: 'Welcome to our platform',
    html: `${content}`,
  };

  return transporter.sendMail(mailOptions);
};
