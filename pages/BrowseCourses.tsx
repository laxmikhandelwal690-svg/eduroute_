import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, Users, ChevronDown } from 'lucide-react';
import { COURSES } from '../../../Eduroute_/data/mockData';
import { Course } from '../../../Eduroute_/types';
import { Link } from 'react-router-dom';

const categories = ['All', 'Development', 'Design', 'Data Science', 'Business'];

export const BrowseCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = COURSES.filter(course => 
    selectedCategory === 'All' || course.category === selectedCategory
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-16">
        <h1 className="text-5xl font-black text-slate-900 mb-6">Explore the Future</h1>
        <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed">
          Our courses are crafted by industry veterans from Google, Meta, and Netflix. 
          Master high-demand skills with project-based learning.
        </p>
      </header>

      <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-2xl px-6 py-3 text-sm font-black tracking-widest uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills..."
              className="h-14 w-full rounded-2xl border border-slate-100 bg-white pl-12 pr-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-6 py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            <Filter className="h-4 w-4" /> Filters <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <BrowseCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const BrowseCourseCard = ({ course }: { course: Course }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -10 }}
    className="group overflow-hidden rounded-[40px] border border-slate-50 bg-white transition-all hover:shadow-2xl"
  >
    <Link to={`/course/${course.id}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute left-6 top-6 rounded-xl bg-white/90 px-4 py-2 text-[10px] font-black text-slate-900 backdrop-blur-md shadow-xl tracking-widest">
          {course.level.toUpperCase()}
        </div>
        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </Link>
    <div className="p-10">
      <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
        <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-400" /> {course.duration}</span>
        <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
      </div>
      <Link to={`/course/${course.id}`}>
        <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight h-16 line-clamp-2">
          {course.title}
        </h3>
      </Link>
      <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
        <div className="flex flex-col">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Price</span>
           <span className="text-3xl font-black text-slate-900">${course.price}</span>
        </div>
        <button className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">
           Details
        </button>
      </div>
    </div>
  </motion.div>
);
