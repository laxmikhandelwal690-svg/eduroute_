import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Search, User, Award } from 'lucide-react';
import { getCurrentUser } from '../../utils/userProfile';

const TOP_THREE = [
  { rank: 2, name: 'Deepesh chauhan', points: 8420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero1', college: 'IIT Bombay' },
  { rank: 1, name: 'Vansh Khandelwal', points: 9250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero', college: 'BITS Pilani', isUser: true },
  { rank: 3, name: 'Sarthak Sharma', points: 7980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=super', college: 'NIT Trichy' },
];

const LEADERBOARD_LIST = [
  { rank: 4, name: 'Ajay Sharma', points: 7650, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yash', college: 'DTU' },
  { rank: 5, name: 'Arjun Gupta', points: 7420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', college: 'IIT Jodhpur' },
  { rank: 6, name: 'Priya Das', points: 7100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', college: 'VIT Vellore' },
  { rank: 7, name: 'Kabir Singh', points: 6850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir', college: 'SRM University' },
  { rank: 8, name: 'Zoya Khan', points: 6420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya', college: 'MSU Baroda' },
];

export const Leaderboard = () => {
  const currentUser = getCurrentUser();
  const leaderboardList = LEADERBOARD_LIST.map((entry) =>
    (entry as { isUser?: boolean }).isUser
      ? { ...entry, name: currentUser.name, avatar: currentUser.avatar }
      : entry
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-500/15 rounded-full text-amber-600 dark:text-amber-300 text-sm font-bold border border-amber-100 dark:border-amber-500/30 mb-4">
          <Trophy className="h-4 w-4" /> Global Ranking
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Hall of Fame</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Compete with learners across the globe. Higher ranks unlock exclusive internship opportunities and rewards.
        </p>
      </header>

      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 md:order-1 flex flex-col items-center group w-full md:w-48"
        >
          <div className="relative mb-4">
            <img src={TOP_THREE[0].avatar} className="h-20 w-20 rounded-3xl border-4 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-lg" alt="" />
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-slate-900">2</div>
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-center">{TOP_THREE[0].name}</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">{TOP_THREE[0].college}</div>
          <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-t-3xl border-x border-t border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-700 dark:text-slate-200">{TOP_THREE[0].points.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">pts</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 md:order-2 flex flex-col items-center group w-full md:w-56"
        >
          <Crown className="h-8 w-8 text-amber-400 mb-2" />
          <div className="relative mb-4">
            <img src={TOP_THREE[1].avatar} className="h-24 w-24 rounded-3xl border-4 border-amber-300 dark:border-amber-500/50 bg-slate-100 dark:bg-slate-800 shadow-xl" alt="" />
            <div className="absolute -bottom-2 -right-2 h-9 w-9 bg-amber-400 rounded-full flex items-center justify-center text-white font-black border-2 border-white dark:border-slate-900">1</div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white text-center">{TOP_THREE[1].name}</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">{TOP_THREE[1].college}</div>
          <div className="w-full h-40 bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-slate-800 rounded-t-3xl border-x border-t border-amber-200 dark:border-amber-700/40 shadow-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{TOP_THREE[1].points.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase">pts</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3 flex flex-col items-center group w-full md:w-48"
        >
          <div className="relative mb-4">
            <img src={TOP_THREE[2].avatar} className="h-20 w-20 rounded-3xl border-4 border-orange-200 dark:border-orange-700/50 bg-slate-100 dark:bg-slate-800 shadow-lg" alt="" />
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-slate-900">3</div>
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-center">{TOP_THREE[2].name}</div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">{TOP_THREE[2].college}</div>
          <div className="w-full h-28 bg-slate-100 dark:bg-slate-800 rounded-t-3xl border-x border-t border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-700 dark:text-slate-200">{TOP_THREE[2].points.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">pts</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-black/40 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Movers & Shakers
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find a friend..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-full md:w-64 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {leaderboardList.map((user) => (
            <div
              key={user.rank}
              className="flex items-center justify-between p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-6">
                <span className="w-6 text-center font-black text-slate-400">{user.rank}</span>
                <img src={user.avatar} className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800" alt={user.name} />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">{user.name}</div>
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    <User className="h-3 w-3" /> {user.college}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900 dark:text-white">{user.points.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
