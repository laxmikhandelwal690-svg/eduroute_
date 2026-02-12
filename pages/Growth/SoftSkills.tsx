import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Lightbulb, 
  Play, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  BrainCircuit,
  Award
} from 'lucide-react';

const SKILLS = [
  { id: '1', title: 'Professional Communication', modules: 5, duration: '2.5h', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: '2', title: 'Emotional Intelligence', modules: 4, duration: '1.8h', icon: BrainCircuit, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: '3', title: 'Team Leadership', modules: 6, duration: '3.2h', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: '4', title: 'Creative Problem Solving', modules: 3, duration: '1.5h', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export const SoftSkills = () => {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Soft Skills & Personality</h1>
        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
          Master the non-technical skills that will set you apart in the industry. From storytelling to team management.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {SKILLS.map((skill) => (
          <motion.div
            key={skill.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`w-14 h-14 ${skill.bg} ${skill.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
               <skill.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{skill.title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
               <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {skill.duration}</span>
               <span className="flex items-center gap-1.5"><Play className="h-3 w-3" /> {skill.modules} Modules</span>
            </div>
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
            <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-900 hover:bg-indigo-700 transition-all flex items-center gap-2">
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
