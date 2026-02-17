import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, BookOpen, ChevronRight, Play, Sparkles, Trophy, Briefcase, Linkedin } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

const LINKEDIN_URL = 'https://www.linkedin.com/in/vansh-khandelwal-22636a373';

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const demoSectionRef = useRef<HTMLElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50/40">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Navbar */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">E</div>
            <span className="text-xl font-black text-slate-900">EDUROUTE</span>
          </div>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A66C2]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0A66C2]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]"
            aria-label="Connect with Vansh Khandelwal on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
            Connect on LinkedIn
          </a>
        </div>
      </header>
      
      <div className="absolute top-0 left-0 w-full h-[420px] bg-gradient-to-b from-emerald-100/80 via-amber-100/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-700">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest">AI Career Platform for Every Student</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8">
              Build Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-amber-500 to-orange-500">
                Get Hired.
              </span>
            </h1>

            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-12">
              EDUROUTE maps each career role into step-by-step levels from Beginner to Pro, with AI Buddy guidance,
              assessments, internships, and direct hiring opportunities—designed for students from every city and town.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
              >
                Start Your Roadmap <Rocket className="h-6 w-6" />
              </button>
              <button
                onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex items-center gap-3 text-slate-900 font-bold hover:text-emerald-700 transition-colors"
              >
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
              { label: 'Roadmaps', value: '80+' },
              { label: 'Hiring Partners', value: '120+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="space-y-4"
          >
            {[
              {
                icon: Sparkles,
                title: 'AI Buddy in English, Hindi & Hinglish',
                desc: '24/7 personalized guidance for roadmap planning, interview prep, and doubts.',
              },
              {
                icon: Trophy,
                title: 'Gamified Progress + Leaderboards',
                desc: 'Complete tasks, earn points, unlock rewards, and stand out to recruiters.',
              },
              {
                icon: Briefcase,
                title: 'Internships & Direct Company Hiring',
                desc: 'Apply for skill-based roles and discover company culture through short videos.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white/90 backdrop-blur border border-amber-100 rounded-3xl p-6 shadow-sm">
                <item.icon className="h-7 w-7 text-emerald-700 mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Featured Section */}
      <section ref={demoSectionRef} className="bg-slate-50 py-20 sm:py-32">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Succeed</h2>
               <p className="text-slate-500 font-medium text-lg">From zero to your first high-paying internship.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                     <Target className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">AI Roadmaps</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Dynamic paths that adjust based on your speed and performance.</p>
               </div>
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8">
                     <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Skill Tests</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Weekly assessments to keep your skills sharp and points high.</p>
               </div>
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-8">
                     <ChevronRight className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Direct Hiring</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Top performers get fast-tracked into verified internships.</p>
               </div>
            </div>
         </div>
      </section>

      {/* About / Team LinkedIn Bio Card */}
      <section className="bg-white py-20 sm:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">About the Team</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">Meet the Builder Behind Eduroute</h2>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                <Linkedin className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900">Vansh Khandelwal</h3>
                <p className="text-slate-600 font-medium">Founder & Product Builder, Eduroute</p>
                <p className="mt-3 text-slate-500 leading-relaxed">
                  Building AI-powered career learning experiences that help students from every background become
                  industry-ready and employable.
                </p>
              </div>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#0857a5]"
              >
                <Linkedin className="h-4 w-4" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-bold">© {new Date().getFullYear()} EDUROUTE</p>
            <p className="text-sm text-slate-400">AI career guidance and hiring pathways for every student.</p>
          </div>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0857a5]"
          >
            <Linkedin className="h-4 w-4" />
            Connect on LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};
