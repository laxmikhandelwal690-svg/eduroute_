import { getOtpRules, sanitizeUser, verifyOtpForUser } from './_lib/authStore.mjs';

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
    const { email, otp } = JSON.parse(event.body || '{}');
    if (!email?.trim() || !otp?.trim()) {
      return json(400, { error: 'Email and OTP are required.' });
    }

    const result = await verifyOtpForUser(email, otp);
    if (result.error) {
      return json(400, { error: result.error, attemptsLeft: result.attemptsLeft ?? null });
    }

    return json(200, {
      message: 'Email verified successfully.',
      user: sanitizeUser(result.user),
      rules: getOtpRules(),
    });
  } catch (error) {
    console.error('auth-verify-otp error', error);
    return json(500, { error: 'Failed to verify OTP.' });
  }
};
