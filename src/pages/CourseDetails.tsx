import { Link, useParams } from 'react-router-dom';
import { Award, ChevronLeft, Clock, FileText, Globe, Play, Video } from 'lucide-react';
import { COURSES } from '../data/mockData';
import { getManagedCourses } from '../utils/courseManagerStorage';

const toCourseSummary = (courseId: string) => {
  const localCourse = getManagedCourses().find((course) => course.id === courseId);
  if (!localCourse) {
    return null;
  }

  return {
    id: localCourse.id,
    title: localCourse.title,
    description: localCourse.description,
    thumbnail: localCourse.thumbnailUrl,
    duration: `${localCourse.content.length} resources`,
    price: 0,
    category: localCourse.category,
    lessons: localCourse.content.map((item) => ({
      id: item.id,
      title: item.title,
      duration: item.type === 'video' ? 'Video' : 'Document',
      isLocked: false,
      type: item.type,
      topic: item.topic,
      url: item.url,
    })),
  };
};

export const CourseDetails = () => {
  const { id = '' } = useParams();

  const localCourse = toCourseSummary(id);
  const mockCourse = COURSES.find((course) => course.id === id);
  const course = localCourse || mockCourse;

  if (!course) {
    return <div className="p-20 text-center font-black">Course not found</div>;
  }

  const isLocalCourse = Boolean(localCourse);
  const moduleLessons = mockCourse?.modules.flatMap((module) => module.lessons) || [];

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="relative h-96 w-full">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
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

      <div className="mx-auto mt-12 max-w-7xl px-8 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="text-2xl font-black text-slate-900">About this course</h2>
          <p className="mt-4 text-slate-600">{course.description}</p>

          <h3 className="mt-10 text-xl font-black text-slate-900">Course curriculum</h3>
          <div className="mt-4 space-y-3">
            {isLocalCourse && course.lessons.length === 0 && (
              <div className="rounded-2xl border border-slate-200 p-6 text-slate-500">No resources added yet.</div>
            )}

            {isLocalCourse && course.lessons.map((lesson) => (
              <a
                key={lesson.id}
                href={lesson.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:border-indigo-300"
              >
                <div className="flex items-center gap-3">
                  {lesson.type === 'video' ? <Video className="h-4 w-4 text-indigo-600" /> : <FileText className="h-4 w-4 text-cyan-600" />}
                  <div>
                    <p className="font-semibold text-slate-900">{lesson.title}</p>
                    <p className="text-xs text-slate-500">{lesson.topic}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">Open</span>
              </a>
            ))}

            {!isLocalCourse && moduleLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <Play className="h-4 w-4 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{lesson.title}</p>
                    <p className="text-xs text-slate-500">{lesson.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 p-6 bg-white h-fit">
          <div className="text-3xl font-black text-slate-900">{isLocalCourse ? 'Free' : `$${course.price}`}</div>
          <button className="mt-5 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white">Enroll Now</button>
        </aside>
      </div>
    </div>
  );
};
