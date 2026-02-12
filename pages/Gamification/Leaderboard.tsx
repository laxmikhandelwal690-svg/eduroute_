import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Search, User, Award } from 'lucide-react';

const TOP_THREE = [
  { rank: 2, name: 'Siddharth M.', points: 8420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sid', college: 'IIT Bombay' },
  { rank: 1, name: 'Ananya Sharma', points: 9250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya', college: 'BITS Pilani' },
  { rank: 3, name: 'Rahul Varma', points: 7980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', college: 'NIT Trichy' },
];

const LEADERBOARD_LIST = [
  { rank: 4, name: 'Arjun Gupta', points: 7650, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', college: 'DTU' },
  { rank: 5, name: 'Alex Rivera', points: 7420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', college: 'IIT Jodhpur', isUser: true },
  { rank: 6, name: 'Priya Das', points: 7100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', college: 'VIT Vellore' },
  { rank: 7, name: 'Kabir Singh', points: 6850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir', college: 'SRM University' },
  { rank: 8, name: 'Zoya Khan', points: 6420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya', college: 'MSU Baroda' },
];

export const Leaderboard = () => {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-full text-amber-600 text-sm font-bold border border-amber-100 mb-4">
          <Trophy className="h-4 w-4" /> Global Ranking
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Hall of Fame</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Compete with learners across the globe. Higher ranks unlock exclusive internship opportunities and rewards.</p>
      </header>

      {/* Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 px-4">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 md:order-1 flex flex-col items-center group w-full md:w-48"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-200 border-4 border-slate-300 overflow-hidden transform group-hover:rotate-6 transition-transform">
              <img src={TOP_THREE[0].avatar} alt={TOP_THREE[0].name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-400 border-4 border-white rounded-full flex items-center justify-center text-white font-black text-lg">2</div>
          </div>
          <div className="text-center mb-6">
            <div className="font-bold text-slate-900">{TOP_THREE[0].name}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">{TOP_THREE[0].points} PTS</div>
          </div>
          <div className="w-full h-32 bg-slate-100 rounded-t-3xl border-x border-t border-slate-200 shadow-sm flex items-center justify-center">
             <Medal className="h-12 w-12 text-slate-300" />
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 md:order-2 flex flex-col items-center group w-full md:w-56"
        >
          <div className="relative mb-6">
            <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-10 text-amber-400 animate-bounce" />
            <div className="w-32 h-32 rounded-[40px] bg-amber-50 border-4 border-amber-400 overflow-hidden transform group-hover:-rotate-6 transition-transform shadow-2xl shadow-amber-200">
              <img src={TOP_THREE[1].avatar} alt={TOP_THREE[1].name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-amber-400 border-4 border-white rounded-full flex items-center justify-center text-white font-black text-xl">1</div>
          </div>
          <div className="text-center mb-6">
            <div className="text-xl font-black text-slate-900">{TOP_THREE[1].name}</div>
            <div className="text-sm font-bold text-amber-600 uppercase tracking-widest">{TOP_THREE[1].points} PTS</div>
          </div>
          <div className="w-full h-48 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-[40px] shadow-2xl flex items-center justify-center">
             <Crown className="h-16 w-16 text-white/50" />
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3 flex flex-col items-center group w-full md:w-48"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-3xl bg-orange-50 border-4 border-orange-300 overflow-hidden transform group-hover:rotate-6 transition-transform">
              <img src={TOP_THREE[2].avatar} alt={TOP_THREE[2].name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-orange-400 border-4 border-white rounded-full flex items-center justify-center text-white font-black text-lg">3</div>
          </div>
          <div className="text-center mb-6">
            <div className="font-bold text-slate-900">{TOP_THREE[2].name}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">{TOP_THREE[2].points} PTS</div>
          </div>
          <div className="w-full h-24 bg-orange-50 rounded-t-3xl border-x border-t border-orange-100 shadow-sm flex items-center justify-center">
             <Award className="h-12 w-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* List */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-2 font-bold text-slate-900">
                <TrendingUp className="h-5 w-5 text-indigo-600" /> Movers & Shakers
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Find a friend..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-full md:w-64"
                />
             </div>
          </div>

          <div className="divide-y divide-slate-50">
            {LEADERBOARD_LIST.map((user) => (
              <div 
                key={user.rank}
                className={`flex items-center justify-between p-6 transition-colors hover:bg-slate-50 ${user.isUser ? 'bg-indigo-50/50' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <span className="w-6 text-center font-black text-slate-400">{user.rank}</span>
                  <div className="relative">
                    <img src={user.avatar} className="h-12 w-12 rounded-2xl bg-slate-100" alt={user.name} />
                    {user.isUser && (
                       <div className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-600 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {user.name}
                      {user.isUser && <span className="px-2 py-0.5 bg-indigo-600 text-[10px] text-white rounded-full uppercase">You</span>}
                    </div>
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                       <User className="h-3 w-3" /> {user.college}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{user.points.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
