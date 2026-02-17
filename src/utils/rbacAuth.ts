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

export const saveAuthSession = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem('eduroute:is-authenticated', 'true');
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('eduroute:is-authenticated');
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const getAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getAuthToken() && getAuthUser());
