import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { getStoredUserProfile } from '../../utils/userProfile';
import { apiSendOtp, apiVerifyOtp } from '../../utils/authApi';

const RESEND_SECONDS = 60;

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupEmail = location.state?.email || getStoredUserProfile()?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldownSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!signupEmail) {
      navigate('/signup');
    }
  }, [navigate, signupEmail]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Enter the 6-digit code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiVerifyOtp({ email: signupEmail, otp: otpValue });
      setSuccess('Email verified successfully! Redirecting...');
      localStorage.setItem('eduroute:is-authenticated', 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Invalid OTP. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || !signupEmail) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsResending(true);

    try {
      const response = await apiSendOtp(signupEmail);
      setCooldownSeconds(response.cooldownSeconds || RESEND_SECONDS);
      setOtp(['', '', '', '', '', '']);
      setSuccess('A new OTP has been sent to your email address.');
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'Unable to resend OTP right now.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Check your email</h2>
        <p className="mt-2 text-slate-600">
          We sent a 6-digit code to <span className="font-bold text-emerald-700">{signupEmail || 'your email'}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white py-8 px-4 shadow-xl rounded-3xl sm:px-10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              ))}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 transition-all active:scale-95"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendOtp}
              disabled={cooldownSeconds > 0 || isResending}
              className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-emerald-700 disabled:text-slate-400 transition-colors"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {cooldownSeconds > 0 ? `Resend Code in ${cooldownSeconds}s` : isResending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
