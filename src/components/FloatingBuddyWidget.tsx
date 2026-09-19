/**
 * Global floating “How can I help you?” AI assistant.
 * Uses existing sendBuddyMessage — does not modify Buddy page or backend.
 * Messages share the same localStorage conversation store as Buddy AI so chats continue.
 */
import { FormEvent, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  Map,
  Send,
  Sparkles,
  Trophy,
  TrendingUp,
  X,
} from 'lucide-react';
import { sendBuddyMessage } from '../services/buddyApi';
import { getAuthUser } from '../utils/rbacAuth';
import { BuddyMarkdown } from './BuddyMarkdown';
import type { BuddyMessage } from '../types/buddy';
import {
  getActiveConversation,
  saveActiveMessages,
} from '../utils/buddyConversations';
import { buildBuddyOnboardingContext } from '../utils/onboardingStore';

type ChatMsg = { id: number; role: 'user' | 'ai'; text: string };

function toChatMsg(m: BuddyMessage): ChatMsg {
  return { id: m.id, role: m.role, text: m.text };
}

function toBuddyMsg(m: ChatMsg): BuddyMessage {
  return {
    id: m.id,
    role: m.role,
    text: m.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function loadSharedMessages(userId: string): ChatMsg[] {
  try {
    const active = getActiveConversation(userId);
    if (active.messages?.length) {
      return active.messages.map(toChatMsg);
    }
  } catch {
    /* ignore */
  }
  return [];
}

function persistSharedMessages(userId: string, msgs: ChatMsg[]) {
  try {
    saveActiveMessages(userId, msgs.map(toBuddyMsg));
    window.dispatchEvent(new CustomEvent('eduroute:buddy-messages-updated'));
  } catch {
    /* ignore */
  }
}

const POS_KEY = 'eduroute:floating-buddy-pos';

const QUICK = [
  { label: 'Explain a topic', prompt: 'Explain a core programming topic step by step for a beginner.', icon: BookOpen },
  { label: 'Show my roadmap', path: '/roadmaps', icon: Map },
  { label: 'Check assessments', path: '/assessments', icon: ClipboardList },
  { label: 'Tell me about internships', path: '/internships', icon: Briefcase },
  { label: 'View leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Give me study tips', prompt: 'Give me practical study tips to stay consistent and improve this week.', icon: TrendingUp },
] as const;

function loadPos(): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { x: number; y: number };
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch {
    /* ignore */
  }
  return null;
}

function savePos(x: number, y: number) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  } catch {
    /* ignore */
  }
}

function defaultPos() {
  if (typeof window === 'undefined') return { x: 24, y: 24 };
  return { x: 24, y: 24 };
}

