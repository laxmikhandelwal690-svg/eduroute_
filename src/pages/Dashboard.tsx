import { motion } from 'framer-motion';
import { PlayCircle, Clock, Star, Users, Trophy, ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';
import { TiltCard } from '../components/TiltCard';

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const enrolledCourses = COURSES.filter(c => currentUser.enrolledCourses.includes(c.id));
  const recommendedCourses = COURSES.filter(c => !currentUser.enrolledCourses.includes(c.id));

  return (
    <div className="relative flex-1 overflow-y-auto p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[10%] top-40 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10 grid gap-6 xl:grid-cols-[1.35fr,0.9fr]">
        <div className="glass-panel premium-border relative overflow-hidden rounded-[32px] p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_58%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-indigo-100">
                <Sparkles className="h-4 w-4" /> Student Command Center
              </div>
              <h1 className="text-3xl font-black text-slate-900 md:text-5xl">Welcome back, {getDisplayFirstName()}! 👋</h1>
              <p className="mt-3 max-w-2xl text-base font-medium text-slate-500 md:text-lg">You've completed 45% of your current path. Keep your momentum going with immersive learning, curated internships, and smart recommendations.</p>
            </div>
            <div className="floaty rounded-[28px] border border-white/12 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-sm font-bold text-indigo-100"><Activity className="h-4 w-4" /> Weekly streak</div>
              <div className="mt-2 text-3xl font-black text-slate-900">12 days</div>
            </div>
          </div>
        </div>

        <TiltCard glowClassName="bg-amber-400/30" className="h-full">
          <div className="glass-panel premium-border relative flex h-full items-center gap-4 rounded-[32px] p-6 md:p-7">
            <div className="rounded-2xl bg-amber-400/20 p-3 text-amber-300 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-black uppercase tracking-[0.25em] text-amber-200">Verify College ID</div>
              <p className="mt-1 text-sm font-semibold text-slate-400">Unlock 50% discount on all certifications.</p>
            </div>
            <button className="glow-button ml-2 rounded-2xl px-4 py-3 text-sm font-black text-white">Verify</button>
          </div>
        </TiltCard>
      </motion.header>

      <motion.section initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="relative mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Continue Learning</h2>
          <button className="text-sm font-bold text-indigo-300 hover:text-indigo-200">View all</button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <ContinueLearningCard key={course.id} course={course} />
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="relative mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Recommended for You</h2>
          <button className="text-sm font-bold text-indigo-300 hover:text-indigo-200">Explore</button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }}>
        <TiltCard glowClassName="bg-indigo-500/30">
          <div className="premium-border relative overflow-hidden rounded-[40px] bg-[linear-gradient(135deg,rgba(79,70,229,0.95),rgba(109,40,217,0.9),rgba(14,165,233,0.85))] p-10 text-white shadow-2xl shadow-indigo-900/25">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_28%)] opacity-80" />
            <div className="relative flex flex-col items-center justify-between gap-12 md:flex-row">
              <div className="space-y-6">
                <h2 className="text-3xl font-black">Weekly Goal Progress</h2>
                <div className="flex gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest opacity-80">Points earned</div>
                    <div className="text-3xl font-black">340 / 500</div>
                  </div>
                </div>
                <div className="h-3 w-full max-w-sm rounded-full bg-white/20">
                  <div className="progress-shimmer h-full w-[68%] rounded-full bg-white shadow-xl"></div>
                </div>
              </div>
              <button className="rounded-[24px] border border-white/30 bg-white px-10 py-5 font-black text-indigo-600 shadow-xl transition-transform hover:scale-105 active:scale-95">
                <span className="flex items-center gap-3">Set New Goal <ArrowRight className="h-6 w-6" /></span>
              </button>
            </div>
          </div>
        </TiltCard>
      </motion.section>
    </div>
  );
};

const ContinueLearningCard = ({ course }: { course: Course }) => (
  <TiltCard glowClassName="bg-indigo-500/20">
    <motion.div whileHover={{ y: -6 }} className="glass-panel premium-border group flex flex-col gap-6 overflow-hidden rounded-[32px] p-6 sm:flex-row">
      <div className="relative aspect-video w-full overflow-hidden rounded-[24px] sm:w-56">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.55))]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full border border-white/40 bg-white/90 p-3 text-indigo-600 shadow-xl">
            <PlayCircle className="h-8 w-8" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300">
          <span>{course.category}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
          <span>40% Done</span>
        </div>
        <h3 className="mt-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-200 leading-tight">{course.title}</h3>
        <div className="mt-6 h-2 w-full rounded-full bg-white/10">
          <div className="progress-shimmer h-full w-[40%] rounded-full bg-[linear-gradient(90deg,#818cf8,#38bdf8)] shadow-sm shadow-indigo-500/20"></div>
        </div>
      </div>
    </motion.div>
  </TiltCard>
);

const CourseCard = ({ course }: { course: Course }) => (
  <TiltCard glowClassName="bg-cyan-400/20">
    <motion.div whileHover={{ y: -8 }} className="glass-panel premium-border group overflow-hidden rounded-[32px]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.58))]" />
        <div className="absolute left-4 top-4 rounded-xl border border-white/20 bg-white/95 px-3 py-1.5 text-[10px] font-black text-slate-900 backdrop-blur-sm shadow-lg">{course.level.toUpperCase()}</div>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 h-14 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-200">{course.title}</h3>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Users className="h-4 w-4 text-slate-300" />
            </div>
            <span className="text-xs font-bold text-slate-400">{course.students.toLocaleString()} students</span>
          </div>
          <div className="text-2xl font-black text-slate-900">${course.price}</div>
        </div>
      </div>
    </motion.div>
  </TiltCard>
);
