import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Target,
  BookOpen,
  ChevronRight,
  Play,
  Sparkles,
  Trophy,
  Briefcase,
  Linkedin,
  type LucideIcon,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

const LINKEDIN_URL = 'https://www.linkedin.com/in/vansh-khandelwal-22636a373';

const STATS = [
  { label: 'Learners', value: '45k+' },
  { label: 'Roadmaps', value: '80+' },
  { label: 'Hiring Partners', value: '120+' },
];

const HIGHLIGHTS: { icon: LucideIcon; title: string; desc: string }[] = [
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
];

const FEATURES: { icon: LucideIcon; title: string; desc: string; iconClass: string }[] = [
  {
    icon: Target,
    title: 'AI Roadmaps',
    desc: 'Dynamic paths that adjust based on your speed and performance.',
    iconClass: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: BookOpen,
    title: 'Skill Tests',
    desc: 'Weekly assessments to keep your skills sharp and points high.',
    iconClass: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ChevronRight,
    title: 'Direct Hiring',
    desc: 'Top performers get fast-tracked into verified internships.',
    iconClass: 'bg-orange-50 text-orange-600',
  },
];

const LinkedInButton = ({ className = '', ariaLabel }: { className?: string; ariaLabel?: string }) => (
  <a
    href={LINKEDIN_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className={[
      'inline-flex items-center gap-2 rounded-full bg-[#0A66C2] text-sm font-bold text-white transition-all',
      'hover:-translate-y-0.5 hover:bg-[#0857a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2]',
      className,
    ].join(' ')}
  >
    <Linkedin className="h-4 w-4" />
    Connect on LinkedIn
  </a>
);

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const demoSectionRef = useRef<HTMLElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-amber-50/40">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Top navbar with LinkedIn CTA */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black">E</div>
            <span className="text-xl font-black text-slate-900">EDUROUTE</span>
          </div>

          <LinkedInButton
            className="px-5 py-2.5 shadow-lg shadow-[#0A66C2]/30 hover:shadow-xl hover:shadow-[#0A66C2]/40"
            ariaLabel="Connect with Vansh Khandelwal on LinkedIn"
          />
        </div>
      </header>

      {/* Hero background layers */}
      <div className="absolute left-0 top-0 h-[420px] w-full bg-gradient-to-b from-emerald-100/80 via-amber-100/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(167,243,208,0.7),transparent_45%),radial-gradient(circle_at_85%_18%,rgba(186,230,253,0.65),transparent_42%),radial-gradient(circle_at_65%_74%,rgba(253,186,116,0.45),transparent_48%),linear-gradient(135deg,rgba(240,253,250,0.95),rgba(239,246,255,0.9)_45%,rgba(255,247,237,0.88))]" />
      <div className="pointer-events-none absolute -top-16 left-16 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

      {/* Hero content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-2 text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700" />
              </span>
              <span className="text-sm font-bold uppercase tracking-widest">AI Career Platform for Every Student</span>
            </div>

            <h1 className="mb-8 text-4xl font-black leading-[0.9] text-slate-900 sm:text-6xl md:text-8xl">
              Build Skills. <br />
              <span className="bg-gradient-to-r from-emerald-700 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Get Hired.
              </span>
            </h1>

            <p className="mb-12 max-w-lg text-xl font-medium leading-relaxed text-slate-500">
              EDUROUTE maps each career role into step-by-step levels from Beginner to Pro, with AI Buddy guidance,
              assessments, internships, and direct hiring opportunities—designed for students from every city and town.
            </p>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex w-full items-center justify-center gap-3 rounded-[24px] bg-slate-900 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-slate-200 transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95 sm:w-auto"
              >
                Start Your Roadmap <Rocket className="h-6 w-6" />
              </button>
              <button
                onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex items-center gap-3 font-bold text-slate-900 transition-colors hover:text-emerald-700"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg">
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
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="space-y-4"
          >
            {HIGHLIGHTS.map((item) => (
              <div key={item.title} className="rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm backdrop-blur">
                <item.icon className="mb-4 h-7 w-7 text-emerald-700" />
                <h3 className="mb-2 text-xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Featured section */}
      <section ref={demoSectionRef} className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-black text-slate-900">Everything You Need to Succeed</h2>
            <p className="text-lg font-medium text-slate-500">From zero to your first high-paying internship.</p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl">
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconClass}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-black text-slate-900">{feature.title}</h3>
                <p className="font-medium leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Team section with bio card */}
      <section className="border-y border-slate-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">About the Team</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Meet the Builder Behind Eduroute</h2>
          </div>

          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0A66C2] text-white">
                <Linkedin className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900">Vansh Khandelwal</h3>
                <p className="font-medium text-slate-600">Founder & Product Builder, Eduroute</p>
                <p className="mt-3 leading-relaxed text-slate-500">
                  Building AI-powered career learning experiences that help students from every background become
                  industry-ready and employable.
                </p>
              </div>
              <LinkedInButton className="justify-center px-6 py-3 hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer with LinkedIn CTA */}
      <footer className="bg-slate-900 py-10 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="font-bold">© {new Date().getFullYear()} EDUROUTE</p>
            <p className="text-sm text-slate-400">AI career guidance and hiring pathways for every student.</p>
          </div>
          <LinkedInButton className="px-6 py-3" />
        </div>
      </footer>
    </div>
  );
};
