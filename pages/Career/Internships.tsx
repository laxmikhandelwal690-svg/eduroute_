import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Filter, 
  Clock, 
  Building2, 
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INTERNSHIPS = [
  {
    id: '1',
    role: 'Frontend Developer Intern',
    company: 'TechFlow Systems',
    location: 'Bangalore, India (Remote)',
    stipend: '₹25,000 / mo',
    type: 'Full-time',
    duration: '6 Months',
    posted: '2 days ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
    tags: ['React', 'TypeScript', 'Tailwind'],
    verified: true,
    fastTrack: true
  },
  {
    id: '2',
    role: 'Backend Engineering Intern',
    company: 'DataScale AI',
    location: 'Pune, India',
    stipend: '₹30,000 / mo',
    type: 'Full-time',
    duration: '3 Months',
    posted: '5 hours ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DS',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    verified: true,
    fastTrack: false
  },
  {
    id: '3',
    role: 'UI/UX Design Intern',
    company: 'CreativePulse',
    location: 'Mumbai, India',
    stipend: '₹15,000 / mo',
    type: 'Part-time',
    duration: '4 Months',
    posted: '1 week ago',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CP',
    tags: ['Figma', 'Prototyping', 'User Research'],
    verified: false,
    fastTrack: false
  }
];

export const Internships = () => {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Career Connect</h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Exclusive internship opportunities for EDUROUTE learners. Apply to verified companies based on your roadmap progress.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roles or companies..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 shrink-0">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold shrink-0">Frontend</button>
          <button className="px-5 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold shrink-0">Backend</button>
          <button className="px-5 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold shrink-0">Remote Only</button>
        </div>
      </div>

      <div className="space-y-6">
        {INTERNSHIPS.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ y: -4 }}
            className="group bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-xl"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-[28px] bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                 <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.role}</h3>
                  {job.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
                      <ShieldCheck className="h-3 w-3" /> VERIFIED
                    </div>
                  )}
                  {job.fastTrack && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold border border-amber-100">
                      <Zap className="h-3 w-3" /> FAST TRACK
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 mb-6">
                   <Link to={`/companies/${job.id}`} className="flex items-center gap-2 hover:text-indigo-600">
                      <Building2 className="h-4 w-4" /> {job.company}
                   </Link>
                   <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {job.location}
                   </div>
                   <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> {job.stipend}
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {job.duration}
                   </div>
                </div>

                <div className="flex flex-wrap gap-2">
                   {job.tags.map(tag => (
                     <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {tag}
                     </span>
                   ))}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-6 border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-8">
                 <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase">Posted</div>
                    <div className="text-sm font-bold text-slate-700">{job.posted}</div>
                 </div>
                 <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg group-hover:shadow-indigo-100">
                    Apply Now <ArrowUpRight className="h-4 w-4" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
         <button className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
            Load More Opportunities
         </button>
      </div>
    </div>
  );
};
