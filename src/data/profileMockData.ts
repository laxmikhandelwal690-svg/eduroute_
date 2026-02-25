export type DifficultyKey = 'easy' | 'medium' | 'hard';

export interface ProfileStat {
  key: string;
  label: string;
  value: number;
  description: string;
}

export interface ProfileBadge {
  id: string;
  icon: string;
  title: string;
  earnedAt: string;
}

export interface ActivityCell {
  date: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  problemName: string;
  status: 'Accepted' | 'Attempted';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  submittedAt: string;
  xpEarned: number;
}

export interface ProfileDashboardData {
  username: string;
  fullName: string;
  roleBio: string;
  profilePhoto?: string;
  rank: {
    global: number;
    platform: number;
  };
  points: number;
  xp: {
    total: number;
    level: number;
    levelName: 'Beginner' | 'Explorer' | 'Advanced' | 'Expert' | 'Pro';
    currentLevelXp: number;
    nextLevelXp: number;
  };
  solved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  streak: {
    current: number;
    max: number;
  };
  badges: ProfileBadge[];
  activityHeatmap: ActivityCell[];
  recentActivity: RecentActivityItem[];
}

const createHeatmapData = (days = 98): ActivityCell[] => {
  const data: ActivityCell[] = [];
  const now = new Date();

  for (let index = days - 1; index >= 0; index -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - index);

    const weekday = day.getDay();
    const pulse = Math.floor((Math.sin(index / 4) + 1) * 2);
    const weekendBoost = weekday === 0 || weekday === 6 ? 0 : 1;
    const count = (index % 11 === 0) ? 0 : Math.min(9, pulse + weekendBoost + (index % 3));

    data.push({
      date: day.toISOString().split('T')[0],
      count,
    });
  }

  return data;
};

export const PROFILE_DASHBOARD_MOCK: ProfileDashboardData = {
  username: 'alexcoder',
  fullName: 'Alex Rivera',
  roleBio: 'DSA Learner | Web Dev',
  profilePhoto: '',
  rank: {
    global: 2194,
    platform: 132,
  },
  points: 6820,
  xp: {
    total: 2890,
    level: 9,
    levelName: 'Advanced',
    currentLevelXp: 2400,
    nextLevelXp: 3200,
  },
  solved: {
    total: 448,
    easy: 190,
    medium: 198,
    hard: 60,
  },
  streak: {
    current: 17,
    max: 54,
  },
  badges: [
    { id: 'badge-1', icon: '🔥', title: '7-Day Streak', earnedAt: '2026-01-14' },
    { id: 'badge-2', icon: '⚡', title: 'Speed Solver', earnedAt: '2026-01-29' },
    { id: 'badge-3', icon: '🧠', title: 'Dynamic Programming', earnedAt: '2026-02-02' },
    { id: 'badge-4', icon: '🏆', title: 'Top 5% Weekly', earnedAt: '2026-02-10' },
    { id: 'badge-5', icon: '🛡️', title: 'Consistency Hero', earnedAt: '2026-02-19' },
    { id: 'badge-6', icon: '🚀', title: '300 Problems Solved', earnedAt: '2026-02-22' },
  ],
  activityHeatmap: createHeatmapData(),
  recentActivity: [
    { id: 'act-1', problemName: 'Two Sum', status: 'Accepted', difficulty: 'Easy', submittedAt: '2h ago', xpEarned: 10 },
    { id: 'act-2', problemName: 'Longest Substring Without Repeating Characters', status: 'Accepted', difficulty: 'Medium', submittedAt: '6h ago', xpEarned: 20 },
    { id: 'act-3', problemName: 'Median of Two Sorted Arrays', status: 'Attempted', difficulty: 'Hard', submittedAt: '1d ago', xpEarned: 5 },
    { id: 'act-4', problemName: 'Merge Intervals', status: 'Accepted', difficulty: 'Medium', submittedAt: '2d ago', xpEarned: 20 },
    { id: 'act-5', problemName: 'Best Time to Buy and Sell Stock', status: 'Accepted', difficulty: 'Easy', submittedAt: '3d ago', xpEarned: 10 },
  ],
};
