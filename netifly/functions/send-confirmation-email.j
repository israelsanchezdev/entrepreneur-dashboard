// netlify/functions/send-confirmation-email.js

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

exports.handler = async function (event, context) {
  // Allow only POST requests.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the JSON body.
    const { email, token } = JSON.parse(event.body);
    if (!email || !token) {
      return { statusCode: 400, body: 'Missing email or token' };
    }

    // Build the confirmation URL.
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

    const messageData = {
      from: `Your App <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: 'Confirm Your Registration',
      text: `Hello,

Thank you for registering at Your App!
Please confirm your registration by clicking the following link:
${confirmationUrl}

If you did not sign up, please ignore this email.`,
    };

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    console.log('Mailgun response:', response);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Confirmation email sent' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
