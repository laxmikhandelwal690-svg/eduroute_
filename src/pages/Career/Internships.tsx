import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Filter,
  Clock,
  Building2,
  IndianRupee,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Target,
  Check,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { readOnboarding, type InterestTrack } from '../../utils/onboardingStore';
import {
  applyToInternship,
  getApplication,
  hasApplied,
  readApplications,
  statusBadgeClass,
  type InternshipApplication,
} from '../../utils/internshipApplications';
import { industryPostingsAsInternships } from '../../utils/industryStore';
import { BuildCvCta } from '../../components/BuildCvCta';

export const INTERNSHIPS = [
  {
    id: '1',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India (Remote)',
    stipend: '\u20b925,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '2 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    tags: ['React', 'TypeScript', 'Tailwind'],
    sector: 'software',
    verified: true,
    fastTrack: true,
    employeeCount: '500-1000 Employees',
    companylink: 'https://techflow.ai',
  },
  {
    id: '2',
    role: 'Backend Engineering Intern',
    company: 'DataScale AI',
    location: 'Pune, India',
    stipend: '\u20b930,000 / mo',
    type: 'Full-time',
    duration: '3 Months',
    posted: '5 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DS',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    sector: 'software',
    verified: true,
    fastTrack: false,
    employeeCount: '200-500 Employees',
    companylink: 'https://datascale.ai',
  },
  {
    id: '3',
    role: 'Cybersecurity Analyst Intern',
    company: 'ShieldOps',
    location: 'Delhi NCR, India',
    stipend: '\u20b927,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '4 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
    tags: ['Linux', 'Networking', 'SIEM', 'Security'],
    sector: 'cybersecurity',
    verified: true,
    fastTrack: true,
    employeeCount: '200-500 Employees',
    companylink: 'https://shieldops.sec',
  },
  {
    id: '4',
    role: 'Data Analyst Intern',
    company: 'InsightHive',
    location: 'Gurgaon, India',
    stipend: '\u20b926,000 / mo',
    type: 'Full-time',
    duration: '5 Months',
    posted: '6 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    tags: ['SQL', 'Python', 'Visualization', 'Excel'],
    sector: 'data',
    verified: true,
    fastTrack: true,
    employeeCount: '500-1000 Employees',
    companylink: 'https://insighthive.ai',
  },
];

const SKILL_TO_TAG_HINTS: Record<string, string[]> = {
  'project building': ['react', 'typescript', 'node.js'],
  'programming fundamentals': ['react', 'typescript', 'node.js', 'python'],
  linux: ['docker', 'linux', 'security'],
  sql: ['postgresql', 'sql', 'python'],
};

const INTEREST_TAG_BOOSTS: Record<InterestTrack, string[]> = {
  software: ['react', 'typescript', 'node.js', 'docker'],
  cybersecurity: ['linux', 'networking', 'security', 'siem'],
  data_analyst: ['sql', 'python', 'visualization', 'excel'],
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function getStudentSkillProfile() {
  const profile = readOnboarding();
  const strengths = (profile.gapAnswers || []).filter((a) => a.answer === 'yes').map((a) => normalize(a.skill));
  const missing = (profile.missingSkills || []).map(normalize);
  const strengthTokens = new Set<string>();
  for (const skill of strengths) {
    strengthTokens.add(skill);
    (SKILL_TO_TAG_HINTS[skill] || []).forEach((h) => strengthTokens.add(h));
  }
  for (const interest of profile.interests || []) {
    (INTEREST_TAG_BOOSTS[interest] || []).forEach((h) => strengthTokens.add(h));
  }
  const missingTokens = new Set<string>();
  for (const skill of missing) {
    missingTokens.add(skill);
    (SKILL_TO_TAG_HINTS[skill] || []).forEach((h) => missingTokens.add(h));
  }
  return {
    hasProfile: Boolean(profile.completedAt),
    strengths,
    missing,
    strengthTokens,
    missingTokens,
    interests: profile.interests || [],
  };
}

function computeMatchScore(tags: string[], profile: ReturnType<typeof getStudentSkillProfile>): number {
  if (!tags.length) return profile.hasProfile ? 50 : 0;
  if (!profile.hasProfile) return 0;
  let covered = 0;
  let missingHits = 0;
  for (const tag of tags) {
    const t = normalize(tag);
    const strengthHit =
      profile.strengthTokens.has(t) ||
      [...profile.strengthTokens].some((s) => t.includes(s) || s.includes(t));
    if (strengthHit) covered += 1;
    const missingHit =
      profile.missingTokens.has(t) ||
      [...profile.missingTokens].some((s) => t.includes(s) || s.includes(t));
    if (missingHit && !strengthHit) missingHits += 1;
  }
  let pct = Math.round((covered / tags.length) * 100);
  pct = Math.max(0, pct - missingHits * 10);
  return Math.min(100, pct);
}

function matchBadgeClasses(score: number) {
  if (score >= 70) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  }
  if (score >= 40) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  }
  return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
}

