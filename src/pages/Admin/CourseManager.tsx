import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FileText, Pencil, Plus, Trash2, Video, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentFormState, CourseFormState, ManagedCourse } from '../../types/courseManager';
import {
  createCourse,
  createCourseContent,
  deleteCourse,
  deleteCourseContent,
  getManagedCourses,
  updateCourse,
  updateCourseContent,
} from '../../utils/courseManagerStorage';
import { clearAdminSession, isAdminSessionActive } from '../../utils/adminSession';

const INITIAL_COURSE_FORM: CourseFormState = {
  title: '',
  description: '',
  category: '',
  thumbnailUrl: '',
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
  publishTarget: 'dashboard',
=======
>>>>>>> main
};

const INITIAL_CONTENT_FORM: ContentFormState = {
  type: 'video',
  title: '',
  url: '',
  topic: '',
};

export const CourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ManagedCourse[]>(() => getManagedCourses());
  const [courseForm, setCourseForm] = useState<CourseFormState>(INITIAL_COURSE_FORM);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState<ContentFormState>(INITIAL_CONTENT_FORM);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminSessionActive()) {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedCourses = editingCourseId
      ? updateCourse(editingCourseId, courseForm)
      : [createCourse(courseForm), ...courses];

    setCourses(updatedCourses);
    setCourseForm(INITIAL_COURSE_FORM);
    setEditingCourseId(null);
  };

  const handleCourseEdit = (course: ManagedCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnailUrl: course.thumbnailUrl,
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
      publishTarget: course.publishTarget,
=======
>>>>>>> main
    });
  };

  const handleCourseDelete = (courseId: string) => {
    const updatedCourses = deleteCourse(courseId);
    setCourses(updatedCourses);
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
  };

  const openContentModal = (courseId: string, item?: ContentFormState & { id: string }) => {
    setSelectedCourseId(courseId);

    if (!item) {
      setContentForm(INITIAL_CONTENT_FORM);
      setEditingContentId(null);
      return;
    }

    setEditingContentId(item.id);
    setContentForm({
      type: item.type,
      title: item.title,
      url: item.url,
      topic: item.topic,
    });
  };

  const handleContentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCourseId) {
      return;
    }

    const updatedCourses = editingContentId
      ? updateCourseContent(selectedCourseId, editingContentId, contentForm)
      : createCourseContent(selectedCourseId, contentForm);

    setCourses(updatedCourses);
    setContentForm(INITIAL_CONTENT_FORM);
    setEditingContentId(null);
    setSelectedCourseId(null);
  };

  const handleDeleteContent = (courseId: string, contentId: string) => {
    setCourses(deleteCourseContent(courseId, contentId));
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Course Manager</h1>
            <p className="text-slate-600">Create, edit and organize courses, videos and documents.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold mb-4">{editingCourseId ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Course Title" required value={courseForm.title} onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })} />
            <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Course Category" required value={courseForm.category} onChange={(event) => setCourseForm({ ...courseForm, category: event.target.value })} />
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
            <select className="rounded-xl border border-slate-300 px-3 py-2" value={courseForm.publishTarget} onChange={(event) => setCourseForm({ ...courseForm, publishTarget: event.target.value as CourseFormState['publishTarget'] })}>
              <option value="dashboard">Show in Dashboard</option>
              <option value="roadmap">Upload to Roadmap</option>
              <option value="both">Dashboard + Roadmap</option>
            </select>
