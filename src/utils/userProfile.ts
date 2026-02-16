import { MOCK_USER } from '../data/mockData';

export interface StoredUserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const USER_PROFILE_KEY = 'eduroute:user-profile';

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const createAvatar = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

export const saveUserProfile = (profile: StoredUserProfile) => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const getStoredUserProfile = (): StoredUserProfile | null => {
  const parsed = safeJsonParse<Partial<StoredUserProfile>>(localStorage.getItem(USER_PROFILE_KEY));

  if (!parsed?.name || !parsed.email) {
    return null;
  }

  return {
    name: parsed.name,
    email: parsed.email,
    avatar: parsed.avatar,
  };
};

export const getCurrentUser = () => {
  const storedUser = getStoredUserProfile();

  if (!storedUser) {
    return MOCK_USER;
  }

  return {
    ...MOCK_USER,
    name: storedUser.name,
    email: storedUser.email,
    avatar: storedUser.avatar || createAvatar(storedUser.name),
  };
};

export const getDisplayFirstName = () => getCurrentUser().name.trim().split(/\s+/)[0] || 'Learner';

const parseBase64Url = (base64Url: string) => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`;
  return atob(padded);
};

export const parseGoogleCredential = (credential: string) => {
  const payloadSegment = credential.split('.')[1];

  if (!payloadSegment) {
    return null;
  }

  try {
    const payload = JSON.parse(parseBase64Url(payloadSegment)) as {
      name?: string;
      email?: string;
      picture?: string;
    };

    if (!payload.name || !payload.email) {
      return null;
    }

    return {
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
    };
  } catch {
    return null;
  }
};
