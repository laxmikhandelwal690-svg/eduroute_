/**
 * Institution placement metrics from internship apply-tracker (localStorage).
 * Demo-friendly: falls back to sample cohort numbers when few real apps exist.
 */

import type { ApplicationStatus, InternshipApplication } from './internshipApplications';
import type { AuthUser } from './rbacAuth';
import { readOnboarding } from './onboardingStore';

const GLOBAL_KEY = 'eduroute:internship-applications-v1';
const BY_EMAIL_PREFIX = 'eduroute:internship-applications-v1:';

export type PlacementKpis = {
  applications: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  applicationsDelta: number;
  shortlistedDelta: number;
  interviewsDelta: number;
  hiredDelta: number;
};

export type SkillGapRow = {
  rank: number;
  name: string;
  percent: number;
  color: string;
};

export type HiringCompany = {
  id: string;
  name: string;
  subtitle: string;
  hires: number;
  tag: string;
  logoSeed: string;
};

export type MonthlyTrendPoint = {
  month: string;
  applied: number;
  shortlisted: number;
  hired: number;
};

export type PlacementDashboardData = {
  institutionName: string;
  periodLabel: string;
  kpis: PlacementKpis;
  skillGaps: SkillGapRow[];
  companies: HiringCompany[];
  trends: MonthlyTrendPoint[];
  source: 'live' | 'demo-seed';
};

const DEMO_KPIS: PlacementKpis = {
  applications: 482,
  shortlisted: 198,
  interviews: 142,
  hired: 86,
  applicationsDelta: 18,
  shortlistedDelta: 24,
  interviewsDelta: 32,
  hiredDelta: 40,
};

const DEMO_SKILL_GAPS: SkillGapRow[] = [
  { rank: 1, name: 'Data Structures & Algorithms', percent: 62, color: '#6366f1' },
  { rank: 2, name: 'React.js', percent: 48, color: '#3b82f6' },
  { rank: 3, name: 'System Design', percent: 41, color: '#14b8a6' },
  { rank: 4, name: 'Java', percent: 35, color: '#f59e0b' },
  { rank: 5, name: 'Communication', percent: 28, color: '#ec4899' },
];

const DEMO_COMPANIES: HiringCompany[] = [
  { id: 'tcs', name: 'TCS', subtitle: 'Tata Consultancy Services', hires: 18, tag: 'Top Recruiter', logoSeed: 'TCS' },
  { id: 'infy', name: 'Infosys', subtitle: 'Infosys', hires: 12, tag: 'IT Services', logoSeed: 'INFY' },
  { id: 'wipro', name: 'Wipro', subtitle: 'Wipro', hires: 9, tag: 'IT Services', logoSeed: 'WIP' },
  { id: 'acc', name: 'Accenture', subtitle: 'Accenture', hires: 7, tag: 'Consulting', logoSeed: 'ACC' },
  { id: 'amz', name: 'Amazon', subtitle: 'Amazon', hires: 6, tag: 'Product', logoSeed: 'AMZ' },
];

const DEMO_TRENDS: MonthlyTrendPoint[] = [
  { month: 'Jul', applied: 38, shortlisted: 18, hired: 8 },
  { month: 'Aug', applied: 48, shortlisted: 28, hired: 14 },
  { month: 'Sep', applied: 58, shortlisted: 38, hired: 24 },
  { month: 'Oct', applied: 68, shortlisted: 48, hired: 34 },
  { month: 'Nov', applied: 78, shortlisted: 58, hired: 42 },
  { month: 'Dec', applied: 92, shortlisted: 72, hired: 54 },
];

function parseList(raw: string | null): InternshipApplication[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as InternshipApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Collect applications across global + per-email keys (institution view). */
export function readCohortApplications(): InternshipApplication[] {
  if (typeof window === 'undefined') return [];
  const byId = new Map<string, InternshipApplication>();

  const push = (list: InternshipApplication[]) => {
    for (const app of list) {
      if (!app?.internshipId) continue;
      const key = `${app.internshipId}::${app.appliedAt || ''}`;
      if (!byId.has(key)) byId.set(key, app);
    }
  };

  push(parseList(localStorage.getItem(GLOBAL_KEY)));

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(BY_EMAIL_PREFIX)) continue;
      push(parseList(localStorage.getItem(k)));
    }
  } catch {
    /* private mode */
  }

  return Array.from(byId.values());
}

function countByStatus(apps: InternshipApplication[], status: ApplicationStatus): number {
  return apps.filter((a) => a.status === status).length;
}

function funnelCounts(apps: InternshipApplication[]): PlacementKpis {
  const total = apps.length;
  const shortlisted =
    countByStatus(apps, 'Shortlisted') +
    countByStatus(apps, 'Interview') +
    countByStatus(apps, 'Hired');
  const interviews = countByStatus(apps, 'Interview') + countByStatus(apps, 'Hired');
  const hired = countByStatus(apps, 'Hired');
  return {
    applications: total,
    shortlisted,
    interviews,
    hired,
    applicationsDelta: 12,
    shortlistedDelta: 18,
    interviewsDelta: 22,
    hiredDelta: 28,
  };
}

function companyHires(apps: InternshipApplication[]): HiringCompany[] {
  const hired = apps.filter((a) => a.status === 'Hired');
  const map = new Map<string, number>();
  for (const a of hired) {
    map.set(a.company, (map.get(a.company) || 0) + 1);
  }
  const rows = Array.from(map.entries())
    .map(([name, hires], i) => ({
      id: `c-${i}`,
      name,
      subtitle: name,
      hires,
      tag: hires >= 3 ? 'Top Recruiter' : 'Partner',
      logoSeed: name.slice(0, 3).toUpperCase(),
    }))
    .sort((a, b) => b.hires - a.hires)
    .slice(0, 5);
  return rows.length ? rows : DEMO_COMPANIES;
}

function skillGapsFromOnboarding(): SkillGapRow[] {
  try {
    const onboarding = readOnboarding();
    const gaps = onboarding.missingSkills || [];
    if (!gaps.length) return DEMO_SKILL_GAPS;
    const colors = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];
    return gaps.slice(0, 5).map((name, i) => ({
      rank: i + 1,
      name,
      percent: Math.max(18, 70 - i * 10),
      color: colors[i % colors.length],
    }));
  } catch {
    return DEMO_SKILL_GAPS;
  }
}

export function getPlacementDashboardData(institutionName = 'Modi Institute of Technology'): PlacementDashboardData {
  const apps = readCohortApplications().filter((a) => !a.isDemo);
  const useLive = apps.length >= 8;
  const kpis = useLive ? funnelCounts(apps) : DEMO_KPIS;

  return {
    institutionName,
    periodLabel: 'Aug 2025 – Dec 2025',
    kpis,
    skillGaps: skillGapsFromOnboarding(),
    companies: useLive ? companyHires(apps) : DEMO_COMPANIES,
    trends: DEMO_TRENDS,
    source: useLive ? 'live' : 'demo-seed',
  };
}

/** College institution demo — separate role from staff admin. */
export const COLLEGE_DEMO_CREDENTIALS = {
  email: 'college@gmail.com',
  password: 'student',
  user: {
    id: 'local-college-1',
    name: 'Placement Cell',
    email: 'college@gmail.com',
    role: 'college' as const,
    verificationStatus: 'verified',
    institutionName: 'Modi Institute of Technology',
  } satisfies AuthUser,
};