=======
>>>>>>> main
            <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Thumbnail Image URL" required value={courseForm.thumbnailUrl} onChange={(event) => setCourseForm({ ...courseForm, thumbnailUrl: event.target.value })} />
            <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2 min-h-[90px]" placeholder="Course Description" required value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="rounded-xl bg-indigo-600 text-white px-4 py-2 font-semibold">{editingCourseId ? 'Update Course' : 'Add Course'}</button>
              {editingCourseId && (
                <button type="button" onClick={() => { setEditingCourseId(null); setCourseForm(INITIAL_COURSE_FORM); }} className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700">Cancel</button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Course Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s

            {courses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                No courses yet. Add your first course from the form above.
              </div>
            )}
=======
>>>>>>> main
            {courses.map((course) => {
              const videoCount = course.content.filter((item) => item.type === 'video').length;
              const documentCount = course.content.filter((item) => item.type === 'document').length;
              const groupedTopics = course.content.reduce<Record<string, typeof course.content>>((acc, item) => {
                const key = item.topic || 'General';
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(item);
                return acc;
              }, {});

              return (
                <article key={course.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <img src={course.thumbnailUrl} alt={course.title} className="h-44 w-full object-cover bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg text-slate-900">{course.title}</h3>
                        <p className="text-sm text-slate-500">{course.category}</p>
<<<<<<< codex/add-admin-course-manager-feature-gbmr6s
                        <p className="text-xs font-semibold text-indigo-600 mt-1">{course.publishTarget === 'both' ? 'Published: Dashboard + Roadmap' : course.publishTarget === 'roadmap' ? 'Published: Roadmap' : 'Published: Dashboard'}</p>
=======
>>>>>>> main
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleCourseEdit(course)} className="rounded-lg bg-amber-100 text-amber-700 px-3 py-2 text-sm font-semibold"><Pencil className="h-4 w-4 inline" /> Edit</button>
                        <button onClick={() => handleCourseDelete(course.id)} className="rounded-lg bg-rose-100 text-rose-700 px-3 py-2 text-sm font-semibold"><Trash2 className="h-4 w-4 inline" /> Delete</button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600">{course.description}</p>

                    <div className="flex gap-3 text-xs font-semibold text-slate-600">
                      <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1">{videoCount} Videos</span>
                      <span className="rounded-full bg-cyan-50 text-cyan-700 px-3 py-1">{documentCount} Documents</span>
                    </div>

                    <button onClick={() => openContentModal(course.id)} className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Video / Document
                    </button>

                    <div className="space-y-3">
                      {Object.entries(groupedTopics).map(([topic, topicItems]) => (
                        <div key={topic} className="rounded-xl border border-slate-200 p-3">
                          <h4 className="font-semibold text-slate-800">{topic}</h4>
                          <ul className="mt-2 space-y-2">
                            {topicItems.map((item) => (
                              <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                                <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-700 hover:text-indigo-600">
                                  {item.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                  {item.title}
                                </a>
                                <div className="flex gap-1">
                                  <button onClick={() => openContentModal(course.id, item)} className="rounded-md border px-2 py-1"><Pencil className="h-3 w-3" /></button>
                                  <button onClick={() => handleDeleteContent(course.id, item.id)} className="rounded-md border px-2 py-1 text-rose-600"><Trash2 className="h-3 w-3" /></button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingContentId ? 'Edit Content' : `Add Content to ${selectedCourse.title}`}</h3>
              <button onClick={() => { setSelectedCourseId(null); setEditingContentId(null); setContentForm(INITIAL_CONTENT_FORM); }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="space-y-3">
              <select className="w-full rounded-xl border border-slate-300 px-3 py-2" value={contentForm.type} onChange={(event) => setContentForm({ ...contentForm, type: event.target.value as ContentFormState['type'] })}>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder={contentForm.type === 'video' ? 'Video Title' : 'Document Title'} required value={contentForm.title} onChange={(event) => setContentForm({ ...contentForm, title: event.target.value })} />
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder={contentForm.type === 'video' ? 'Video URL' : 'PDF / Drive Link'} required value={contentForm.url} onChange={(event) => setContentForm({ ...contentForm, url: event.target.value })} />
              <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Topic Name (e.g. Arrays)" required value={contentForm.topic} onChange={(event) => setContentForm({ ...contentForm, topic: event.target.value })} />
              <button className="w-full rounded-xl bg-indigo-600 text-white py-2 font-semibold" type="submit">{editingContentId ? 'Update Content' : 'Save Content'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
