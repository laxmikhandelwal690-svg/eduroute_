import { createUser, generateOtp, getOtpRules, sanitizeUser, setOtpForUser } from './_lib/authStore.mjs';
import { sendOtpEmail } from './_lib/mailer.mjs';

const json = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  try {
    const { name, email, password } = JSON.parse(event.body || '{}');

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return json(400, { error: 'Name, email, and password are required.' });
    }

    if (password.length < 8) {
      return json(400, { error: 'Password must be at least 8 characters long.' });
    }

    const created = await createUser({ name, email, password });
    if (created.error) {
      return json(409, { error: created.error });
    }

    const otp = generateOtp();
    await setOtpForUser(email, otp);
    await sendOtpEmail({ to: email, name: name.trim(), otp });

    return json(201, {
      message: 'Signup successful. OTP sent to email.',
      email,
      rules: getOtpRules(),
      user: sanitizeUser(created.user),
    });
  } catch (error) {
    console.error('auth-signup error', error);
    return json(500, { error: 'Failed to sign up user.' });
  }
};
