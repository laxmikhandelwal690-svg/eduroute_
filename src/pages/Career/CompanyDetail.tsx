import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Globe, 
  ArrowLeft, 
  Play, 
  CheckCircle2,
  Mail
} from 'lucide-react';

export const CompanyDetail = () => {
  const { id } = useParams();

  return (
    <div className="flex-1 pb-20">
      <div className="h-64 md:h-80 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-slate-900"></div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-full flex items-end pb-8">
           <Link to="/internships" className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Jobs
           </Link>
           <div className="flex flex-col md:flex-row items-end gap-6 w-full">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-[32px] p-1 shadow-2xl flex items-center justify-center overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${id}`} alt="Company Logo" className="w-full h-full object-cover rounded-[28px]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h1 className="text-3xl md:text-5xl font-black text-white">TechFlow Systems</h1>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-white/70 text-sm font-bold">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-400" /> Bangalore, India</span>
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-indigo-400" /> 500-1000 Employees</span>
                    <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-indigo-400" /> techflow.ai</span>
                 </div>
              </div>
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                 Direct Hiring CTA
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-12">
            <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Company</h2>
               <p className="text-slate-600 leading-relaxed text-lg">
                  TechFlow Systems is a leading AI-first engineering company building next-generation cloud infrastructure. 
                  We believe in radical transparency and autonomous teams. Our mission is to accelerate the world's 
                  transition to decentralized computing.
               </p>
            </section>

            <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Company Culture</h2>
               <div className="aspect-video w-full rounded-[40px] bg-slate-100 overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <button className="h-20 w-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 fill-current" />
                     </button>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white font-bold">
                     <p className="text-xs uppercase tracking-widest opacity-70">Watch Video</p>
                     <h3 className="text-xl">Life at TechFlow</h3>
                  </div>
               </div>
            </section>

            <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Internship Roles</h2>
               <div className="space-y-4">
                  {['Senior Frontend Intern', 'DevOps Specialist', 'QA Engineer'].map(role => (
                    <div key={role} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all">
                       <div>
                          <h4 className="font-bold text-slate-900">{role}</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">Stipend: ₹25,000 • 6 Months</p>
                       </div>
                       <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
                          Apply
                       </button>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="space-y-8">
            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-6">Why Join Us?</h3>
               <ul className="space-y-4">
                  {[
                    'Remote-first work policy',
                    'Health & Wellness allowance',
                    'Latest MacBook Pro M3',
                    'Bi-annual team retreats'
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                       <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100">
               <Mail className="h-8 w-8 text-indigo-600 mb-4" />
               <h3 className="font-bold text-indigo-900 mb-2">Have Questions?</h3>
               <p className="text-sm text-indigo-700 mb-6">Reach out to our talent acquisition team directly.</p>
               <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm">
                  Contact HR
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