export function FloatingBuddyWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAuthUser();
  const userName = user?.name?.split(' ')[0] || 'there';
  const userId = user?.id || 'demo-student-101';
  const hideOnBuddy = location.pathname.startsWith('/buddy');

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>(() => loadSharedMessages(userId));
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');

  const [pos, setPos] = useState(() => loadPos() || defaultPos());
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMessages(loadSharedMessages(userId));
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, userId]);

  useEffect(() => {
    const onUpdate = () => {
      if (open) setMessages(loadSharedMessages(userId));
    };
    window.addEventListener('eduroute:buddy-messages-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('eduroute:buddy-messages-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [open, userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const clampPos = useCallback((x: number, y: number) => {
    const pad = 8;
    const w = 64;
    const h = 64;
    const maxX = Math.max(pad, window.innerWidth - w - pad);
    const maxY = Math.max(pad, window.innerHeight - h - pad);
    const right = Math.min(maxX, Math.max(pad, x));
    const bottom = Math.min(maxY, Math.max(pad, y));
    return { x: right, y: bottom };
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    moved.current = false;
    const el = fabRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    moved.current = true;
    const left = e.clientX - dragOffset.current.x;
    const top = e.clientY - dragOffset.current.y;
    const right = window.innerWidth - left - 56;
    const bottom = window.innerHeight - top - 56;
    setPos(clampPos(right, bottom));
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      fabRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    savePos(pos.x, pos.y);
    if (!moved.current) {
      setOpen((v) => !v);
    }
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setInput('');
    setError('');
    const userMsg: ChatMsg = { id: Date.now(), role: 'user', text: q };
    setMessages((m) => {
      const next = [...m, userMsg];
      persistSharedMessages(userId, next);
      return next;
    });
    setTyping(true);
    try {
      const onboard = buildBuddyOnboardingContext();
      const messageWithContext = onboard.summary
        ? `[Student profile] ${onboard.summary}\n\n${q}`
        : q;
      const res = await sendBuddyMessage({
        userId,
        message: messageWithContext,
        language: 'english',
        context: {
          missingSkills: onboard.missingSkills,
        },
      });
      const aiMsg: ChatMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: res.reply || 'I could not generate a reply right now.',
      };
      setMessages((m) => {
        const next = [...m, aiMsg];
        persistSharedMessages(userId, next);
        return next;
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Buddy is temporarily unavailable.');
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onQuick = (item: (typeof QUICK)[number]) => {
    if ('path' in item && item.path) {
      setOpen(false);
      navigate(item.path);
      return;
    }
    if ('prompt' in item && item.prompt) {
      void send(item.prompt);
    }
  };

  const fabStyle: CSSProperties = {
    right: pos.x,
    bottom: pos.y,
  };

  const panelStyle: CSSProperties = {
    right: typeof window !== 'undefined' ? Math.min(pos.x, Math.max(8, window.innerWidth - 380)) : pos.x,
    bottom: pos.y + 72,
  };

  if (hideOnBuddy) return null;

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          style={panelStyle}
          className="fixed z-[90] flex w-[min(380px,calc(100vw-24px))] max-h-[min(560px,calc(100vh-120px))] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          role="dialog"
          aria-label="EDUROUTE AI assistant"
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200/60 dark:shadow-violet-900/40">
              <span className="text-lg" aria-hidden>
                🤖
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">How can I help you?</h2>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">Your AI learning assistant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <div className="mb-3 rounded-xl bg-violet-50 px-3.5 py-3 dark:bg-violet-950/40">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                <span className="mr-1">✨</span>
                Hi {userName}! 👋
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                I'm your EDUROUTE AI Buddy. Ask me anything about your learning journey, courses, roadmap,
                assessments, internships, or anything else!
              </p>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-2.5 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-violet-600 text-white'
                      : 'rounded-bl-md border border-slate-100 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  {m.role === 'ai' ? <BuddyMarkdown text={m.text} /> : m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                </span>
                Buddy is thinking…
              </div>
            )}

            {error && (
              <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            {messages.length === 0 && !typing && (
              <div className="mt-1">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Quick Suggestions
                </p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {QUICK.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onQuick(item)}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-violet-500/40 dark:hover:bg-violet-950/40 dark:hover:text-violet-300"
                    >
                      <item.icon className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="text-slate-300 dark:text-slate-600">›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-slate-100 px-3 py-3 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:border-violet-500/60">
              <Sparkles className="ml-1.5 h-4 w-4 shrink-0 text-violet-400" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Press Enter to send · Saved to Buddy AI history
            </p>
          </form>
        </div>
      )}

      <button
        ref={fabRef}
        type="button"
        style={fabStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="fixed z-[91] flex h-14 touch-none select-none items-center gap-2 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 px-1.5 pr-4 text-white shadow-lg shadow-violet-300/50 transition hover:shadow-xl hover:shadow-violet-400/50 active:cursor-grabbing dark:shadow-violet-900/50 sm:h-12"
        aria-label="How can I help you? AI assistant"
        title="Drag to move · Click to open"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl sm:h-9 sm:w-9">
          🤖
        </span>
        <span className="hidden text-sm font-semibold sm:inline">How can I help you?</span>
        <Sparkles className="hidden h-3.5 w-3.5 opacity-80 sm:inline" />
      </button>
    </>
  );
}

export default FloatingBuddyWidget;
