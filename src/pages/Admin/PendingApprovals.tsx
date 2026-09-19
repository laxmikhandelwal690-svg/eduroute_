import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  User,
  FileText,
  IdCard,
} from 'lucide-react';
import {
  apiFetchVerificationDocument,
  apiGetPendingStudents,
  apiVerifyStudent,
} from '../../utils/authApi';
import {
  listLocalPendingVerifications,
  updateLocalVerificationStatus,
  getLocalVerificationDocument,
} from '../../utils/pendingVerificationStore';

type PendingStudent = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  college?: string;
  location?: string;
  fileName?: string;
  verificationId?: string;
  appliedAt?: string;
  source?: 'api' | 'local' | 'demo';
  documentDataUrl?: string;
  mimeType?: string;
};

const DEMO_CONSTANT: PendingStudent[] = [
  {
    id: 'demo-1',
    name: 'Aman Sharma',
    email: 'aman.sharma@gmail.com',
    phone: '+91 98765 43210',
    course: 'B.Tech Computer Science',
    college: 'Government Engineering College, Kota',
    location: 'Kota, Rajasthan',
    fileName: 'id_card_aman.jpg',
    verificationId: 'demo-1',
    appliedAt: '2025-09-16T10:24:00',
    source: 'demo',
  },
  {
    id: 'demo-2',
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    phone: '+91 99887 76655',
    course: 'B.Tech Information Technology',
    college: 'MSU Baroda',
    location: 'Vadodara, Gujarat',
    fileName: 'admission_letter.pdf',
    verificationId: 'demo-2',
    appliedAt: '2025-09-15T16:12:00',
    source: 'demo',
  },
];

