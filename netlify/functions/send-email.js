const nodemailer = require('nodemailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function validatePayload(payload) {
  if (!payload) return 'Request body is required.';

  const { to, subject, text, html } = payload;

  if (!to || !EMAIL_REGEX.test(String(to))) {
    return 'A valid recipient email is required.';
  }

  if (!subject || String(subject).trim().length < 3) {
    return 'Subject must be at least 3 characters.';
  }

  if (!text && !html) {
    return 'Provide at least one of `text` or `html`.';
  }

  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const requiredVars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'];
  const missingVars = requiredVars.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    return json(500, {
      ok: false,
      error: `Missing required env vars: ${missingVars.join(', ')}`,
    });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body.' });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return json(400, { ok: false, error: validationError });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.GMAIL_USER,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo,
    });

    return json(200, {
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error('send-email failed', error);
    return json(500, {
      ok: false,
      error: 'Email delivery failed. Check Gmail credentials and App Password.',
    });
  }
};
