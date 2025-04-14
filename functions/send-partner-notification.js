const nodemailer = require('nodemailer');

exports.handler = async function (event) {
  console.log('Received request:', event.body);
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { entrepreneurName, businessName, partnerEmail, partnerName, notes } = JSON.parse(event.body);
    console.log('Parsed data:', { entrepreneurName, businessName, partnerEmail, partnerName, notes });
    
    if (!entrepreneurName || !businessName || !partnerEmail || !partnerName) {
      console.log('Missing required fields');
      return { statusCode: 400, body: 'Missing required fields' };
    }

    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      // Don't log the password, just check if it exists
      hasPassword: !!process.env.SMTP_PASS
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Enable debug mode
      logger: true // Enable logging
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw verifyError;
    }

    const mailOptions = {
      from: `"Founder Tracker" <${process.env.SMTP_USER}>`,
      to: partnerEmail,
      subject: `New Entrepreneur Referral: ${entrepreneurName}`,
      text: `Hello ${partnerName},\n\nYou have received a new entrepreneur referral:\n\nEntrepreneur: ${entrepreneurName}\nBusiness: ${businessName}\n\nNotes: ${notes || 'No additional notes provided.'}\n\nPlease log in to the Founder Tracker platform to view more details.\n\nBest regards,\nFounder Tracker Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Entrepreneur Referral</h2>
          <p>Hello ${partnerName},</p>
          <p>You have received a new entrepreneur referral:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Entrepreneur:</strong> ${entrepreneurName}</p>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Notes:</strong> ${notes || 'No additional notes provided.'}</p>
          </div>
          <p>Please log in to the Founder Tracker platform to view more details.</p>
          <p>Best regards,<br>Founder Tracker Team</p>
        </div>
      `,
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Server response:', info.response);
    console.log('Message ID:', info.messageId);
    console.log('Envelope:', info.envelope);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        messageId: info.messageId,
        envelope: info.envelope
      }),
    };
  } catch (err) {
    console.error('Error sending email:', err);
    console.error('Error stack:', err.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email', 
        details: err.message,
        stack: err.stack
      }),
    };
  }
}; 
