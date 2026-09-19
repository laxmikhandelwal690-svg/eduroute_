import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  Plus,
  MapPin,
  Clock,
  Users,
  BookOpen,
  Briefcase,
  FlaskConical,
  Building2,
  Check,
  Sparkles,
} from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../../utils/rbacAuth';
import {
  addFacultyOpportunity,
  expressInterest,
  FACULTY_TYPES,
  readFacultyInterests,
  readFacultyOpportunities,
  type FacultyInterest,
  type FacultyOpportunity,
  type FacultyOpportunityType,
} from '../../utils/facultyStore';
import { ThemeToggle } from '../../components/ThemeToggle';

const typeIcon = (type: FacultyOpportunityType) => {
  switch (type) {
    case 'FDP':
      return <BookOpen className="h-4 w-4" />;
    case 'Faculty Internship':
      return <Briefcase className="h-4 w-4" />;
    case 'Industrial Training':
      return <Building2 className="h-4 w-4" />;
    case 'Consultancy':
      return <Users className="h-4 w-4" />;
    case 'Research Collaboration':
      return <FlaskConical className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const typeBadge = (type: FacultyOpportunityType) => {
  const map: Record<FacultyOpportunityType, string> = {
    FDP: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
    'Faculty Internship': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
    'Industrial Training': 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    Consultancy: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    'Research Collaboration': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  };
  return map[type];
};

export const FacultyWorkspace = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [opps, setOpps] = useState<FacultyOpportunity[]>(() => readFacultyOpportunities());
  const [interests, setInterests] = useState<FacultyInterest[]>(() => readFacultyInterests());
  const [filter, setFilter] = useState<'All' | FacultyOpportunityType>('All');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'FDP' as FacultyOpportunityType,
    organizer: '',
    location: '',
    duration: '',
    mode: 'Hybrid',
    domain: '',
    description: '',
    seats: '',
  });

  const refresh = useCallback(() => {
    setOpps(readFacultyOpportunities());
    setInterests(readFacultyInterests());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (filter === 'All') return opps;
    return opps.filter((o) => o.type === filter);
  }, [opps, filter]);

  const myInterests = useMemo(() => {
    const email = user?.email?.toLowerCase() || '';
    return interests.filter((i) => i.email.toLowerCase() === email);
  }, [interests, user?.email]);

  const interestedIds = useMemo(
    () => new Set(myInterests.map((i) => i.opportunityId)),
    [myInterests],
  );

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.organizer.trim()) {
      setFormError('Title and organizer are required.');
      return;
    }
    setBusy(true);
    try {
      addFacultyOpportunity({
        title: form.title.trim(),
        type: form.type,
        organizer: form.organizer.trim(),
        location: form.location.trim() || 'TBA',
        duration: form.duration.trim() || 'Flexible',
        mode: form.mode.trim() || 'Hybrid',
        domain: form.domain.trim() || 'General',
        description: form.description.trim(),
        seats: form.seats.trim() || undefined,
      });
      setForm({
        title: '',
        type: 'FDP',
        organizer: '',
        location: '',
        duration: '',
        mode: 'Hybrid',
        domain: '',
        description: '',
        seats: '',
      });
      setShowForm(false);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleInterest = (oppId: string) => {
    if (!user) return;
    const row = expressInterest(oppId, {
      name: user.name || 'Faculty',
      email: user.email,
      institution: user.institutionName || 'Institution',
      department: 'Academic',
    });
    if (!row) return;
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="hidden sm:inline">
                EDUROUTE <span className="font-semibold text-violet-600 dark:text-violet-400">Faculty</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden text-right text-xs sm:block">
              <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'Faculty'}</p>
              <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Academician portal
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              Faculty opportunities
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Explore FDPs, faculty internships, industrial training, consultancy, and collaborative research —
              aligned with SIH academia–industry collaboration.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" /> Post opportunity
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handlePost}
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2"
          >
            {formError && (
              <p
                className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                role="alert"
              >
                {formError}
              </p>
            )}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. FDP on Generative AI for Educators"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as FacultyOpportunityType })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {FACULTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Organizer</label>
              <input
                required
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                placeholder="AICTE / Industry partner"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Delhi / Remote"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="5 Days / 4 Weeks"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode</label>
              <input
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                placeholder="Hybrid / Online / On-site"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Domain</label>
              <input
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="AI, Cyber, Data…"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Outcomes, eligibility, benefits…"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError('');
                }}
                className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {busy ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          </form>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {(['All', ...FACULTY_TYPES] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                filter === t
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="space-y-4 lg:col-span-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Open opportunities</h2>
            {filtered.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No opportunities in this category yet.
              </p>
            )}
            {filtered.map((o) => (
              <article
                key={o.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${typeBadge(o.type)}`}
                    >
                      {typeIcon(o.type)} {o.type}
                    </span>
                    <h3 className="mt-2 text-base font-black text-slate-900 dark:text-white">{o.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{o.organizer}</p>
                  </div>
                  {interestedIds.has(o.id) ? (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <Check className="h-3.5 w-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInterest(o.id)}
                      className="rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-violet-700"
                    >
                      Express interest
                    </button>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{o.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {o.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {o.duration} · {o.mode}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-800">{o.domain}</span>
                  {o.seats && <span>{o.seats} seats</span>}
                </div>
              </article>
            ))}
          </section>

          <aside className="space-y-4 lg:col-span-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">My applications</h2>
            {myInterests.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                You have not applied yet. Express interest on an opportunity to track it here.
              </p>
            ) : (
              myInterests.map((i) => {
                const opp = opps.find((o) => o.id === i.opportunityId);
                return (
                  <div
                    key={i.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {opp?.title || 'Opportunity'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {opp?.type} · {i.status}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Applied {new Date(i.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            )}

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-xs leading-relaxed text-violet-900 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-200">
              <p className="font-bold">SIH · Academician side</p>
              <p className="mt-1 opacity-90">
                Faculty internships, FDPs, industrial training, consultancy, and research collaboration in one place.
                Demo data is stored locally.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default FacultyWorkspace;
