import { FormEvent, useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from 'react';
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  Languages,
  Lightbulb,
  Map,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';
import { fetchBuddyProgress, sendBuddyMessage } from '../../services/buddyApi';
import type { BuddyLanguage, BuddyMessage, BuddyProgress } from '../../types/buddy';
import { getAuthUser } from '../../utils/rbacAuth';
import { BuddyMarkdown } from '../../components/BuddyMarkdown';
import {
  type BuddyConversation,
  deleteConversation,
  getActiveConversation,
  listConversations,
  saveActiveMessages,
  startNewConversation,
  switchConversation,
} from '../../utils/buddyConversations';
import { buildBuddyOnboardingContext } from '../../utils/onboardingStore';

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const QUICK_PROMPTS = [
  { label: 'Explain a DSA topic', prompt: 'Explain a core DSA topic step by step for a beginner.', icon: Code2 },
  { label: 'Plan my study roadmap', prompt: 'Create a practical study roadmap based on my goals and skill gaps.', icon: Map },
  { label: 'Help with project ideas', prompt: 'Suggest project ideas that will strengthen my portfolio for internships.', icon: Lightbulb },
  { label: 'Interview preparation tips', prompt: 'Share practical interview preparation tips for software roles.', icon: UserRound },
  { label: 'Career guidance', prompt: 'Give me career guidance for landing an SDE or related role.', icon: Briefcase },
] as const;

const LANGUAGE_OPTIONS: { value: BuddyLanguage; label: string; short: string }[] = [
  { value: 'english', label: 'English', short: 'EN' },
  { value: 'hindi', label: 'Hindi', short: 'HI' },
  { value: 'hinglish', label: 'Hinglish', short: 'HN' },
];

function welcomeMessage(name: string): BuddyMessage {
  return {
    id: 1,
    role: 'ai',
    text: [
      `Hey ${name}! 👋`,
      ``,
      `I'm your AI Buddy — your personal learning and career companion. I can help you with:`,
      ``,
      `• Explain concepts in simple terms`,
      `• Solve DSA & coding problems`,
      `• Plan your learning roadmap`,
      `• Guide you for internships & SDE roles`,
      `• Answer your doubts anytime`,
      ``,
      `Just tell me what you want to work on, and I'll guide you step by step! 🚀`,
    ].join('\n'),
    timestamp: timestamp(),
  };
}

const SIDEBAR_MIN = 0;
const SIDEBAR_MAX = 360;
const SIDEBAR_DEFAULT = 300;
const SIDEBAR_COLLAPSED = 0;

export const BuddyChat = () => {
  const authUser = getAuthUser();
  const currentUserId = authUser?.id || 'demo-student-101';
  const firstName = authUser?.name?.split(' ')[0] || 'there';

  const [conversations, setConversations] = useState<BuddyConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BuddyMessage[]>(() => [welcomeMessage(firstName)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<BuddyLanguage>('english');
  const [progress, setProgress] = useState<BuddyProgress | null>(null);
  const [error, setError] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(SIDEBAR_DEFAULT);

  useEffect(() => {
    const active = getActiveConversation(currentUserId);
    setActiveChatId(active.id);
    setMessages(active.messages.length ? active.messages : [welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
    void (async () => {
      try {
        const data = await fetchBuddyProgress(currentUserId);
        setProgress(data.progress);
        setLanguage(data.progress.preferredLanguage || 'english');
      } catch {
        /* offline ok */
      }
    })();
  }, [currentUserId, firstName]);

  useEffect(() => {
    if (!activeChatId) return;
    saveActiveMessages(currentUserId, messages);
    setConversations(listConversations(currentUserId));
  }, [messages, activeChatId, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const refresh = () => {
      const active = getActiveConversation(currentUserId);
      setActiveChatId(active.id);
      setMessages(active.messages.length ? active.messages : [welcomeMessage(firstName)]);
      setConversations(listConversations(currentUserId));
    };
    window.addEventListener('eduroute:buddy-messages-updated', refresh);
    return () => window.removeEventListener('eduroute:buddy-messages-updated', refresh);
  }, [currentUserId, firstName]);

  const onDragStart = (e: ReactPointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onDragMove = useCallback((e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const delta = startX.current - e.clientX;
    const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startWidth.current + delta));
    setSidebarWidth(next);
    setSidebarOpen(next > 40);
  }, []);

  const onDragEnd = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
    if (sidebarWidth < 80) {
      setSidebarWidth(SIDEBAR_COLLAPSED);
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (sidebarOpen && sidebarWidth > 40) {
      setSidebarOpen(false);
      setSidebarWidth(SIDEBAR_COLLAPSED);
    } else {
      setSidebarOpen(true);
      setSidebarWidth(SIDEBAR_DEFAULT);
    }
  };

  const handleSend = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || isTyping) return;
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text, timestamp: timestamp() }]);
    setInput('');
    setError('');
    setIsTyping(true);
    try {
      const onboard = buildBuddyOnboardingContext();
      const mergedMissing = [...(progress?.missingSkills || []), ...onboard.missingSkills].filter(
        (v, i, arr) => arr.indexOf(v) === i,
      );
      const messageWithContext = onboard.summary
        ? `[Student profile] ${onboard.summary}\n\n${text}`
        : text;
      const response = await sendBuddyMessage({
        userId: currentUserId,
        message: messageWithContext,
        language,
        context: {
          level: progress?.level,
          points: progress?.points,
          missingSkills: mergedMissing,
          weeklyChallenge: progress?.weeklyChallenges?.[0],
        },
      });
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: 'ai', text: response.reply, timestamp: timestamp() },
      ]);
      setProgress((current) => ({
        points: response.gamification?.points || current?.points || 0,
        level: response.gamification?.level || current?.level || 1,
        achievements: current?.achievements || ['Welcome to Buddy'],
        weeklyChallenges: current?.weeklyChallenges || ['Complete one skill challenge this week'],
        missingSkills: current?.missingSkills || [],
        preferredLanguage: language,
      }));
    } catch (sendError: unknown) {
      setError(sendError instanceof Error ? sendError.message : 'Buddy is temporarily unavailable.');
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend();
  };

  const onNewChat = () => {
    const conv = startNewConversation(currentUserId);
    setActiveChatId(conv.id);
    setMessages([welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
  };

  const onSelectChat = (id: string) => {
    const conv = switchConversation(currentUserId, id);
    if (!conv) return;
    setActiveChatId(conv.id);
    setMessages(conv.messages.length ? conv.messages : [welcomeMessage(firstName)]);
    setConversations(listConversations(currentUserId));
  };

  const onDeleteChat = (id: string, e?: ReactMouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!window.confirm('Delete this chat? This cannot be undone.')) return;
    const next = deleteConversation(currentUserId, id);
    setConversations(listConversations(currentUserId));
    setActiveChatId(next.id);
    setMessages(next.messages.length ? next.messages : [welcomeMessage(firstName)]);
  };

  const effectiveWidth = sidebarOpen ? Math.max(sidebarWidth, 200) : 0;

  return (
    <div className="relative flex h-[calc(100vh-5.5rem)] min-h-[520px] w-full gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200/50 dark:shadow-violet-900/40">
              <span className="text-lg" aria-hidden>🤖</span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Buddy AI</h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                </span>
              </div>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Your personal study & career companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative flex items-center">
              <label htmlFor="buddy-language" className="sr-only">Reply language</label>
              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/80">
                <Languages className="h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden />
                <select
                  id="buddy-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as BuddyLanguage)}
                  className="max-w-[6.5rem] cursor-pointer appearance-none border-0 bg-transparent py-0.5 pr-4 text-xs font-semibold text-slate-700 outline-none dark:text-slate-200"
                  title="Buddy reply language"
                  aria-label="Buddy reply language"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" onClick={onNewChat} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200" title="New chat" aria-label="New chat">
              <Plus className="h-5 w-5" />
            </button>
            <button type="button" onClick={toggleSidebar} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden" title={sidebarOpen ? 'Hide panel' : 'Show prompts'} aria-label="Toggle side panel">
              {sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button type="button" className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="More options">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && (
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white shadow-sm">🤖</div>
              )}
              <div className={`max-w-[min(100%,36rem)] ${m.role === 'user' ? 'order-1' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${m.role === 'user' ? 'rounded-br-md bg-violet-600 text-white shadow-sm shadow-violet-200/40 dark:shadow-violet-900/30' : 'rounded-bl-md border border-slate-100 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100'}`}>
                  {m.role === 'ai' ? <BuddyMarkdown text={m.text} /> : m.text}
                </div>
                <p className={`mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}{m.role === 'user' ? ' ✓' : ''}
                </p>
              </div>
              {m.role === 'user' && (
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">{(firstName[0] || 'U').toUpperCase()}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm text-white">🤖</div>
              <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-xs font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 animate-pulse text-violet-500" /> Buddy is thinking…</span>
              </div>
            </div>
          )}
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300">{error}</p>
          )}
        </div>

        <form onSubmit={onSubmit} className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80 sm:px-5">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-violet-500/50">
            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300" aria-label="Attach" title="Attachments coming soon">
              <Paperclip className="h-4 w-4" />
            </button>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Buddy anything about your learning journey..." className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500" />
            <button type="submit" disabled={!input.trim() || isTyping} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <div role="separator" aria-orientation="vertical" aria-label="Resize side panel" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd} className="group relative z-10 hidden w-1.5 shrink-0 cursor-col-resize touch-none bg-transparent hover:bg-violet-400/40 lg:block" title="Drag to resize side panel">
        <div className="absolute inset-y-0 -left-1 -right-1" />
        <div className="absolute left-1/2 top-1/2 h-10 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 opacity-0 transition group-hover:opacity-100 dark:bg-slate-600" />
      </div>

      <aside style={{ width: effectiveWidth }} className={`relative hidden shrink-0 flex-col overflow-hidden border-l border-slate-200/80 bg-white transition-[width] duration-200 ease-out dark:border-slate-800 dark:bg-slate-900/60 lg:flex ${effectiveWidth === 0 ? 'border-l-0' : ''}`}>
        {effectiveWidth > 0 && (
          <div className="flex h-full min-w-[200px] flex-col gap-4 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <button type="button" onClick={toggleSidebar} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" title="Collapse panel" aria-label="Collapse side panel">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white"><Sparkles className="h-4 w-4 text-violet-500" /> Quick Prompts</h2>
                <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">Try these</span>
              </div>
              <ul className="space-y-1">
                {QUICK_PROMPTS.map((item) => (
                  <li key={item.label}>
                    <button type="button" onClick={() => void handleSend(item.prompt)} className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-violet-700 hover:shadow-sm dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-violet-300">
                      <item.icon className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="text-slate-300 dark:text-slate-600">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white"><MessageSquare className="h-4 w-4 text-violet-500" /> Recent Chats</h2>
                <button type="button" onClick={onNewChat} className="text-[11px] font-semibold text-violet-600 hover:underline dark:text-violet-400">New</button>
              </div>
              <ul className="space-y-1">
                {conversations.length === 0 && (
                  <li className="px-2 py-3 text-xs text-slate-400">No chats yet — start one below.</li>
                )}
                {conversations.slice(0, 8).map((c) => {
                  const active = c.id === activeChatId;
                  const title = c.title || c.messages.find((m) => m.role === 'user')?.text?.slice(0, 42) || 'New conversation';
                  const when = c.updatedAt
                    ? new Date(c.updatedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '';
                  return (
                    <li key={c.id} className="group flex items-stretch gap-0.5">
                      <button type="button" onClick={() => onSelectChat(c.id)} className={`flex min-w-0 flex-1 items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition ${active ? 'bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200' : 'text-slate-700 hover:bg-white hover:shadow-sm dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold">{title}</span>
                          {when && <span className="mt-0.5 block text-[10px] font-medium text-slate-400 dark:text-slate-500">{when}</span>}
                        </span>
                      </button>
                      <button type="button" onClick={(e) => onDeleteChat(c.id, e)} className="mt-1 shrink-0 self-start rounded-lg p-1.5 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400" title="Delete chat" aria-label="Delete chat">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </aside>

      {!sidebarOpen && (
        <button type="button" onClick={toggleSidebar} className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-l-xl border border-r-0 border-slate-200 bg-white px-1.5 py-3 text-slate-500 shadow-md hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-violet-400 lg:flex" title="Show Quick Prompts & Recent Chats" aria-label="Expand side panel">
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default BuddyChat;
