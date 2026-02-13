import { motion } from 'framer-motion';
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
    partner: 'IIT Jodhpur'
  },
  { 
    id: '2', 
    title: 'Free 1-Month LinkedIn Premium', 
    description: 'Boost your job search with LinkedIn Premium Career features.',
    points: 8000, 
    locked: true,
    category: 'Career',
    partner: 'LinkedIn'
  },
  { 
    id: '3', 
    title: 'Premium Resume Review', 
    description: 'Get your resume reviewed by top recruiters from FAANG companies.',
    points: 3000, 
    locked: false,
    category: 'Coaching',
    partner: 'EDUROUTE'
  },
  { 
    id: '4', 
    title: 'AWS Certification Voucher', 
    description: '100% discount on any AWS Associate level certification exam.',
    points: 15000, 
    locked: true,
    category: 'Certification',
    partner: 'Amazon Web Services'
  }
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
          <div className="flex items-center gap-2 text-pink-600 font-bold mb-4">
             <Gift className="h-6 w-6" /> <span className="uppercase tracking-widest text-sm">Reward Store</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Redeem Your Points</h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Your hard work pays off. Exchange your learning points for exclusive vouchers, courses, and perks.
          </p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200">
           <div className="text-sm font-bold uppercase opacity-80 mb-1">Your Balance</div>
           <div className="text-5xl font-black mb-2 flex items-center gap-3">
              1,250 <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
           </div>
           <div className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full inline-block">
              Top 15% of all learners
           </div>
        </div>
      </header>


      {claimedReward && (
        <div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700 font-semibold flex items-center justify-between gap-4">
          <span>Success! <strong>{claimedReward}</strong> has been added to your claimed rewards.</span>
          <button
            onClick={() => setClaimedReward(null)}
            className="text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8 flex justify-end">
        <button
          onClick={toggleMuted}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          UI Sounds: {isMuted ? 'Muted' : 'On'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {REWARDS.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ y: -5 }}
            className={`group relative overflow-hidden rounded-[40px] border-2 transition-all p-8 flex flex-col ${
              reward.locked ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-white border-white shadow-xl hover:shadow-2xl hover:border-indigo-100'
            }`}
          >
            {reward.locked && (
              <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center">
                 <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-slate-900">
                    <Lock className="h-5 w-5 text-slate-400" /> Insufficient Points
                 </div>
              </div>
            )}

            <div className="flex items-start justify-between mb-8">
               <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                  <ShoppingBag className={`h-8 w-8 ${reward.locked ? 'text-slate-300' : 'text-indigo-600'}`} />
               </div>
               <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                 reward.locked ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700'
               }`}>
                  {reward.category}
               </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">{reward.title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed font-medium">
               {reward.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
               <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Cost</div>
                  <div className={`text-2xl font-black ${reward.locked ? 'text-slate-400' : 'text-slate-900'}`}>
                    {reward.points.toLocaleString()} <span className="text-sm font-bold text-slate-400">PTS</span>
                  </div>
               </div>
               <button 
                 disabled={reward.locked}
                 onClick={() => handleClaim(reward.title)}
                 className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg ${
                   reward.locked 
                     ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' 
                     : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95'
                 }`}
               >
                  Claim Now <ArrowRight className="h-4 w-4" />
               </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold">
               <span className="text-slate-400 uppercase tracking-widest">Partner</span>
               <div className="flex items-center gap-1.5 text-slate-700">
                  <Sparkles className="h-3 w-3 text-amber-400" /> {reward.partner}
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-indigo-900 rounded-[60px] text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[100px] -z-10"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 blur-[100px] -z-10"></div>
         
         <CheckCircle2 className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
         <h2 className="text-3xl font-black text-white mb-4">How to Earn More?</h2>
         <p className="text-indigo-200 max-w-2xl mx-auto mb-10 font-medium">
            Completing modules gives you 50 pts, finishing roadmaps earns you 500 pts, 
            and scoring high on assessments can net you up to 200 pts per test.
         </p>
         <button className="px-12 py-5 bg-white text-indigo-900 rounded-[30px] font-black hover:bg-indigo-50 transition-all shadow-2xl">
            Start Learning Now
         </button>
      </div>
    </div>
  );
};
