// functions/send-partner-notification.js

const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      to, name,
      entrepreneur, business,
      date, initials, notes, stage,
    } = JSON.parse(event.body);

    console.log('Partner notify called with:', { to, name, entrepreneur, business, date, initials, notes, stage });

    if (!to) {
      console.error('No "to" address provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing partner email (to)' }),
      };
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from:    process.env.FROM_EMAIL,
      to,
      subject: `New referral for ${name}`,
      text: `
Hello ${name},

A new entrepreneur has been referred to you:

• Name:        ${entrepreneur}
• Business:    ${business}
• Date:        ${date}
• Initials:    ${initials}
• Stage:       ${stage}
• Notes:       ${notes || '–'}

Please follow up at your earliest convenience.

Thank you,
Founder Tracker
      `,
    };

    console.log('Sending mail with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('SMTP response:', info);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified', info }),
    };
  } catch (err) {
    console.error('Error in partner notification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to notify partner', details: err.message }),
    };
  }
};
