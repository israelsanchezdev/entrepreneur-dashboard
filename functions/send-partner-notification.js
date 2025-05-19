// functions/send-partner-notification.js
const nodemailer = require('nodemailer');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      to,
      partner,
      entrepreneur,
      business,
      date,
      initials,
      notes,
      stage,
    } = JSON.parse(event.body);

    if (!to || !partner) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown partner: ${partner}` }),
      };
    }

    // build a simple notification email
    const subject = `New entrepreneur assigned: ${entrepreneur}`;
    const text    = `
      Hi ${partner},

      A new entrepreneur has been added:

      • Name:        ${entrepreneur}
      • Business:    ${business}
      • Contacted:   ${date || '—'}
      • Stage:       ${stage}
      • Initials:    ${initials || '—'}
      • Notes:       ${notes || '—'}

      Please follow up as appropriate.
    `;

    // SMTP configuration (from your Netlify ENV)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:    process.env.FROM_EMAIL,
      to:      to,
      subject: subject,
      text:    text,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified' }),
    };

  } catch (err) {
    console.error('Partner-notification error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to notify partner', details: err.message }),
    };
  }
};
