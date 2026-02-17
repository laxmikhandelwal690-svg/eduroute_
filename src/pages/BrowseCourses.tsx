import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiGetCourses } from '../utils/authApi';

const categories = ['All', 'Development', 'Design', 'Data Science', 'Business'];

export const BrowseCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    apiGetCourses().then((response) => setCourses(response.data)).catch(() => setCourses([]));
  }, []);

  const filteredCourses = courses.filter((course) => selectedCategory === 'All' || course.category === selectedCategory);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-3">Student Course Catalog</h1>
        <p className="text-slate-500 text-lg">Browse all available courses. Students can only view course details.</p>
      </header>

      <div className="mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-2xl px-6 py-3 text-sm font-black uppercase ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Search skills..." className="h-14 w-full rounded-2xl border bg-white pl-12 pr-6 text-sm md:w-64" />
          </div>
          <button className="flex items-center gap-2 rounded-2xl border bg-white px-6 py-4 text-sm font-bold text-slate-600">
            Category <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <motion.div key={course._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group overflow-hidden rounded-[24px] border bg-white">
            <Link to={`/course/${course._id}`}>
              <div className="p-6 space-y-4">
                <div className="text-xs font-bold text-indigo-600 uppercase">{course.level}</div>
                <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                <p className="text-sm text-slate-500">{course.description}</p>
                <div className="text-xs text-slate-500 flex items-center gap-2"><Clock className="h-4 w-4" /> {course.duration}</div>
                <button className="w-full rounded-xl bg-slate-900 text-white px-4 py-2 font-bold">View Course</button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