type Internship = (typeof INTERNSHIPS)[number] & { fromIndustry?: boolean };
type FilterKey = 'all' | 'frontend' | 'backend' | 'remote' | 'cyber' | 'data' | 'design';

function matchesSectorFilter(job: Internship, filter: FilterKey) {
  if (filter === 'all') return true;
  if (filter === 'remote') return job.location.toLowerCase().includes('remote');
  if (filter === 'frontend') return job.tags.some((t) => /react|typescript|tailwind|figma/i.test(t));
  if (filter === 'backend') return job.tags.some((t) => /node|postgres|docker|mongo|api/i.test(t));
  if (filter === 'cyber') return job.sector === 'cybersecurity' || job.tags.some((t) => /security|linux|siem|network/i.test(t));
  if (filter === 'data') return job.sector === 'data' || job.tags.some((t) => /sql|python|visual|excel|power bi/i.test(t));
  if (filter === 'design') return job.sector === 'design' || job.tags.some((t) => /figma|prototyp/i.test(t));
  return true;
}

function MyApplicationsPanel() {
  const [apps, setApps] = useState<InternshipApplication[]>(() => readApplications());
  useEffect(() => {
    const refresh = () => setApps(readApplications());
    window.addEventListener('eduroute:applications-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('eduroute:applications-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  if (apps.length === 0) return null;
  return (
    <section className="mb-10 rounded-[28px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">My Applications</h2>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{apps.length} total</span>
      </div>
      <ul className="space-y-3">
        {apps.map((app) => (
          <li
            key={app.internshipId}
            className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="min-w-0">
              <div className="truncate font-bold text-slate-900 dark:text-white">{app.role}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {app.company} \u00b7 Applied {new Date(app.appliedAt).toLocaleDateString()}
              </div>
            </div>
            <span className={`shrink-0 self-start rounded-full px-3 py-1 text-[11px] font-bold sm:self-center ${statusBadgeClass(app.status)}`}>
              {app.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InternshipCard({
  job,
  matchScore,
  showScore,
}: {
  job: Internship;
  matchScore: number;
  showScore: boolean;
}) {
  const [application, setApplication] = useState<InternshipApplication | null>(() => getApplication(job.id) || null);
  useEffect(() => {
    const refresh = () => setApplication(getApplication(job.id) || null);
    window.addEventListener('eduroute:applications-updated', refresh);
    return () => window.removeEventListener('eduroute:applications-updated', refresh);
  }, [job.id]);
  const applied = Boolean(application) || hasApplied(job.id);
  const handleApply = () => {
    if (applied) return;
    const app = applyToInternship({
      internshipId: job.id,
      role: job.role,
      company: job.company,
      location: job.location,
      stipend: job.stipend,
      logo: job.logo,
    });
    if (app) setApplication(app);
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-slate-100 dark:bg-slate-800 md:h-20 md:w-20">
          <img src={job.logo} alt={job.company} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {job.role}
            </h3>
            {showScore && (
              <div className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${matchBadgeClasses(matchScore)}`}>
                <Target className="h-3 w-3" />
                {matchScore}% MATCH
              </div>
            )}
            {job.verified && (
              <div className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </div>
            )}
            {job.fastTrack && (
              <div className="flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <Zap className="h-3 w-3" /> FAST TRACK
              </div>
            )}
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to={`/companies/${job.id}`} className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Building2 className="h-4 w-4" /> {job.company}
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {job.location}
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> {job.stipend}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> {job.duration}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-6 border-t border-slate-50 pt-6 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">Posted</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{job.posted}</div>
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={applied}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-lg transition-all lg:w-auto ${
              applied
                ? 'cursor-not-allowed bg-emerald-600 text-white opacity-95'
                : 'bg-slate-900 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            {applied ? (
              <>
                <Check className="h-4 w-4" /> Applied
              </>
            ) : (
              <>
                Apply Now <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export const Internships = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [industryTick, setIndustryTick] = useState(0);
  const skillProfile = useMemo(() => getStudentSkillProfile(), []);

  useEffect(() => {
    const onUp = () => setIndustryTick((t) => t + 1);
    window.addEventListener('eduroute:industry-updated', onUp);
    window.addEventListener('storage', onUp);
    window.addEventListener('focus', onUp);
    return () => {
      window.removeEventListener('eduroute:industry-updated', onUp);
      window.removeEventListener('storage', onUp);
      window.removeEventListener('focus', onUp);
    };
  }, []);

  const scoredInternships = useMemo(() => {
    const industryJobs = industryPostingsAsInternships() as unknown as Internship[];
    const combined = [...industryJobs, ...INTERNSHIPS];
    return combined.map((job) => ({
      job,
      matchScore: computeMatchScore(job.tags, skillProfile),
    }));
  }, [skillProfile, industryTick]);

  const filtered = useMemo(() => {
    return scoredInternships.filter(({ job }) => {
      if (!matchesSectorFilter(job, filter)) return false;
      if (!query.trim()) return true;
      const searchable = `${job.role} ${job.company} ${job.location} ${job.tags.join(' ')} ${job.sector}`.toLowerCase();
      return searchable.includes(query.trim().toLowerCase());
    });
  }, [filter, query, scoredInternships]);

  const recommended = useMemo(() => {
    if (!skillProfile.hasProfile) return [];
    return [...scoredInternships].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [scoredInternships, skillProfile.hasProfile]);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'cyber', label: 'Cyber' },
    { key: 'data', label: 'Data' },
    { key: 'design', label: 'Design' },
    { key: 'remote', label: 'Remote' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Internships</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Browse openings matched to your skill profile when available. Includes openings posted by industry partners.
        </p>
      </div>

      <Link
        to="/faculty-opportunities"
        className="mb-8 flex flex-col gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-5 transition hover:border-violet-300 hover:shadow-md dark:border-violet-900/50 dark:from-violet-950/40 dark:to-indigo-950/30 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">Faculty & Research opportunities</p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              FDPs, faculty internships, industrial training, consultancy and collaborative research — posted by academicians.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white sm:self-center">
          Explore <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      <BuildCvCta
        title="Build CV for applications"
        subtitle="Create a resume with free templates and download PDF before you apply."
        ctaLabel="Build CV"
      />
      <MyApplicationsPanel />

      {recommended.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">Recommended for you</h2>
          <div className="space-y-4">
            {recommended.map(({ job, matchScore }) => (
              <InternshipCard key={`rec-${job.id}`} job={job} matchScore={matchScore} showScore />
            ))}
          </div>
        </section>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company, skills\u2026"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-xl px-5 py-3 font-bold ${
                filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(({ job, matchScore }) => (
          <InternshipCard key={job.id} job={job} matchScore={matchScore} showScore={skillProfile.hasProfile} />
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No internships match your filters.
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <Filter className="h-3.5 w-3.5" />
        <p>
          Showing {filtered.length} of {scoredInternships.length} opportunities
        </p>
      </div>
    </div>
  );
};

export default Internships;
