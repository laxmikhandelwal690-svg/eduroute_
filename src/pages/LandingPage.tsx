import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Instagram,
  Mail,
  Map,
  MessageCircle,
  Trophy,
  Users,
} from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { OfferStackSection } from '../components/OfferStackSection';

const HERO_VIDEO_CDN =
  'https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4';
const HERO_VIDEO_LOCAL = '/videos/hero-coding.mp4';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Roadmaps', href: '#features' },
  { label: 'Jobs & Internships', href: '#features' },
  { label: 'Hackathons', href: '#features' },
  { label: 'Resources', href: '#features' },
  { label: 'Community', href: '#features' },
];

const STATS = [
  { value: '45K+', label: 'Active Learners', icon: Users, color: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300' },
  { value: '80+', label: 'Roadmaps', icon: Map, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { value: '500+', label: 'Job & Internship Opportunities', icon: Briefcase, color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' },
  { value: '120+', label: 'Upcoming Hackathons', icon: Trophy, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300' },
];

const JOURNEY = [
  { title: 'Learn', desc: 'Explore curated roadmaps', icon: BookOpen, color: 'bg-violet-600' },
  { title: 'Build', desc: 'Work on real projects and practice', icon: Code2, color: 'bg-emerald-500' },
  { title: 'Compete', desc: 'Join hackathons and challenges', icon: Trophy, color: 'bg-pink-500' },
  { title: 'Get Hired', desc: 'Land internships and full-time roles', icon: Briefcase, color: 'bg-blue-500' },
];

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'Jobs & Internships', href: '/internships' },
  { label: 'Hackathons', href: '#features' },
  { label: 'Resources', href: '#features' },
  { label: 'Community', href: '#features' },
];

const COMPANY_LINKS = [
  { label: 'About Us', href: '#contact' },
  { label: 'Our Mission', href: '#features' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Privacy Policy', href: '#contact' },
  { label: 'Terms & Conditions', href: '#contact' },
];

export const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const instagramUrl = 'https://www.instagram.com/vanshkhandelwal28/';
  const whatsappUrl = 'https://wa.link/9mfubu';
  const supportEmail = 'vanshkhandelwal777@gmail.com';

  return (
    <div id="home" className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-md shadow-violet-200/50 dark:shadow-violet-900/40">
              E
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 sm:inline"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700"
            >
              Get Started
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 lg:hidden dark:text-slate-300"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1.5 block h-0.5 w-5 bg-current" />
              <span className="mt-1.5 block h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Contact Us
            </a>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="h-full w-full scale-105 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO_CDN} type="video/mp4" />
            <source src={HERO_VIDEO_LOCAL} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/75 via-35% to-white/15 to-100% dark:from-slate-950 dark:from-0% dark:via-slate-950/80 dark:via-40% dark:to-slate-950/25 dark:to-100%" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/90 to-transparent dark:from-slate-950/90 dark:to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-950/40 dark:to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-violet-700 shadow-sm backdrop-blur dark:border-violet-500/30 dark:bg-slate-900/70 dark:text-violet-300">
              <span className="text-sm">⚡</span>
              Your Growth Partner in Tech
            </div>
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm sm:text-5xl lg:text-6xl dark:text-white">
              Build Skills.
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Get Hired.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-700 dark:text-slate-200">
              EDUROUTE helps you find the right roadmap, get internships and job opportunities, participate in hackathons and build the skills you need to grow in tech — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/roadmaps" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200/60 transition hover:bg-violet-700 dark:shadow-violet-900/40">
                <ArrowRight className="h-4 w-4" /> Explore Roadmaps
              </Link>
              <Link to="/internships" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-bold text-slate-800 backdrop-blur transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-violet-500">
                Find Opportunities
              </Link>
            </div>
          </div>
          <div className="hidden min-h-[280px] lg:block" aria-hidden />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-200/40 backdrop-blur-md sm:grid-cols-4 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/30">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-2 py-2">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-slate-900 dark:text-white">{s.value}</div>
                  <div className="text-[11px] font-medium leading-tight text-slate-500 dark:text-slate-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OfferStackSection onExploreAll={() => setIsAuthOpen(true)} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">Your Journey</p>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">From Learning to Landing</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Follow a clear path, build real skills, and turn your effort into opportunities.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {JOURNEY.map((step, i) => (
                  <div key={step.title} className="relative text-center">
                    {i < JOURNEY.length - 1 && (
                      <div className="absolute left-[60%] top-5 hidden h-px w-[80%] border-t border-dashed border-slate-300 sm:block dark:border-slate-600" />
                    )}
                    <div className={`relative z-10 mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md ${step.color}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</div>
                    <div className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-12 text-center text-white shadow-xl shadow-violet-200/40 sm:px-12 dark:shadow-violet-900/30">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Ready to build skills that get you hired?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">Join thousands of learners using EDUROUTE roadmaps, practice sheets, and AI Buddy to grow faster.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => setIsAuthOpen(true)} className="rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:bg-violet-50">Create free account</button>
            <Link to="/roadmaps" className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Browse roadmaps</Link>
          </div>
        </div>
      </section>

      {/* Footer: EDUROUTE watermark first, then columns below (no overlap) */}
      <footer
        id="contact"
        className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#0a0a0f]"
      >
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          {/* Outlined EDUROUTE — in document flow so content sits fully below */}
          <div className="select-none overflow-hidden text-center" aria-hidden>
            <span
              className="inline-block whitespace-nowrap text-[16vw] font-black leading-none tracking-tight sm:text-[12vw] lg:text-[9.5rem]"
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px rgba(109, 40, 217, 0.55)',
              }}
            >
              <span className="dark:hidden">EDUROUTE</span>
            </span>
            <span
              className="hidden whitespace-nowrap text-[16vw] font-black leading-none tracking-tight dark:inline-block sm:text-[12vw] lg:text-[9.5rem]"
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px rgba(167, 139, 250, 0.55)',
              }}
            >
              EDUROUTE
            </span>
          </div>

          {/* All info below the word — no absolute overlay */}
          <div className="mt-6 grid gap-10 pb-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-md">
                  E
                </span>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EDU<span className="text-violet-600 dark:text-violet-400">ROUTE</span>
                </span>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                Learn. Build. Compete. Get Hired.
              </p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your one stop platform to build skills, explore opportunities and grow your career in tech.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-pink-300 hover:text-pink-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-pink-500/50 dark:hover:text-pink-400"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${supportEmail}`}
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((item) =>
                  item.href.startsWith('/') ? (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Company
              </h3>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Join community */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                Join Our Community
              </h3>
              <p className="mb-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Stay updated with latest opportunities, events and learning resources.
              </p>
              <form
                className="flex items-center gap-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    window.location.href = `mailto:${supportEmail}?subject=Newsletter%20signup&body=${encodeURIComponent(newsletterEmail.trim())}`;
                  }
                }}
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} EDUROUTE. All rights reserved.</p>
            <p className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
              Better Skills <span className="text-violet-500">→</span> Brighter Future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
