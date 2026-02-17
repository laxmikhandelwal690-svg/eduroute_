import type { BuddyLanguage, BuddyProgress } from '../types/buddy';

const BASE = '/api';

export async function fetchBuddyProgress(userId: string): Promise<{ progress: BuddyProgress; history: Array<{ role: string; text: string }> }> {
  const response = await fetch(`${BASE}/buddy-progress?userId=${encodeURIComponent(userId)}`);
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Unable to fetch Buddy progress.');
  }

  return data;
}

export async function sendBuddyMessage(params: { userId: string; message: string; language: BuddyLanguage }) {
  const response = await fetch(`${BASE}/buddy-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Unable to send message to Buddy.');
  }

  return data;
}

export async function saveSkillGap(params: { userId: string; missingSkills: string[] }) {
  const response = await fetch(`${BASE}/buddy-progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || 'Unable to save skill-gap analysis.');
  }

  return data;
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
