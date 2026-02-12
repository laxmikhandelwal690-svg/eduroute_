import { motion } from 'framer-motion';
import { PlayCircle, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { COURSES, MOCK_USER } from '../../../Eduroute_/data/mockData';
import { Course } from '../../../Eduroute_/types';

export const MyCourses = () => {
  const enrolledCourses = COURSES.filter(c => MOCK_USER.enrolledCourses.includes(c.id));

  return (
    <div className="flex-1 p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
        <p className="mt-2 text-slate-600">Pick up where you left off and reach your goals.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {enrolledCourses.map((course) => (
          <EnrolledCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const EnrolledCourseCard = ({ course }: { course: Course }) => {
  const progress = Math.floor(Math.random() * 80) + 10; // Mock progress

  return (
    <motion.div 
      whileHover={{ scale: 1.005 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg md:flex-row"
    >
      <div className="relative aspect-video w-full md:w-72">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
            {course.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <Clock className="h-3 w-3" /> {course.duration}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-slate-900">{course.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{course.instructor}</p>
        
        <div className="mt-auto pt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Course Progress</span>
            <span className="font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-indigo-600 shadow-sm shadow-indigo-200"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-l border-slate-50 p-6 md:w-48">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600">
          Resume <ChevronRight className="h-4 w-4" />
        </button>
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
          <BookOpen className="h-4 w-4" /> Syllabus
        </button>
      </div>
    </motion.div>
  );
};
