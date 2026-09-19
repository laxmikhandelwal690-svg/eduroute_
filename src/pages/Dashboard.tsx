import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Flame,
  Star,
  Trophy,
  Play,
  Clock,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Target,
  Briefcase,
  FileText,
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';
import { readOnboarding } from '../utils/onboardingStore';
import {
  readApplications,
  statusBadgeClass,
  type InternshipApplication,
} from '../utils/internshipApplications';

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const firstName = getDisplayFirstName() || 'there';
  const enrolledCourses = COURSES.filter((c) => currentUser.enrolledCourses.includes(c.id)).slice(0, 2);
  const recommendedCourses = COURSES.filter((c) => !currentUser.enrolledCourses.includes(c.id)).slice(0, 4);
  const onboarding = readOnboarding();
  const gapCount = onboarding.missingSkills?.length || 0;
  const hasSkillProfile = Boolean(onboarding.completedAt);
  const [applications, setApplications] = useState<InternshipApplication[]>(() => readApplications());

  useEffect(() => {
    const refresh = () => setApplications(readApplications());
    window.addEventListener('eduroute:applications-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('eduroute:applications-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const stats = [
    {
      label: 'Completed Courses',
      value: '12',
      delta: '+3 this month',
      deltaPositive: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Learning Streak',
      value: '7 days',
      delta: '+2',
      deltaPositive: true,
      icon: Flame,
      iconBg: 'bg-violet-100 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Total Points',
      value: '2,850',
      delta: '+320',
      deltaPositive: true,
      icon: Star,
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Rank',
      value: '#12',
      delta: 'in your batch',
      deltaPositive: true,
      icon: Trophy,
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="er-page space-y-8">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] min-h-[180px] md:min-h-[200px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1600&q=85')",
            filter: 'brightness(1.18) contrast(1.12) saturate(1.2)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/45 to-transparent dark:from-slate-950/92 dark:via-slate-950/70 dark:to-slate-950/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/30 dark:from-slate-950/40 dark:via-transparent dark:to-slate-950/50"
          aria-hidden
        />
        <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="max-w-xl">
            <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="mr-1">👋</span> Welcome back,
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              {firstName}! <span className="inline-block">👋</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              You've completed 45% of your current path. Keep it up!
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="er-progress flex-1 max-w-xs">
                <div className="er-progress-bar" style={{ width: '45%' }} />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">45%</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)]/80 px-5 py-4 shadow-sm backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20">
              <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Verify College ID</div>
              <p className="text-xs text-[var(--text-secondary)]">Unlock 50% discount on certifications</p>
            </div>
            <Link to="/verify-college" className="er-btn er-btn-primary ml-2 shrink-0 !px-4 !py-2 text-xs">
              Verify
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-20 dark:opacity-15" aria-hidden>
          <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMid slice" fill="none">
            <path d="M0 200 L80 120 L140 160 L220 60 L280 110 L340 40 L400 90 L400 200 Z" className="fill-indigo-200/60 dark:fill-indigo-900/40" />
            <path d="M0 200 L60 150 L120 180 L200 90 L260 130 L320 70 L400 120 L400 200 Z" className="fill-indigo-300/50 dark:fill-indigo-800/30" />
            <circle cx="340" cy="48" r="18" className="fill-violet-400/30 dark:fill-violet-500/20" />
          </svg>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="er-stat-card">
            <div className={`er-stat-icon ${s.iconBg}`}>
              <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[var(--text-secondary)]">{s.label}</div>
              <div className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{s.value}</div>
              <div className={`mt-1 text-xs font-medium ${s.deltaPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                {s.deltaPositive && s.delta.startsWith('+') ? (
                  <span className="inline-flex items-center gap-0.5">
                    <span className="text-[10px]">↑</span> {s.delta}
                  </span>
                ) : (
                  s.delta
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section>
        <Link
          to="/skill-profile"
          className="er-card er-card-hover group flex flex-col gap-4 p-5 transition-all sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                Student Skill Profile
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {hasSkillProfile
                  ? gapCount > 0
                    ? `You have ${gapCount} skill gap${gapCount === 1 ? '' : 's'} marked — view strengths, tracks, and next steps.`
                    : 'View your strengths, target tracks, and recommended next steps.'
                  : 'Complete onboarding to unlock strengths, gaps, and a personal path.'}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
            Open profile <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Continue Learning</h2>
          <Link
            to="/courses"
            className="text-sm font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => <ContinueCard key={course.id} course={course} progress={40} />)
          ) : (
            <div className="er-card col-span-full p-8 text-center text-[var(--text-secondary)]">
              No enrolled courses yet.{' '}
              <Link to="/browse" className="font-semibold text-[var(--accent)]">
                Browse courses
              </Link>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
            <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            Recommended for You
          </h2>
          <Link
            to="/browse"
            className="text-sm font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
          >
            Explore all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DsaSheetCard />
          {recommendedCourses.slice(0, 3).map((course, i) => (
            <RecommendCard key={course.id} course={course} badgeIndex={i + 1} />
          ))}
        </div>
      </section>

      <Link
        to="/cv-builder"
        className="mb-8 mt-6 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">Build CV</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Free templates · step-by-step editor · download PDF for internships & placements.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white sm:self-center">
          Open builder <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {applications.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
              <Briefcase className="h-5 w-5 text-[var(--accent)]" />
              My Applications
            </h2>
            <Link
              to="/internships"
              className="text-sm font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              View internships <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="er-card divide-y divide-[var(--border-default)] overflow-hidden p-0">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.internshipId}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold text-[var(--text-primary)]">{app.role}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {app.company} · {app.stipend}
                  </div>
                </div>
                <span
                  className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold sm:self-center ${statusBadgeClass(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

function ContinueCard({ course, progress }: { course: Course; progress: number }) {
  return (
    <Link to={`/course/${course.id}`} className="er-card er-card-hover group flex gap-4 overflow-hidden p-4 transition-all">
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-secondary)]">
        <img src={course.thumbnail} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <span className="absolute left-2 top-2 rounded-md bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          In Progress
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-violet-600 opacity-0 shadow transition group-hover:opacity-100">
            <Play className="h-4 w-4 fill-current" />
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {course.category} · {progress}% DONE
        </div>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-[var(--text-primary)]">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{course.description}</p>
        <div className="mt-auto pt-3">
          <div className="er-progress">
            <div className="er-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 text-right text-[10px] font-medium text-[var(--text-muted)]">{progress}%</div>
        </div>
      </div>
    </Link>
  );
}

function DsaSheetCard() {
  return (
    <Link to="/dsa-sheet" className="er-card er-card-hover group flex flex-col overflow-hidden transition-all">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
          alt="DSA practice"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="er-badge absolute left-3 top-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          FREE
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> 4 HOURS
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9
          </span>
        </div>
        <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">DSA Beginner Sheet</h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
          Start your DSA journey with structured problems and guided practice.
        </p>
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition group-hover:bg-emerald-600">
            Open Sheet <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const BADGES = [
  { label: 'FREE', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { label: 'BEGINNER', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  { label: 'INTERMEDIATE', className: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' },
  { label: 'POPULAR', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
];

function RecommendCard({ course, badgeIndex }: { course: Course; badgeIndex: number }) {
  const badge = BADGES[badgeIndex % BADGES.length];
  const weeks = course.duration?.includes('hour')
    ? `${Math.max(4, Math.round(parseInt(course.duration) / 10) || 6)} weeks`
    : course.duration || '6 weeks';

  return (
    <Link to={course.link || `/course/${course.id}`} className="er-card er-card-hover group flex flex-col overflow-hidden transition-all">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        <img src={course.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className={`er-badge absolute left-3 top-3 ${badge.className}`}>{badge.label}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)]">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-[11px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {weeks}
          </span>
          <span className="inline-flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" /> {course.level}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:bg-[var(--accent)] group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Dashboard;
