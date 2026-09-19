/**
 * Student CV builder data — client-only (localStorage).
 * FlowCV-style templates + persistence for EDUROUTE.
 */

export type CvTemplateId = 'classic' | 'modern' | 'minimal' | 'professional';

export type CvAccentId = 'indigo' | 'slate' | 'emerald' | 'rose' | 'amber';

export type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
  details: string;
};

export type CvExperience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

export type CvProject = {
  id: string;
  name: string;
  tech: string;
  description: string;
  link: string;
};

export type CvData = {
  template: CvTemplateId;
  accent: CvAccentId;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  title: string;
  summary: string;
  skills: string[];
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
  updatedAt: string;
};

const KEY = 'eduroute:cv-builder-v2';

export const ACCENT_COLORS: Record<CvAccentId, { hex: string; label: string }> = {
  indigo: { hex: '#4f46e5', label: 'Indigo' },
  slate: { hex: '#0f172a', label: 'Slate' },
  emerald: { hex: '#059669', label: 'Emerald' },
  rose: { hex: '#e11d48', label: 'Rose' },
  amber: { hex: '#d97706', label: 'Amber' },
};

export const CV_TEMPLATES: {
  id: CvTemplateId;
  name: string;
  blurb: string;
  tags: string[];
  layout: 'single' | 'sidebar';
}[] = [
  {
    id: 'classic',
    name: 'Classic',
    blurb: 'Clean serif headers · ATS-friendly single column',
    tags: ['ATS', 'Traditional'],
    layout: 'single',
  },
  {
    id: 'modern',
    name: 'Modern',
    blurb: 'Bold accent bar · contemporary sans-serif',
    tags: ['Popular', 'Bold'],
    layout: 'single',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Lots of white space · simple type',
    tags: ['Clean', 'ATS'],
    layout: 'single',
  },
  {
    id: 'professional',
    name: 'Professional',
    blurb: 'Two-column sidebar · skills on the left',
    tags: ['Sidebar', 'Executive'],
    layout: 'sidebar',
  },
];

export function emptyEducation(): CvEducation {
  return { id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, school: '', degree: '', year: '', details: '' };
}

export function emptyExperience(): CvExperience {
  return { id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, role: '', company: '', duration: '', description: '' };
}

export function emptyProject(): CvProject {
  return { id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: '', tech: '', description: '', link: '' };
}

export function defaultCvData(partial?: Partial<CvData>): CvData {
  return {
    template: 'modern',
    accent: 'indigo',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    title: 'Software Developer',
    summary: '',
    skills: [],
    education: [emptyEducation()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

export function readCvData(): CvData {
  if (typeof window === 'undefined') return defaultCvData();
  try {
    const raw = window.localStorage.getItem(KEY) || window.localStorage.getItem('eduroute:cv-builder-v1');
    if (!raw) return defaultCvData();
    return { ...defaultCvData(), ...(JSON.parse(raw) as CvData) };
  } catch {
    return defaultCvData();
  }
}

export function saveCvData(data: CvData): void {
  if (typeof window === 'undefined') return;
  try {
    const next = { ...data, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export const SAMPLE_SUMMARIES = [
  'Motivated computer science student with hands-on experience in full-stack development. Passionate about building user-focused products and continuous learning.',
  'Detail-oriented engineering student seeking internship opportunities. Strong foundation in data structures, algorithms, and modern web technologies.',
  'Results-driven learner with project experience in React, Node.js, and cloud tools. Eager to contribute to real-world products and grow with a collaborative team.',
];

export const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'SQL',
  'Git',
  'Tailwind CSS',
  'REST APIs',
  'Communication',
  'Problem Solving',
  'Teamwork',
];
