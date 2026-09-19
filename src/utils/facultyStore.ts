/**
 * Faculty / Academician opportunities — client-only (localStorage).
 * FDPs, faculty internships, industrial training, consultancy, research.
 */

export type FacultyOpportunityType =
  | 'FDP'
  | 'Faculty Internship'
  | 'Industrial Training'
  | 'Consultancy'
  | 'Research Collaboration';

export type FacultyOpportunity = {
  id: string;
  title: string;
  type: FacultyOpportunityType;
  organizer: string;
  location: string;
  duration: string;
  mode: string;
  domain: string;
  description: string;
  postedAt: string;
  seats?: string;
};

export type FacultyInterestStatus = 'Interested' | 'Applied' | 'Selected' | 'Completed';

export type FacultyInterest = {
  id: string;
  opportunityId: string;
  facultyName: string;
  email: string;
  institution: string;
  department: string;
  status: FacultyInterestStatus;
  appliedAt: string;
};

const OPP_KEY = 'eduroute:faculty-opportunities-v1';
const INTEREST_KEY = 'eduroute:faculty-interests-v1';

export const FACULTY_DEMO_CREDENTIALS = {
  email: 'faculty@gmail.com',
  password: 'faculty',
  user: {
    id: 'faculty-demo-1',
    name: 'Dr. Ananya Sharma',
    email: 'faculty@gmail.com',
    role: 'faculty' as const,
    institutionName: 'All India Institute of Technology',
  },
};

const DEMO_OPPORTUNITIES: FacultyOpportunity[] = [
  {
    id: 'fac-opp-1',
    title: 'FDP on AI-Powered Teaching & Assessment',
    type: 'FDP',
    organizer: 'AICTE · EduRoute Partners',
    location: 'Hybrid · Delhi',
    duration: '5 Days',
    mode: 'Hybrid',
    domain: 'AI / Education Technology',
    description:
      'Hands-on faculty development program covering generative AI tools for curriculum design, assessment, and student mentoring. Certificate on completion.',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    seats: '40',
  },
  {
    id: 'fac-opp-2',
    title: 'Industry Immersion — Full Stack Product Teams',
    type: 'Faculty Internship',
    organizer: 'EduRoute Tech Labs',
    location: 'Bangalore',
    duration: '4 Weeks',
    mode: 'On-site',
    domain: 'Software Engineering',
    description:
      'Faculty work alongside product engineers on live tickets, agile rituals, and code reviews to bring industry practices back to classrooms.',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    seats: '12',
  },
  {
    id: 'fac-opp-3',
    title: 'Industrial Training: SOC & Cyber Defense',
    type: 'Industrial Training',
    organizer: 'SecureNet India',
    location: 'Remote',
    duration: '2 Weeks',
    mode: 'Online',
    domain: 'Cybersecurity',
    description:
      'Structured training for faculty teaching cybersecurity courses — SIEM labs, threat intel briefings, and curriculum mapping.',
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    seats: '25',
  },
  {
    id: 'fac-opp-4',
    title: 'Consultancy: Campus Skill-Gap Audit',
    type: 'Consultancy',
    organizer: 'EduRoute Consulting',
    location: 'Pan-India',
    duration: 'Project-based',
    mode: 'Hybrid',
    domain: 'Skill Mapping',
    description:
      'Institutions can engage faculty consultants to run cohort skill audits aligned to industry roles and recommend curriculum updates.',
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'fac-opp-5',
    title: 'Collaborative Research: Employability Analytics',
    type: 'Research Collaboration',
    organizer: 'EduRoute Research Cell',
    location: 'Remote + workshops',
    duration: '6–12 Months',
    mode: 'Hybrid',
    domain: 'Data / Education Research',
    description:
      'Joint research on skill-gap predictors, placement outcomes, and NSQF-aligned competency mapping. Co-authorship and dataset access.',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    seats: '8 teams',
  },
];

const DEMO_INTERESTS: FacultyInterest[] = [
  {
    id: 'fac-int-1',
    opportunityId: 'fac-opp-1',
    facultyName: 'Dr. Ananya Sharma',
    email: 'faculty@gmail.com',
    institution: 'All India Institute of Technology',
    department: 'Computer Science',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function readFacultyOpportunities(): FacultyOpportunity[] {
  const list = readJson<FacultyOpportunity[]>(OPP_KEY, DEMO_OPPORTUNITIES);
  if (!list.length) {
    writeJson(OPP_KEY, DEMO_OPPORTUNITIES);
    return DEMO_OPPORTUNITIES;
  }
  return list;
}

export function addFacultyOpportunity(
  input: Omit<FacultyOpportunity, 'id' | 'postedAt'>,
): FacultyOpportunity {
  const list = readFacultyOpportunities();
  const item: FacultyOpportunity = {
    ...input,
    id: `fac-opp-${Date.now()}`,
    postedAt: new Date().toISOString(),
  };
  const next = [item, ...list];
  writeJson(OPP_KEY, next);
  return item;
}

export function readFacultyInterests(): FacultyInterest[] {
  const list = readJson<FacultyInterest[]>(INTEREST_KEY, DEMO_INTERESTS);
  if (!list.length) {
    writeJson(INTEREST_KEY, DEMO_INTERESTS);
    return DEMO_INTERESTS;
  }
  return list;
}

export function expressInterest(
  opportunityId: string,
  faculty: { name: string; email: string; institution: string; department: string },
): FacultyInterest | null {
  const interests = readFacultyInterests();
  if (interests.some((i) => i.opportunityId === opportunityId && i.email === faculty.email)) {
    return null;
  }
  const row: FacultyInterest = {
    id: `fac-int-${Date.now()}`,
    opportunityId,
    facultyName: faculty.name,
    email: faculty.email,
    institution: faculty.institution,
    department: faculty.department,
    status: 'Applied',
    appliedAt: new Date().toISOString(),
  };
  writeJson(INTEREST_KEY, [row, ...interests]);
  return row;
}

export function updateInterestStatus(
  interestId: string,
  status: FacultyInterestStatus,
): FacultyInterest | null {
  const list = readFacultyInterests();
  const idx = list.findIndex((i) => i.id === interestId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status };
  writeJson(INTEREST_KEY, list);
  return list[idx];
}

export const FACULTY_TYPES: FacultyOpportunityType[] = [
  'FDP',
  'Faculty Internship',
  'Industrial Training',
  'Consultancy',
  'Research Collaboration',
];
