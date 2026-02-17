import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Languages, Brain, Trophy, CalendarRange, BriefcaseBusiness } from 'lucide-react';
import { fetchBuddyProgress, saveSkillGap, sendBuddyMessage } from '../../services/buddyApi';
import type { BuddyLanguage, BuddyMessage, BuddyProgress } from '../../types/buddy';

const DEFAULT_MESSAGE: BuddyMessage = {
  id: 1,
  role: 'ai',
  text: "Hey champ! I'm Buddy 👋 Ask me for learning roadmap, skill-gap test, internships, or weekly motivation.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SKILL_CHECK_QUESTIONS = [
  { key: 'html', text: 'Can you build a semantic responsive webpage using HTML/CSS?' },
  { key: 'js', text: 'Are you comfortable with JavaScript fundamentals (DOM, async/await, ES6)?' },
  { key: 'react', text: 'Can you create React apps with state management and API calls?' },
  { key: 'dsa', text: 'Do you solve DSA/coding problems at least 3 times per week?' },
];

const CURRENT_USER_ID = 'demo-student-101';

const toTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const BuddyChat = () => {
  const [messages, setMessages] = useState<BuddyMessage[]>([DEFAULT_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<BuddyLanguage>('english');
  const [progress, setProgress] = useState<BuddyProgress | null>(null);
  const [skillAnswers, setSkillAnswers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBuddyProgress(CURRENT_USER_ID);
        setProgress(data.progress);
        setLanguage(data.progress.preferredLanguage || 'english');
        if (data.history?.length) {
          const restoredMessages = data.history.map((entry: { role: string; text: string }, index: number) => ({
            id: index + 2,
            role: entry.role === 'assistant' ? 'ai' : 'user',
            text: entry.text,
            timestamp: toTimestamp(),
          }));
          setMessages([DEFAULT_MESSAGE, ...restoredMessages]);
        }
      } catch (loadError) {
        console.error(loadError);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const missingSkills = useMemo(() => {
    return SKILL_CHECK_QUESTIONS.filter((question) => skillAnswers[question.key] === false).map((question) => question.key.toUpperCase());
  }, [skillAnswers]);

  const handleSend = async (presetMessage?: string) => {
    const messageToSend = (presetMessage ?? input).trim();
    if (!messageToSend) return;

    const userText = messageToSend;
    const userMessage: BuddyMessage = { id: Date.now(), role: 'user', text: userText, timestamp: toTimestamp() };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    setIsTyping(true);

    try {
      const response = await sendBuddyMessage({ userId: CURRENT_USER_ID, message: userText, language });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: response.reply,
          timestamp: toTimestamp(),
        },
      ]);

      setProgress((prev) => ({
        points: response.gamification?.points || prev?.points || 0,
        level: response.gamification?.level || prev?.level || 1,
        achievements: prev?.achievements || ['Welcome to Buddy 🚀'],
        weeklyChallenges: prev?.weeklyChallenges || ['Complete one skill challenge this week'],
        missingSkills: prev?.missingSkills || [],
        preferredLanguage: language,
      }));
    } catch (sendError: any) {
      setError(sendError.message || 'Buddy is temporarily unavailable.');
    } finally {
      setIsTyping(false);
    }
  };

  const runSkillGapAnalyzer = async () => {
    try {
      const saved = await saveSkillGap({ userId: CURRENT_USER_ID, missingSkills });
      setProgress(saved.progress);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'ai',
          text: `Skill gap analysis done ✅ Missing focus skills: ${missingSkills.length ? missingSkills.join(', ') : 'No critical gaps found. Keep leveling up!'}.`,
          timestamp: toTimestamp(),
        },
      ]);
    } catch (analysisError: any) {
      setError(analysisError.message || 'Could not save skill-gap analysis.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Buddy AI Mentor</h1>
            <p className="text-xs text-slate-500 font-semibold">Roadmaps • Skill Gap • Internships • Motivation</p>
          </div>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as BuddyLanguage)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="hinglish">Hinglish</option>
        </select>
      </header>

      <div className="px-4 md:px-8 pt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-slate-50">
        <InfoCard icon={Trophy} title="Level" value={`Lv. ${progress?.level || 1}`} />
        <InfoCard icon={Sparkles} title="Points" value={`${progress?.points || 0} XP`} />
        <InfoCard icon={CalendarRange} title="Weekly Challenge" value={progress?.weeklyChallenges?.[0] || 'Start your first challenge'} />
        <InfoCard icon={BriefcaseBusiness} title="Career Focus" value={progress?.missingSkills?.[0] || 'No major skill gap'} />
      </div>

      <div className="px-4 md:px-8 py-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white border border-slate-100 rounded-2xl p-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Brain className="h-4 w-4 text-indigo-600" /> Skill Gap Analyzer</h2>
          <div className="mt-3 space-y-2">
            {SKILL_CHECK_QUESTIONS.map((question) => (
              <div key={question.key} className="flex items-center justify-between text-sm border border-slate-100 rounded-xl px-3 py-2">
                <span className="text-slate-700">{question.text}</span>
                <div className="flex gap-2">
                  <button onClick={() => setSkillAnswers((prev) => ({ ...prev, [question.key]: true }))} className={`px-3 py-1 rounded-lg ${skillAnswers[question.key] === true ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>Yes</button>
                  <button onClick={() => setSkillAnswers((prev) => ({ ...prev, [question.key]: false }))} className={`px-3 py-1 rounded-lg ${skillAnswers[question.key] === false ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>No</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={runSkillGapAnalyzer} className="mt-3 w-full bg-slate-900 text-white py-2 rounded-xl font-semibold">Analyze My Skill Gap</button>
        </section>

        <section className="bg-white border border-slate-100 rounded-2xl p-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Languages className="h-4 w-4 text-indigo-600" /> Quick Prompts</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'Create a Web Developer roadmap for beginner to pro',
              'Suggest internships for my current skill level',
              'How to prepare resume and portfolio for product companies?',
              'Recommend hackathons in Bengaluru this month',
            ].map((prompt) => (
              <button key={prompt} onClick={() => handleSend(prompt)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl font-semibold">
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 space-y-4">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[10px] mt-2 opacity-70">{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && <div className="text-sm text-slate-500">Buddy is typing...</div>}
        {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
      </div>

      <div className="p-4 md:p-6 bg-white border-t border-slate-100">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Buddy for roadmaps, internships, events, and motivation..."
            className="w-full pl-4 pr-14 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4">
    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider"><Icon className="h-4 w-4" /> {title}</div>
    <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
  </div>
);
