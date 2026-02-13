import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  MessageSquare,
  Trophy,
  Gift,
  Briefcase,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

const NAVIGATION = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmaps', path: '/roadmaps', icon: Map },
  { name: 'Assessments', path: '/assessments', icon: ClipboardCheck },
  { name: 'AI Buddy', path: '/buddy', icon: MessageSquare },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Rewards', path: '/rewards', icon: Gift },
  { name: 'Internships', path: '/internships', icon: Briefcase },
  { name: 'Growth', path: '/events', icon: TrendingUp },
];

export const MainLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  const navItemClass = (isActive: boolean) => `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
    isActive
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40'
      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

  const ThemeButtons = () => (
    <div className="space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Theme</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setThemeMode('light')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
            themeMode === 'light'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
          White (Light)
        </button>
        <button
          onClick={() => setThemeMode('dark')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
            themeMode === 'dark'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="h-3.5 w-3.5" />
          Black (Dark)
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">E</div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">EDUROUTE</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link key={item.path} to={item.path} className={navItemClass(isActive)}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3 dark:border-slate-800">
          <ThemeButtons />
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all dark:text-slate-300 dark:hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 z-40 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">E</div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">EDUROUTE</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors dark:hover:bg-slate-800 dark:text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-30 pt-16 overflow-y-auto dark:bg-slate-900">
          <nav className="p-4 space-y-2">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={navItemClass(isActive)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <ThemeButtons />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 dark:text-slate-100">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
