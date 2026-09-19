import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Search } from 'lucide-react';

const EVENTS = [
  {
    id: '1',
    title: 'Modern Web Architecture Summit 2024',
    date: 'Oct 15, 2024',
    location: 'IIT Delhi / Hybrid',
    attendees: '2,500+',
    category: 'Technology',
    filter: 'all' as const,
    image:
      'https://images.unsplash.com/photo-1571645163064-77faa9676a46?q=80&w=1170&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Google Cloud Study Jam',
    date: 'Sep 28, 2024',
    location: 'IIT Jodhpur (On-campus)',
    attendees: '400',
    category: 'Workshop',
    filter: 'workshops' as const,
    image:
      'https://images.unsplash.com/photo-1616499535171-a3ca97f87a7d?q=80&w=1170&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    date: 'Nov 02, 2024',
    location: 'Online',
    attendees: '1,200',
    category: 'Design',
    filter: 'meetups' as const,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60',
  },
];

type Tab = 'all' | 'workshops' | 'meetups';

export const Events = () => {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      const matchTab = tab === 'all' || e.filter === tab || (tab === 'workshops' && e.category === 'Workshop');
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchTab && matchQ;
    });
  }, [tab, query]);

  const tabBtn = (id: Tab, label: string) => {
    const active = tab === id;
    return (
      <button
        type="button"
        onClick={() => setTab(id)}
        className={`px-6 py-3 rounded-2xl font-bold transition-all ${
          active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/40'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Growth Events</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Expand your network and learn from experts at our curated tech summits, workshops, and hackathons.
        </p>
      </header>

      {/* Hero / Featured Event — previous UI */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="mb-12 relative h-80 md:h-[450px] rounded-[40px] overflow-hidden group cursor-pointer"
      >
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt="Featured Event"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest">
              Featured Event
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest">
              Hackathon
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Global AI Innovation Hackathon</h2>
          <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-bold">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" /> Dec 10-12, 2024
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-400" /> IIT Jodhpur
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" /> 5,000+ Participants
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tabBtn('all', 'All Events')}
          {tabBtn('workshops', 'Workshops')}
          {tabBtn('meetups', 'Meetups')}
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or month..."
            className="pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm w-full md:w-64 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ y: -8 }}
            className="group bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/30 transition-all"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                {event.category}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">{event.date}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-1">{event.title}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400" /> {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <Users className="h-4 w-4 text-slate-400" /> {event.attendees} attending
                </div>
              </div>
              <button
                type="button"
                className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Register Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">No events match your filters.</p>
      )}
    </div>
  );
};

export default Events;
