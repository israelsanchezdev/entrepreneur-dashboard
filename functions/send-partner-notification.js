// functions/send-partner-notification.js

const nodemailer = require('nodemailer');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON body' };
  }

  const {
    to,            // partner’s email address
    name,          // partner’s display name
    entrepreneur,  // entrepreneur name
    business,      // business name
    date,          // contact date
    initials,      // your initials
    notes,         // any notes
    stage,         // current stage
  } = payload;

  if (!to || !name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Unknown partner or missing recipient: ${name}` }),
    };
  }

  // Use FROM_EMAIL (set in Netlify) or fall back to your SMTP_USER
  const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER;
  if (!fromAddress) {
    console.error('❌ No FROM_EMAIL or SMTP_USER set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfiguration: missing from address' }),
    };
  }

  // Build the email
  const subject = `New entrepreneur assigned: ${entrepreneur}`;
  const text = `
Hello ${name},

A new entrepreneur has been added to Founder Tracker:

 • Name:       ${entrepreneur}
 • Business:   ${business}
 • Contacted:  ${date || '—'}
 • Stage:      ${stage}
 • Initials:   ${initials || '—'}
 • Notes:      ${notes || '—'}

Please follow up as needed.

Thanks,
Founder Tracker
  `.trim();

  // Configure Nodemailer SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send it!
  try {
    await transporter.sendMail({
      from:    fromAddress,
      to:      to,
      subject: subject,
      text:    text,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified' }),
    };
  } catch (err) {
    console.error('❌ Partner notification failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to notify partner', details: err.message }),
    };
  }
};
