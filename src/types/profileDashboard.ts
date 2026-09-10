export interface ProfileStat { key: string; label: string; value: number; description: string }
export interface ProfileBadge { id: string; icon: string; title: string; earnedAt: string }
export interface ActivityCell { date: string; count: number }
export interface RecentActivityItem { id: string; problemName: string; status: 'Accepted' | 'Attempted'; difficulty: 'Easy' | 'Medium' | 'Hard'; submittedAt: string; xpEarned: number }
export interface ProfileDashboardData {
  username: string;
  fullName: string;
  roleBio: string;
  profilePhoto?: string;
  rank: { global: number; platform: number };
  points: number;
  xp: { total: number; level: number; levelName: 'Beginner' | 'Explorer' | 'Advanced' | 'Expert' | 'Pro'; currentLevelXp: number; nextLevelXp: number };
  solved: { total: number; easy: number; medium: number; hard: number };
  streak: { current: number; max: number };
  badges: ProfileBadge[];
  activityHeatmap: ActivityCell[];
  recentActivity: RecentActivityItem[];
  scores?: { assessmentAttempts: number; assessmentScore: number };
  courses?: Array<{ id: string; title: string; description?: string; category: string; level: string; duration: string; instructor: string; thumbnail?: string; playlistUrl?: string; youtubeUrl?: string; resourceUrl?: string; published?: boolean; progressPercent?: number; enrolled?: boolean }>;
}
