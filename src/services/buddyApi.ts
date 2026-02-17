import type { BuddyLanguage, BuddyProgress } from '../types/buddy';

const BASE = '/api';
const BUDDY_LOCAL_STORAGE_KEY = 'buddy-local-cache-v1';

type BuddyHistoryEntry = { role: string; text: string };
type BuddyStore = { progress: BuddyProgress; history: BuddyHistoryEntry[] };

const defaultProgress: BuddyProgress = {
  points: 0,
  level: 1,
  achievements: ['Welcome to Buddy 🚀'],
  weeklyChallenges: ['Complete one project milestone this week'],
  missingSkills: [],
  preferredLanguage: 'english',
};

function readBuddyStore(): BuddyStore {
  if (typeof window === 'undefined') {
    return { progress: defaultProgress, history: [] };
  }

  try {
    const raw = window.localStorage.getItem(BUDDY_LOCAL_STORAGE_KEY);
    if (!raw) return { progress: defaultProgress, history: [] };
    const parsed = JSON.parse(raw) as Partial<BuddyStore>;
    return {
      progress: { ...defaultProgress, ...parsed.progress },
      history: Array.isArray(parsed.history) ? parsed.history.slice(-20) : [],
    };
  } catch {
    return { progress: defaultProgress, history: [] };
  }
}

function writeBuddyStore(store: BuddyStore) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BUDDY_LOCAL_STORAGE_KEY, JSON.stringify(store));
}

function localFallbackReply(message: string, language: BuddyLanguage) {
  const intro = language === 'hindi'
    ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
    : language === 'hinglish'
      ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
      : 'I am Buddy in limited mode, but I can still guide you effectively.';

  return `${intro}\n\nBased on: "${message}"\n\nBeginner → Intermediate → Pro Plan:\n1) Beginner: strengthen fundamentals + 1 mini project.\n2) Intermediate: framework mastery + API integration + portfolio update.\n3) Pro: system design, testing, interview prep, and internship applications.\n\nWeekly challenge: complete one project milestone and one mock interview.`;
}

function buildLocalGamification(previous?: BuddyProgress) {
  const points = (previous?.points || 0) + 5;
  return {
    points,
    level: Math.max(1, Math.floor(points / 100) + 1),
    pointsEarned: 5,
  };
}

export async function fetchBuddyProgress(userId: string): Promise<{ progress: BuddyProgress; history: Array<{ role: string; text: string }> }> {
  try {
    const response = await fetch(`${BASE}/buddy-progress?userId=${encodeURIComponent(userId)}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Unable to fetch Buddy progress.');
    }

    writeBuddyStore({ progress: data.progress, history: data.history || [] });
    return data;
  } catch {
    const local = readBuddyStore();
    return local;
  }
}

export async function sendBuddyMessage(params: { userId: string; message: string; language: BuddyLanguage }) {
  try {
    const response = await fetch(`${BASE}/buddy-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Unable to send message to Buddy.');
    }

    const local = readBuddyStore();
    writeBuddyStore({
      progress: {
        ...local.progress,
        points: data.gamification?.points || local.progress.points,
        level: data.gamification?.level || local.progress.level,
        preferredLanguage: params.language,
      },
      history: [...local.history, { role: 'user', text: params.message }, { role: 'assistant', text: data.reply }].slice(-20),
    });

    return data;
  } catch {
    const local = readBuddyStore();
    const reply = localFallbackReply(params.message, params.language);
    const gamification = buildLocalGamification(local.progress);

    writeBuddyStore({
      progress: {
        ...local.progress,
        points: gamification.points,
        level: gamification.level,
        preferredLanguage: params.language,
      },
      history: [...local.history, { role: 'user', text: params.message }, { role: 'assistant', text: reply }].slice(-20),
    });

    return { ok: true, reply, gamification };
  }
}

export async function saveSkillGap(params: { userId: string; missingSkills: string[] }) {
  try {
    const response = await fetch(`${BASE}/buddy-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Unable to save skill-gap analysis.');
    }

    const local = readBuddyStore();
    writeBuddyStore({ progress: data.progress, history: local.history });
    return data;
  } catch {
    const local = readBuddyStore();
    const progress = { ...local.progress, missingSkills: params.missingSkills };
    writeBuddyStore({ progress, history: local.history });
    return { ok: true, progress };
  }
}

export async function fetchRoadmaps(adminSecret?: string) {
  const headers: Record<string, string> = {};
  if (adminSecret) headers['x-admin-secret'] = adminSecret;

  const response = await fetch(`${BASE}/admin-roadmaps`, { headers });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Unable to fetch roadmaps.');
  }

  return data.roadmaps;
}

export async function upsertRoadmap(roadmap: unknown, adminSecret?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (adminSecret) headers['x-admin-secret'] = adminSecret;

  const response = await fetch(`${BASE}/admin-roadmaps`, {
    method: 'POST',
    headers,
    body: JSON.stringify(roadmap),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Unable to save roadmap.');
  }

  return data.roadmap;
}
