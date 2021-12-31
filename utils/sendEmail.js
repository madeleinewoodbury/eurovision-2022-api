const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
    })
  );

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
