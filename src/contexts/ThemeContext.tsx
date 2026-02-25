import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'eduroute-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return getSystemTheme();
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY);
      if (!savedTheme) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', onSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', onSystemThemeChange);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme: () => setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
      setTheme: setThemeState,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};

