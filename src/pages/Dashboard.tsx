import { motion } from 'framer-motion';
import { PlayCircle, Clock, Star, Users, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course } from '../types';
import { getCurrentUser, getDisplayFirstName } from '../utils/userProfile';

export const Dashboard = () => {
  const currentUser = getCurrentUser();
  const enrolledCourses = COURSES.filter(c => currentUser.enrolledCourses.includes(c.id));
  const recommendedCourses = COURSES.filter(c => !currentUser.enrolledCourses.includes(c.id));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Welcome back, {getDisplayFirstName()}! 👋</h1>
          <p className="mt-2 text-slate-500 font-medium">You've completed 45% of your current path. Keep it up!</p>
        </div>
        <div className="flex items-center gap-4 rounded-[28px] bg-amber-50 p-6 border border-amber-200">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-black text-amber-900">Verify College ID</div>
            <p className="text-xs text-amber-700 font-bold">Unlock 50% discount on all certifications</p>
          </div>
          <button className="ml-4 rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-700 shadow-lg shadow-amber-200">
            Verify
          </button>
        </div>
      </header>

      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Continue Learning</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View all</button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {enrolledCourses.map((course) => (
            <ContinueLearningCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Recommended for You</h2>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Explore</button>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-[40px] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-200">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="space-y-6">
              <h2 className="text-3xl font-black">Weekly Goal Progress</h2>
              <div className="flex gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-80">Points earned</div>
                  <div className="text-3xl font-black">340 / 500</div>
                </div>
              </div>
              <div className="h-3 w-full max-w-sm rounded-full bg-white/20">
                <div className="h-full w-[68%] rounded-full bg-white shadow-xl"></div>
              </div>
            </div>
            <button className="flex items-center gap-3 rounded-[24px] bg-white px-10 py-5 font-black text-indigo-600 shadow-xl transition-transform hover:scale-105 active:scale-95">
              Set New Goal <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContinueLearningCard = ({ course }: { course: Course }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="group flex flex-col gap-6 overflow-hidden rounded-[32px] border border-slate-100 bg-white p-6 transition-all hover:shadow-xl sm:flex-row"
  >
    <div className="relative aspect-video w-full overflow-hidden rounded-[24px] sm:w-56">
      <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-full bg-white p-3 text-indigo-600 shadow-xl">
          <PlayCircle className="h-8 w-8" />
        </div>
      </div>
    </div>
    <div className="flex flex-1 flex-col justify-center py-2">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
        <span>{course.category}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
        <span>40% Done</span>
      </div>
      <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{course.title}</h3>
      <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
        <div className="h-full w-[40%] rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></div>
      </div>
    </div>
  </motion.div>
);

const CourseCard = ({ course }: { course: Course }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="group overflow-hidden rounded-[32px] border border-slate-100 bg-white transition-all hover:shadow-2xl"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black text-slate-900 backdrop-blur-sm shadow-lg">
        {course.level.toUpperCase()}
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
        <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug h-14">
        {course.title}
      </h3>
      <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
             <Users className="h-4 w-4 text-slate-400" />
          </div>
          <span className="text-xs font-bold text-slate-500">{course.students.toLocaleString()} students</span>
        </div>
        <div className="text-2xl font-black text-slate-900">${course.price}</div>
      </div>
    </div>
  </motion.div>
);
