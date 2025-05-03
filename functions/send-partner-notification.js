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
      to,            // actual email address
      name,          // partner display name
      entrepreneur,
      business,
      date,
      initials,
      notes,
      stage,
    } = JSON.parse(event.body);

    // → If frontend failed to send us `to`, bail out
    if (!to) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing partner email (to)' }),
      };
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the email
    await transporter.sendMail({
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
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified' }),
    };
  } catch (err) {
    console.error('Error sending partner notification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to notify partner', details: err.message }),
    };
  }
};
