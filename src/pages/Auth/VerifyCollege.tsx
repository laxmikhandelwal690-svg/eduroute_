import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuthSession, getAuthUser, getAuthToken } from '../../utils/rbacAuth';
import { getStoredUserProfile } from '../../utils/userProfile';
import { apiSubmitCollegeVerification } from '../../utils/authApi';
import { addLocalPendingVerification } from '../../utils/pendingVerificationStore';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Info, ChevronRight } from 'lucide-react';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });

export const VerifyCollege = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'pending'>('idle');
  const [error, setError] = useState('');
  const [storedForAdmin, setStoredForAdmin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const completeVerification = () => {
    const storedProfile = getStoredUserProfile();
    const existing = getAuthUser();
    const token = getAuthToken() || localStorage.getItem('eduroute:auth-token') || 'pending-verification-session';

    saveAuthSession(token, {
      id: existing?.id || (storedProfile?.email ? `pending-${storedProfile.email}` : `pending-${Date.now()}`),
      name: existing?.name || storedProfile?.name || 'Student',
      email: existing?.email || storedProfile?.email || 'student@eduroute.app',
      role: 'student',
      verificationStatus: 'pending',
    });

    navigate('/onboarding', { replace: true });
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setError('');
    setStatus('uploading');
    setStoredForAdmin(false);

    const storedProfile = getStoredUserProfile();
    const authUser = getAuthUser();
    const name = authUser?.name || storedProfile?.name || 'Student';
    const email = authUser?.email || storedProfile?.email || 'student@eduroute.app';

    let backendOk = false;
    if (getAuthToken()) {
      try {
        await apiSubmitCollegeVerification(file);
        backendOk = true;
      } catch (uploadError) {
        console.warn('Backend college verification failed, using local queue', uploadError);
      }
    }

    try {
      const documentDataUrl = await fileToDataUrl(file);
      addLocalPendingVerification({
        name,
        email,
        fileName: file.name,
        documentDataUrl,
        mimeType: file.type || 'image/jpeg',
        course: (storedProfile as any)?.course,
        college: (storedProfile as any)?.college,
        location: (storedProfile as any)?.location,
        phone: (storedProfile as any)?.phone,
      });
      setStoredForAdmin(true);
    } catch {
      addLocalPendingVerification({
        name,
        email,
        fileName: file.name,
        mimeType: file.type,
      });
      setStoredForAdmin(true);
    }

    if (!backendOk && !getAuthToken()) {
      setError('Saved for admin review locally. Log in as a student before upload to also store on the server.');
    }

    setStatus('pending');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">College ID Verification</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Upload your college ID card or admission letter to unlock premium student features.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-100 dark:border-slate-800"
        >
          {status === 'idle' && (
            <form className="space-y-6" onSubmit={handleUpload}>
              <button
                type="button"
                className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (event.dataTransfer.files[0]) setFile(event.dataTransfer.files[0]);
                }}
              >
                <Upload className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {file ? file.name : 'Drag and drop your ID card here, or click to browse'}
                </p>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />

              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Your ID is stored for admin review (Admin → Pending Approvals). Verification usually takes 24–48 hours.
                </p>
              </div>
              {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!file}
                  className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Submit for Verification
                </button>
                <button
                  type="button"
                  onClick={completeVerification}
                  className="flex-1 py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  Skip for Now
                </button>
              </div>
            </form>
          )}

          {status === 'uploading' && (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Uploading and storing your ID…</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="py-8 text-center">
              <div className="mx-auto h-20 w-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Application Received!</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 mb-2">
                Your verification is pending. Admins can review your ID under Pending Approvals.
              </p>
              {storedForAdmin && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-6">
                  ID card stored for admin review.
                </p>
              )}
              <button
                onClick={completeVerification}
                className="inline-flex items-center px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:bg-slate-800 transition-all group"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCollege;
