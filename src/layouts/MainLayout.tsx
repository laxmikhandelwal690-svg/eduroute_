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
  X
} from 'lucide-react';
import { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-indigo-50 to-cyan-50 p-3 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.45)] backdrop-blur-md md:min-h-[calc(100vh-3rem)]">
        <aside className="hidden w-24 flex-col border-r border-slate-100/80 bg-white/70 px-4 py-6 lg:flex">
          <Link
            to="/dashboard"
            className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-300 to-violet-300 text-base font-black text-white shadow-sm"
          >
            E
          </Link>

          <nav className="flex flex-1 flex-col items-center gap-3">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                  title={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-slate-100 pt-5">
            <Link
              to="/admin"
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={() => window.location.href = '/'}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-rose-100 hover:text-rose-500"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </aside>

        <div className="lg:hidden fixed left-3 right-3 top-3 z-40 flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-200 text-sm font-black text-indigo-700">E</div>
            <span className="text-sm font-semibold text-slate-700">EduRoute</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-white/95 pt-20 lg:hidden">
            <nav className="space-y-2 px-4">
              {NAVIGATION.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
