import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();
  const trackClasses = isDark
    ? 'border-white/15 bg-slate-950 text-white shadow-[0_18px_40px_rgba(2,6,23,0.45)]'
    : 'border-slate-300/90 bg-white text-slate-900 shadow-[0_18px_40px_rgba(148,163,184,0.28)]';
  const thumbClasses = isDark ? 'bg-white text-slate-950' : 'bg-slate-950 text-white';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`theme-toggle group relative inline-flex h-11 w-20 shrink-0 items-center overflow-hidden rounded-full border p-1 ${trackClasses} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute bottom-1 left-1 top-1 flex aspect-square items-center justify-center rounded-full shadow-lg transition-all duration-300 ${thumbClasses} ${
          isDark ? 'left-[calc(100%-2.5rem)]' : 'left-1'
        }`}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className={`flex w-full items-center justify-between px-1 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/75' : 'text-slate-700'}`}>
        <Sun className="h-3.5 w-3.5" />
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
};
