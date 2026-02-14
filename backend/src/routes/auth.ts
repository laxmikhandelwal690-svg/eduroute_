import crypto from 'crypto';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OTP, User } from '../models';

const router = express.Router();

const OTP_TTL_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);
const OTP_LENGTH = 6;
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 45);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

const signToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return jwt.sign({ id: userId, role }, secret, { expiresIn: '1d' });
};

const normalizeEmail = (email?: string) => String(email || '').trim().toLowerCase();

const makeOtpCode = () => Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join('');

const hashOtp = (email: string, code: string, purpose: string) =>
  crypto.createHash('sha256').update(`${normalizeEmail(email)}:${purpose}:${code}`).digest('hex');

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password || !name) {
    return res.status(400).json({ success: false, error: 'name, email, and password are required' });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email is already in use' });
  }

  const passwordHash = await bcrypt.hash(String(password), 12);
  const user = await User.create({ name: String(name).trim(), email: normalizedEmail, password: passwordHash });

  const token = signToken(String(user._id), user.role);
  return res.status(201).json({
    success: true,
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ success: false, error: 'email and password are required' });
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user?.password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const passwordOk = await bcrypt.compare(String(password), user.password);
  if (!passwordOk) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = signToken(String(user._id), user.role);
  return res.json({
    success: true,
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified },
  });
});

router.post('/otp/request', async (req, res) => {
  const { email, purpose = 'signup' } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return res.status(400).json({ success: false, error: 'email is required' });
  }

  const now = new Date();
  const latestOtp = await OTP.findOne({ email: normalizedEmail, purpose }).sort({ createdAt: -1 });
  if (latestOtp?.createdAt) {
    const elapsedSeconds = (now.getTime() - latestOtp.createdAt.getTime()) / 1000;
    if (elapsedSeconds < OTP_RESEND_COOLDOWN_SECONDS) {
      return res.status(429).json({
        success: false,
        error: `OTP already sent. Retry in ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds)}s`,
      });
    }
  }

  const code = makeOtpCode();
  const codeHash = hashOtp(normalizedEmail, code, String(purpose));
  const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);

  await OTP.create({
    email: normalizedEmail,
    codeHash,
    purpose: String(purpose),
    expiresAt,
    maxAttempts: OTP_MAX_ATTEMPTS,
  });

  return res.status(201).json({
    success: true,
    data: {
      expiresAt,
      ...(process.env.NODE_ENV !== 'production' ? { devCode: code } : {}),
    },
  });
});

router.post('/otp/verify', async (req, res) => {
  const { email, code, purpose = 'signup' } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !code) {
    return res.status(400).json({ success: false, error: 'email and code are required' });
  }

  const otp = await OTP.findOne({
    email: normalizedEmail,
    purpose: String(purpose),
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otp) {
    return res.status(400).json({ success: false, error: 'OTP expired or invalid' });
  }

  if (otp.attempts >= otp.maxAttempts) {
    return res.status(429).json({ success: false, error: 'Maximum OTP attempts exceeded' });
  }

  const inputHash = hashOtp(normalizedEmail, String(code), String(purpose));
  const isMatch = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(otp.codeHash));

  if (!isMatch) {
    otp.attempts += 1;
    await otp.save();
    return res.status(400).json({ success: false, error: 'Invalid OTP code' });
  }

  otp.consumedAt = new Date();
  await otp.save();
  await User.updateOne({ email: normalizedEmail }, { $set: { isVerified: true } });

  return res.json({ success: true, data: { verified: true } });
});

export default router;
