// functions/send-partner-notification.js

const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const {
      to,
      name,
      entrepreneur,
      business,
      date,
      initials,
      notes,
      stage,
    } = JSON.parse(event.body);

    console.log('Partner notification payload:', { to, name, entrepreneur, business, date, initials, notes, stage });

    if (!to) {
      console.error('Missing "to" address');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing partner email (to)' }),
      };
    }

    // Use the FROM_EMAIL env-var, or fallback if not set locally
    const fromEmail = process.env.FROM_EMAIL
      ? process.env.FROM_EMAIL
      : '"Founder Tracker" <no-reply@yourdomain.com>';

    console.log('Using FROM_EMAIL:', fromEmail);

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
      from:    fromEmail,      // ← now guaranteed
      to,                    // actual partner email
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
    console.log('SMTP sendMail response:', info);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified', info }),
    };
  } catch (err) {
    console.error('Error sending partner notification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to notify partner', details: err.message }),
    };
  }
};
