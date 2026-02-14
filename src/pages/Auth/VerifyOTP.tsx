import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { resendOtp, verifyOtp } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const email = useMemo(() => sessionStorage.getItem('pendingVerificationEmail') || '', []);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const timer = setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(email, code);
      setUser(response.user);
      sessionStorage.removeItem('pendingVerificationEmail');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setError('');
    setInfo('');
    try {
      await resendOtp(email);
      setInfo('OTP has been resent successfully.');
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend OTP.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Check your email</h2>
        <p className="mt-2 text-slate-600">We sent a 6-digit code to <span className="font-bold text-emerald-700">{email}</span></p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl" />
              ))}
            </div>

            {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
            {info && <p className="text-sm text-emerald-700 font-semibold">{info}</p>}

            <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300">
              {loading ? 'Verifying...' : <>Verify & Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={handleResend} disabled={cooldown > 0} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-emerald-700 disabled:text-slate-300">
              <RefreshCcw className="mr-2 h-4 w-4" /> {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
