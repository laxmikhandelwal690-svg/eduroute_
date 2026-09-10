import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
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
  resources?: Array<{ label: string; url: string }>;
}

interface RoadmapLevel {
  name: string;
  status: 'completed' | 'current' | 'locked';
  modules: RoadmapModule[];
}

const ROADMAP_DATA: Record<string, { title: string; description: string; levels: RoadmapLevel[] }> = {
  frontend: {
    title: 'Frontend Developer',
    description: 'Learn the foundations of web interfaces, modern JavaScript, and React to build polished user experiences.',
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
            resources: [
              { label: 'MDN Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
              { label: 'JavaScript.info', url: 'https://javascript.info/' }
            ]
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
  },
  backend: {
    title: 'Backend Developer',
    description: 'Master server-side logic, APIs, databases, and system design to build scalable applications.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'b1', title: 'Programming Basics', lessons: ['Variables', 'Functions', 'Control Flow'], completed: true },
          { id: 'b2', title: 'HTTP & APIs', lessons: ['REST basics', 'JSON', 'Request/Response'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'b3', title: 'Node.js & Express', lessons: ['Routing', 'Middleware', 'Authentication'] },
          { id: 'b4', title: 'Databases', lessons: ['SQL', 'MongoDB', 'Relationships'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'b5', title: 'System Design', lessons: ['Scaling', 'Caching', 'Load Balancing'] },
          { id: 'b6', title: 'Production Deployment', lessons: ['Docker', 'CI/CD', 'Monitoring'] },
        ]
      }
    ]
  },
  'data-analyst': {
    title: 'Data Analyst',
    description: 'Build expertise in Python, SQL, data cleaning, statistics, and business intelligence storytelling.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'd1', title: 'Python Fundamentals', lessons: ['Syntax', 'Lists', 'Loops'], completed: true },
          { id: 'd2', title: 'Spreadsheet & Data Basics', lessons: ['Tables', 'Filters', 'Summaries'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'd3', title: 'SQL & Data Wrangling', lessons: ['SELECT', 'JOINs', 'CLEANING'] },
          { id: 'd4', title: 'Visualization', lessons: ['Charts', 'Dashboards', 'Insights'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'd5', title: 'Statistics', lessons: ['A/B testing', 'Probability', 'Hypothesis testing'] },
          { id: 'd6', title: 'Business Analytics', lessons: ['KPIs', 'Forecasting', 'Storytelling'] },
        ]
      }
    ]
  },
  cybersecurity: {
    title: 'Cybersecurity',
    description: 'Develop the skills to secure systems, analyze threats, and protect digital infrastructure.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'c1', title: 'Networking Basics', lessons: ['IP', 'DNS', 'Ports'], completed: true },
          { id: 'c2', title: 'Linux Essentials', lessons: ['Shell', 'Permissions', 'Processes'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'c3', title: 'Threat Fundamentals', lessons: ['Malware', 'Phishing', 'SOC basics'] },
          { id: 'c4', title: 'Web Security', lessons: ['OWASP', 'XSS', 'CSRF'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'c5', title: 'Offensive Security', lessons: ['Reconnaissance', 'Exploitation', 'Reporting'] },
          { id: 'c6', title: 'Defensive Security', lessons: ['Logs', 'SIEM', 'Incident Response'] },
        ]
      }
    ]
  },
  'ui-ux': {
    title: 'UI/UX Designer',
    description: 'Create user-first experiences with design thinking, wireframing, usability, and interaction patterns.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'u1', title: 'Design Fundamentals', lessons: ['Color', 'Layout', 'Typography'], completed: true },
          { id: 'u2', title: 'UX Research', lessons: ['User interviews', 'Pain points', 'Surveys'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'u3', title: 'Figma & Prototyping', lessons: ['Frames', 'Components', 'Interactions'] },
          { id: 'u4', title: 'Information Architecture', lessons: ['Navigation', 'Content hierarchy', 'Flows'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'u5', title: 'Design Systems', lessons: ['Tokens', 'Patterns', 'Accessibility'] },
          { id: 'u6', title: 'Portfolio & Case Studies', lessons: ['Research docs', 'Metrics', 'Presentation'] },
        ]
      }
    ]
  },
  fullstack: {
    title: 'Fullstack Engineer',
    description: 'Connect frontend craftsmanship with backend systems to ship complete products end-to-end.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'f1', title: 'Frontend Basics', lessons: ['HTML', 'CSS', 'Responsive UI'], completed: true },
          { id: 'f2', title: 'Backend Foundations', lessons: ['Servers', 'Database basics', 'APIs'], completed: true },
        ]
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'f3', title: 'Fullstack Project Flow', lessons: ['Auth', 'CRUD', 'State sync'] },
          { id: 'f4', title: 'Dev Tools', lessons: ['Debugging', 'Testing', 'Deployment'] },
        ]
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'f5', title: 'Production Architectures', lessons: ['Monorepos', 'Microservices', 'Caching'] },
          { id: 'f6', title: 'Scaling & Optimization', lessons: ['Performance', 'Monitoring', 'Reliability'] },
        ]
      }
    ]
  }
};

