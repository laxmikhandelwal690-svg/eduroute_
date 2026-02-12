import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Search
} from 'lucide-react';

const EVENTS = [
  {
    id: '1',
    title: 'Modern Web Architecture Summit 2024',
    date: 'Oct 15, 2024',
    location: 'IIT Delhi / Hybrid',
    attendees: '2,500+',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: '2',
    title: 'Google Cloud Study Jam',
    date: 'Sep 28, 2024',
    location: 'IIT Jodhpur (On-campus)',
    attendees: '400',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1591115765373-520b7a217294?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    date: 'Nov 02, 2024',
    location: 'Online',
    attendees: '1,200',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
  }
];

export const Events = () => {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Growth Events</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Expand your network and learn from experts at our curated tech summits, workshops, and hackathons.
        </p>
      </header>

      {/* Hero Event */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="mb-12 relative h-80 md:h-[450px] rounded-[40px] overflow-hidden group cursor-pointer"
      >
        <img 
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          alt="Featured Event"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
           <div className="flex items-center gap-2 mb-4">
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest">Featured Event</span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest">Hackathon</span>
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Global AI Innovation Hackathon</h2>
           <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-bold">
              <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-400" /> Dec 10-12, 2024</span>
              <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-indigo-400" /> IIT Jodhpur</span>
              <span className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-400" /> 5,000+ Participants</span>
           </div>
        </div>
      </motion.div>

      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all">All Events</button>
           <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Workshops</button>
           <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Meetups</button>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search city or month..."
             className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm w-full md:w-64"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="h-48 relative overflow-hidden">
               <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-black uppercase text-indigo-600">
                  {event.category}
               </div>
            </div>
            <div className="p-6">
               <div className="text-xs font-bold text-indigo-600 mb-2">{event.date}</div>
               <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-1">{event.title}</h3>
               <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                     <MapPin className="h-4 w-4 text-slate-400" /> {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                     <Users className="h-4 w-4 text-slate-400" /> {event.attendees} attending
                  </div>
               </div>
               <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                  Register Now <ArrowRight className="h-4 w-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
