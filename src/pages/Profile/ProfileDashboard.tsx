import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Flame,
  PenLine,
  Sparkles,
  Target,
  Trophy,
  Info,
  ArrowRight,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { getProfileDashboardData } from '../../services/profileDashboardApi';
import { PROFILE_DASHBOARD_MOCK, type ProfileDashboardData } from '../../data/profileMockData';
import { getAuthToken, getAuthUser, saveAuthSession } from '../../utils/rbacAuth';
import { getStoredUserProfile, saveUserProfile } from '../../utils/userProfile';
import { readOnboarding } from '../../utils/onboardingStore';
import { BuildCvCta } from '../../components/BuildCvCta';

const difficultyColors = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const levelTitles = ['Beginner', 'Explorer', 'Advanced', 'Expert', 'Pro'];

const statsMeta = [
  { key: 'totalProblems', label: 'Total Solved', icon: Target, description: 'All accepted problems.' },
  { key: 'rank', label: 'Rank', icon: Trophy, description: 'Global ranking among all users.' },
  { key: 'xp', label: 'XP', icon: Sparkles, description: 'Experience gained from solved questions.' },
  { key: 'badges', label: 'Badges', icon: Award, description: 'Achievements unlocked by milestones.' },
] as const;

export const ProfileDashboard = () => {
  const [profileData, setProfileData] = useState<ProfileDashboardData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const onboarding = useMemo(() => readOnboarding(), []);
  const skillGapCount = onboarding.missingSkills?.length || 0;

  useEffect(() => {
    const authUser = getAuthUser();
    const storedProfile = getStoredUserProfile();
    const userName = authUser?.name || storedProfile?.name;
    const userEmail = authUser?.email || storedProfile?.email;
    const userAvatar = authUser?.avatar || storedProfile?.avatar;
    const userBio = storedProfile?.roleBio;
    const userIdentity = userName
      ? {
          fullName: userName,
          username: userEmail?.split('@')[0] || userName.toLowerCase().replace(/\s+/g, ''),
          profilePhoto: userAvatar,
          roleBio: userBio || 'Student learner',
        }
      : null;

    const loadData = async () => {
      try {
        const payload = await getProfileDashboardData();
        setProfileData(userIdentity ? { ...payload, ...userIdentity } : payload);
      } catch {
        setProfileData(userIdentity ? { ...PROFILE_DASHBOARD_MOCK, ...userIdentity } : null);
      }
    };

    void loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  const progressPercent = useMemo(() => {
    if (!profileData) return 0;
    const levelSpan = profileData.xp.nextLevelXp - profileData.xp.currentLevelXp;
    const earned = profileData.xp.total - profileData.xp.currentLevelXp;
    return Math.max(0, Math.min(100, Math.round((earned / levelSpan) * 100)));
  }, [profileData]);

  const chartData = useMemo(() => {
    if (!profileData) return [];
    return [
      { name: 'Easy', value: profileData.solved.easy, color: difficultyColors.easy },
      { name: 'Medium', value: profileData.solved.medium, color: difficultyColors.medium },
      { name: 'Hard', value: profileData.solved.hard, color: difficultyColors.hard },
    ];
  }, [profileData]);

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-8 text-[var(--text-secondary)]">
        Loading profile...
      </div>
    );
  }

  const avatarFallback = profileData.username.charAt(0).toUpperCase();

  const openEditor = () => {
    setEditName(profileData.fullName);
    setEditEmail(getStoredUserProfile()?.email || getAuthUser()?.email || '');
    setEditBio(profileData.roleBio);
    setIsEditing(true);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = editName.trim();
    const email = editEmail.trim();
    if (!name || !email) return;

    const storedProfile = getStoredUserProfile();
    const avatar = getAuthUser()?.avatar || storedProfile?.avatar;
    const roleBio = editBio.trim() || 'Student learner';

    saveUserProfile({
      name,
      email,
      avatar,
      roleBio,
      enrolledCourses: storedProfile?.enrolledCourses,
    });

    const authUser = getAuthUser();
    const authToken = getAuthToken();
    if (authUser && authToken) {
      saveAuthSession(authToken, { ...authUser, name, email });
    }

    setProfileData((current) =>
      current
        ? {
            ...current,
            fullName: name,
            username: email.split('@')[0] || name.toLowerCase().replace(/\s+/g, ''),
            profilePhoto: avatar,
            roleBio,
          }
        : current
    );
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 text-[var(--text-primary)] md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[var(--border-default)] bg-linear-to-br from-indigo-500 to-violet-600 text-3xl font-black uppercase text-white">
                {profileData.profilePhoto ? (
                  <img src={profileData.profilePhoto} alt={profileData.username} className="h-full w-full object-cover" />
                ) : (
                  avatarFallback
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">{profileData.fullName}</h1>
                <p className="text-sm font-semibold text-[var(--accent)]">@{profileData.username}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{profileData.roleBio}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/skill-profile"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--accent-soft)] px-5 py-3 text-sm font-bold text-[var(--accent)] hover:bg-[var(--accent-muted)]"
              >
                <Target className="h-4 w-4" /> Skill Profile
                {skillGapCount > 0 && (
                  <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                    {skillGapCount} gaps
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={openEditor}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--accent-soft)] px-5 py-3 text-sm font-bold text-[var(--accent)] hover:bg-[var(--accent-muted)]"
              >
                <PenLine className="h-4 w-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <div>
                <p className="font-semibold text-[var(--accent)]">
                  Level {profileData.xp.level}: {profileData.xp.levelName}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Gamification: solve problems to gain XP and level up.</p>
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                {profileData.xp.total} / {profileData.xp.nextLevelXp} XP
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-input)]">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {progressPercent}% to {levelTitles[Math.min(levelTitles.length - 1, profileData.xp.level)]}.
            </p>
          </div>

          <Link
            to="/skill-profile"
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--accent-soft)] px-4 py-3 text-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]"
          >
            <span className="font-semibold text-[var(--accent)]">
              View strengths, skill gaps & recommended next steps
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)]" />
          </Link>
        </section>

        <BuildCvCta />

        {isEditing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 dark:bg-black/70"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <form
              onSubmit={saveProfile}
              className="w-full max-w-md rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 id="edit-profile-title" className="text-xl font-black text-[var(--text-primary)]">
                  Edit Profile
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Close
                </button>
              </div>
              <label className="block text-sm font-semibold text-[var(--text-secondary)]">
                Name
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  required
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-[var(--text-secondary)]">
                Email
                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) => setEditEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                  required
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-[var(--text-secondary)]">
                Bio
                <textarea
                  value={editBio}
                  onChange={(event) => setEditBio(event.target.value)}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                />
              </label>
              <p className="mt-3 text-xs text-[var(--text-muted)]">Your profile image is connected to your Google account.</p>
              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsMeta.map((item) => {
            const Icon = item.icon;
            const valueMap: Record<string, string> = {
              totalProblems: String(profileData.solved.total),
              rank: `#${profileData.rank.global.toLocaleString()}`,
              xp: profileData.xp.total.toLocaleString(),
              badges: String(profileData.badges.length),
            };

            return (
              <article
                key={item.key}
                className="group rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]" title={item.description}>
                    <Info className="h-3.5 w-3.5" /> Tooltip
                  </div>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{item.label}</p>
                <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">{valueMap[item.key]}</p>
              </article>
            );
          })}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] xl:col-span-1">
            <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">Progress Breakdown</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={5}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number | undefined, name: string | undefined) => [`${value ?? 0} solved`, name ?? '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-2">
              {chartData.map((difficulty) => (
                <div key={difficulty.name} className="flex items-center justify-between text-sm text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: difficulty.color }} />
                    {difficulty.name}
                  </div>
                  <span className="font-semibold text-[var(--text-secondary)]">{difficulty.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Badges Earned</h2>
              <span className="text-xs text-[var(--text-muted)]">{profileData.badges.length} total</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profileData.badges.map((badge) => (
                <article
                  key={badge.id}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 hover:border-[var(--accent)]"
                >
                  <p className="text-2xl">{badge.icon}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{badge.title}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Earned: {badge.earnedAt}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] xl:col-span-2">
            <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">Activity Heatmap</h2>
            <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2">
              {profileData.activityHeatmap.map((cell) => {
                const tone =
                  cell.count === 0
                    ? 'bg-[var(--bg-elevated)]'
                    : cell.count < 3
                      ? 'bg-indigo-200 dark:bg-indigo-900'
                      : cell.count < 6
                        ? 'bg-indigo-500 dark:bg-indigo-600'
                        : 'bg-violet-500';

                return (
                  <div
                    key={cell.date}
                    className={`h-4 w-4 rounded-sm ${tone}`}
                    title={`${cell.date}: ${cell.count} submissions`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex gap-3 text-xs text-[var(--text-muted)]">
              <span>Less</span>
              <span className="h-3 w-3 rounded-sm bg-[var(--bg-elevated)]" />
              <span className="h-3 w-3 rounded-sm bg-indigo-200 dark:bg-indigo-900" />
              <span className="h-3 w-3 rounded-sm bg-indigo-500 dark:bg-indigo-600" />
              <span className="h-3 w-3 rounded-sm bg-violet-500" />
              <span>More</span>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Rank & Streak</h2>
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
              <p className="text-xs uppercase text-[var(--text-muted)]">Global Rank</p>
              <p className="mt-1 text-2xl font-black text-[var(--accent)]">#{profileData.rank.global.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
              <p className="text-xs uppercase text-[var(--text-muted)]">Platform Rank</p>
              <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">#{profileData.rank.platform.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-xs uppercase text-[var(--text-muted)]">Current Streak</p>
              </div>
              <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">{profileData.streak.current} days</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Best: {profileData.streak.best} days</p>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-lg font-bold text-[var(--text-primary)]">Recent Submissions</h2>
          <div className="space-y-3">
            {profileData.recentSubmissions.map((sub) => (
              <article
                key={sub.id}
                className="flex flex-col gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{sub.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {sub.difficulty} · {sub.status} · {sub.submittedAt}
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)]">
                  {sub.earned} XP
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileDashboard;
