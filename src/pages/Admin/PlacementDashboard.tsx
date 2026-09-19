import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronDown,
  Code2,
  FileText,
  MessageSquare,
  Network,
  TrendingUp,
  Users,
  Coffee,
  Atom,
} from 'lucide-react';
import {
  getPlacementDashboardData,
  type PlacementDashboardData,
} from '../../utils/placementDashboard';
import { getAuthUser } from '../../utils/rbacAuth';

const kpiIcons = [
  { key: 'applications', label: 'Total Applications', icon: FileText, tone: 'bg-violet-500/20 text-violet-300' },
  { key: 'shortlisted', label: 'Shortlisted', icon: Users, tone: 'bg-teal-500/20 text-teal-300' },
  { key: 'interviews', label: 'Interviews', icon: Users, tone: 'bg-blue-500/20 text-blue-300' },
  { key: 'hired', label: 'Hired', icon: Briefcase, tone: 'bg-amber-500/20 text-amber-300' },
] as const;

const skillIcons = [Code2, Atom, Network, Coffee, MessageSquare];

function funnelPct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function SimpleTrendChart({ data }: { data: PlacementDashboardData['trends'] }) {
  const maxY = Math.max(...data.flatMap((d) => [d.applied, d.shortlisted, d.hired]), 100);
  const w = 520;
  const h = 180;
  const pad = 28;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const toPoints = (key: 'applied' | 'shortlisted' | 'hired') =>
    data
      .map((d, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * innerW;
        const y = pad + innerH - (d[key] / maxY) * innerH;
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full" role="img" aria-label="Placement trends">
      {[0, 25, 50, 75, 100].map((tick) => {
        const y = pad + innerH - (tick / 100) * innerH;
        return (
          <g key={tick}>
            <line x1={pad} x2={w - pad} y1={y} y2={y} stroke="currentColor" className="text-[var(--border-default)]" strokeWidth={1} />
            <text x={8} y={y + 4} className="fill-[var(--text-muted)] text-[10px]">
              {tick}
            </text>
          </g>
        );
      })}
      <polyline fill="none" stroke="#a78bfa" strokeWidth={2.5} points={toPoints('applied')} />
      <polyline fill="none" stroke="#60a5fa" strokeWidth={2.5} points={toPoints('shortlisted')} />
      <polyline fill="none" stroke="#34d399" strokeWidth={2.5} points={toPoints('hired')} />
      {data.map((d, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * innerW;
        return (
          <text key={d.month} x={x} y={h - 6} textAnchor="middle" className="fill-[var(--text-muted)] text-[10px]">
            {d.month}
          </text>
        );
      })}
    </svg>
  );
}

export const PlacementDashboard = () => {
  const [periodOpen, setPeriodOpen] = useState(false);
  const data = useMemo(() => {
    const u = getAuthUser();
    const name = u?.institutionName || u?.name || 'Modi Institute of Technology';
    return getPlacementDashboardData(name);
  }, []);
  const { kpis } = data;
  const total = Math.max(kpis.applications, 1);

  const kpiValues = [
    { value: kpis.applications, delta: kpis.applicationsDelta },
    { value: kpis.shortlisted, delta: kpis.shortlistedDelta },
    { value: kpis.interviews, delta: kpis.interviewsDelta },
    { value: kpis.hired, delta: kpis.hiredDelta },
  ];

  const funnelStages = [
    { label: 'Applications', value: kpis.applications, pct: 100, color: 'from-violet-500 to-violet-600', icon: FileText },
    {
      label: 'Shortlisted',
      value: kpis.shortlisted,
      pct: funnelPct(kpis.shortlisted, total),
      color: 'from-blue-500 to-blue-600',
      icon: Users,
    },
    {
      label: 'Interviews',
      value: kpis.interviews,
      pct: funnelPct(kpis.interviews, total),
      color: 'from-teal-500 to-teal-600',
      icon: Users,
    },
    {
      label: 'Hired',
      value: kpis.hired,
      pct: funnelPct(kpis.hired, total),
      color: 'from-amber-500 to-amber-600',
      icon: Briefcase,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-[var(--text-primary)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Welcome back,</p>
          <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-black tracking-tight md:text-3xl">
            {data.institutionName}
            <BadgeCheck className="h-6 w-6 text-sky-400" />
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--text-muted)]">
            Track placements, analyse performance and help your students build better careers.
          </p>
          {data.source === 'demo-seed' && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Showing demo cohort numbers · live counts appear when apply-tracker has enough student applications.
            </p>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPeriodOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]"
          >
            <Calendar className="h-4 w-4" />
            {data.periodLabel}
            <ChevronDown className="h-4 w-4" />
          </button>
          {periodOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-2 text-sm shadow-[var(--shadow-elevated)]">
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--accent-soft)]"
                onClick={() => setPeriodOpen(false)}
              >
                {data.periodLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiIcons.map((meta, i) => {
          const Icon = meta.icon;
          const row = kpiValues[i];
          return (
            <article
              key={meta.key}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">{meta.label}</p>
                  <p className="mt-1 text-3xl font-black tracking-tight">{row.value}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-500">
                    ↑ {row.delta}% <span className="font-medium text-[var(--text-muted)]">vs. last cycle</span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-3">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Placement Funnel</h2>
                <p className="text-xs text-[var(--text-muted)]">Overall conversion from application to hire</p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
            >
              All Companies <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-end justify-center gap-3 md:gap-4">
            {funnelStages.map((stage, idx) => {
              const Icon = stage.icon;
              const size = 88 - idx * 10;
              return (
                <div key={stage.label} className="flex items-center gap-2 md:gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-xs font-bold text-[var(--text-muted)]">{stage.pct}%</span>
                    <div
                      className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${stage.color} text-white shadow-lg`}
                      style={{ width: size, height: size }}
                    >
                      <span className="text-xl font-black">{stage.value}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
                      <Icon className="h-3.5 w-3.5" />
                      {stage.label}
                    </div>
                  </div>
                  {idx < funnelStages.length - 1 && (
                    <span className="mb-10 hidden text-[var(--text-muted)] sm:inline">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                <Network className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Top Skill Gaps (Cohort)</h2>
                <p className="text-xs text-[var(--text-muted)]">Based on industry demand & assessment data</p>
              </div>
            </div>
            <button type="button" className="text-xs font-semibold text-indigo-400 hover:underline">
              View Details →
            </button>
          </div>
          <ul className="space-y-3">
            {data.skillGaps.map((gap, i) => {
              const Icon = skillIcons[i % skillIcons.length];
              return (
                <li key={gap.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-xs font-bold text-[var(--text-muted)]">
                    {gap.rank}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{gap.name}</span>
                      <span className="text-xs font-bold text-[var(--text-muted)]">{gap.percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${gap.percent}%`, backgroundColor: gap.color }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Placement Trends</h2>
                <p className="text-xs text-[var(--text-muted)]">Hired students over the last 6 months</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" /> Applied
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400" /> Shortlisted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Hired
              </span>
            </div>
          </div>
          <SimpleTrendChart data={data.trends} />
        </section>

        <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)] xl:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Top Hiring Companies</h2>
                <p className="text-xs text-[var(--text-muted)]">Based on successful placements</p>
              </div>
            </div>
            <button type="button" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All →
            </button>
          </div>
          <ul className="space-y-3">
            {data.companies.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.logoSeed)}`}
                  alt=""
                  className="h-9 w-9 rounded-lg bg-white object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{c.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{c.hires} hires</p>
                  <span className="mt-0.5 inline-block rounded-md bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                    {c.tag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PlacementDashboard;
