import { Outlet, Link, useLocation } from 'react-router-dom';
import { getAuthUser } from '../utils/rbacAuth';
import { getStoredUserProfile } from '../utils/userProfile';
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
import { useMemo, useState } from 'react';

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

  const profileIdentity = useMemo(() => {
    const authUser = getAuthUser();
    const storedProfile = getStoredUserProfile();

    const name = authUser?.name || storedProfile?.name || 'Learner';
    const photo = storedProfile?.avatar || '';

    return {
      name,
      photo,
      initial: name.trim().charAt(0).toUpperCase() || 'L',
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-2">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">E</div>
            <span className="text-xl font-bold text-slate-900">EDUROUTE</span>
          </Link>
          <Link to="/profile" className="group" aria-label="Open profile dashboard">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105">
              {profileIdentity.photo ? <img src={profileIdentity.photo} alt={profileIdentity.name} className="h-full w-full object-cover" /> : profileIdentity.initial}
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 z-40 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">E</div>
          <span className="text-lg font-bold text-slate-900">EDUROUTE</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/profile" className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-indigo-600 text-white flex items-center justify-center font-bold" aria-label="Open profile dashboard">
            {profileIdentity.photo ? <img src={profileIdentity.photo} alt={profileIdentity.name} className="h-full w-full object-cover" /> : profileIdentity.initial}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-30 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;