import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Gift, Lock, CheckCircle2, ShoppingBag, Sparkles, ArrowRight, Star, Volume2, VolumeX } from 'lucide-react';
import { useUISound } from '../../contexts/SoundContext';

const REWARDS = [
  {
    id: '1',
    title: '50% Off IIT Jodhpur Professional Courses',
    description: 'Get deep discounts on certified professional courses from IIT J.',
    points: 5000,
    locked: false,
    category: 'Education',
    partner: 'IIT Jodhpur',
  },
  {
    id: '2',
    title: 'Free 1-Month LinkedIn Premium',
    description: 'Boost your job search with LinkedIn Premium Career features.',
    points: 8000,
    locked: true,
    category: 'Career',
    partner: 'LinkedIn',
  },
  {
    id: '3',
    title: 'Premium Resume Review',
    description: 'Get your resume reviewed by top recruiters from FAANG companies.',
    points: 3000,
    locked: false,
    category: 'Coaching',
    partner: 'EDUROUTE',
  },
  {
    id: '4',
    title: 'AWS Certification Voucher',
    description: '100% discount on any AWS Associate level certification exam.',
    points: 15000,
    locked: true,
    category: 'Certification',
    partner: 'Amazon Web Services',
  },
];

export const Rewards = () => {
  const { isMuted, toggleMuted, playSuccess } = useUISound();
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  const handleClaim = (rewardTitle: string) => {
    setClaimedReward(rewardTitle);
    playSuccess();
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold mb-4">
            <Gift className="h-6 w-6" />
            <span className="uppercase tracking-widest text-sm">Reward Store</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Redeem Your Points</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
            Your hard work pays off. Exchange your learning points for exclusive vouchers, courses, and perks.
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 dark:shadow-indigo-950/40">
          <div className="text-sm font-bold uppercase opacity-80 mb-1">Your Balance</div>
          <div className="text-4xl font-black mb-2">12,450</div>
          <div className="text-sm opacity-80">points available</div>
        </div>
      </header>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
          <ShoppingBag className="h-4 w-4" /> {REWARDS.length} rewards
        </div>
        <button
          type="button"
          onClick={toggleMuted}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          {isMuted ? 'Sound off' : 'Sound on'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REWARDS.map((reward, i) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl dark:shadow-black/30 transition-all"
          >
            {reward.locked && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase">
                <Lock className="h-3 w-3" /> Locked
              </div>
            )}
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
              {reward.category} · {reward.partner}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{reward.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{reward.description}</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black">
                <Star className="h-4 w-4 fill-current" /> {reward.points.toLocaleString()} pts
              </div>
              {reward.locked ? (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-bold cursor-not-allowed"
                >
                  Need more points
                </button>
              ) : claimedReward === reward.title ? (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> Claimed
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClaim(reward.title)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="h-4 w-4" /> Redeem
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Climb the leaderboard for more points <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