const formatApplied = (iso?: string) => {
  if (!iso) return 'Recently';
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const PendingApprovals = () => {
  const [students, setStudents] = useState<PendingStudent[]>(DEMO_CONSTANT);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_CONSTANT[0]?.id || null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'id' | 'docs'>('profile');
  const [backendConnected, setBackendConnected] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    let apiRows: PendingStudent[] = [];
    let connected = false;
    try {
      const response = await apiGetPendingStudents();
      connected = true;
      apiRows = (response.data || []).map((row: any) => ({
        id: String(row.id),
        name: row.name || 'Student',
        email: row.email || '',
        phone: row.phone,
        course: row.course,
        college: row.college,
        location: row.location,
        fileName: row.fileName,
        verificationId: row.verificationId ? String(row.verificationId) : undefined,
        appliedAt: row.documentCreatedAt || row.createdAt,
        source: 'api' as const,
      }));
    } catch {
      connected = false;
    }
    setBackendConnected(connected);
    const localRows: PendingStudent[] = listLocalPendingVerifications().map((item) => ({
      ...item,
      source: 'local' as const,
    }));
    const apiEmails = new Set(apiRows.map((r) => r.email.toLowerCase()));
    const localOnly = localRows.filter((l) => !apiEmails.has(l.email.toLowerCase()));
    const merged = [...DEMO_CONSTANT, ...apiRows, ...localOnly];
    setStudents(merged);
    setSelectedId((prev) => (prev && merged.some((s) => s.id === prev) ? prev : merged[0]?.id || null));
    setMessage(
      connected
        ? apiRows.length
          ? `Loaded ${apiRows.length} real pending request(s) (+ 2 demo rows).`
          : 'Backend connected. No pending API requests — demo rows shown.'
        : 'Backend offline — demo rows and local uploads.',
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const selected = useMemo(
    () => students.find((s) => s.id === selectedId) || null,
    [students, selectedId],
  );

  useEffect(() => {
    let revoke: string | null = null;
    const loadDoc = async () => {
      setDocPreviewUrl(null);
      if (!selected?.verificationId) return;
      if (selected.source === 'local' || selected.source === 'demo' || selected.documentDataUrl) {
        const local = getLocalVerificationDocument(selected.verificationId);
        if (local?.documentDataUrl) {
          setDocPreviewUrl(local.documentDataUrl);
          return;
        }
        if (selected.documentDataUrl) {
          setDocPreviewUrl(selected.documentDataUrl);
          return;
        }
        return;
      }
      try {
        const blob = await apiFetchVerificationDocument(selected.verificationId);
        const url = URL.createObjectURL(blob);
        revoke = url;
        setDocPreviewUrl(url);
      } catch {
        /* no doc */
      }
    };
    loadDoc().catch(() => undefined);
    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [selected]);

  const handleDecision = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    if (selected.source === 'demo') {
      setMessage('Demo rows stay constant and cannot be removed.');
      return;
    }
    setActionLoading(true);
    try {
      if (selected.source === 'api') {
        await apiVerifyStudent(selected.id, action);
      } else {
        updateLocalVerificationStatus(selected.id, action === 'approve' ? 'verified' : 'rejected');
      }
      setMessage(`Student ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[var(--text-primary)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">Student Approval Requests</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review profile and ID, then approve or reject.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              backendConnected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {backendConnected ? 'Backend connected' : 'Backend offline'}
          </span>
          <button type="button" onClick={() => load()} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
            Refresh
          </button>
        </div>
      </div>

      {message && (
        <p className="text-sm rounded-xl px-3 py-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <section className="xl:col-span-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[var(--border-default)]">
            <h2 className="font-bold">Pending Approvals ({students.length})</h2>
          </div>
          <div className="divide-y divide-[var(--border-default)] max-h-[70vh] overflow-y-auto">
            {loading && <div className="p-8 text-center text-sm text-[var(--text-secondary)]">Loading…</div>}
            {students.map((student) => {
              const active = student.id === selectedId;
              return (
                <div
                  key={`${student.source}-${student.id}`}
                  className={`p-4 cursor-pointer ${active ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-l-indigo-500' : 'hover:bg-[var(--bg-elevated)]'}`}
                  onClick={() => {
                    setSelectedId(student.id);
                    setActiveTab('profile');
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-black shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold">{student.name}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                          {student.source === 'demo' ? 'Demo' : student.source === 'api' ? 'Live' : 'Local'}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{student.course || 'Course not set'}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">Applied {formatApplied(student.appliedAt)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="button" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--border-default)]" onClick={(e) => { e.stopPropagation(); setSelectedId(student.id); }}>
                      View
                    </button>
                    <button type="button" className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-white" onClick={(e) => { e.stopPropagation(); setSelectedId(student.id); void handleDecision('approve'); }}>
                      Approve
                    </button>
                    <button type="button" className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-200 text-rose-600 dark:border-rose-800 dark:text-rose-400" onClick={(e) => { e.stopPropagation(); setSelectedId(student.id); void handleDecision('reject'); }}>
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="xl:col-span-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm overflow-hidden min-h-[520px] flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-secondary)] p-8">Select a student</div>
          ) : (
            <>
              <div className="border-b border-[var(--border-default)] px-4 flex gap-1">
                {([
                  { id: 'profile' as const, label: 'Profile', icon: User },
                  { id: 'id' as const, label: 'ID Card', icon: IdCard },
                  { id: 'docs' as const, label: 'Documents', icon: FileText },
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 ${
                      activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-[var(--text-secondary)]'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 md:p-6 flex-1 space-y-4 overflow-y-auto">
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl font-black shrink-0">
                    {selected.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black">{selected.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Mail className="h-3.5 w-3.5" />{selected.email}</div>
                    {selected.phone && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Phone className="h-3.5 w-3.5" />{selected.phone}</div>}
                    {selected.location && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><MapPin className="h-3.5 w-3.5" />{selected.location}</div>}
                    {selected.course && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><GraduationCap className="h-3.5 w-3.5" />{selected.course}</div>}
                    {selected.college && <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Building2 className="h-3.5 w-3.5" />{selected.college}</div>}
                  </div>
                </div>

                {(activeTab === 'id' || activeTab === 'docs' || activeTab === 'profile') && (
                  <div className="rounded-2xl border border-dashed border-[var(--border-default)] min-h-[160px] flex items-center justify-center p-4 bg-[var(--bg-elevated)]">
                    {docPreviewUrl ? (
                      selected.mimeType?.includes('pdf') || selected.fileName?.endsWith('.pdf') ? (
                        <a href={docPreviewUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">
                          Open PDF
                        </a>
                      ) : (
                        <img src={docPreviewUrl} alt="ID" className="max-h-56 object-contain" />
                      )
                    ) : (
                      <span className="text-xs text-[var(--text-secondary)]">
                        {selected.fileName ? `Document: ${selected.fileName}` : 'No document attached'}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    disabled={actionLoading || selected.source === 'demo'}
                    onClick={() => handleDecision('approve')}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || selected.source === 'demo'}
                    onClick={() => handleDecision('reject')}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-800 px-5 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default PendingApprovals;
