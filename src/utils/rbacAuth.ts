export type UserRole = 'student' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verificationStatus?: string;
};

const TOKEN_KEY = 'eduroute:auth-token';
const USER_KEY = 'eduroute:auth-user';

const readStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage access errors (e.g. private mode restrictions)
  }
};

const removeStorage = (key: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage access errors (e.g. private mode restrictions)
  }
};

export const saveAuthSession = (token: string, user: AuthUser) => {
  writeStorage(TOKEN_KEY, token);
  writeStorage(USER_KEY, JSON.stringify(user));
  writeStorage('eduroute:is-authenticated', 'true');
};

export const clearAuthSession = () => {
  removeStorage(TOKEN_KEY);
  removeStorage(USER_KEY);
  removeStorage('eduroute:is-authenticated');
};

export const getAuthToken = () => readStorage(TOKEN_KEY) || '';

export const getAuthUser = (): AuthUser | null => {
  const raw = readStorage(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getAuthToken() && getAuthUser());
