import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  LineChart, 
  ShieldAlert, 
  Palette, 
  Database, 
  TrendingUp, 
  ChevronRight,
  Target,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
  { id: 'frontend', title: 'Frontend Developer', icon: Code2, color: 'bg-blue-500', description: 'Master HTML, CSS, React, and modern frontend architecture.', level: 'Beginner to Advanced', modules: 12, trending: true },
  { id: 'backend', title: 'Backend Developer', icon: Terminal, color: 'bg-emerald-500', description: 'Learn Node.js, SQL/NoSQL, and system design patterns.', level: 'Beginner to Advanced', modules: 15, trending: false },
  { id: 'data-analyst', title: 'Data Analyst', icon: LineChart, color: 'bg-purple-500', description: 'Master Python, SQL, and data visualization tools.', level: 'Beginner to Pro', modules: 10, trending: true },
  { id: 'cybersecurity', title: 'Cybersecurity', icon: ShieldAlert, color: 'bg-red-500', description: 'Learn ethical hacking, network security, and defense.', level: 'Beginner to Pro', modules: 14, trending: false },
  { id: 'ui-ux', title: 'UI/UX Designer', icon: Palette, color: 'bg-pink-500', description: 'Learn Figma, user research, and interactive design.', level: 'Creative focused', modules: 8, trending: true },
  { id: 'fullstack', title: 'Fullstack Engineer', icon: Database, color: 'bg-indigo-500', description: 'The complete path from frontend to infrastructure.', level: 'Comprehensive', modules: 22, trending: true }
];

export const RoadmapList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 dark:text-indigo-300 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Career Paths</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Your Career Journey, <br />Visualized.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl font-medium leading-relaxed">
          Follow industry-standard paths designed to take you from absolute zero to a professional role. 
          Each step is verified by experts.
        </p>
      </header>

      <div className="mb-12 relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search career paths..."
          className="w-full pl-16 pr-6 py-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-xl shadow-slate-200/50 dark:shadow-black/40 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ROLES.map((role, i) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/roadmaps/${role.id}`)}
            className="group relative h-full cursor-pointer rounded-[40px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-10 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-950/40"
          >
            {role.trending && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" /> Trending
              </div>
            )}
            <div className={`w-16 h-16 ${role.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              <role.icon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{role.title}</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[3rem]">{role.description}</p>
            <div className="mt-6 flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500">
              <span>{role.level}</span>
              <span>·</span>
              <span>{role.modules} modules</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-8 mt-8">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">View path</span>
              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
