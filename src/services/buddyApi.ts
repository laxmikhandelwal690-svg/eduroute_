import type { BuddyLanguage, BuddyProgress } from '../types/buddy';

const BASE = '/api';
const buddyStorageKey = (userId: string) => `buddy-local-cache-v1:${userId}`;

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

function readBuddyStore(userId: string): BuddyStore {
  if (typeof window === 'undefined') {
    return { progress: defaultProgress, history: [] };
  }

  try {
    const raw = window.localStorage.getItem(buddyStorageKey(userId));
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

function writeBuddyStore(userId: string, store: BuddyStore) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(buddyStorageKey(userId), JSON.stringify(store));
}

function localFallbackReply(message: string, language: BuddyLanguage) {
  const intro =
    language === 'hindi'
      ? 'मैं Buddy हूँ। अभी limited mode में हूँ, लेकिन आपकी पूरी help करूंगा।'
      : language === 'hinglish'
        ? 'Main Buddy hoon. Abhi limited mode hai, but main full guidance dunga.'
        : 'I am Buddy in limited mode, but I can still guide you effectively.';

  return `${intro}\n\nBased on: "${message}"\n\nBeginner → Intermediate → Pro Plan:\n1) Beginner: strengthen fundamentals + 1 mini project.\n2) Intermediate: framework mastery + API integration + portfolio update.\n3) Pro: system design, testing, interview prep, and internship applications.\n\nWeekly challenge: complete one project milestone and one mock interview.`;
}

function needsClientSearch(message: string) {
  return /\b(who is|who's|who was|what is|what's|when is|prime minister|president|capital of|current|latest|internship|hackathon)\b/i.test(
    message
  );
}

function refineClientQuery(message: string) {
  const lower = message.toLowerCase();
  if (/prime\s*minister.*india|pm of india|india.*prime\s*minister/i.test(lower)) {
    return 'Narendra Modi Prime Minister of India';
  }
  return message.trim();
}

/** Free Wikipedia search from the browser when API is down */
async function clientLiveSearch(message: string, language: BuddyLanguage) {
  const query = refineClientQuery(message);
  const searchUrl =
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}` +
    `&format=json&srlimit=3&origin=*`;

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error('Wikipedia search failed');
  const searchData = await searchRes.json();
  const hits = searchData?.query?.search || [];
  if (!hits.length) throw new Error('No results');

  const topTitle = hits[0].title as string;
  const sumRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`
  );
  if (!sumRes.ok) throw new Error('Wikipedia summary failed');
  const sum = await sumRes.json();
  const extract = (sum.extract || '').trim();
  if (!extract) throw new Error('Empty extract');

  const pageUrl =
    sum?.content_urls?.desktop?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(topTitle.replace(/ /g, '_'))}`;

  const header =
    language === 'hindi'
      ? 'लाइव जानकारी के आधार पर:'
      : language === 'hinglish'
        ? 'Live info ke basis pe:'
        : 'Based on live information:';

  const reply = `${header}\n\n${extract}\n\nSources:\n1. ${topTitle} — ${pageUrl}`;

  return {
    reply,
    usedWebSearch: true,
    sources: [{ title: topTitle, url: pageUrl }],
  };
}

function buildLocalGamification(previous?: BuddyProgress, extra = 5) {
  const points = (previous?.points || 0) + extra;
  return {
    points,
    level: Math.max(1, Math.floor(points / 100) + 1),
    pointsEarned: extra,
  };
}

export async function fetchBuddyProgress(
  userId: string
): Promise<{ progress: BuddyProgress; history: Array<{ role: string; text: string }> }> {
  try {
    const response = await fetch(`${BASE}/buddy-progress?userId=${encodeURIComponent(userId)}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Unable to fetch Buddy progress.');
    }

    writeBuddyStore(userId, { progress: data.progress, history: data.history || [] });
    return data;
  } catch {
    const local = readBuddyStore(userId);
    return local;
  }
}

export async function sendBuddyMessage(params: {
  userId: string;
  message: string;
  language: BuddyLanguage;
  context?: {
    level?: number;
    points?: number;
    missingSkills?: string[];
    weeklyChallenge?: string;
  };
}) {
  const persist = (reply: string, gamification: ReturnType<typeof buildLocalGamification>) => {
    const local = readBuddyStore(params.userId);
    writeBuddyStore(params.userId, {
      progress: {
        ...local.progress,
        points: gamification.points,
        level: gamification.level,
        preferredLanguage: params.language,
      },
      history: [
        ...local.history,
        { role: 'user', text: params.message },
        { role: 'assistant', text: reply },
      ].slice(-20),
    });
  };

  try {
    const response = await fetch(`${BASE}/buddy-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: params.userId || 'demo-student-101',
        message: params.message,
        language: params.language || 'english',
        context: params.context,
      }),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Buddy API returned non-JSON (status ${response.status})`);
    }

    if (!response.ok || !data?.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error(data?.error || `Unable to send message to Buddy (status ${response.status}).`);
    }

    const local = readBuddyStore(params.userId);
    const gamification = {
      points: data.gamification?.points ?? local.progress.points,
      level: data.gamification?.level ?? local.progress.level,
      pointsEarned: data.gamification?.pointsEarned ?? 5,
    };
    persist(data.reply, gamification);

    return {
      ok: true,
      reply: data.reply,
      usedWebSearch: Boolean(data.usedWebSearch),
      sources: Array.isArray(data.sources) ? data.sources : [],
      gamification,
    };
  } catch (primaryError) {
    // Try free client-side Wikipedia search for factual queries
    try {
      if (needsClientSearch(params.message)) {
        const live = await clientLiveSearch(params.message, params.language);
        const gamification = buildLocalGamification(readBuddyStore(params.userId).progress, live.usedWebSearch ? 8 : 5);
        persist(live.reply, gamification);
        return {
          ok: true,
          reply: live.reply,
          usedWebSearch: live.usedWebSearch,
          sources: live.sources || [],
          gamification,
        };
      }
    } catch {
      /* fall through to local template */
    }

    const reply = localFallbackReply(params.message, params.language);
    const gamification = buildLocalGamification(readBuddyStore(params.userId).progress);
    persist(reply, gamification);

    console.warn('[Buddy] API unavailable, using local fallback:', primaryError);
    return {
      ok: true,
      reply,
      usedWebSearch: false,
      sources: [] as Array<{ title: string; url: string }>,
      gamification,
    };
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

    const local = readBuddyStore(params.userId);
    writeBuddyStore(params.userId, { progress: data.progress, history: local.history });
    return data;
  } catch {
    const local = readBuddyStore(params.userId);
    const progress = { ...local.progress, missingSkills: params.missingSkills };
    writeBuddyStore(params.userId, { progress, history: local.history });
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
