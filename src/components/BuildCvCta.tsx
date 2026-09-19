import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  className?: string;
};

/** Shared Build CV entry card used on Dashboard, Internships, Profile */
export function BuildCvCta({
  title = 'Build CV',
  subtitle = 'Free templates · step-by-step editor · download PDF for internships & placements.',
  ctaLabel = 'Open builder',
  className = '',
}: Props) {
  return (
    <Link
      to="/cv-builder"
      className={`mb-6 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-white p-5 transition hover:border-indigo-300 hover:shadow-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">{title}</p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 self-start rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white sm:self-center">
        {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
