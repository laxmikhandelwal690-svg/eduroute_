import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  PlayCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { dsaSheet, TOTAL_DSA_QUESTIONS } from '../data/dsaSheetData';

type FilterType = 'all' | 'solved' | 'unsolved';

const STORAGE_KEY = 'eduroute_dsa_sheet_progress_v1';

export const DSASheet = () => {
  const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(dsaSheet.map((section) => [section.topic, true])),
  );
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as number[];
        setSolvedQuestions(parsed);
      } catch {
        setSolvedQuestions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

  const solvedSet = useMemo(() => new Set(solvedQuestions), [solvedQuestions]);

  const displayedSections = useMemo(
    () =>
      dsaSheet
        .map((section) => ({
          ...section,
          questions: section.questions.filter((question) => {
            const searchMatch = question.title.toLowerCase().includes(searchText.toLowerCase());
            const solved = solvedSet.has(question.id);

            if (!searchMatch) return false;
            if (filter === 'solved') return solved;
            if (filter === 'unsolved') return !solved;
            return true;
          }),
        }))
        .filter((section) => section.questions.length > 0),
    [filter, searchText, solvedSet],
  );

  const totalSolved = solvedQuestions.length;
  const progress = Math.round((totalSolved / TOTAL_DSA_QUESTIONS) * 100);

  const toggleSolved = (id: number) => {
    setSolvedQuestions((prev) => (prev.includes(id) ? prev.filter((questionId) => questionId !== id) : [...prev, id]));
  };

  const markAllComplete = () => {
    const ids = dsaSheet.flatMap((section) => section.questions.map((question) => question.id));
    setSolvedQuestions(ids);
  };

  return (
    <div className="relative flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1fr,320px]">
        <section className="space-y-6">
          <div className="glass-panel premium-border rounded-3xl p-6 md:p-8">
            <div className="mb-4 inline-flex animate-pulse items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-400/20 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-emerald-200 shadow-lg shadow-emerald-400/20">
              <Sparkles className="h-4 w-4" /> Free
            </div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">DSA Sheet (Beginner - 100 Questions)</h1>
            <p className="mt-2 text-sm font-medium text-slate-400 md:text-base">Practice consistently, track your solved count, and build your coding confidence one easy problem at a time.</p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search questions..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/30 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'solved', 'unsolved'] as FilterType[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest transition ${
                      filter === option ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                <button onClick={markAllComplete} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30 transition hover:brightness-110">
                  Mark all complete
                </button>
              </div>
            </div>
          </div>

          {displayedSections.map((section) => {
            const topicSolvedCount = section.questions.filter((question) => solvedSet.has(question.id)).length;
            const totalQuestions = section.questions.length;
            const isExpanded = expandedTopics[section.topic];

            return (
              <div key={section.topic} className="glass-panel premium-border overflow-hidden rounded-3xl">
                <button
                  onClick={() => setExpandedTopics((prev) => ({ ...prev, [section.topic]: !prev[section.topic] }))}
                  className="flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left"
                >
                  <div>
                    <h2 className="text-lg font-black text-slate-100">{section.topic}</h2>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">{topicSolvedCount}/{totalQuestions} solved</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-300 transition ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-sm">
                      <thead className="bg-slate-900/40 text-xs uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Problem Name</th>
                          <th className="px-4 py-3 text-left">Difficulty</th>
                          <th className="px-4 py-3 text-left">Resource</th>
                          <th className="px-4 py-3 text-left">Practice</th>
                          <th className="px-4 py-3 text-left">Notes</th>
                          <th className="px-4 py-3 text-left">Revision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.questions.map((question) => {
                          const solved = solvedSet.has(question.id);
                          return (
                            <tr key={question.id} className="border-t border-white/5 transition hover:bg-indigo-500/10 hover:shadow-[inset_0_0_24px_rgba(99,102,241,0.15)]">
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => toggleSolved(question.id)}
                                  className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
                                    solved ? 'border-emerald-300 bg-emerald-500 text-white' : 'border-slate-500 bg-transparent text-transparent hover:border-emerald-300'
                                  }`}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-100">{question.title}</td>
                              <td className="px-4 py-3">
                                <span className="rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-200">Easy</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <a href={question.resourceUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-slate-200 transition hover:bg-white/20" title="Article">
                                    <FileText className="h-4 w-4" />
                                  </a>
                                  <a href={question.videoUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 p-2 text-slate-200 transition hover:bg-white/20" title="Video">
                                    <PlayCircle className="h-4 w-4" />
                                  </a>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <a href={question.resourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-500/40 transition hover:bg-indigo-400">
                                  Solve <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </td>
                              <td className="px-4 py-3">
                                <button className="rounded-lg bg-white/10 p-2 text-slate-200 transition hover:bg-white/20" title="Add notes">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <button className="rounded-lg bg-white/10 p-2 text-amber-300 transition hover:bg-white/20" title="Mark revision">
                                  <Star className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <aside className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel premium-border sticky top-4 rounded-3xl p-6">
            <h3 className="text-lg font-black text-slate-100">DSA Progress</h3>
            <p className="text-sm text-slate-400">Track your easy questions completed out of 100.</p>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
                  <circle cx="60" cy="60" r="52" className="fill-none stroke-white/10" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="fill-none stroke-emerald-400 transition-all duration-500"
                    strokeWidth="10"
                    strokeDasharray={326.72}
                    strokeDashoffset={326.72 - (326.72 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-100">{totalSolved}</span>
                  <span className="text-xs uppercase tracking-widest text-slate-400">Solved</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-base font-semibold text-emerald-200">{totalSolved} / {TOTAL_DSA_QUESTIONS} solved</p>
            <p className="text-center text-xs text-slate-400">Easy: {totalSolved}/{TOTAL_DSA_QUESTIONS}</p>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 py-3 text-sm font-black text-white shadow-xl shadow-indigo-500/30 transition hover:brightness-110">
              <Target className="h-4 w-4" /> Start Practice
            </button>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-slate-300">
              Day Streak: <span className="font-bold text-indigo-200">12 days</span>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};
