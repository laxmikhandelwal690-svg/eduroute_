import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Code2, Database, GraduationCap, Shield, Sparkles } from 'lucide-react';
import {
  GAP_QUESTIONS,
  INTEREST_OPTIONS,
  InterestTrack,
  GapAnswer,
  interestLabel,
  markOnboardingSkipped,
  saveGapResults,
  saveInterests,
} from '../../utils/onboardingStore';
import { saveSkillGap } from '../../services/buddyApi';
import { getAuthUser } from '../../utils/rbacAuth';

type Step = 'interests' | 'gaps';

const iconFor = (icon: 'software' | 'cyber' | 'data') => {
  if (icon === 'software') return <Code2 className="h-8 w-8 text-indigo-600" />;
  if (icon === 'cyber') return <Shield className="h-8 w-8 text-violet-600" />;
  return <Database className="h-8 w-8 text-emerald-600" />;
};

export const OnboardingAnalyze = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('interests');
  const [selected, setSelected] = useState<InterestTrack[]>([]);
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no'>>({});
  const [saving, setSaving] = useState(false);

  const gapQuestions = useMemo(() => {
    const tracks = selected.length ? selected : (['software'] as InterestTrack[]);
    const map = new Map<string, { id: string; question: string; skill: string }>();
    tracks.forEach((track) => {
      GAP_QUESTIONS[track].forEach((q) => {
        if (!map.has(q.id)) map.set(q.id, q);
      });
    });
    return Array.from(map.values()).slice(0, 6);
  }, [selected]);

  const answeredCount = Object.keys(answers).length;
  const canFinishGaps = answeredCount === gapQuestions.length;
  const goDashboard = () => navigate('/dashboard', { replace: true });

  const toggleInterest = (id: InterestTrack) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const finishToBuddy = async (
    gapAnswers: GapAnswer[],
    missingSkills: string[],
    interests: InterestTrack[],
  ) => {
    setSaving(true);
    try {
      saveInterests(interests);
      saveGapResults(gapAnswers, missingSkills);
      const user = getAuthUser();
      if (user?.id && missingSkills.length) {
        try {
          await saveSkillGap({ userId: user.id, missingSkills });
        } catch {
          /* local store is enough for Buddy */
        }
      }
    } finally {
      setSaving(false);
      goDashboard();
    }
  };

  const handleSkipAll = () => {
    markOnboardingSkipped();
    goDashboard();
  };

  const handleInterestsDone = () => {
    if (selected.length === 0) {
      markOnboardingSkipped();
      goDashboard();
      return;
    }
    saveInterests(selected);
    setStep('gaps');
  };

  const handleGapsDone = async () => {
    const gapAnswers: GapAnswer[] = gapQuestions.map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || 'no',
      skill: q.skill,
    }));
    const missingSkills = gapAnswers.filter((a) => a.answer === 'no').map((a) => a.skill);
    await finishToBuddy(gapAnswers, missingSkills, selected);
  };

  const handleSkipGaps = async () => {
    await finishToBuddy([], [], selected);
  };

  const stepLabel = step === 'interests' ? 'Step 1 of 2' : 'Step 2 of 2';
  const progressPct = step === 'interests' ? 50 : 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9ff] text-slate-900">
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-800">EduRoute</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 sm:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">{stepLabel}</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-4 sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4" />
          Tell us about yourself
        </div>

        <AnimatePresence mode="wait">
          {step === 'interests' ? (
            <motion.div
              key="interests"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full"
            >
              <h1 className="text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Which one are you interested in?
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                Select the option(s) that match your interests and goals.
                <br className="hidden sm:block" />
                This will help us provide better recommendations for you.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {INTEREST_OPTIONS.map((opt) => {
                  const isOn = selected.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`group relative rounded-3xl border bg-gradient-to-br p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${opt.accent} ${
                        isOn ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-transparent'
                      }`}
                    >
                      {isOn && (
                        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      )}
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                        {iconFor(opt.icon)}
                      </div>
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">{opt.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{opt.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleInterestsDone}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Done <span aria-hidden>→</span>
                </button>
                <button
                  type="button"
                  onClick={handleSkipAll}
                  className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gaps"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-2xl"
            >
              <h1 className="text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Quick skill check
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-slate-500 sm:text-base">
                Answer a few yes/no questions about{' '}
                <span className="font-semibold text-indigo-600">
                  {selected.map(interestLabel).join(', ')}
                </span>
                . We use this to personalize Buddy AI and your learning path.
              </p>

              <div className="mt-8 space-y-4">
                {gapQuestions.map((q, index) => (
                  <div key={q.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-800">
                      <span className="mr-2 text-indigo-500">{index + 1}.</span>
                      {q.question}
                    </p>
                    <div className="mt-4 flex gap-3">
                      {(['yes', 'no'] as const).map((val) => {
                        const active = answers[q.id] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold capitalize transition ${
                              active
                                ? val === 'yes'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-rose-400 bg-rose-50 text-rose-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs font-medium text-slate-400">
                {answeredCount}/{gapQuestions.length} answered
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={!canFinishGaps || saving}
                  onClick={() => void handleGapsDone()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Done'} <span aria-hidden>→</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSkipGaps()}
                  className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OnboardingAnalyze;
