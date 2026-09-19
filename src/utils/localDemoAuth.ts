/**
 * Offline / demo auth when MySQL is not configured on Netlify.
 * Accounts live in localStorage only — never used when API succeeds.
 */

import type { AuthUser } from './rbacAuth';

const STORE_KEY = 'eduroute:local-demo-users-v1';

type DemoAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  verificationStatus: string;
};

function readAccounts(): DemoAccount[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: DemoAccount[]) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify(accounts));
  } catch {
    // private mode
  }
}

export function isAuthDbConfigError(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes('auth database not configured') ||
    m.includes('mysql_url') ||
    m.includes('mysql_host') ||
    (m.includes('cannot reach auth') && m.includes('mysql')) ||
    m.includes('unable to connect to server')
  );
}

export function localDemoRegister(payload: {
  name: string;
  email: string;
  password: string;
}): { token: string; user: AuthUser } {
  const email = payload.email.trim().toLowerCase();
  const name = payload.name.trim();
  const password = payload.password;
  if (!name || !email || !password) {
    throw new Error('Name, email and password are required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const accounts = readAccounts();
  if (accounts.some((a) => a.email === email)) {
    throw new Error('Email already registered');
  }

  const account: DemoAccount = {
    id: `local-${Date.now()}`,
    name,
    email,
    password,
    role: 'student',
    verificationStatus: 'pending',
  };
  accounts.push(account);
  writeAccounts(accounts);

  const user: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: 'student',
    verificationStatus: account.verificationStatus,
  };
  return { token: `local-demo-${account.id}`, user };
}

export function localDemoLogin(payload: {
  email: string;
  password: string;
  role: 'student' | 'admin';
}): { token: string; user: AuthUser } {
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;
  const accounts = readAccounts();

  // Built-in demo admin (matches existing Login fallback)
  if (payload.role === 'admin' && email === 'admin@gmail.com' && password === 'timepass') {
    const user: AuthUser = {
      id: 'local-admin-1',
      name: 'EduRoute Admin',
      email: 'admin@gmail.com',
      role: 'admin',
      verificationStatus: 'verified',
    };
    return { token: `local-demo-admin`, user };
  }

  const account = accounts.find((a) => a.email === email);
  if (!account || account.password !== password) {
    throw new Error('Invalid credentials');
  }
  if (account.role !== payload.role) {
    throw new Error(`Unauthorized for ${payload.role} login`);
  }

  const user: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    verificationStatus: account.verificationStatus,
  };
  return { token: `local-demo-${account.id}`, user };
}
