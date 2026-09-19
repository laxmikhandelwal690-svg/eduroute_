import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Building2 } from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../utils/rbacAuth';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * College institution shell — placements only (no admin nav).
 */
export const CollegeLayout = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const institution =
    user?.institutionName || user?.name || 'Institution';

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-[var(--bg-card)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link to="/college/placements" className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black tracking-tight">EDUROUTE · College</div>
              <div className="truncate text-xs text-[var(--text-muted)]">{institution}</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CollegeLayout;
