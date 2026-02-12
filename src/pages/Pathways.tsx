import { motion } from 'framer-motion';
import { Layers, Database, ArrowRight, CheckCircle2, Map } from 'lucide-react';
import { PATHS, COURSES } from '../data/mockData';
import { LearningPath } from '../types';

const iconMap: Record<string, any> = {
  Layers: Layers,
  Database: Database,
  Map: Map,
};

export const Pathways = () => {
  return (
    <div className="flex-1 p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Learning Pathways</h1>
        <p className="mt-2 text-slate-600">Step-by-step guides to mastering specific domains. No more guessing what to learn next.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {PATHS.map((path) => (
          <PathCard key={path.id} path={path} />
        ))}
      </div>
    </div>
  );
};

const PathCard = ({ path }: { path: LearningPath }) => {
  const Icon = iconMap[path.icon] || Map;
  const pathCourses = COURSES.filter(c => path.courses.includes(c.id));

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl"
    >
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
        <div className="mb-6 inline-flex rounded-2xl bg-white/20 p-3 backdrop-blur-md">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold">{path.title}</h3>
        <p className="mt-2 opacity-90">{path.description}</p>
        <div className="mt-6 flex items-center gap-4 text-sm font-semibold">
          <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" /> {path.courses.length} Courses</span>
          <span className="h-1 w-1 rounded-full bg-white/40"></span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {path.estimatedTime}</span>
        </div>
      </div>
      <div className="flex-1 p-6">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Curriculum</h4>
        <div className="space-y-4">
          {pathCourses.map((course, index) => (
            <div key={course.id} className="flex items-center gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-100 text-sm font-bold text-slate-400">
                {index + 1}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <span className="font-medium text-slate-700">{course.title}</span>
                <span className="text-xs text-slate-400">{course.duration}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-indigo-600">
          Start Pathway <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};
