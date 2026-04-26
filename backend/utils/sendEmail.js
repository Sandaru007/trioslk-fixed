const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Verify connection configuration
    await transporter.verify();
    console.log('✓ Email transporter verified successfully');

    // 2. Define the email options
    const mailOptions = {
      from: `TrioSLK Academy <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;