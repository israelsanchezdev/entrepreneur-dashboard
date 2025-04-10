// netlify/functions/send-confirmation-email.js
const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, token } = JSON.parse(event.body);
    if (!email || !token) {
      return { statusCode: 400, body: 'Missing email or token' };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // set to true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Founder Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Please confirm your registration',
      text: `Hi there,

Thanks for registering at Founder Tracker!

Please confirm your registration by clicking this link:
${confirmationUrl}

If you didn’t sign up, you can ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent via SMTP' }),
    };
  } catch (error) {
    console.error('SMTP email error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send confirmation email via SMTP' }),
    };
  }
};
