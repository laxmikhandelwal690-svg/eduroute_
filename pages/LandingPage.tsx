import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, BookOpen, ChevronRight, Play } from 'lucide-react';
import { Hero3D } from '../components/Hero3D';
import { AuthModal } from '../components/AuthModal';

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <Hero3D />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest">Next-Gen Education</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8">
              Navigate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Future
              </span>
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-12">
              The only platform that combines 3D roadmaps, AI mentors, and verified internship direct-connect. 
              Built for the next 10 million Indian tech leaders.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                Start Your Roadmap <Rocket className="h-6 w-6" />
              </button>
              <button className="flex items-center gap-3 text-slate-900 font-bold hover:text-indigo-600 transition-colors">
                 <div className="h-14 w-14 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-lg">
                    <Play className="h-5 w-5 fill-current" />
                 </div>
                 Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24 grid grid-cols-3 gap-8 border-t border-slate-100 pt-12"
          >
            {[
              { label: 'Learners', value: '45k+' },
              { label: 'Roadmaps', value: '25+' },
              { label: 'Partners', value: '120+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Featured Section */}
      <section className="bg-slate-50 py-32">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Succeed</h2>
               <p className="text-slate-500 font-medium text-lg">From zero to your first high-paying internship.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                     <Target className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">AI Roadmaps</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Dynamic paths that adjust based on your speed and performance.</p>
               </div>
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                     <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Skill Tests</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Weekly assessments to keep your skills sharp and points high.</p>
               </div>
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-8">
                     <ChevronRight className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Direct Hiring</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Top performers get fast-tracked into verified internships.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
