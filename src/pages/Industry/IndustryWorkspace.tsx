import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  LogOut,
  Plus,
  MapPin,
  IndianRupee,
  Users,
  Check,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { clearAuthSession, getAuthUser } from '../../utils/rbacAuth';
import {
  addIndustryPosting,
  readIndustryApplicants,
  readIndustryPostings,
  shortlistApplicant,
  type IndustryApplicant,
  type IndustryPosting,
} from '../../utils/industryStore';
import { ThemeToggle } from '../../components/ThemeToggle';

export const IndustryWorkspace = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [postings, setPostings] = useState<IndustryPosting[]>(() => readIndustryPostings());
  const [applicants, setApplicants] = useState<IndustryApplicant[]>(() => readIndustryApplicants());
  const [selectedPostingId, setSelectedPostingId] = useState<string>(() => readIndustryPostings()[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [postingBusy, setPostingBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    skills: '',
    stipend: '',
    location: '',
    description: '',
  });

  const refresh = useCallback(() => {
    const p = readIndustryPostings();
    setPostings(p);
    setApplicants(readIndustryApplicants());
    setSelectedPostingId((prev) => prev || p[0]?.id || '');
  }, []);

  useEffect(() => {
    refresh();
    const onUp = () => refresh();
    window.addEventListener('eduroute:industry-updated', onUp);
    return () => window.removeEventListener('eduroute:industry-updated', onUp);
  }, [refresh]);

  const filteredApplicants = useMemo(
    () => applicants.filter((a) => a.postingId === selectedPostingId),
    [applicants, selectedPostingId],
  );

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const title = form.title.trim();
    const stipend = form.stipend.trim();
    const location = form.location.trim();
    if (!title || !stipend || !location) {
      setFormError('Title, stipend, and location are required.');
      return;
    }
    const skills = form.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setPostingBusy(true);
    try {
      const created = addIndustryPosting({
        title,
        skills: skills.length ? skills : ['General'],
        stipend,
        location,
        description:
          form.description.trim() || 'Internship opportunity posted by industry partner.',
      });
      setForm({ title: '', skills: '', stipend: '', location: '', description: '' });
      setShowForm(false);
      setSelectedPostingId(created.id);
      refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not publish. Try again.');
    } finally {
      setPostingBusy(false);
    }
  };

  const handleShortlist = (id: string) => {
    shortlistApplicant(id);
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              E
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">Industry Workspace</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user?.name || 'Partner'} · {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
        <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-slate-800 dark:from-indigo-950/40 dark:to-slate-900 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                <Building2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                Recruiter dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Post internships, review applicants, and shortlist talent. Openings appear on the student Internships
                page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm((v) => !v);
                setFormError('');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Post internship
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handlePost}
              className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2"
            >
              {formError && (
                <p
                  className="sm:col-span-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                  role="alert"
                >
                  {formError}
                </p>
              )}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Frontend Developer Intern"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Skills (comma-separated)</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, TypeScript, DSA"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Stipend</label>
                <input
                  required
                  value={form.stipend}
                  onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                  placeholder="₹25,000 / mo"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Location</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Bangalore / Remote"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Role details, expectations, perks…"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError('');
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingBusy}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {postingBusy ? 'Publishing…' : 'Publish opening'}
                </button>
              </div>
            </form>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-2 space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
              <Briefcase className="h-5 w-5 text-indigo-600" /> Your openings
            </h2>
            {postings.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPostingId(p.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedPostingId === p.id
                    ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {p.stipend}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </section>

          <section className="lg:col-span-3">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
              <Users className="h-5 w-5 text-indigo-600" /> Applicants
              <span className="text-xs font-bold text-slate-400">{filteredApplicants.length}</span>
            </h2>
            {filteredApplicants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No applicants for this opening yet. New posts get 2 demo applicants automatically.
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredApplicants.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white">{a.studentName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {a.college} · {a.email}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {a.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="h-3 w-3" /> {a.matchPercent}% match
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-center text-[11px] font-bold ${
                          a.status === 'Shortlisted'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200'
                            : a.status === 'Interview'
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/25 dark:text-amber-200'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200'
                        }`}
                      >
                        {a.status}
                      </span>
                      {a.status !== 'Shortlisted' && (
                        <button
                          type="button"
                          onClick={() => handleShortlist(a.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
                        >
                          <Check className="h-3.5 w-3.5" /> Shortlist
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Students see these openings on{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">
            Internships
          </Link>{' '}
          after student login. Data is stored locally for this demo.
        </p>
      </main>
    </div>
  );
};

export default IndustryWorkspace;