export const RoadmapDetail = () => {
  const { role } = useParams();
  const data = (role && ROADMAP_DATA[role]) || ROADMAP_DATA.frontend;
  const roadmapStorageKey = `eduroute-roadmap-${role || 'frontend'}`;

  const initialCompletedModules = useMemo(() => {
    const completedModules: Record<string, boolean> = {};

    Object.values(ROADMAP_DATA).forEach(({ levels }) => {
      levels.forEach((level) => {
        level.modules.forEach((module) => {
          completedModules[module.id] = module.completed ?? false;
        });
      });
    });

    return completedModules;
  }, []);

  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return initialCompletedModules;
    }

    try {
      const stored = localStorage.getItem(roadmapStorageKey);
      if (!stored) {
        return initialCompletedModules;
      }

      const parsed = JSON.parse(stored) as { modules?: Record<string, boolean>; lessons?: Record<string, boolean> };
      return { ...initialCompletedModules, ...(parsed.modules ?? {}) };
    } catch {
      return initialCompletedModules;
    }
  });

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    try {
      const stored = localStorage.getItem(roadmapStorageKey);
      if (!stored) {
        return {};
      }

      const parsed = JSON.parse(stored) as { modules?: Record<string, boolean>; lessons?: Record<string, boolean> };
      return parsed.lessons ?? {};
    } catch {
      return {};
    }
  });

  const toggleModuleCompletion = (moduleId: string) => {
    setCompletedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleLessonCompletion = (moduleId: string, lessonIndex: number) => {
    const key = `${moduleId}-${lessonIndex}`;

    setCompletedLessons((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      roadmapStorageKey,
      JSON.stringify({
        modules: completedModules,
        lessons: completedLessons,
      }),
    );
  }, [roadmapStorageKey, completedModules, completedLessons]);

  return (
    <div className="flex-1 pb-20">
      <div className="border-b border-slate-200 bg-slate-100 py-12 px-4 md:px-8 dark:border-white/10 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <Link to="/roadmaps" className="inline-flex items-center text-slate-600 hover:text-indigo-600 mb-6 text-sm font-bold transition-colors dark:text-slate-400 dark:hover:text-white">
            <ChevronLeft className="mr-1 h-4 w-4" /> All Roadmaps
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{data.title} Roadmap</h1>
              <p className="mt-4 text-slate-600 text-lg max-w-2xl dark:text-slate-400">{data.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">45%</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Progress</div>
              </div>
              <div className="text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-2xl font-black text-amber-500 dark:text-amber-400">1.2k</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Learners</div>
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
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{level.name} Path</h2>
                  <p className="text-slate-500 text-sm font-medium dark:text-slate-300">
                    {level.status === 'completed' ? 'Mastered' : level.status === 'current' ? 'Current Focus' : 'Locked'}
                  </p>
                </div>
              </div>

              <div className="ml-6 pl-12 space-y-6">
                {level.modules.map((module) => {
                  const isModuleCompleted = completedModules[module.id] ?? module.completed ?? false;

                  return (
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
                            {isModuleCompleted ? (
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Completed</span>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">In Progress</span>
                            )}
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-500">{module.lessons.length} Lessons</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleModuleCompletion(module.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isModuleCompleted ? 'bg-green-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                          }`}
                          aria-label={isModuleCompleted ? 'Mark module as incomplete' : 'Mark module as complete'}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.lessons.map((lesson, i) => {
                        const lessonKey = `${module.id}-${i}`;
                        const isLessonCompleted = completedLessons[lessonKey] ?? false;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleLessonCompletion(module.id, i)}
                            className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                              isLessonCompleted ? 'bg-green-50 hover:bg-green-100' : 'bg-slate-50 hover:bg-indigo-50'
                            }`}
                          >
                            {isLessonCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-300 group-hover:text-indigo-400" />
                            )}
                            <span className="text-sm font-medium text-slate-700">{lesson}</span>
                          </button>
                        );
                      })}
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
                          {module.resources.map((res) => (
                            <a key={res.label} href={res.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                              {res.label} <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
