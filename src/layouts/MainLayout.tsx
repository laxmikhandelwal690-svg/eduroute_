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
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../utils/cn';

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
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 18 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

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

  const navLinkClass = (isActive: boolean) => cn(
    'group relative overflow-hidden rounded-2xl border px-4 py-3 text-sm font-bold transition-all duration-300',
    isActive
      ? 'active-nav border-white/20 bg-white/15 text-white shadow-[0_12px_40px_rgba(79,70,229,0.42)]'
      : 'border-white/10 bg-white/5 text-[var(--text-secondary)] hover:border-white/20 hover:bg-white/10 hover:text-[var(--text-primary)] hover:shadow-[0_12px_34px_rgba(15,23,42,0.18)]'
  );

  return (
    <div
      className="relative flex h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99,102,241,0.18), transparent 18%), radial-gradient(circle at 15% 15%, rgba(56,189,248,0.18), transparent 20%), linear-gradient(135deg, rgba(2,6,23,0.03), transparent 55%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[10%] top-[10%] h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[12%] right-[14%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <aside className="relative hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.78))] px-4 py-5 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl lg:flex">
        <div className="absolute inset-0 rounded-r-[2rem] border-r border-white/10 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.22),transparent_30%)]" />
        <div className="relative mb-5 flex items-center justify-between gap-2 rounded-[28px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="gradient-border-box h-12 w-12 rounded-2xl">
              <div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-slate-950 text-xl font-black text-white">E</div>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Premium</span>
              <span className="text-xl font-black text-white">EDUROUTE</span>
            </div>
          </Link>
          <Link to="/profile" className="group" aria-label="Open profile dashboard">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-white/15 bg-[var(--accent-gradient)] text-white flex items-center justify-center font-bold shadow-[0_10px_30px_rgba(79,70,229,0.35)] group-hover:scale-105">
              {profileIdentity.photo ? <img src={profileIdentity.photo} alt={profileIdentity.name} className="h-full w-full object-cover" /> : profileIdentity.initial}
            </div>
          </Link>
        </div>

        <nav className="relative flex-1 space-y-2 overflow-y-auto px-1 py-3">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link key={item.path} to={item.path} className={navLinkClass(isActive)}>
                <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_58%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex items-center gap-3">
                  <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-white/80 group-hover:text-white')} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative space-y-2 border-t border-white/10 pt-4">
          <Link to="/admin-login" className={navLinkClass(false)}>
            <span className="relative flex items-center gap-3"><span className="inline-flex h-5 w-5 items-center justify-center font-black">A</span>Admin</span>
          </Link>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm font-bold text-[var(--text-secondary)] hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-200"
          >
            <span className="flex items-center gap-3"><LogOut className="h-5 w-5" />Logout</span>
          </button>
        </div>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[rgba(15,23,42,0.82)] px-4 py-3 shadow-lg shadow-slate-950/10 backdrop-blur-2xl lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="gradient-border-box h-9 w-9 rounded-xl"><div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-slate-950 text-lg font-black text-white">E</div></div>
          <span className="text-lg font-black text-white">EDUROUTE</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/profile" className="h-9 w-9 overflow-hidden rounded-full border border-white/15 bg-[var(--accent-gradient)] text-white flex items-center justify-center font-bold" aria-label="Open profile dashboard">
            {profileIdentity.photo ? <img src={profileIdentity.photo} alt={profileIdentity.name} className="h-full w-full object-cover" /> : profileIdentity.initial}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-30 overflow-y-auto bg-[rgba(2,6,23,0.92)] pt-20 backdrop-blur-2xl lg:hidden">
          <nav className="space-y-2 p-4">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass(isActive)}>
                  <span className="relative flex items-center gap-3"><item.icon className="h-5 w-5" />{item.name}</span>
                </Link>
              );
            })}
            <Link to="/admin-login" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass(false)}>
              <span className="relative flex items-center gap-3"><span className="inline-flex h-5 w-5 items-center justify-center font-black">A</span>Admin</span>
            </Link>
          </nav>
        </motion.div>
      )}

      <main className="relative flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
