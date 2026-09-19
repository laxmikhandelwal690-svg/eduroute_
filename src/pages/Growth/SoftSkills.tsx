import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Brain, 
  Handshake, 
  Presentation, 
  Clock, 
  Play,
  ChevronRight,
  CheckCircle2,
  Award
} from 'lucide-react';

const SOFT_SKILLS = [
  { id: '1', title: 'Effective Communication', icon: MessageSquare, color: 'bg-blue-500', duration: '2h 15m', modules: 5 },
  { id: '2', title: 'Team Collaboration', icon: Users, color: 'bg-emerald-500', duration: '1h 45m', modules: 4 },
  { id: '3', title: 'Critical Thinking', icon: Brain, color: 'bg-purple-500', duration: '3h 00m', modules: 6 },
  { id: '4', title: 'Professional Networking', icon: Handshake, color: 'bg-orange-500', duration: '1h 30m', modules: 3 },
  { id: '5', title: 'Public Speaking', icon: Presentation, color: 'bg-pink-500', duration: '2h 45m', modules: 5 },
];

export const SoftSkills = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
          <Users className="h-6 w-6" /> <span className="uppercase tracking-widest text-sm">Growth Track</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Soft Skills & Personality</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
          Technical skills get you the interview. Soft skills get you the job. Build the professional edge that sets you apart.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {SOFT_SKILLS.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl dark:shadow-black/30 transition-all group"
          >
            <div className={`w-14 h-14 ${skill.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
              <skill.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{skill.title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mb-6">
               <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {skill.duration}</span>
               <span className="flex items-center gap-1.5"><Play className="h-3 w-3" /> {skill.modules} Modules</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/buddy')}
              className="w-full py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"
            >
              Start Learning
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden">
         <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">
               Recommended for you
            </div>
            <h2 className="text-3xl font-black mb-4">Mastering Tech Interviews: Storytelling & Confidence</h2>
            <p className="text-slate-400 mb-8 font-medium">
               Learn how to present your technical projects as compelling stories. 
               This module includes a mock interview with Buddy AI.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
               <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Lesson Video
               </div>
               <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> Mini Quiz
               </div>
               <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4 text-green-400" /> AI Practice
               </div>
            </div>
            <button onClick={() => navigate('/buddy')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-900 hover:bg-indigo-700 transition-all flex items-center gap-2">
               Start Module <ChevronRight className="h-5 w-5" />
            </button>
         </div>
         <div className="hidden lg:block absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-600/20 blur-[100px]"></div>
         <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-12 w-64 h-64 border-4 border-white/5 rounded-full"></div>
         <Award className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-32 h-24 w-24 text-white/10" />
      </div>
    </div>
  );
};
