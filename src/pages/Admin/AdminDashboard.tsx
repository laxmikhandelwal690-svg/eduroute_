import { FormEvent, useEffect, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import {
  apiCreateCourse,
  apiDeleteCourse,
  apiGetCourses,
  apiGetPendingStudents,
  apiUpdateCourse,
  apiVerifyStudent,
} from '../../utils/authApi';

type CourseForm = {
  title: string;
  description: string;
  category: string;
  duration: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

const INITIAL_FORM: CourseForm = {
  title: '',
  description: '',
  category: 'Development',
  duration: '6 weeks',
  instructor: '',
  level: 'Beginner',
};

export const AdminDashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [form, setForm] = useState<CourseForm>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [coursesResponse, studentsResponse] = await Promise.all([apiGetCourses(), apiGetPendingStudents()]);
    setCourses(coursesResponse.data);
    setPendingStudents(studentsResponse.data);
  };

  useEffect(() => {
    loadData().catch(() => setMessage('Unable to load admin data. Check backend service.'));
  }, []);

  const submitCourse = async (event: FormEvent) => {
    event.preventDefault();
    if (editingId) {
      await apiUpdateCourse(editingId, form);
      setMessage('Course updated successfully.');
    } else {
      await apiCreateCourse(form);
      setMessage('Course added successfully.');
    }

    setForm(INITIAL_FORM);
    setEditingId(null);
    await loadData();
  };

  const startEdit = (course: any) => {
    setEditingId(course._id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      instructor: course.instructor,
      level: course.level,
    });
  };

  const removeCourse = async (id: string) => {
    await apiDeleteCourse(id);
    setMessage('Course deleted.');
    await loadData();
  };

  const verifyStudent = async (id: string, action: 'approve' | 'reject') => {
    await apiVerifyStudent(id, action);
    setMessage(`Student ${action}d successfully.`);
    await loadData();
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
      {message && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{message}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={submitCourse} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Course title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Instructor" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input className="border rounded-lg px-3 py-2" placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
          <select className="border rounded-lg px-3 py-2" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as CourseForm['level'] })}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
          <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="md:col-span-2 flex gap-2">
            <button className="rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold" type="submit">{editingId ? 'Update' : 'Add'} Course</button>
            {editingId && <button className="rounded-lg px-4 py-2 bg-slate-200" type="button" onClick={() => { setEditingId(null); setForm(INITIAL_FORM); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold mb-4">Manage Courses</h2>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course._id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-slate-500">{course.category} • {course.level} • {course.duration}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded bg-amber-100 text-amber-800" onClick={() => startEdit(course)}><Pencil className="h-4 w-4 inline" /> Edit</button>
                <button className="px-3 py-2 rounded bg-rose-100 text-rose-700" onClick={() => removeCourse(course._id)}><Trash2 className="h-4 w-4 inline" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold mb-4">Pending Student Verifications</h2>
        <div className="space-y-3">
          {pendingStudents.map((student) => (
            <div key={student._id} className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-slate-500">{student.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded bg-emerald-100 text-emerald-700" onClick={() => verifyStudent(student._id, 'approve')}><Check className="h-4 w-4 inline" /> Approve</button>
                <button className="px-3 py-2 rounded bg-rose-100 text-rose-700" onClick={() => verifyStudent(student._id, 'reject')}><X className="h-4 w-4 inline" /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
