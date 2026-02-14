import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), '.netlify', 'state');
const DATA_FILE = path.join(DATA_DIR, 'auth-db.json');

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

const defaultDb = {
  users: []
};

const safeJson = (value) => JSON.stringify(value, null, 2);

export const now = () => Date.now();

export const getOtpRules = () => ({
  expiryMs: OTP_EXPIRY_MS,
  maxAttempts: MAX_OTP_ATTEMPTS,
  resendCooldownMs: RESEND_COOLDOWN_MS,
});

const ensureDbFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, safeJson(defaultDb), 'utf8');
  }
};

export const readDb = async () => {
  await ensureDbFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
};

export const writeDb = async (db) => {
  await ensureDbFile();
  await fs.writeFile(DATA_FILE, safeJson(db), 'utf8');
};

export const normalizeEmail = (email) => email.trim().toLowerCase();

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
});

export const generateOtp = () => {
  return randomInt(100000, 1000000).toString();
};

export const hashOtp = async (otp) => bcrypt.hash(otp, 10);
export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const verifyHash = async (plain, hash) => bcrypt.compare(plain, hash);

export const createUser = async ({ name, email, password }) => {
  const db = await readDb();
  const normalizedEmail = normalizeEmail(email);

  if (db.users.find((user) => user.email === normalizedEmail)) {
    return { error: 'Email is already registered.' };
  }

  const createdAt = new Date().toISOString();
  const user = {
    id: randomBytes(12).toString('hex'),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    emailVerified: false,
    otp: null,
    createdAt,
  };

  db.users.push(user);
  await writeDb(db);

  return { user };
};

export const setOtpForUser = async (email, otpCode) => {
  const db = await readDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return { error: 'User not found.' };
  }

  const issuedAt = now();
  user.otp = {
    hash: await hashOtp(otpCode),
    attempts: 0,
    createdAt: issuedAt,
    expiresAt: issuedAt + OTP_EXPIRY_MS,
    resendAvailableAt: issuedAt + RESEND_COOLDOWN_MS,
  };

  await writeDb(db);
  return { user };
};

export const findUserByEmail = async (email) => {
  const db = await readDb();
  return db.users.find((user) => user.email === normalizeEmail(email));
};

export const verifyOtpForUser = async (email, otp) => {
  const db = await readDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return { error: 'User not found.' };
  }

  if (!user.otp) {
    return { error: 'No OTP request found. Please resend OTP.' };
  }

  const current = now();
  if (current > user.otp.expiresAt) {
    user.otp = null;
    await writeDb(db);
    return { error: 'OTP has expired. Please request a new one.' };
  }

  if (user.otp.attempts >= MAX_OTP_ATTEMPTS) {
    user.otp = null;
    await writeDb(db);
    return { error: 'Maximum OTP attempts exceeded. Please resend OTP.' };
  }

  const valid = await verifyHash(otp, user.otp.hash);
  if (!valid) {
    user.otp.attempts += 1;
    await writeDb(db);
    return {
      error: `Invalid OTP. ${MAX_OTP_ATTEMPTS - user.otp.attempts} attempt(s) left.`,
      attemptsLeft: MAX_OTP_ATTEMPTS - user.otp.attempts,
    };
  }

  user.emailVerified = true;
  user.otp = null;
  await writeDb(db);

  return { user };
};

export const canResendOtp = (user) => {
  if (!user.otp?.resendAvailableAt) {
    return { ok: true, waitMs: 0 };
  }

  const waitMs = user.otp.resendAvailableAt - now();
  if (waitMs > 0) {
    return { ok: false, waitMs };
  }

  return { ok: true, waitMs: 0 };
};
