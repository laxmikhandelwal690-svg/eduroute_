import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Timer, 
  HelpCircle, 
  ChevronRight, 
  BarChart2, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ASSESSMENTS = [
  { id: '1', title: 'React Performance optimization', category: 'Frontend', questions: 20, time: '30m', level: 'Intermediate', points: 200 },
  { id: '2', title: 'Node.js Security Patterns', category: 'Backend', questions: 15, time: '20m', level: 'Advanced', points: 300 },
  { id: '3', title: 'UI/UX Fundamentals', category: 'Design', questions: 25, time: '40m', level: 'Beginner', points: 150 },
];

export const Assessments = () => {
  const [view, setView] = useState<'list' | 'quiz' | 'results'>('list');

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      {view === 'list' && (
        <>
          <header className="mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-6">Skill Assessments</h1>
            <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
              Validate your knowledge, earn points, and unlock exclusive rewards. 
              Our tests are designed to find your learning gaps.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <Trophy className="h-10 w-10 mb-6 opacity-80" />
              <div className="text-4xl font-black">1,250</div>
              <div className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Total Points</div>
            </div>
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <BarChart2 className="h-10 w-10 mb-6 text-emerald-500" />
              <div className="text-4xl font-black text-slate-900">84%</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Avg. Accuracy</div>
            </div>
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <Clock className="h-10 w-10 mb-6 text-amber-500" />
              <div className="text-4xl font-black text-slate-900">12</div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Tests Completed</div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Weekly Challenges</h2>
            {ASSESSMENTS.map((test) => (
              <motion.div 
                key={test.id}
                whileHover={{ scale: 1.01 }}
                className="group flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="h-20 w-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm">
                    <HelpCircle className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{test.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="text-indigo-600 font-black">{test.category}</span>
                      <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                      <span>{test.questions} Questions</span>
                      <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                      <span>{test.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="hidden lg:flex flex-col items-end mr-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Difficulty</span>
                    <span className="text-xs font-black text-slate-700 mt-1">{test.level.toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={() => setView('quiz')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100"
                  >
                    Take Test <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {view === 'quiz' && (
        <div className="max-w-4xl mx-auto py-12">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setView('list')} className="p-4 hover:bg-white rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-slate-900 shadow-sm">
                <ChevronRight className="h-6 w-6 rotate-180" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900">React Performance Test</h2>
                <div className="h-2 w-48 bg-slate-100 rounded-full mt-2">
                   <div className="h-full w-[20%] bg-indigo-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-600 rounded-[20px] font-black text-lg border border-amber-100 shadow-sm">
              <Timer className="h-6 w-6" /> 28:45
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-50 p-12 shadow-2xl">
            <div className="mb-12">
              <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Question 4 / 20</span>
              <h3 className="text-3xl font-black text-slate-900 mt-4 leading-tight">
                Which hook should be used to memoize a value and prevent unnecessary re-computations?
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {['useCallback', 'useMemo', 'useRef', 'useEffect'].map((opt, i) => (
                <button 
                  key={i}
                  className="group w-full text-left p-6 rounded-[28px] border-2 border-slate-50 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center"
                >
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 mr-6 group-hover:bg-indigo-600 group-hover:text-white font-black transition-all">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-lg font-bold text-slate-700 group-hover:text-indigo-900">{opt}</span>
                </button>
              ))}
            </div>

            <div className="mt-16 flex justify-between items-center">
              <button className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-sm hover:text-slate-900 transition-colors">Skip</button>
              <button 
                onClick={() => setView('results')}
                className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105"
              >
                Confirm & Next
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'results' && (
        <div className="max-w-3xl mx-auto py-12 text-center">
          <div className="inline-flex items-center justify-center h-32 w-32 bg-green-50 rounded-[40px] text-green-600 mb-10 shadow-sm border border-green-100">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-6">Great Progress!</h2>
          <p className="text-slate-500 text-xl mb-16 font-medium leading-relaxed">You've completed the assessment with an impressive score. Points have been added to your profile.</p>

          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50">
              <div className="text-5xl font-black text-indigo-600">18/20</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Correct Answers</div>
            </div>
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50">
              <div className="text-5xl font-black text-amber-500">+200</div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Points Gained</div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-10 rounded-[40px] flex items-start gap-8 text-left mb-16">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-white">
               <AlertCircle className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-xl font-black text-indigo-900 mb-2">Identify Your Gap</h4>
              <p className="text-indigo-700 font-medium leading-relaxed">
                You struggled with questions related to `useCallback`. We've added a specialized module to your Frontend roadmap to help you master it.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => setView('list')}
              className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200"
            >
              Back to Skill Center
            </button>
            <button className="flex-1 py-5 bg-white border border-slate-200 text-slate-900 rounded-[24px] font-black text-lg hover:bg-slate-50 transition-all">
              Download Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
