export type BuddyLanguage = 'english' | 'hindi' | 'hinglish';

export interface BuddyMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface BuddyProgress {
  points: number;
  level: number;
  achievements: string[];
  weeklyChallenges: string[];
  missingSkills: string[];
  preferredLanguage: BuddyLanguage;
}
