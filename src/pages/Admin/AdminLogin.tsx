import { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAdminSessionActive, setAdminSession, validateAdminPassword } from '../../utils/adminSession';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminSessionActive()) {
      navigate('/course-manager', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const isValidPassword = await validateAdminPassword(password);

    if (!isValidPassword) {
      setAdminSession(false);
      setError('Access Denied');
      setIsSubmitting(false);
      return;
    }

    setAdminSession(true);
    setIsSubmitting(false);
    navigate('/course-manager', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center mb-5">
          <LockKeyhole className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-black text-center">Admin Access</h1>
        <p className="text-slate-400 text-sm text-center mt-2 mb-8">Enter password to open Course Manager.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          {error && <p className="rounded-lg bg-rose-950/70 border border-rose-700 px-3 py-2 text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-3 font-semibold disabled:opacity-60"
          >
            {isSubmitting ? 'Checking...' : 'Unlock Course Manager'}
          </button>
        </form>
      </div>
    </div>
  );
};
