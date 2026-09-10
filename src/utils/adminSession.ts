const ADMIN_SESSION_KEY = 'eduroute.adminSession';
const ADMIN_PASSWORD_HASH = '89263fa24598520bf17b7762ffb5304dc5b776e9827a6fcb96d8697d52d00a62';

const isBrowser = typeof window !== 'undefined';

const hashPassword = async (password: string): Promise<string> => {
  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const validateAdminPassword = async (password: string): Promise<boolean> => {
  if (!isBrowser) {
    return false;
  }

  const normalizedPassword = password.trim();
  if (!normalizedPassword) {
    return false;
  }

  const hashedPassword = await hashPassword(normalizedPassword);
  return hashedPassword === ADMIN_PASSWORD_HASH;
};

export const setAdminSession = (isActive: boolean) => {
  if (!isBrowser) {
    return;
  }

  localStorage.setItem(ADMIN_SESSION_KEY, isActive ? 'active' : 'inactive');
};

export const isAdminSessionActive = (): boolean => {
  if (!isBrowser) {
    return false;
  }

  return localStorage.getItem(ADMIN_SESSION_KEY) === 'active';
};

export const clearAdminSession = () => {
  if (!isBrowser) {
    return;
  }

  localStorage.removeItem(ADMIN_SESSION_KEY);
};
