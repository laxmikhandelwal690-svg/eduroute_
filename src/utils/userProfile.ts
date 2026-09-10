import { MOCK_USER } from '../data/mockData';

export interface StoredUserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const USER_PROFILE_KEY = 'eduroute:user-profile';

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const createAvatar = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    name
  )}`;

export const saveUserProfile = (profile: StoredUserProfile) => {
  try {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      USER_PROFILE_KEY,
      JSON.stringify(profile)
    );
  } catch {
    console.warn('Unable to save user profile');
  }
};

export const getStoredUserProfile = (): StoredUserProfile | null => {
  try {
    if (typeof window === 'undefined') return null;

    const parsed = safeJsonParse<Partial<StoredUserProfile>>(
      window.localStorage.getItem(USER_PROFILE_KEY)
    );

    if (!parsed?.name || !parsed.email) {
      return null;
    }

    return {
      name: parsed.name,
      email: parsed.email,
      avatar: parsed.avatar,
    };
  } catch {
    return null;
  }
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
    avatar:
      storedUser.avatar || createAvatar(storedUser.name),
  };
};

export const getDisplayFirstName = () => {
  return (
    getCurrentUser().name.trim().split(/\s+/)[0] ||
    'Learner'
  );
};

const parseBase64Url = (base64Url: string) => {
  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const padded =
    base64 +
    '='.repeat((4 - (base64.length % 4)) % 4);

  return atob(padded);
};

export const parseGoogleCredential = (credential: string) => {
  try {
    const parts = credential.split('.');

    if (parts.length < 2) {
      return null;
    }

    const payload = JSON.parse(
      parseBase64Url(parts[1])
    ) as {
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
