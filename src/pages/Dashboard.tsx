import { motion } from 'framer-motion';
import { Clock3, Search, Sparkles, CheckCircle2, CircleDashed, UserCircle2 } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';

const categories = ['Product Design', 'Frontend', 'Leadership', 'AI Tools', 'Data Basics'];

const getStatus = (index: number) => {
  if (index % 3 === 0) return { label: 'In progress', tone: 'bg-sky-100 text-sky-700', progress: 62 };
  if (index % 3 === 1) return { label: 'Review', tone: 'bg-violet-100 text-violet-700', progress: 82 };
  return { label: 'Planned', tone: 'bg-emerald-100 text-emerald-700', progress: 24 };
};

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const enrolledCourses = COURSES.filter((course) => currentUser.enrolledCourses.includes(course.id));
  const recommendedCourses = COURSES.filter((course) => !currentUser.enrolledCourses.includes(course.id)).slice(0, 3);

  return (
    <div className="p-4 md:p-8">
      <div className="rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.7)] backdrop-blur-sm md:p-7">
        <header className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="text-lg font-semibold text-slate-700 md:text-xl">Welcome back, {getDisplayFirstName()}</h1>

          <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, tasks, docs..."
              className="w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <UserCircle2 className="h-6 w-6" />
          </button>
        </header>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-slate-500">Recommended categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  index === 0
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {enrolledCourses.slice(0, 3).map((course, index) => {
            const status = getStatus(index);
            return (
              <motion.article
                key={course.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.8)]"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-400">Task #{index + 14}</p>
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-700">{course.title}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.tone}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {course.duration}</span>
                  <span>{status.progress}%</span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-sky-300" style={{ width: `${status.progress}%` }} />
                </div>
              </motion.article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-emerald-50/70 p-5">
            <p className="mb-2 text-xs font-medium text-emerald-700">Today focus</p>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Finish your sprint review checklist and prep demo notes.</h3>
            <div className="inline-flex items-center gap-1 text-xs text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> 3 tasks completed
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-violet-50/80 p-5">
            <p className="mb-2 text-xs font-medium text-violet-700">Suggested next</p>
            <ul className="space-y-2">
              {recommendedCourses.map((course) => (
                <li key={course.id} className="flex items-center justify-between text-xs text-slate-600">
                  <span className="line-clamp-1">{course.title}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-medium text-violet-600">
                    <Sparkles className="h-3 w-3" /> Add
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <CircleDashed className="h-3.5 w-3.5" />
          Minimal, pastel workspace mode enabled.
        </footer>
      </div>
    </div>
  );
};
