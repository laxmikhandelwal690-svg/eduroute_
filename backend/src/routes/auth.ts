import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { OTP, User } from '../models';

const router = express.Router();

const BCRYPT_ROUNDS = 12;
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_LENGTH = 6;
const MAX_VERIFY_ATTEMPTS = 5;

const pendingRegisterRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many signup attempts. Please try again later.' },
});

const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many OTP requests. Please try again later.' },
});

const verifyRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many verification attempts. Please try again later.' },
});

const createOtpCode = () => crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');

const getOtpHtmlTemplate = (name: string, otpCode: string) => `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 24px; color: #fff;">
      <h1 style="margin: 0; font-size: 20px;">EDUROUTE Email Verification</h1>
      <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 14px;">Secure OTP verification</p>
    </div>
    <div style="padding: 24px; color: #0f172a;">
      <p style="margin-top: 0;">Hi ${name},</p>
      <p>Use the OTP below to verify your email address. This code expires in <strong>5 minutes</strong>.</p>
      <div style="font-size: 28px; letter-spacing: 8px; font-weight: 700; text-align: center; margin: 20px 0; background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 12px; padding: 16px;">
        ${otpCode}
      </div>
      <p style="font-size: 13px; color: #475569;">If you did not request this email, you can safely ignore it.</p>
    </div>
  </div>
`;

const sendOtpEmail = async (toEmail: string, name: string, otpCode: string) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || 'no-reply@eduroute.app';

  const transporter = smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })
    : nodemailer.createTransport({ jsonTransport: true });

  const result = await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: 'Your EDUROUTE verification code',
    text: `Your EDUROUTE verification code is ${otpCode}. It expires in 5 minutes.`,
    html: getOtpHtmlTemplate(name, otpCode),
  });

  if ('message' in result) {
    console.log(`OTP email preview for ${toEmail}:`, result.message.toString());
  }
};

const issueAuthToken = (userId: string) => jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

router.post('/register', pendingRegisterRateLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      isVerified: false,
    });

    return res.status(201).json({
      success: true,
      token: issueAuthToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verificationStatus: user.isVerified ? 'verified' : 'pending',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, error: 'Unable to register user' });
  }
});

router.post('/login', pendingRegisterRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user?.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.json({
      success: true,
      token: issueAuthToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verificationStatus: user.isVerified ? 'verified' : 'pending',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Unable to login user' });
  }
});

router.post('/otp/send', otpRateLimiter, async (req, res) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }

    const latestOtp = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (latestOtp?.lastSentAt) {
      const cooldownRemainingMs = RESEND_COOLDOWN_MS - (Date.now() - latestOtp.lastSentAt.getTime());
      if (cooldownRemainingMs > 0) {
        return res.status(429).json({
          success: false,
          error: 'OTP recently sent. Please wait before requesting another code.',
          cooldownRemainingSeconds: Math.ceil(cooldownRemainingMs / 1000),
        });
      }
    }

    const otpCode = createOtpCode();
    const hashedCode = await bcrypt.hash(otpCode, BCRYPT_ROUNDS);

    await OTP.create({
      email: normalizedEmail,
      codeHash: hashedCode,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
      attemptCount: 0,
      lastSentAt: new Date(),
      lockedUntil: null,
    });

    await sendOtpEmail(normalizedEmail, user.name, otpCode);

    return res.json({
      success: true,
      message: 'OTP sent to email',
      expiresInSeconds: OTP_TTL_MS / 1000,
      cooldownSeconds: RESEND_COOLDOWN_MS / 1000,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, error: 'Unable to send OTP' });
  }
});

router.post('/otp/verify', verifyRateLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string };

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, error: 'OTP must be a 6-digit code' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: 'Email is already verified' });
    }

    const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(404).json({ success: false, error: 'No OTP found. Request a new code.' });
    }

    if (otpRecord.lockedUntil && otpRecord.lockedUntil.getTime() > Date.now()) {
      return res.status(429).json({
        success: false,
        error: 'Too many invalid OTP attempts. Please request a new OTP.',
        retryAfterSeconds: Math.ceil((otpRecord.lockedUntil.getTime() - Date.now()) / 1000),
      });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'OTP expired. Request a new code.' });
    }

    const isOtpMatch = await bcrypt.compare(otp, otpRecord.codeHash);
    if (!isOtpMatch) {
      otpRecord.attemptCount += 1;
      if (otpRecord.attemptCount >= MAX_VERIFY_ATTEMPTS) {
        otpRecord.lockedUntil = new Date(Date.now() + OTP_TTL_MS);
      }
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        error: 'Invalid OTP code',
        remainingAttempts: Math.max(0, MAX_VERIFY_ATTEMPTS - otpRecord.attemptCount),
      });
    }

    user.isVerified = true;
    await user.save();

    await OTP.deleteMany({ email: normalizedEmail });

    return res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verificationStatus: 'verified',
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, error: 'Unable to verify OTP' });
  }
});

export default router;
