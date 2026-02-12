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
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
          <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Career Paths</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Your Career Journey, <br />Visualized.</h1>
        <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
          Follow industry-standard paths designed to take you from absolute zero to a professional role. 
          Each step is verified by experts.
        </p>
      </header>

      <div className="mb-12 relative max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for a role (e.g. AI Engineer)..."
          className="w-full pl-16 pr-6 py-6 bg-white border border-slate-100 rounded-[28px] shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ROLES.map((role) => (
          <motion.div 
            key={role.id}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/roadmaps/${role.id}`)}
            className="group relative h-full cursor-pointer bg-white rounded-[40px] border border-slate-50 p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300"
          >
            {role.trending && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black tracking-widest border border-amber-100">
                <TrendingUp className="h-3 w-3" /> TRENDING
              </div>
            )}
            
            <div className={`w-16 h-16 ${role.color} rounded-[24px] flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-100 transform group-hover:scale-110 transition-transform`}>
              <role.icon className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{role.title}</h3>
            <p className="mt-4 text-slate-500 text-base leading-relaxed mb-10 font-medium">
              {role.description}
            </p>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complexity</span>
                <span className="text-xs font-bold text-slate-700 mt-1">{role.level}</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                Map <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
