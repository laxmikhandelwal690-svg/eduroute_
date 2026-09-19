import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Plus, Trash2, Sparkles, Check, LayoutTemplate, User, GraduationCap, Briefcase, FolderKanban, Wrench, Palette, Wand2 } from 'lucide-react';
import { getAuthUser } from '../../utils/rbacAuth';
import { getStoredUserProfile } from '../../utils/userProfile';
import { readOnboarding } from '../../utils/onboardingStore';
import { ACCENT_COLORS, CV_TEMPLATES, SAMPLE_SUMMARIES, SUGGESTED_SKILLS, defaultCvData, emptyEducation, emptyExperience, emptyProject, readCvData, saveCvData, type CvAccentId, type CvData, type CvTemplateId } from '../../utils/cvStore';

type Phase = 'templates' | 'editor';
type SectionId = 'contact' | 'summary' | 'skills' | 'education' | 'experience' | 'projects' | 'design';
const SECTIONS: { id: SectionId; label: string; icon: typeof User }[] = [
  { id: 'contact', label: 'Contact', icon: User }, { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Wrench }, { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase }, { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'design', label: 'Design', icon: Palette },
];
function parseSkills(raw: string) { return raw.split(/[,;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 28); }
function esc(s: string) {
  return String(s || '')
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;')
    .replace(/"/g, '&' + 'quot;');
}
function accentHex(id: CvAccentId) { return ACCENT_COLORS[id]?.hex || '#4f46e5'; }
function openPrintPreview(data: CvData) {
  const a = accentHex(data.accent); const skills = data.skills.join(' · ');
  const edu = data.education.filter(e=>e.school||e.degree).map(e=>`<div class="item"><strong>${esc(e.degree||'Degree')}</strong> — ${esc(e.school)} <span class="muted">${esc(e.year)}</span></div>`).join('');
  const exp = data.experience.filter(e=>e.role||e.company).map(e=>`<div class="item"><strong>${esc(e.role)}</strong> @ ${esc(e.company)} <span class="muted">${esc(e.duration)}</span><div>${esc(e.description)}</div></div>`).join('');
  const proj = data.projects.filter(p=>p.name).map(p=>`<div class="item"><strong>${esc(p.name)}</strong> <span class="muted">${esc(p.tech)}</span><div>${esc(p.description)}</div></div>`).join('');
  const isPro = data.template==='professional';
  const body = isPro
    ? `<div class="layout"><div class="side"><h1>${esc(data.fullName||'Your Name')}</h1><div class="title">${esc(data.title)}</div><div class="meta">${esc(data.email)}<br/>${esc(data.phone)}<br/>${esc(data.city)}</div><h2>Skills</h2><div>${esc(skills)||'—'}</div></div><div>${data.summary?`<div class="summary">${esc(data.summary)}</div>`:''}<h2>Experience</h2>${exp||'—'}<h2>Education</h2>${edu||'—'}<h2>Projects</h2>${proj||'—'}</div></div>`
    : `${data.template==='modern'?`<div style="height:6px;background:${a};margin:-32px -32px 20px"></div>`:''}<h1>${esc(data.fullName||'Your Name')}</h1><div class="title">${esc(data.title)}</div><div class="meta">${[data.email,data.phone,data.city].filter(Boolean).map(esc).join(' · ')}</div>${data.summary?`<div class="summary">${esc(data.summary)}</div>`:''}<h2>Skills</h2><div>${esc(skills)||'—'}</div><h2>Experience</h2>${exp||'—'}<h2>Education</h2>${edu||'—'}<h2>Projects</h2>${proj||'—'}`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${esc(data.fullName||'CV')}</title><style>@page{margin:12mm}body{font-family:${data.template==='classic'?'Georgia,serif':'system-ui'};color:#0f172a;padding:32px;max-width:800px;margin:0 auto;font-size:13px}h1{margin:0;font-size:28px;color:${a}}h2{font-size:11px;text-transform:uppercase;border-bottom:2px solid ${a};color:${a};margin:16px 0 8px}.title{font-size:14px;color:#475569}.meta{font-size:12px;color:#64748b}.layout{display:grid;grid-template-columns:1fr 2fr;gap:20px}.side{background:#f1f5f9;padding:16px;border-radius:8px}@media print{body{padding:0}}</style></head><body>${body}<script>window.onload=()=>window.print()</script></body></html>`;
  const w = window.open('','_blank'); if(!w){alert('Allow pop-ups for PDF');return;} w.document.write(html); w.document.close();
}
const inputCls = 'mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const inputSm = 'rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white';

export const CvBuilder = () => {
  const user = getAuthUser();
  const [phase, setPhase] = useState<Phase>('templates');
  const [section, setSection] = useState<SectionId>('contact');
  const [data, setData] = useState<CvData>(() => readCvData());
  const [skillsText, setSkillsText] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  useEffect(() => {
    const stored = readCvData(); const auth = getAuthUser(); const profile = getStoredUserProfile(); const onboarding = readOnboarding();
    const seeded = defaultCvData({ ...stored, fullName: stored.fullName || auth?.name || profile?.name || '', email: stored.email || auth?.email || profile?.email || '',
      skills: stored.skills?.length > 0 ? stored.skills : (onboarding.gapAnswers || []).filter(g => g.answer === 'yes').map(g => g.skill).slice(0, 12) });
    setData(seeded); setSkillsText(seeded.skills.join(', '));
    if (stored.fullName || stored.summary || stored.skills?.length) setPhase('editor');
  }, []);
  const persist = useCallback((next: CvData) => { setData(next); saveCvData(next); setSavedFlash(true); window.setTimeout(() => setSavedFlash(false), 1400); }, []);
  const update = (patch: Partial<CvData>) => persist({ ...data, ...patch });
  const applySkills = () => update({ skills: parseSkills(skillsText) });
  const handleDownloadPdf = () => { const latest = { ...data, skills: parseSkills(skillsText) }; saveCvData(latest); setData(latest); openPrintPreview(latest); };
  const completion = useMemo(() => {
    let n = 0; if (data.fullName) n++; if (data.email) n++; if (data.summary) n++; if (data.skills.length) n++;
    if (data.education.some(e => e.school || e.degree)) n++; if (data.experience.some(e => e.role)) n++; return Math.round((n / 6) * 100);
  }, [data]);

  if (phase === 'templates') {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Free · No watermark · Unlimited PDF</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Choose a template</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400">Pick a design, fill sections, download PDF. Like FlowCV — free forever for students.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CV_TEMPLATES.map(t => (
            <button key={t.id} type="button" onClick={() => { update({ template: t.id }); setPhase('editor'); setSection('contact'); }}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className={`h-28 rounded-xl border-2 p-3 ${data.template===t.id?'border-indigo-500 ring-2 ring-indigo-500/30':'border-slate-200 dark:border-slate-700'}`}
                style={t.id==='modern'?{borderTop:`4px solid ${accentHex(data.accent)}`}:undefined}>
                <div className="h-2.5 w-2/3 rounded" style={{ background: accentHex(data.accent) }} />
                <div className="mt-2 h-1.5 w-1/2 rounded bg-slate-300 dark:bg-slate-600" />
                <div className="mt-3 space-y-1"><div className="h-1 w-full rounded bg-slate-100 dark:bg-slate-800" /><div className="h-1 w-4/5 rounded bg-slate-100 dark:bg-slate-800" /></div>
              </div>
              <p className="mt-3 font-black text-slate-900 dark:text-white">{t.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{t.blurb}</p>
              <div className="mt-2 flex flex-wrap gap-1">{t.tags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>)}</div>
              <span className="mt-3 inline-flex w-full justify-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">Use this template</span>
            </button>
          ))}
        </div>
        {data.fullName && <div className="mt-8 text-center"><button type="button" onClick={() => setPhase('editor')} className="text-sm font-bold text-indigo-600 hover:underline">Continue editing →</button></div>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setPhase('templates')} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400"><ArrowLeft className="h-4 w-4" /> Templates</button>
        <div className="flex items-center gap-2">
          {savedFlash && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><Check className="h-3.5 w-3.5" /> Saved</span>}
          <button type="button" onClick={handleDownloadPdf} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"><Download className="h-4 w-4" /> Download PDF</button>
        </div>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${completion}%` }} /></div>
      <div className="grid gap-6 lg:grid-cols-12">
        <nav className="lg:col-span-2"><ul className="flex flex-wrap gap-1.5 lg:flex-col">{SECTIONS.map(s => { const Icon = s.icon; return (
          <li key={s.id}><button type="button" onClick={() => setSection(s.id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-bold ${section===s.id?'bg-indigo-600 text-white':'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}><Icon className="h-3.5 w-3.5" />{s.label}</button></li>
        ); })}</ul></nav>
        <div className="space-y-4 lg:col-span-5">
          {section==='contact' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h2 className="text-lg font-black text-slate-900 dark:text-white">Contact & role</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">{([['fullName','Full name'],['title','Target role'],['email','Email'],['phone','Phone'],['city','City']] as const).map(([k,l]) => (
              <div key={k} className={k==='title'?'sm:col-span-2':''}><label className="text-xs font-bold text-slate-500">{l}</label><input value={data[k]} onChange={e=>update({[k]:e.target.value})} className={inputCls} /></div>
            ))}</div></section>}
          {section==='summary' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Summary</h2>
              <button type="button" onClick={()=>update({summary:SAMPLE_SUMMARIES[Math.floor(Math.random()*SAMPLE_SUMMARIES.length)]})} className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"><Wand2 className="h-3.5 w-3.5" /> Sample</button></div>
            <textarea rows={5} value={data.summary} onChange={e=>update({summary:e.target.value})} className={`${inputCls} mt-3`} placeholder="2-4 lines..." /></section>}
          {section==='skills' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h2 className="text-lg font-black text-slate-900 dark:text-white">Skills</h2>
            <textarea rows={3} value={skillsText} onChange={e=>setSkillsText(e.target.value)} onBlur={applySkills} className={`${inputCls} mt-3`} placeholder="React, TypeScript..." />
            <div className="mt-3 flex flex-wrap gap-2">{parseSkills(skillsText).map(s=><span key={s} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">{s}</span>)}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">{SUGGESTED_SKILLS.filter(s=>!parseSkills(skillsText).includes(s)).slice(0,8).map(s=>(
              <button key={s} type="button" onClick={()=>{const set=new Set(parseSkills(skillsText));set.add(s);const n=[...set].join(', ');setSkillsText(n);update({skills:[...set]});}} className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:border-indigo-400 dark:border-slate-600">+ {s}</button>
            ))}</div></section>}
          {section==='education' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Education</h2>
              <button type="button" onClick={()=>update({education:[...data.education,emptyEducation()]})} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
            <div className="mt-4 space-y-3">{data.education.map((row,idx)=>(
              <div key={row.id} className="grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-2 dark:border-slate-800">
                <input placeholder="School" value={row.school} onChange={e=>{const education=[...data.education];education[idx]={...row,school:e.target.value};update({education});}} className={inputSm} />
                <input placeholder="Degree" value={row.degree} onChange={e=>{const education=[...data.education];education[idx]={...row,degree:e.target.value};update({education});}} className={inputSm} />
                <input placeholder="Year" value={row.year} onChange={e=>{const education=[...data.education];education[idx]={...row,year:e.target.value};update({education});}} className={inputSm} />
                <input placeholder="Details" value={row.details} onChange={e=>{const education=[...data.education];education[idx]={...row,details:e.target.value};update({education});}} className={inputSm} />
                {data.education.length>1&&<button type="button" onClick={()=>update({education:data.education.filter(e=>e.id!==row.id)})} className="text-xs font-bold text-rose-600 sm:col-span-2"><Trash2 className="inline h-3 w-3" /> Remove</button>}
              </div>
            ))}</div></section>}
          {section==='experience' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Experience</h2>
              <button type="button" onClick={()=>update({experience:[...data.experience,emptyExperience()]})} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
            <div className="mt-4 space-y-3">{data.experience.map((row,idx)=>(
              <div key={row.id} className="grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-2 dark:border-slate-800">
                <input placeholder="Role" value={row.role} onChange={e=>{const experience=[...data.experience];experience[idx]={...row,role:e.target.value};update({experience});}} className={inputSm} />
                <input placeholder="Company" value={row.company} onChange={e=>{const experience=[...data.experience];experience[idx]={...row,company:e.target.value};update({experience});}} className={inputSm} />
                <input placeholder="Duration" value={row.duration} onChange={e=>{const experience=[...data.experience];experience[idx]={...row,duration:e.target.value};update({experience});}} className={`sm:col-span-2 ${inputSm}`} />
                <textarea placeholder="Impact" rows={2} value={row.description} onChange={e=>{const experience=[...data.experience];experience[idx]={...row,description:e.target.value};update({experience});}} className={`sm:col-span-2 ${inputSm}`} />
                {data.experience.length>1&&<button type="button" onClick={()=>update({experience:data.experience.filter(e=>e.id!==row.id)})} className="text-xs font-bold text-rose-600 sm:col-span-2"><Trash2 className="inline h-3 w-3" /> Remove</button>}
              </div>
            ))}</div></section>}
          {section==='projects' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex justify-between"><h2 className="text-lg font-black text-slate-900 dark:text-white">Projects</h2>
              <button type="button" onClick={()=>update({projects:[...data.projects,emptyProject()]})} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"><Plus className="h-3.5 w-3.5" /> Add</button></div>
            <div className="mt-4 space-y-3">{data.projects.map((row,idx)=>(
              <div key={row.id} className="grid gap-2 rounded-xl border border-slate-100 p-3 sm:grid-cols-2 dark:border-slate-800">
                <input placeholder="Name" value={row.name} onChange={e=>{const projects=[...data.projects];projects[idx]={...row,name:e.target.value};update({projects});}} className={inputSm} />
                <input placeholder="Tech" value={row.tech} onChange={e=>{const projects=[...data.projects];projects[idx]={...row,tech:e.target.value};update({projects});}} className={inputSm} />
                <textarea placeholder="Description" rows={2} value={row.description} onChange={e=>{const projects=[...data.projects];projects[idx]={...row,description:e.target.value};update({projects});}} className={`sm:col-span-2 ${inputSm}`} />
                <input placeholder="Link" value={row.link} onChange={e=>{const projects=[...data.projects];projects[idx]={...row,link:e.target.value};update({projects});}} className={`sm:col-span-2 ${inputSm}`} />
                {data.projects.length>1&&<button type="button" onClick={()=>update({projects:data.projects.filter(p=>p.id!==row.id)})} className="text-xs font-bold text-rose-600 sm:col-span-2"><Trash2 className="inline h-3 w-3" /> Remove</button>}
              </div>
            ))}</div></section>}
          {section==='design' && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Design</h2>
            <p className="mt-4 text-xs font-bold uppercase text-slate-400">Template</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">{CV_TEMPLATES.map(t=>(
              <button key={t.id} type="button" onClick={()=>update({template:t.id})} className={`rounded-xl border p-3 text-left ${data.template===t.id?'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40':'border-slate-200 dark:border-slate-700'}`}>
                <p className="text-sm font-black text-slate-900 dark:text-white">{t.name}</p><p className="text-[11px] text-slate-500">{t.blurb}</p>
              </button>
            ))}</div>
            <p className="mt-5 text-xs font-bold uppercase text-slate-400">Accent</p>
            <div className="mt-2 flex flex-wrap gap-2">{(Object.keys(ACCENT_COLORS) as CvAccentId[]).map(id=>(
              <button key={id} type="button" onClick={()=>update({accent:id})} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${data.accent===id?'border-slate-900 dark:border-white':'border-slate-200 dark:border-slate-700'}`}>
                <span className="h-3.5 w-3.5 rounded-full" style={{background:ACCENT_COLORS[id].hex}} />{ACCENT_COLORS[id].label}
              </button>
            ))}</div>
            <button type="button" onClick={handleDownloadPdf} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-700"><Download className="h-4 w-4" /> Download PDF</button>
          </section>}
          <div className="flex justify-between">
            <button type="button" disabled={SECTIONS.findIndex(s=>s.id===section)<=0} onClick={()=>{const i=SECTIONS.findIndex(s=>s.id===section);if(i>0)setSection(SECTIONS[i-1].id);}} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-30">Previous</button>
            <button type="button" disabled={SECTIONS.findIndex(s=>s.id===section)>=SECTIONS.length-1} onClick={()=>{if(section==='skills')applySkills();const i=SECTIONS.findIndex(s=>s.id===section);if(i<SECTIONS.length-1)setSection(SECTIONS[i+1].id);}} className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white disabled:opacity-30 dark:bg-indigo-600">Next</button>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-20">
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"><Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Live preview · {data.template}</span>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-950">
              <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div></div>
              <div className="max-h-[min(70vh,560px)] overflow-y-auto p-5 text-slate-900 dark:text-slate-100">
                {data.template==='modern'&&<div className="-mx-5 -mt-5 mb-4 h-1.5" style={{background:accentHex(data.accent)}} />}
                <h3 className="text-xl font-black" style={{color:accentHex(data.accent)}}>{data.fullName||'Your Name'}</h3>
                <p className="text-xs font-semibold text-slate-500">{data.title||'Target role'}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">{[data.email,data.phone,data.city].filter(Boolean).join(' · ')||'email · phone · city'}</p>
                {data.summary&&<p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{data.summary}</p>}
                {(parseSkills(skillsText).length?parseSkills(skillsText):data.skills).length>0&&(
                  <div className="mt-3"><p className="text-[9px] font-bold uppercase" style={{color:accentHex(data.accent)}}>Skills</p>
                    <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-300">{(parseSkills(skillsText).length?parseSkills(skillsText):data.skills).join(' · ')}</p></div>
                )}
                {data.experience.some(e=>e.role)&&(
                  <div className="mt-3"><p className="border-b pb-0.5 text-[9px] font-bold uppercase" style={{color:accentHex(data.accent),borderColor:accentHex(data.accent)}}>Experience</p>
                    {data.experience.filter(e=>e.role).map(e=><div key={e.id} className="mt-1.5 text-[10px]"><span className="font-bold">{e.role}</span>{e.company?` @ ${e.company}`:''}</div>)}</div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default CvBuilder;
