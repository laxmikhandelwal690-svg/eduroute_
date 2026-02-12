import { useParams, Link } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  Clock,
  Globe,
  Award,
  ChevronLeft,
  Lock
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Lesson } from '../types';

export const CourseDetails = () => {
  const { id } = useParams();
  const course = COURSES.find(c => c.id === id);

  if (!course) return <div className="p-20 text-center font-black">Course not found</div>;

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="relative h-96 w-full">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-12">
          <div className="mx-auto max-w-7xl">
            <Link to="/browse" className="mb-6 inline-flex items-center text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Explore
            </Link>
            <h1 className="text-5xl font-black text-white md:text-6xl max-w-4xl leading-tight">{course.title}</h1>
            <div className="mt-8 flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-indigo-400" /> {course.duration}</span>
              <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-indigo-400" /> English / Hinglish</span>
              <span className="flex items-center gap-2"><Award className="h-4 w-4 text-indigo-400" /> Professional Certificate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-6">About this course</h2>
              <p className="text-xl leading-relaxed text-slate-500 font-medium">
                {course.description} MASTER the fundamentals and advanced concepts of {course.category}. 
                This curriculum is built in partnership with top tech leaders to ensure you learn exactly what industry demands.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-slate-900 mb-8">Course Curriculum</h2>
              <div className="space-y-4">
                {course.modules && course.modules.length > 0 ? (course.modules as any[]).map((module) => (
                  <div key={module.id} className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{module.title}</h3>
                    <div className="space-y-3">
                      {(module.lessons as Lesson[]).map((lesson: Lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 hover:bg-indigo-50 transition-colors group cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {lesson.type === 'video' ? <Play className="h-4 w-4 fill-current" /> : <CheckCircle2 className="h-4 w-4" />}
                            </div>
                            <span className="text-base font-bold text-slate-700">{lesson.title}</span>
                          </div>
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )) : (
                   <div className="rounded-[40px] border-2 border-dashed border-slate-200 p-16 text-center">
                     <Lock className="mx-auto h-12 w-12 text-slate-200 mb-6" />
                     <h3 className="text-xl font-bold text-slate-400">Curriculum is being finalized.</h3>
                     <p className="text-slate-300 mt-2 font-medium">Expected release: Tomorrow</p>
                   </div>
                )}
              </div>
            </section>
          </div>

          <div className="lg:relative">
            <div className="sticky top-24 rounded-[40px] border border-slate-50 bg-white p-10 shadow-2xl shadow-slate-200">
              <div className="mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900">${course.price}</span>
                  <span className="text-xl font-bold text-slate-300 line-through">$149.99</span>
                </div>
                <div className="mt-4 inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                  40% Off Limited Offer
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full h-16 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95">
                  Enroll Now
                </button>
                <button className="w-full h-16 rounded-2xl border border-slate-200 bg-white text-slate-900 font-black text-lg hover:bg-slate-50 transition-all">
                  Add to Wishlist
                </button>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <span>Lifetime Access to Content</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <span>Industry-Recognized Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
