const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1. Create a transporter with error handling
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('✓ Email transporter verified successfully');

    // 2. Define the email options
    const mailOptions = {
      from: `TrioSLK Academy <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message, // We use HTML so the email looks nice!
    };

    // 3. Actually send the email
    const response = await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent successfully to ${options.email}. Message ID: ${response.messageId}`);
    
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    // Log full error for debugging
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    // Return error but allow caller to decide how to handle
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;