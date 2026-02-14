import nodemailer from 'nodemailer';

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export const sendOtpEmail = async ({ to, name, otp }) => {
  const mailer = getTransporter();
  const from = process.env.GMAIL_FROM || process.env.GMAIL_USER;

  await mailer.sendMail({
    from,
    to,
    subject: 'Your EduRoute verification code',
    text: `Hi ${name}, your EduRoute OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your EduRoute account</h2>
        <p>Hi ${name},</p>
        <p>Your one-time password is:</p>
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">${otp}</p>
        <p>This code expires in <strong>5 minutes</strong>.</p>
      </div>
    `,
  });
};
