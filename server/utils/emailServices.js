const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};

const sendPasswordResetEmail = async (user, resetURL) => {
  const subject = 'Password Reset Request';
  const text = `Hello ${user.name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetURL}\n\nIf you did not request this, ignore this email.`;
  const html = `<p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetURL}">${resetURL}</a>
                <p>If you did not request this, ignore this email.</p>`;

  await sendEmail(user.email, subject, text, html);
};

module.exports = { sendEmail, sendPasswordResetEmail };