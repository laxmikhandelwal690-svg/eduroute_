import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  Clock,
  FlaskConical,
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { getAuthUser } from '../../utils/rbacAuth';
import {
  expressInterest,
  FACULTY_TYPES,
  readFacultyInterests,
  readFacultyOpportunities,
  type FacultyOpportunity,
  type FacultyOpportunityType,
} from '../../utils/facultyStore';

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

/**
 * Student-facing list of faculty / academician opportunities.
 * Faculty posts via /faculty (login role). Students only browse + express interest here.
 */
export const FacultyOpportunities = () => {
  const user = getAuthUser();
  const [opps, setOpps] = useState<FacultyOpportunity[]>(() => readFacultyOpportunities());
  const [filter, setFilter] = useState<'All' | FacultyOpportunityType>('All');
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setOpps(readFacultyOpportunities());
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onFocus);
    };
  }, [refresh]);

  const filtered = useMemo(() => {
    if (filter === 'All') return opps;
    return opps.filter((o) => o.type === filter);
  }, [opps, filter]);

  const interestedIds = useMemo(() => {
    const email = user?.email?.toLowerCase() || '';
    if (!email) return new Set<string>();
    return new Set(
      readFacultyInterests()
        .filter((i) => i.email.toLowerCase() === email)
        .map((i) => i.opportunityId),
    );
  }, [user?.email, tick]);

  const handleInterest = (oppId: string) => {
    if (!user) return;
    expressInterest(oppId, {
      name: user.name || 'Student',
      email: user.email,
      institution: user.institutionName || 'Student',
      department: 'Student',
    });
    refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <Link
        to="/internships"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Internships
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Faculty &amp; research
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            <GraduationCap className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            Faculty opportunities
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            FDPs, faculty internships, industrial training, consultancy, and collaborative research posted by
            academicians and partners. Browse here as a student — faculty post via Faculty login.
          </p>
        </div>
      </div>

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

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No faculty opportunities in this category yet.
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
                  <Check className="h-3.5 w-3.5" /> Interested
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
      </div>
    </div>
  );
};

export default FacultyOpportunities;
