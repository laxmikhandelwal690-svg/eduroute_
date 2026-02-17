import type { BuddyLanguage, BuddyProgress } from '../types/buddy';

const BASE = '/api';
const LOCAL_PROGRESS_PREFIX = 'buddy:progress:';
const LOCAL_HISTORY_PREFIX = 'buddy:history:';

const DEFAULT_PROGRESS: BuddyProgress = {
  points: 0,
  level: 1,
  achievements: ['Welcome to Buddy 🚀'],
  weeklyChallenges: ['Complete your first roadmap milestone'],
  missingSkills: [],
  preferredLanguage: 'english',
};

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const getLocalProgress = (userId: string): BuddyProgress => {
  const value = safeJsonParse<BuddyProgress>(localStorage.getItem(`${LOCAL_PROGRESS_PREFIX}${userId}`));
  return value || { ...DEFAULT_PROGRESS };
};

const setLocalProgress = (userId: string, progress: BuddyProgress) => {
  localStorage.setItem(`${LOCAL_PROGRESS_PREFIX}${userId}`, JSON.stringify(progress));
};

const getLocalHistory = (userId: string) => {
  return safeJsonParse<Array<{ role: string; text: string }>>(localStorage.getItem(`${LOCAL_HISTORY_PREFIX}${userId}`)) || [];
};

const setLocalHistory = (userId: string, history: Array<{ role: string; text: string }>) => {
  localStorage.setItem(`${LOCAL_HISTORY_PREFIX}${userId}`, JSON.stringify(history.slice(-30)));
};

async function requestJson(path: string, init?: RequestInit) {
  const response = await fetch(`${BASE}${path}`, init);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const getFallbackReply = (message: string, language: BuddyLanguage) => {
  const starter = language === 'hindi'
    ? 'मैं Buddy हूँ। अभी server unavailable है, लेकिन मैं आपका fallback guide हूँ।'
    : language === 'hinglish'
      ? 'Main Buddy hoon. Server abhi unavailable hai, but main fallback guide mode mein hoon.'
      : 'I am Buddy. The server is currently unavailable, but I can still guide you in fallback mode.';

  return `${starter}\n\nYour request: "${message}"\n\nTry this action plan:\n1) Pick one role (Web Dev / Data / AI).\n2) Complete 1 beginner milestone this week.\n3) Build one mini project and update your portfolio.\n4) Apply to 2 internships this month.`;
};

export async function fetchBuddyProgress(userId: string): Promise<{ progress: BuddyProgress; history: Array<{ role: string; text: string }> }> {
  try {
    return await requestJson(`/buddy-progress?userId=${encodeURIComponent(userId)}`);
  } catch {
    return {
      progress: getLocalProgress(userId),
      history: getLocalHistory(userId),
    };
  }
}

export async function sendBuddyMessage(params: { userId: string; message: string; language: BuddyLanguage }) {
  try {
    const data = await requestJson('/buddy-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const updatedHistory = [...getLocalHistory(params.userId), { role: 'user', text: params.message }, { role: 'assistant', text: data.reply }];
    setLocalHistory(params.userId, updatedHistory);
    setLocalProgress(params.userId, {
      ...getLocalProgress(params.userId),
      points: data.gamification?.points ?? getLocalProgress(params.userId).points,
      level: data.gamification?.level ?? getLocalProgress(params.userId).level,
      preferredLanguage: params.language,
    });

    return data;
  } catch {
    const previous = getLocalProgress(params.userId);
    const points = previous.points + 5;
    const level = Math.max(1, Math.floor(points / 100) + 1);
    const fallbackReply = getFallbackReply(params.message, params.language);

    setLocalProgress(params.userId, { ...previous, points, level, preferredLanguage: params.language });
    setLocalHistory(params.userId, [...getLocalHistory(params.userId), { role: 'user', text: params.message }, { role: 'assistant', text: fallbackReply }]);

    return { ok: true, reply: fallbackReply, gamification: { points, level, pointsEarned: 5 }, fallback: true };
  }
}

export async function saveSkillGap(params: { userId: string; missingSkills: string[] }) {
  try {
    return await requestJson('/buddy-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  } catch {
    const progress = { ...getLocalProgress(params.userId), missingSkills: params.missingSkills };
    setLocalProgress(params.userId, progress);
    return { ok: true, progress, history: getLocalHistory(params.userId), fallback: true };
  }
}

export async function fetchRoadmaps(adminSecret?: string) {
  const headers: Record<string, string> = {};
  if (adminSecret) headers['x-admin-secret'] = adminSecret;
  const data = await requestJson('/admin-roadmaps', { headers });
  return data.roadmaps;
}

export async function upsertRoadmap(roadmap: unknown, adminSecret?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (adminSecret) headers['x-admin-secret'] = adminSecret;

  const data = await requestJson('/admin-roadmaps', {
    method: 'POST',
    headers,
    body: JSON.stringify(roadmap),
  });

  return data.roadmap;
}
