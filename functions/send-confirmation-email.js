// functions/send-confirmation-email.js

const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, token } = JSON.parse(event.body);
    if (!email || !token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or token' }),
      };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    // create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // send mail
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Please confirm your registration',
      text: `
Hi there!

Please confirm your registration by clicking the link below:

${confirmationUrl}

If you did not sign up, you can ignore this.
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent' }),
    };
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email', details: err.message }),
    };
  }
};
