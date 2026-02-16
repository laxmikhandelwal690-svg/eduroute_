import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { parseGoogleCredential, saveUserProfile } from '../../utils/userProfile';
import { apiRegisterUser, apiSendOtp } from '../../utils/authApi';

const GOOGLE_CLIENT_SCRIPT_ID = 'google-identity-services';

const loadGoogleScript = () => {
  if (document.getElementById(GOOGLE_CLIENT_SCRIPT_ID)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_CLIENT_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Google Identity Services script.'));
    document.head.appendChild(script);
  });
};

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = useMemo(
    () => import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '234757313390-8ihis6sl6h1635ievvaitfcjjndqv1je.apps.googleusercontent.com',
    []
  );

  useEffect(() => {
    if (!googleClientId) {
      setGoogleError('Google sign up is not configured yet. Add VITE_GOOGLE_CLIENT_ID to your .env file.');
      return;
    }

    let isMounted = true;

    const setupGoogleButton = async () => {
      try {
        await loadGoogleScript();

        if (!isMounted || !window.google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: ({ credential }) => {
            if (!credential) {
              setGoogleError('Google sign up was canceled. Please try again.');
              return;
            }

            const googleProfile = parseGoogleCredential(credential);
            if (googleProfile) {
              saveUserProfile(googleProfile);
            }

            localStorage.setItem('eduroute:is-authenticated', 'true');
            navigate('/dashboard');
          },
        });

        googleButtonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          size: 'large',
          shape: 'pill',
          text: 'signup_with',
          width: 320,
          theme: 'outline',
          logo_alignment: 'left',
        });
      } catch {
        if (isMounted) {
          setGoogleError('Unable to load Google sign up right now. Please use email sign up.');
        }
      }
    };

    setupGoogleButton();

    return () => {
      isMounted = false;
    };
  }, [googleClientId, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const registerResponse = await apiRegisterUser(payload);
      localStorage.setItem('eduroute:auth-token', registerResponse.token);

      saveUserProfile({ name: payload.name, email: payload.email });

      await apiSendOtp(payload.email);

      navigate('/verify-otp', { state: { email: payload.email } });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">E</div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">EDUROUTE</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
              <ShieldCheck className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-700">
                Verify your email with a one-time password for account security.
              </p>
            </div>

            {apiError ? <p className="text-sm text-red-600">{apiError}</p> : null}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95"
              >
                {isSubmitting ? 'Creating account...' : 'Sign up'} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div ref={googleButtonRef} aria-label="Google sign up" />
            </div>
            {googleError ? <p className="mt-3 text-center text-xs text-amber-600">{googleError}</p> : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
