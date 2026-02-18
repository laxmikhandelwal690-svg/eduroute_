import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, BookOpen, ChevronRight, Play, Sparkles, Trophy, Briefcase, Linkedin } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const demoSectionRef = useRef<HTMLElement | null>(null);
  const founderLinkedinUrl = 'https://www.linkedin.com/in/vansh-khandelwal-22636a373';
  const coFounderLinkedinUrl = 'https://www.linkedin.com/in/deepesh-chauhan-a12413382';

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="relative z-20 border-b border-white/60 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-xl font-black tracking-tight text-slate-900">EDUROUTE</div>
          <a
            href={founderLinkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A66C2]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#004182]"
          >
            <Linkedin className="h-4 w-4" />
            Connect on LinkedIn
          </a>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(167,243,208,0.7),transparent_45%),radial-gradient(circle_at_85%_18%,rgba(186,230,253,0.65),transparent_42%),radial-gradient(circle_at_65%_74%,rgba(253,186,116,0.45),transparent_48%),linear-gradient(135deg,rgba(240,253,250,0.95),rgba(239,246,255,0.9)_45%,rgba(255,247,237,0.88))]" />
      <div className="pointer-events-none absolute -top-16 left-16 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-12 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-2xl border border-white/50 bg-white/45 text-emerald-800 shadow-lg shadow-sky-100/50 backdrop-blur-xl">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest">AI Career Platform for Every Student</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 drop-shadow-[0_6px_24px_rgba(148,163,184,0.25)]">
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
                className="w-full sm:w-auto px-10 py-5 rounded-[24px] border border-white/60 bg-white/70 text-slate-900 font-black text-lg shadow-2xl shadow-slate-200/60 backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/85 active:scale-95 flex items-center justify-center gap-3"
              >
                Start Your Roadmap <Rocket className="h-6 w-6" />
              </button>
              <button
                onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex items-center gap-3 text-slate-900 font-bold hover:text-emerald-700 transition-colors"
              >
                 <div className="h-14 w-14 rounded-full border border-white/70 flex items-center justify-center bg-white/65 shadow-lg backdrop-blur-lg">
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
            className="mt-24 grid grid-cols-3 gap-8 rounded-3xl border border-white/55 bg-white/40 p-8 shadow-lg shadow-slate-200/60 backdrop-blur-xl"
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
              <div key={index} className="rounded-3xl border border-white/50 bg-white/50 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
                <item.icon className="h-7 w-7 text-emerald-700 mb-4" />
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Featured Section */}
      <section ref={demoSectionRef} className="relative py-20 sm:py-32">
         <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-sky-50/40 to-orange-50/35" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need to Succeed</h2>
               <p className="text-slate-500 font-medium text-lg">From zero to your first high-paying internship.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               <div className="rounded-[40px] border border-white/55 bg-white/55 p-10 shadow-lg shadow-slate-200/45 backdrop-blur-xl transition-all hover:shadow-2xl">
                  <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                     <Target className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">AI Roadmaps</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Dynamic paths that adjust based on your speed and performance.</p>
               </div>
               <div className="rounded-[40px] border border-white/55 bg-white/55 p-10 shadow-lg shadow-slate-200/45 backdrop-blur-xl transition-all hover:shadow-2xl">
                  <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8">
                     <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Skill Tests</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Weekly assessments to keep your skills sharp and points high.</p>
               </div>
               <div className="rounded-[40px] border border-white/55 bg-white/55 p-10 shadow-lg shadow-slate-200/45 backdrop-blur-xl transition-all hover:shadow-2xl">
                  <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-8">
                     <ChevronRight className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Direct Hiring</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Top performers get fast-tracked into verified internships.</p>
               </div>
            </div>
         </div>
      </section>

      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-4xl font-black text-slate-900">About the Team</h2>
            <p className="text-lg font-medium text-slate-500">Meet the founder and co-founder behind Eduroute.</p>
          </div>

          <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/70 p-6 text-center shadow-xl shadow-slate-200/60 backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                <Linkedin className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Vansh Khandelwal</h3>
              <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500">Founder, Eduroute</p>
              <a
                href={founderLinkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2] px-6 py-3 font-bold text-white shadow-lg shadow-[#0A66C2]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#004182]"
              >
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </a>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/70 p-6 text-center shadow-xl shadow-slate-200/60 backdrop-blur-xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white">
                <Linkedin className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Deepesh Chauhan</h3>
              <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-500">Co-Founder, Eduroute</p>
              <a
                href={coFounderLinkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2] px-6 py-3 font-bold text-white shadow-lg shadow-[#0A66C2]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#004182]"
              >
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/60 bg-white/65 py-10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-slate-500">© {new Date().getFullYear()} Eduroute. All rights reserved.</p>
          <a
            href={founderLinkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0A66C2]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#004182]"
          >
            <Linkedin className="h-4 w-4" />
            Connect on LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};
