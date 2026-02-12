import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Languages, RefreshCcw, ThumbsUp, Trash2 } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, role: 'ai', text: "Hello! I'm Buddy, your personal EDUROUTE guide. I've analyzed your recent React progress. Want to discuss how to improve your scores in 'State Management'?", timestamp: '10:30 AM' }
];

export const BuddyChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHinglish, setIsHinglish] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      text: input, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "That's a great question! React State can be tricky. You should generally use the simplest state possible (useState) before moving to more complex solutions like Context or Redux.";
      if (isHinglish) {
        aiText = "Ye kaafi sahi sawaal hai! React State thoda tricky ho sakta hai. Aapko pehle simple state (useState) use karni chahiye, uske baad hi Context ya Redux jaise complex solutions par jaana chahiye.";
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Buddy AI</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Learning Gap Analyzer</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHinglish(!isHinglish)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border ${
              isHinglish ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Languages className="h-4 w-4" /> {isHinglish ? 'Hinglish Mode' : 'English Mode'}
          </button>
          <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] md:max-w-[60%] ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}>
              <div className={`p-6 md:p-8 rounded-[32px] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-800 border border-slate-100'
              }`}>
                <p className="text-base font-medium leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-3 mt-3 px-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.timestamp}</span>
                {msg.role === 'ai' && (
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><ThumbsUp className="h-3 w-3" /></button>
                    <button className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><RefreshCcw className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-6 rounded-[24px] flex gap-2">
              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-12 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Buddy for advice, roadmaps, or learning gaps..."
            className="w-full pl-8 pr-20 py-6 bg-slate-50 border border-slate-100 rounded-[28px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-lg shadow-slate-200/50 font-medium text-lg"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-slate-900 text-white rounded-[20px] shadow-xl hover:bg-indigo-600 disabled:opacity-50 transition-all active:scale-90"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
