import { findUserByEmail, sanitizeUser, verifyHash } from './_lib/authStore.mjs';

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
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email?.trim() || !password?.trim()) {
      return json(400, { error: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return json(401, { error: 'Invalid email or password.' });
    }

    const validPassword = await verifyHash(password, user.passwordHash);
    if (!validPassword) {
      return json(401, { error: 'Invalid email or password.' });
    }

    if (!user.emailVerified) {
      return json(403, { error: 'Please verify your email before logging in.', requiresOtp: true });
    }

    return json(200, {
      message: 'Login successful.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('auth-login error', error);
    return json(500, { error: 'Failed to login.' });
  }
};
