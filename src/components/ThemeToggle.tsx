import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`theme-toggle group relative inline-flex h-11 w-20 items-center rounded-full border border-white/20 p-1 ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg transition-transform duration-300 ${
          isDark ? 'translate-x-9' : 'translate-x-0'
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="flex w-full items-center justify-between px-1 text-[10px] font-black uppercase tracking-widest text-white/80">
        <Sun className="h-3.5 w-3.5" />
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
};

