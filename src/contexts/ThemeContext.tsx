import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'eduroute-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const readThemeStorage = (): Theme | null => {
  try {
    if (typeof window === 'undefined') return null;

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === 'dark' || saved === 'light') {
      return saved;
    }

    return null;
  } catch {
    return null;
  }
};

const getSystemTheme = (): Theme => {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
  } catch {
    // Ignore browser API errors
  }

  return 'light';
};

const getInitialTheme = (): Theme => {
  return readThemeStorage() ?? getSystemTheme();
};

const saveTheme = (theme: Theme) => {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Ignore storage errors
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle(
          'dark',
          theme === 'dark'
        );
      }

      saveTheme(theme);
    } catch {
      // Never crash the application because of theme handling
    }
  }, [theme]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    let mediaQuery: MediaQueryList;

    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }

    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedTheme = readThemeStorage();

      if (!savedTheme) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', onSystemThemeChange);
      };
    }

    return;
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === 'dark',

      toggleTheme: () => {
        setThemeState((current) =>
          current === 'dark' ? 'light' : 'dark'
        );
      },

      setTheme: (newTheme: Theme) => {
        setThemeState(newTheme);
      },
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
};
