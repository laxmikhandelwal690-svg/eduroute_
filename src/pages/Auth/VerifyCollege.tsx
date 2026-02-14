import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, Info, ChevronRight } from 'lucide-react';

export const VerifyCollege = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'pending'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const completeVerification = () => {
    localStorage.setItem('eduroute:is-authenticated', 'true');
    navigate('/dashboard');
  };

  const handleUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setStatus('uploading');
    setTimeout(() => setStatus('pending'), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">College ID Verification</h2>
        <p className="mt-2 text-slate-600">
          Upload your college ID card or admission letter to unlock premium student features.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100"
        >
          {status === 'idle' && (
            <form className="space-y-6" onSubmit={handleUpload}>
              <button
                type="button"
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (event.dataTransfer.files[0]) setFile(event.dataTransfer.files[0]);
                }}
              >
                <Upload className="mx-auto h-12 w-12 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                <p className="mt-4 text-sm font-medium text-slate-600">
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

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Verification usually takes 24-48 hours. You can still use the platform while we verify your ID.
                </p>
              </div>

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
                  className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Skip for Now
                </button>
              </div>
            </form>
          )}

          {status === 'uploading' && (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Uploading your documents...</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="py-8 text-center">
              <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Application Received!</h3>
              <p className="mt-2 text-slate-600 mb-8">
                Your verification is now pending. We'll notify you via email once it's complete.
              </p>
              <button
                onClick={completeVerification}
                className="inline-flex items-center px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all group"
              >
                Go to Dashboard <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
