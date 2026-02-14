export const AUTH_KEY = 'eduroute_auth';

export const markLoggedIn = () => {
  localStorage.setItem(AUTH_KEY, 'true');
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === 'true';
