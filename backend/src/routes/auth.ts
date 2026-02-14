import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { ApiError, asyncHandler } from '../middleware/error';
import { assertRequiredEnv, isValidEmail } from '../utils/validators';

const router = express.Router();

interface LocalUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isVerified: boolean;
}

interface OTPRecord {
  otpHash: string;
  expiresAt: number;
  attempts: number;
  resendAvailableAt: number;
}

// Local in-memory data store for development mode.
const users: LocalUser[] = [];
const otpStore = new Map<string, OTPRecord>();

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts. Please try again later.' },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many OTP requests. Please try again later.' },
});

router.use(authLimiter);

const signToken = (user: Pick<LocalUser, 'id' | 'email'>) => {
  const jwtSecret = assertRequiredEnv('JWT_SECRET');
  return jwt.sign({ id: user.id, email: user.email, role: 'student' }, jwtSecret, { expiresIn: '1d' });
};

router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password || !name) {
    throw new ApiError(400, 'Name, email, and password are required.');
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters long.');
  }

  const normalizedEmail = email.toLowerCase();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new ApiError(409, 'Email is already registered.');
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user: LocalUser = {
    id: Date.now().toString(),
    email: normalizedEmail,
    name,
    passwordHash,
    isVerified: false,
  };
  users.push(user);

  const token = signToken(user);
  res.status(201).json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }

  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  const token = signToken(user);
  res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
}));

router.post('/otp/send', otpLimiter, asyncHandler(async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email || !isValidEmail(email)) {
    throw new ApiError(400, 'A valid email is required.');
  }

  const normalizedEmail = email.toLowerCase();
  const existingOtp = otpStore.get(normalizedEmail);
  const now = Date.now();

  if (existingOtp && existingOtp.resendAvailableAt > now) {
    throw new ApiError(429, 'Please wait before requesting another OTP.');
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otpCode, 10);

  otpStore.set(normalizedEmail, {
    otpHash,
    expiresAt: now + 5 * 60 * 1000,
    attempts: 0,
    resendAvailableAt: now + 60 * 1000,
  });

  // In production, send otpCode through an email provider using secure API keys from env vars.
  res.json({
    success: true,
    message: 'OTP sent successfully.',
    ...(process.env.NODE_ENV === 'production' ? {} : { devOtp: otpCode }),
  });
}));

router.post('/otp/verify', asyncHandler(async (req, res) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

  if (!email || !otp || !isValidEmail(email)) {
    throw new ApiError(400, 'Valid email and OTP are required.');
  }

  const normalizedEmail = email.toLowerCase();
  const record = otpStore.get(normalizedEmail);
  if (!record) {
    throw new ApiError(400, 'No active OTP found. Request a new OTP.');
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    throw new ApiError(400, 'OTP expired. Request a new OTP.');
  }

  if (record.attempts >= 5) {
    otpStore.delete(normalizedEmail);
    throw new ApiError(429, 'Too many invalid OTP attempts. Request a new OTP.');
  }

  const isValidOtp = await bcrypt.compare(otp, record.otpHash);
  if (!isValidOtp) {
    record.attempts += 1;
    otpStore.set(normalizedEmail, record);
    throw new ApiError(401, 'Invalid OTP.');
  }

  otpStore.delete(normalizedEmail);

  const user = users.find((u) => u.email === normalizedEmail);
  if (user) {
    user.isVerified = true;
  }

  res.json({ success: true, message: 'OTP verified successfully.' });
}));

export default router;
