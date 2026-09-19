import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin,
  Users,
  Globe,
  ArrowLeft,
  Play,
  CheckCircle2,
  Mail,
  Check,
} from 'lucide-react';
import { INTERNSHIPS } from './Internships';
import {
  applyToInternship,
  getApplication,
  hasApplied,
  statusBadgeClass,
  type InternshipApplication,
} from '../../utils/internshipApplications';
import { industryPostingsAsInternships } from '../../utils/industryStore';

export const CompanyDetail = () => {
  const { id } = useParams();
  const internship = useMemo(() => {
    const fromStatic = INTERNSHIPS.find((job) => job.id === id);
    if (fromStatic) return fromStatic;
    const fromIndustry = industryPostingsAsInternships().find((job) => job.id === id);
    if (fromIndustry) return fromIndustry as (typeof INTERNSHIPS)[number];
    return INTERNSHIPS[0];
  }, [id]);

  const [application, setApplication] = useState<InternshipApplication | null>(null);

  const refresh = useCallback(() => {
    setApplication(getApplication(internship.id) || null);
  }, [internship.id]);

  useEffect(() => {
    refresh();
    window.addEventListener('eduroute:applications-updated', refresh);
    return () => window.removeEventListener('eduroute:applications-updated', refresh);
  }, [refresh]);

  const applied = Boolean(application) || hasApplied(internship.id);

  const handleApply = () => {
    if (applied) return;
    const app = applyToInternship({
      internshipId: internship.id,
      role: internship.role,
      company: internship.company,
      location: internship.location,
      stipend: internship.stipend,
      logo: internship.logo,
    });
    if (app) setApplication(app);
  };

  return (
    <div className="flex-1 pb-20">
      <div className="h-64 md:h-80 bg-slate-900 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-full flex items-end pb-8">
          <Link
            to="/internships"
            className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row items-end gap-6 w-full">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-[32px] p-1 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={internship.logo}
                alt={internship.company}
                className="w-full h-full object-cover rounded-[28px]"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-white">{internship.company}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-white/70 text-sm font-bold">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-400" /> {internship.location}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" /> {internship.employeeCount}
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-400" />{' '}
                  <a
                    href={internship.companylink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {internship.companylink}
                  </a>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={applied}
              className={`px-8 py-4 rounded-2xl font-bold shadow-lg transition-all ${
                applied
                  ? 'bg-emerald-600 text-white cursor-not-allowed opacity-90'
                  : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'
              }`}
            >
              {applied ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Applied
                  {application && (
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                  )}
                </span>
              ) : (
                'Apply Now'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the role</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              {(internship as { description?: string }).description ||
                `${internship.company} is hiring for ${internship.role}. Apply to join the team and grow with mentors on real projects.`}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Company Culture</h2>
            <div className="aspect-video w-full rounded-[40px] bg-slate-100 dark:bg-slate-800 overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  type="button"
                  className="h-20 w-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform"
                >
                  <Play className="h-8 w-8 fill-current" />
                </button>
              </div>
              <div className="absolute bottom-6 left-6 text-white font-bold">
                <p className="text-xs uppercase tracking-widest opacity-70">Watch Video</p>
                <h3 className="text-xl">Life at {internship.company}</h3>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Open Internship Roles</h2>
            <div className="space-y-4">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 group hover:border-indigo-100 dark:hover:border-indigo-800 transition-all">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{internship.role}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Stipend: {internship.stipend} • {internship.duration}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applied}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    applied
                      ? 'bg-emerald-600 text-white cursor-not-allowed'
                      : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-600'
                  }`}
                >
                  {applied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Why Join Us?</h3>
            <ul className="space-y-4">
              {[
                'Remote-first work policy',
                'Health & Wellness allowance',
                'Latest MacBook Pro M3',
                'Bi-annual team retreats',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-[40px] border border-indigo-100 dark:border-indigo-900">
            <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-4" />
            <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Have Questions?</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-6">
              Reach out to our talent acquisition team directly.
            </p>
            <button
              type="button"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700"
            >
              Contact HR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
