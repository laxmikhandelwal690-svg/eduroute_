import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Database,
  Layers,
  Map,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import {
  INTEREST_OPTIONS,
  InterestTrack,
  interestLabel,
  readOnboarding,
  TRACK_RECOMMENDATIONS,
  type GapAnswer,
  type OnboardingProfile,
} from '../utils/onboardingStore';
import { getAuthUser } from '../utils/rbacAuth';
import { getDisplayFirstName } from '../utils/userProfile';

/** Map onboarding skill → course CTA (existing app routes). */
const SKILL_COURSE: Record<
  string,
  { courseTitle: string; to: string }
> = {
  'Project building': { courseTitle: 'Frontend & project path', to: '/roadmaps/frontend' },
  'Programming fundamentals': { courseTitle: 'Fullstack fundamentals', to: '/roadmaps/fullstack' },
  'Data structures': { courseTitle: 'DSA from Scratch (Beginner Sheet)', to: '/dsa-sheet' },
  'Git & GitHub': { courseTitle: 'Backend Developer roadmap', to: '/roadmaps/backend' },
  APIs: { courseTitle: 'Backend & API path', to: '/roadmaps/backend' },
  'Practical experience': { courseTitle: 'Internships board', to: '/internships' },
  'Networking basics': { courseTitle: 'Cybersecurity roadmap', to: '/roadmaps/cybersecurity' },
  Linux: { courseTitle: 'Cybersecurity roadmap', to: '/roadmaps/cybersecurity' },
  'Cryptography basics': { courseTitle: 'Cybersecurity roadmap', to: '/roadmaps/cybersecurity' },
  'Hands-on security practice': { courseTitle: 'Assessments & labs', to: '/assessments' },
  'Web vulnerabilities': { courseTitle: 'Cybersecurity roadmap', to: '/roadmaps/cybersecurity' },
  'OS & network security': { courseTitle: 'Cybersecurity roadmap', to: '/roadmaps/cybersecurity' },
  Spreadsheets: { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
  SQL: { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
  'Python/R for analysis': { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
  Visualization: { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
  Statistics: { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
  'Data cleaning': { courseTitle: 'Data Analyst roadmap', to: '/roadmaps/data-analyst' },
};

type SkillCard = {
  skill: string;
  score: number;
  label: 'Good' | 'Improve' | 'Gap';
  question?: string;
  courseTitle: string;
  to: string;
};

function scoreForAnswer(answer: 'yes' | 'no', index: number): number {
  // Deterministic spread so UI looks like the mock (not flat 0/10)
  if (answer === 'yes') return Math.round((7.2 + (index % 3) * 0.5) * 10) / 10;
  return Math.round((3.5 + (index % 3) * 0.5) * 10) / 10;
}

function labelForScore(score: number): 'Good' | 'Improve' | 'Gap' {
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Improve';
  return 'Gap';
}

function buildSkillCards(gapAnswers: GapAnswer[], missingSkills: string[]): SkillCard[] {
  const cards: SkillCard[] = [];
  const seen = new Set<string>();

  gapAnswers.forEach((a, i) => {
    const score = scoreForAnswer(a.answer, i);
    const course = SKILL_COURSE[a.skill] || {
      courseTitle: 'Browse recommended path',
      to: '/roadmaps',
    };
    seen.add(a.skill);
    cards.push({
      skill: a.skill,
      score,
      label: labelForScore(score),
      question: a.question,
      courseTitle: course.courseTitle,
      to: course.to,
    });
  });

  missingSkills.forEach((skill, i) => {
    if (seen.has(skill)) return;
    const score = scoreForAnswer('no', i + 3);
    const course = SKILL_COURSE[skill] || { courseTitle: 'Open roadmap', to: '/roadmaps' };
    cards.push({
      skill,
      score,
      label: 'Gap',
      courseTitle: course.courseTitle,
      to: course.to,
    });
  });

  return cards.sort((a, b) => a.score - b.score);
}

function overallFromCards(cards: SkillCard[]): number {
  if (!cards.length) return 0;
  const avg = cards.reduce((s, c) => s + c.score, 0) / cards.length;
  return Math.round(avg * 10) / 10;
}

function categoryBreakdown(cards: SkillCard[], tracks: InterestTrack[]) {
  const tech = cards.filter((c) =>
    /data structures|apis|project|networking|sql|visualization|system/i.test(c.skill),
  );
  const prog = cards.filter((c) =>
    /programming|python|linux|git|spreadsheet|cryptography/i.test(c.skill),
  );
  const tools = cards.filter((c) =>
    /git|practical|hands-on|os &|data cleaning|web vuln/i.test(c.skill),
  );
  const soft = cards.filter((c) => /practical experience|statistics/i.test(c.skill));

  const avg = (list: SkillCard[]) =>
    list.length ? Math.round((list.reduce((s, c) => s + c.score, 0) / list.length) * 10) / 10 : 6.5;

  // Soft skills default when track is career-oriented
  const softScore = soft.length ? avg(soft) : tracks.length ? 7.2 : 6.5;

  return [
    { name: 'Technical Skills', score: avg(tech.length ? tech : cards), color: 'bg-violet-500', icon: Code2 },
    { name: 'Programming Languages', score: avg(prog.length ? prog : cards), color: 'bg-blue-500', icon: Layers },
    { name: 'Tools & DevOps', score: avg(tools.length ? tools : cards), color: 'bg-emerald-500', icon: Wrench },
    { name: 'Soft Skills', score: softScore, color: 'bg-amber-500', icon: Users },
  ];
}

function progressColor(label: 'Good' | 'Improve' | 'Gap') {
  if (label === 'Good') return 'bg-violet-500';
  if (label === 'Improve') return 'bg-amber-500';
  return 'bg-rose-500';
}

function badgeClass(label: 'Good' | 'Improve' | 'Gap') {
  if (label === 'Good')
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300';
  if (label === 'Improve')
    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
  return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
}

export const SkillProfile = () => {
  const [profile, setProfile] = useState<OnboardingProfile>(() => readOnboarding());
  const auth = getAuthUser();
  const firstName = getDisplayFirstName() || 'Learner';

  useEffect(() => {
    const refresh = () => setProfile(readOnboarding());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const cards = useMemo(
    () => buildSkillCards(profile.gapAnswers || [], profile.missingSkills || []),
    [profile.gapAnswers, profile.missingSkills],
  );
  const overall = overallFromCards(cards);
  const tracks = profile.interests || [];
  const categories = useMemo(() => categoryBreakdown(cards, tracks), [cards, tracks]);
  const hasData = Boolean(profile.completedAt) && (tracks.length > 0 || cards.length > 0);
  const updatedLabel = profile.completedAt
    ? new Date(profile.completedAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const pathRecs = useMemo(() => {
    const list: { title: string; blurb: string; to: string; tag: string }[] = [];
    const seen = new Set<string>();
    const sources = tracks.length ? tracks : (['software'] as InterestTrack[]);
    sources.forEach((t) => {
      (TRACK_RECOMMENDATIONS[t] || []).forEach((r) => {
        if (seen.has(r.to)) return;
        seen.add(r.to);
        list.push(r);
      });
    });
    return list;
  }, [tracks]);

  const ringPct = Math.min(100, (overall / 10) * 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (ringPct / 100) * circumference;

  const encouragement =
    overall >= 7.5
      ? `Strong foundation, ${firstName}! Keep shipping projects and applying.`
      : overall >= 5.5
        ? `Good progress, ${firstName}! You have a solid base — close the gaps below for internship readiness.`
        : `Let's build up, ${firstName}. Focus on the Gap skills first, then re-check.`;

  return (
    <div className="er-page space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Target className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
              Skill Gap Analysis
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            See how your current skills match industry requirements and discover what you need to learn
            next. Scores come from your onboarding MCQ
            {auth?.email ? (
              <>
                {' '}
                · saved for <span className="font-semibold text-[var(--text-primary)]">{auth.email}</span>
              </>
            ) : null}
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/profile"
            className="er-card inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)]"
          >
            <Users className="h-4 w-4 text-[var(--accent)]" />
            <span>
              Your Skill Profile
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">
                Last updated: {updatedLabel}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </Link>
          <Link
            to="/onboarding"
            className="er-btn er-btn-primary inline-flex items-center gap-2 !px-4 !py-2.5 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            {hasData ? 'Retake MCQ' : 'Start skill check'}
          </Link>
        </div>
      </div>

      {!hasData ? (
        <section className="er-card p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-[var(--accent)]" />
          <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">No analysis yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            Complete the interest + skill MCQ after signup. Answers are stored with your login email on
            this device and power this page plus Buddy AI guidance for internships.
          </p>
          <Link to="/onboarding" className="er-btn er-btn-primary mt-6 inline-flex items-center gap-2">
            Start skill check <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      ) : (
        <>
          {/* Score + categories */}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="er-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="relative mx-auto h-36 w-36 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-[var(--border-default)]"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="url(#skillRing)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                  />
                  <defs>
                    <linearGradient id="skillRing" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[var(--text-primary)]">{overall}</span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">/10</span>
                </div>
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Overall Skill Score
                </p>
                <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                  {overall >= 7.5
                    ? `Strong path, ${firstName}!`
                    : overall >= 5.5
                      ? `Good progress, ${firstName}!`
                      : `Building up, ${firstName}`}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{encouragement}</p>
                {tracks.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {tracks.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent)]"
                      >
                        {interestLabel(t)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="er-card p-6">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Skill Category Breakdown</h3>
              <ul className="mt-4 space-y-4">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span className="inline-flex items-center gap-2 font-medium text-[var(--text-primary)]">
                        <cat.icon className="h-4 w-4 text-[var(--accent)]" />
                        {cat.name}
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">{cat.score}/10</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${Math.min(100, (cat.score / 10) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Skill gap details */}
          <section>
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
                <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                Skill Gap Details
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Detailed skills from your MCQ and recommended courses to improve. Gaps link to DSA sheet,
                roadmaps, or internships.
              </p>
            </div>
            {cards.length === 0 ? (
              <div className="er-card p-6 text-sm text-[var(--text-secondary)]">
                No skill answers yet. Retake the MCQ to score each skill.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <article key={card.skill} className="er-card flex flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                          {/data structure|dsa/i.test(card.skill) ? (
                            <Layers className="h-4 w-4" />
                          ) : /cyber|network|linux|crypto|vuln/i.test(card.skill) ? (
                            <Shield className="h-4 w-4" />
                          ) : /sql|data|python|stat|visual/i.test(card.skill) ? (
                            <Database className="h-4 w-4" />
                          ) : (
                            <Code2 className="h-4 w-4" />
                          )}
                        </div>
                        <h3 className="truncate font-semibold text-[var(--text-primary)]">{card.skill}</h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {card.score}/10
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass(card.label)}`}>
                          {card.label}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                      <div
                        className={`h-full rounded-full ${progressColor(card.label)}`}
                        style={{ width: `${(card.score / 10) * 100}%` }}
                      />
                    </div>
                    <Link
                      to={card.to}
                      className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/50 px-3 py-2.5 text-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                    >
                      <span className="inline-flex min-w-0 items-center gap-2 text-[var(--text-secondary)]">
                        <BookOpen className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                        <span className="truncate">
                          <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                            Recommended Course
                          </span>
                          <span className="font-medium text-[var(--text-primary)]">{card.courseTitle}</span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Personalized learning path */}
          <section className="er-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
                  <Map className="h-5 w-5 text-[var(--accent)]" />
                  Personalized Learning Path
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Based on your skill gaps and track
                  {tracks.includes('software')
                    ? ' (SDE: DSA, Frontend, Backend)'
                    : tracks.includes('cybersecurity')
                      ? ' (Cybersecurity)'
                      : tracks.includes('data_analyst')
                        ? ' (Data Analyst)'
                        : ''}
                  , here is what to do next.
                </p>
              </div>
              <Link
                to={tracks.includes('software') ? '/roadmaps/fullstack' : '/roadmaps'}
                className="er-btn er-btn-primary inline-flex shrink-0 items-center gap-2 !px-4 !py-2.5 text-sm"
              >
                View Full Roadmap <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pathRecs.map((step) => (
                <Link
                  key={step.to + step.title}
                  to={step.to}
                  className="group flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/40 p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    {step.to.includes('dsa') ? (
                      <Code2 className="h-5 w-5" />
                    ) : step.to.includes('internship') ? (
                      <Briefcase className="h-5 w-5" />
                    ) : (
                      <Map className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                        {step.title}
                      </span>
                      <span className="rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--accent)]">
                        {step.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{step.blurb}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                </Link>
              ))}
              <Link
                to="/buddy"
                className="group flex items-start gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/40 p-4 transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                    Ask Buddy AI
                  </span>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    Your MCQ strengths & gaps are in Buddy context for internship/job readiness tips.
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SkillProfile;
