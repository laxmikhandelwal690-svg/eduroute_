import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  Circle, 
  Youtube, 
  ExternalLink,
  Trophy,
  Zap,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoadmapModule {
  id: string;
  title: string;
  lessons: string[];
  completed?: boolean;
  video?: string;
  resources?: string[];
}

interface RoadmapLevel {
  name: string;
  status: 'completed' | 'current' | 'locked';
  modules: RoadmapModule[];
}

const ROADMAP_DATA: Record<string, { title: string; description: string; levels: RoadmapLevel[] }> = {
  frontend: {
    title: 'Frontend Developer',
    description: 'The journey to becoming a professional web developer.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: '1', title: 'Internet Fundamentals', lessons: ['How the web works', 'DNS', 'HTTP/HTTPS'], completed: true },
          { id: '2', title: 'HTML & CSS', lessons: ['Semantic HTML', 'CSS Flexbox/Grid', 'Responsive Design'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { 
            id: '3', 
            title: 'Modern JavaScript', 
            lessons: ['ES6+ Syntax', 'Asynchronous JS', 'DOM Manipulation'],
            video: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            resources: ['MDN Documentation', 'JavaScript.info']
          },
          { id: '4', title: 'React Essentials', lessons: ['Hooks', 'Props/State', 'Components'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: '5', title: 'Next.js & Performance', lessons: ['SSR/SSG', 'Optimization', 'Vercel Deployment'] },
          { id: '6', title: 'Advanced Testing', lessons: ['Jest', 'Cypress', 'RTL'] },
        ]
      }
    ]
  }
};

export const RoadmapDetail = () => {
  const { role } = useParams();
  const data = (role && ROADMAP_DATA[role]) || ROADMAP_DATA.frontend;

  return (
    <div className="flex-1 pb-20">
      <div className="bg-slate-900 py-12 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <Link to="/roadmaps" className="inline-flex items-center text-slate-400 hover:text-white mb-6 text-sm font-bold transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" /> All Roadmaps
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">{data.title} Roadmap</h1>
              <p className="mt-4 text-slate-400 text-lg max-w-2xl">{data.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-indigo-400">45%</div>
                <div className="text-[10px] font-bold uppercase text-slate-500">Progress</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-2xl font-black text-amber-400">1.2k</div>
                <div className="text-[10px] font-bold uppercase text-slate-500">Learners</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12">
        <div className="space-y-16 relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>

          {data.levels.map((level) => (
            <div key={level.name} className="relative">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  level.status === 'completed' ? 'bg-green-500' : 
                  level.status === 'current' ? 'bg-indigo-600 ring-4 ring-indigo-500/20' : 'bg-slate-300'
                }`}>
                  {level.status === 'completed' ? <CheckCircle2 className="h-6 w-6 text-white" /> : 
                   level.status === 'current' ? <Zap className="h-6 w-6 text-white" /> : <Trophy className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{level.name} Path</h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {level.status === 'completed' ? 'Mastered' : level.status === 'current' ? 'Current Focus' : 'Locked'}
                  </p>
                </div>
              </div>

              <div className="ml-6 pl-12 space-y-6">
                {level.modules.map((module) => (
                  <motion.div 
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className={`p-6 rounded-3xl border ${
                      level.status === 'locked' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{module.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {module.completed ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Completed</span>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">In Progress</span>
                          )}
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-500">{module.lessons.length} Lessons</span>
                        </div>
                      </div>
                      {level.status !== 'locked' && (
                        <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                          <Play className="h-4 w-4 fill-current" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.lessons.map((lesson, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group cursor-pointer hover:bg-indigo-50 transition-colors">
                          {module.completed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-slate-300 group-hover:text-indigo-400" />}
                          <span className="text-sm font-medium text-slate-700">{lesson}</span>
                        </div>
                      ))}
                    </div>

                    {module.video && (
                      <div className="mt-8">
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-900">
                          <Youtube className="h-4 w-4 text-red-600" /> Recommended Video
                        </div>
                        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                           <iframe 
                             width="100%" 
                             height="100%" 
                             src={module.video} 
                             title="YouTube video player" 
                             frameBorder="0" 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen
                           ></iframe>
                        </div>
                      </div>
                    )}

                    {module.resources && (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-900">
                          <BookOpen className="h-4 w-4 text-indigo-600" /> Key Resources
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {module.resources.map((res: string) => (
                            <a key={res} href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                              {res} <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
