import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, BookOpen, ChevronRight, Play, Sparkles, Trophy, Briefcase, Linkedin, Instagram, Mail, Phone, MessageCircle, ArrowUpRight, Zap } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { Hero3D } from '../components/Hero3D';
import { TiltCard } from '../components/TiltCard';

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 20 });
  const demoSectionRef = useRef<HTMLElement | null>(null);
  const linkedinUrl = 'https://www.linkedin.com/in/vansh-khandelwal-22636a373/';
  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const contactEmail = 'vanshkhandelwal777@gmail.com';
  const contactPhone = '+91 7898140600';
  const teamMembers = [
    {
      name: 'Vansh Khandelwal',
      role: 'Founder, EduRoutee',
      profileUrl: 'https://www.linkedin.com/in/vansh-khandelwal-22636a373/',
    },
    {
      name: 'Deepesh Chauhan',
      role: 'Co-Founder, EduRoutee',
      profileUrl: 'https://www.linkedin.com/in/deepesh-chauhan-a12413382/',
    },
  ];

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const heroStats = useMemo(() => ([
    { label: 'Learners', value: '45k+' },
    { label: 'Roadmaps', value: '80+' },
    { label: 'Hiring Partners', value: '120+' },
  ]), []);

  return (
    <div
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(56,189,248,0.16), transparent 16%), radial-gradient(circle at 18% 18%, rgba(99,102,241,0.22), transparent 28%), linear-gradient(135deg, #020617 0%, #0b1120 42%, #111827 100%)`,
      }}
    >
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob absolute left-[-8%] top-12 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="blob absolute right-[-4%] top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl [animation-delay:2s]" />
        <div className="blob absolute bottom-20 left-[30%] h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl [animation-delay:4s]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="gradient-border-box h-12 w-12 rounded-2xl"><div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-slate-950 text-xl font-black">E</div></div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50">Career OS</div>
              <div className="text-xl font-black tracking-tight text-white">EDUROUTE</div>
            </div>
          </div>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="glow-button inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white">
            <Linkedin className="h-4 w-4" /> Connect on LinkedIn
          </a>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="relative z-10">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 py-2 text-emerald-200 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.3em]">AI Career Platform for Every Student</span>
            </motion.div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] text-white sm:text-6xl md:text-7xl xl:text-[5.5rem]">
              Build Skills. <br />
              <span className="text-gradient">Get Hired.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
              EDUROUTE maps each career role into step-by-step levels from Beginner to Pro, with AI Buddy guidance,
              assessments, internships, and direct hiring opportunities—designed for students from every city and town.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button onClick={() => setIsAuthOpen(true)} className="glow-button w-full rounded-[24px] px-8 py-4 text-lg font-black text-white sm:w-auto">
                <span className="flex items-center justify-center gap-3">Start Your Roadmap <Rocket className="h-6 w-6" /></span>
              </button>
              <button onClick={() => demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="group inline-flex items-center gap-3 rounded-[24px] border border-white/12 bg-white/10 px-6 py-4 font-bold text-white/90 backdrop-blur-xl hover:border-white/20 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10">
                  <Play className="h-5 w-5 fill-current" />
                </div>
                Watch Demo
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index + 0.5 }} className="premium-border floaty rounded-[28px] bg-white/10 p-5 backdrop-blur-2xl">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="relative min-h-[540px]">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_120px_rgba(14,165,233,0.16)] lg:rounded-[3rem]" />
            <Hero3D />
            <div className="pointer-events-none absolute inset-x-8 bottom-8 grid gap-4 md:grid-cols-2">
              <TiltCard glowClassName="bg-cyan-400/30">
                <div className="premium-border floaty rounded-[28px] bg-slate-950/70 p-5 backdrop-blur-2xl">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="font-bold uppercase tracking-[0.25em] text-cyan-200">Live Guidance</span>
                    <Zap className="h-4 w-4 text-cyan-300" />
                  </div>
                  <h3 className="mt-3 text-xl font-black">AI Buddy in English, Hindi & Hinglish</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">24/7 personalized guidance for roadmap planning, interview prep, and doubts.</p>
                </div>
              </TiltCard>
              <TiltCard glowClassName="bg-fuchsia-500/30">
                <div className="premium-border floaty rounded-[28px] bg-slate-950/70 p-5 backdrop-blur-2xl [animation-delay:1.2s]">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span className="font-bold uppercase tracking-[0.25em] text-fuchsia-200">Career Lift-off</span>
                    <Briefcase className="h-4 w-4 text-fuchsia-300" />
                  </div>
                  <h3 className="mt-3 text-xl font-black">Internships & direct company hiring</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">Top performers get discovered by verified employers through premium student showcases.</p>
                </div>
              </TiltCard>
            </div>
          </motion.div>
        </div>
      </div>

      <section ref={demoSectionRef} className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="mb-16 text-center">
            <h2 className="text-4xl font-black text-white">Everything You Need to Succeed</h2>
            <p className="mt-4 text-lg font-medium text-slate-400">From zero to your first high-paying internship.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Target, title: 'AI Roadmaps', desc: 'Dynamic paths that adjust based on your speed and performance.' },
              { icon: BookOpen, title: 'Skill Tests', desc: 'Weekly assessments to keep your skills sharp and points high.' },
              { icon: ChevronRight, title: 'Direct Hiring', desc: 'Top performers get fast-tracked into verified internships.' },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }}>
                <TiltCard glowClassName="bg-indigo-500/20">
                  <div className="premium-border rounded-[32px] bg-white/10 p-8 backdrop-blur-2xl">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-indigo-200 shadow-lg shadow-indigo-950/20">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{item.title}</h3>
                    <p className="mt-4 text-slate-400">{item.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-eduroutee" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="premium-border rounded-[40px] bg-white/10 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-2xl sm:p-12">
            <h2 className="mb-5 text-4xl font-black text-white">About EduRoutee</h2>
            <p className="text-lg font-medium leading-relaxed text-slate-300">EduRoutee is a smart learning roadmap platform designed to help students plan, track, and optimize their learning journey. Students waste time because they don’t know what to learn and in what order. EduRoutee provides structured roadmaps, AI guidance, and progress tracking in one platform to help students build skills efficiently and achieve career success.</p>
          </motion.div>
        </div>
      </section>

      <section id="problem-statement" className="relative pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="premium-border rounded-[40px] bg-white/10 p-8 shadow-xl shadow-slate-950/20 backdrop-blur-2xl sm:p-12">
            <h2 className="mb-5 text-4xl font-black text-white">Problem Statement</h2>
            <p className="text-lg font-medium leading-relaxed text-slate-300">Students waste time because they don’t know what to learn and in what order. EduRoutee solves this by providing structured learning roadmaps, AI-based guidance, and progress tracking in one platform.</p>
          </motion.div>
        </div>
      </section>

      <section id="team" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-4xl font-black text-white">About the Team</h2>
            <p className="text-lg font-medium text-slate-400">Meet the founders behind EduRoutee.</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.08 }}>
                <TiltCard glowClassName="bg-sky-400/25">
                  <div className="premium-border rounded-3xl bg-white/10 p-6 text-center backdrop-blur-2xl">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/30">
                      <Linkedin className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white">{member.name}</h3>
                    <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">{member.role}</p>
                    <a href={member.profileUrl} target="_blank" rel="noreferrer" className="glow-button inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white">
                      <Linkedin className="h-5 w-5" /> Connect on LinkedIn
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 bg-white/5 py-14 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="premium-border rounded-3xl bg-white/10 p-6 shadow-lg shadow-slate-950/20">
            <p className="mb-4 text-lg font-black text-white">EduRoutee</p>
            <p className="text-sm font-medium leading-relaxed text-slate-400">A smart roadmap platform helping students learn in the right order and reach career goals faster.</p>
          </div>

          <div className="premium-border rounded-3xl bg-white/10 p-6 shadow-lg shadow-slate-950/20">
            <h3 className="mb-4 text-lg font-black text-white">Contact Us</h3>
            <div className="space-y-3 text-sm font-medium text-slate-300">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 transition-colors hover:text-cyan-300"><Mail className="h-4 w-4" />{contactEmail}</a>
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-cyan-300"><Phone className="h-4 w-4" />{contactPhone}</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-cyan-300"><MessageCircle className="h-4 w-4" />WhatsApp</a>
            </div>
          </div>

          <div className="premium-border rounded-3xl bg-white/10 p-6 shadow-lg shadow-slate-950/20">
            <h3 className="mb-4 text-lg font-black text-white">Social</h3>
            <div className="space-y-3 text-sm font-medium text-slate-300">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-cyan-300"><Linkedin className="h-4 w-4" />LinkedIn</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-cyan-300"><Instagram className="h-4 w-4" />Instagram</a>
            </div>
          </div>

          <div className="premium-border rounded-3xl bg-white/10 p-6 shadow-lg shadow-slate-950/20">
            <h3 className="mb-4 text-lg font-black text-white">Highlights</h3>
            <div className="space-y-3 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-300" />AI guidance for every learner</div>
              <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-cyan-300" />Gamified growth & rewards</div>
              <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-cyan-300" />Internships and direct hiring</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
