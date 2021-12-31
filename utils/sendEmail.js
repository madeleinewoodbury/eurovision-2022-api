const nodemailer = require('nodemailer');
// const nodemailerSendgrid = require('nodemailer-sendgrid');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: 'apikey',
      pass: process.env.SMTP_PASSWORD,
    },
  });
  console.log('attempting email send');
  await transport.sendMail({
    from: process.env.FROM_EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  });

  // const msg = {
  //   from: process.env.FROM_EMAIL,
  //   to: options.email,
  //   subject: options.subject,
  //   html: options.html,
  // };

  // const info = await transporter.sendMail(msg);
};

module.exports = sendEmail;
