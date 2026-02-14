import { canResendOtp, findUserByEmail, generateOtp, getOtpRules, setOtpForUser } from './_lib/authStore.mjs';
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
    const { email } = JSON.parse(event.body || '{}');
    if (!email?.trim()) {
      return json(400, { error: 'Email is required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return json(404, { error: 'User not found.' });
    }

    const resend = canResendOtp(user);
    if (!resend.ok) {
      return json(429, {
        error: 'Please wait before requesting a new OTP.',
        retryAfterSeconds: Math.ceil(resend.waitMs / 1000),
      });
    }

    const otp = generateOtp();
    await setOtpForUser(email, otp);
    await sendOtpEmail({ to: user.email, name: user.name, otp });

    return json(200, {
      message: 'A new OTP has been sent.',
      rules: getOtpRules(),
    });
  } catch (error) {
    console.error('auth-resend-otp error', error);
    return json(500, { error: 'Failed to resend OTP.' });
  }
};
