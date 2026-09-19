/**
 * Student internship applications — client-only (localStorage).
 * Status pipeline: Applied → Shortlisted → Interview → Hired
 */

import { getAuthUser } from './rbacAuth';

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Hired';

export type InternshipApplication = {
  internshipId: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  logo?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  /** True for seeded sample rows shown in My Applications. */
  isDemo?: boolean;
};

const GLOBAL_KEY = 'eduroute:internship-applications-v1';
const BY_EMAIL_PREFIX = 'eduroute:internship-applications-v1:';

const STATUS_ORDER: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Hired'];

/** Sample rows always present in My Applications (demo / UI). */
const DEMO_APPLICATIONS: InternshipApplication[] = [
  {
    internshipId: 'demo-applied-1',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India (Remote)',
    stipend: '₹25,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    internshipId: 'demo-shortlisted-2',
    role: 'Data Analyst Intern',
    company: 'InsightHive',
    location: 'Gurgaon, India',
    stipend: '₹26,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IH',
    status: 'Shortlisted',
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    internshipId: 'demo-interview-3',
    role: 'Cybersecurity Analyst Intern',
    company: 'ShieldOps',
    location: 'Delhi NCR, India',
    stipend: '₹27,000 / mo',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SO',
    status: 'Interview',
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isDemo: true,
  },
];

function currentEmail(): string | null {
  try {
    return getAuthUser()?.email?.trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

function storageKey(): string {
  const email = currentEmail();
  return email ? `${BY_EMAIL_PREFIX}${email}` : GLOBAL_KEY;
}

function mergeWithDemo(list: InternshipApplication[]): InternshipApplication[] {
  const byId = new Map(list.map((a) => [a.internshipId, a]));
  // Always ensure the 3 demo status samples exist
  for (const demo of DEMO_APPLICATIONS) {
    if (!byId.has(demo.internshipId)) {
      byId.set(demo.internshipId, demo);
    }
  }
  const demos = DEMO_APPLICATIONS.map((d) => byId.get(d.internshipId)!);
  const rest = list.filter((a) => !DEMO_APPLICATIONS.some((d) => d.internshipId === a.internshipId));
  return [...demos, ...rest];
}

export function readApplications(): InternshipApplication[] {
  try {
    if (typeof window === 'undefined') return [...DEMO_APPLICATIONS];
    const raw = localStorage.getItem(storageKey());
    if (!raw) {
      const email = currentEmail();
      if (email) {
        const global = localStorage.getItem(GLOBAL_KEY);
        if (global) {
          const parsed = JSON.parse(global) as InternshipApplication[];
          const merged = mergeWithDemo(Array.isArray(parsed) ? parsed : []);
          writeApplications(merged);
          return merged;
        }
      }
      const seeded = mergeWithDemo([]);
      writeApplications(seeded);
      return seeded;
    }
    const list = JSON.parse(raw) as InternshipApplication[];
    const base = Array.isArray(list) ? list : [];
    const merged = mergeWithDemo(base);
    // Persist if demos were missing
    if (merged.length !== base.length) {
      writeApplications(merged);
    }
    return merged;
  } catch {
    return [...DEMO_APPLICATIONS];
  }
}

function writeApplications(list: InternshipApplication[]) {
  try {
    if (typeof window === 'undefined') return;
    const json = JSON.stringify(list);
    localStorage.setItem(storageKey(), json);
    localStorage.setItem(GLOBAL_KEY, json);
    window.dispatchEvent(new Event('eduroute:applications-updated'));
  } catch {
    /* private mode */
  }
}

export function hasApplied(internshipId: string): boolean {
  return readApplications().some((a) => a.internshipId === internshipId && !a.isDemo);
}

export function getApplication(internshipId: string): InternshipApplication | undefined {
  return readApplications().find((a) => a.internshipId === internshipId && !a.isDemo);
}

export function applyToInternship(input: {
  internshipId: string;
  role: string;
  company: string;
  location: string;
  stipend: string;
  logo?: string;
}): InternshipApplication | null {
  const existing = readApplications();
  if (existing.some((a) => a.internshipId === input.internshipId && !a.isDemo)) {
    return null;
  }
  const now = new Date().toISOString();
  const app: InternshipApplication = {
    ...input,
    status: 'Applied',
    appliedAt: now,
    updatedAt: now,
  };
  writeApplications([app, ...existing]);
  return app;
}

/** Advance status one step (demo tracker). No-op if already Hired. */
export function advanceApplicationStatus(internshipId: string): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const current = list[idx];
  const i = STATUS_ORDER.indexOf(current.status);
  if (i < 0 || i >= STATUS_ORDER.length - 1) return current;
  const next: InternshipApplication = {
    ...current,
    status: STATUS_ORDER[i + 1],
    updatedAt: new Date().toISOString(),
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

export function setApplicationStatus(
  internshipId: string,
  status: ApplicationStatus,
): InternshipApplication | null {
  const list = readApplications();
  const idx = list.findIndex((a) => a.internshipId === internshipId);
  if (idx < 0) return null;
  const next: InternshipApplication = {
    ...list[idx],
    status,
    updatedAt: new Date().toISOString(),
  };
  const updated = [...list];
  updated[idx] = next;
  writeApplications(updated);
  return next;
}

/** Pill / badge colors per status (light + dark). */
export function statusBadgeClass(status: ApplicationStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/25 dark:text-indigo-200 dark:border-indigo-500/40';
    case 'Shortlisted':
      return 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-500/25 dark:text-sky-200 dark:border-sky-500/40';
    case 'Interview':
      return 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/40';
    case 'Hired':
      return 'bg-emerald-100 text-emerald-900 border border-emerald-200 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500/40';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600';
  }
}

/** Solid button colors per status (for status chips / CTAs). */
export function statusButtonClass(status: ApplicationStatus): string {
  switch (status) {
    case 'Applied':
      return 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400';
    case 'Shortlisted':
      return 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400';
    case 'Interview':
      return 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400';
    case 'Hired':
      return 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400';
    default:
      return 'bg-slate-700 text-white dark:bg-slate-600';
  }
}
