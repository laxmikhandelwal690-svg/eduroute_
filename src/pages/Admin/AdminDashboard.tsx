import { 
  Users, 
  ShieldCheck, 
  Map, 
  Briefcase, 
  TrendingUp, 
  Check, 
  X, 
  ExternalLink,
  Settings,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useUISound } from '../../contexts/SoundContext';

const PENDING_VERIFICATIONS = [
  { id: '1', name: 'Arjun Gupta', college: 'DTU Delhi', date: '2 hours ago', document: 'id_card_front.jpg' },
  { id: '2', name: 'Zoya Khan', college: 'MSU Baroda', date: '5 hours ago', document: 'admission_letter.pdf' },
  { id: '3', name: 'Rahul Varma', college: 'NIT Trichy', date: '1 day ago', document: 'id_card_back.jpg' },
];

export const AdminDashboard = () => {
  const { isMuted, toggleMuted } = useUISound();

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
             <Settings className="h-8 w-8 text-indigo-600" /> Admin Control Center
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage verifications, roadmaps, and platform insights.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
           <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black">AD</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Users} label="Total Students" value="48,250" trend="+12%" />
        <StatCard icon={ShieldCheck} label="Verified IDs" value="12,400" trend="+8%" />
        <StatCard icon={Map} label="Active Roadmaps" value="22" trend="0%" />
        <StatCard icon={Briefcase} label="Internships" value="156" trend="+24%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-slate-900">Pending College Verifications</h2>
                 <button className="text-indigo-600 text-sm font-bold hover:underline">View all</button>
              </div>
              <div className="divide-y divide-slate-50">
                 {PENDING_VERIFICATIONS.map((user) => (
                   <div key={user.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex gap-4">
                         <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                            {user.name.charAt(0)}
                         </div>
                         <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-sm text-slate-400 font-medium">{user.college} • {user.date}</div>
                            <button className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                               <ExternalLink className="h-3 w-3" /> View Document: {user.document}
                            </button>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                            <Check className="h-4 w-4" /> Approve
                         </button>
                         <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                            <X className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div>
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                 <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-between">
                    Add New Roadmap <Map className="h-4 w-4" />
                 </button>
                 <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-between">
                    Post New Internship <Briefcase className="h-4 w-4" />
                 </button>
                 <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-between">
                    Manage Rewards <TrendingUp className="h-4 w-4" />
                 </button>
                 <button
                    onClick={toggleMuted}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-between"
                 >
                    UI Sound Feedback
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      {isMuted ? 'Muted' : 'On'}
                    </span>
                 </button>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100">
              <h3 className="text-lg font-bold mb-2">Platform Status</h3>
              <p className="text-indigo-100 text-sm mb-6 font-medium">Everything is running smoothly. 2 new server clusters added.</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-indigo-200">
                    <span>CPU Load</span>
                    <span>32%</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[32%] bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
     <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
           <Icon className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
           <TrendingUp className="h-3 w-3" /> {trend}
        </div>
     </div>
     <div className="text-2xl font-black text-slate-900">{value}</div>
     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
  </div>
);
