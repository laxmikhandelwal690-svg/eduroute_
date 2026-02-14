import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../services/auth';

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'eduroute.auth.user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => readStoredUser());

  const setUser = (nextUser: AuthUser | null) => {
    setUserState(nextUser);

    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, setUser, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
