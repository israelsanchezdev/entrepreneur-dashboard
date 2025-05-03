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
      partner,
      entrepreneur,
      business,
      date,
      initials,
      notes,
      stage,
    } = JSON.parse(event.body);

    // simple map: partner name → email address
    const partnerEmailMap = {
      'Go Topeka': 'israelsanchezofficial@gmail.com',
      'KS Department of Commerce': 'commerce@ks.gov',
      'Network Kansas': 'info@networkkansas.org',
      'Omni Circle': 'contact@omnicircle.org',
      'Shawnee Startups': 'hello@shawneestartups.org',
      'Washburn SBDC': 'sbdc@washburn.edu',
      // …add your real partner emails here…
    };

    const toEmail = partnerEmailMap[partner];
    if (!toEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown partner: ${partner}` }),
      };
    }

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
      to: toEmail,
      subject: `New Entrepreneur Referral: ${entrepreneur}`,
      text: `
Hello ${partner},

A new entrepreneur has been referred to you.

• Name:        ${entrepreneur}
• Business:    ${business}
• Date:        ${date}
• Initials:    ${initials}
• Stage:       ${stage}
• Notes:       ${notes || '–'}

Please follow up with them at your earliest convenience.

Thank you,
The Founder Tracker Team
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Partner notified by email' }),
    };
  } catch (err) {
    console.error('Error sending partner notification:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send partner notification', details: err.message }),
    };
  }
};
