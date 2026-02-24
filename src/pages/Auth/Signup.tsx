import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, Sparkles, User } from 'lucide-react';
import { apiRegisterUser } from '../../utils/authApi';
import { saveAuthSession } from '../../utils/rbacAuth';
import { parseGoogleCredential, saveUserProfile } from '../../utils/userProfile';

const GOOGLE_CLIENT_SCRIPT_ID = 'google-identity-services';
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof SignupForm, string>>;

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

const validateForm = (formData: SignupForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
};

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupForm>({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
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
            if (!googleProfile) {
              setGoogleError('Unable to read your Google profile. Please use email sign up.');
              return;
            }

            saveUserProfile(googleProfile);
            saveAuthSession(credential, {
              id: `google-${googleProfile.email}`,
              name: googleProfile.name,
              email: googleProfile.email,
              role: 'student',
              verificationStatus: 'verified',
            });

            console.log('[Signup] Google sign-up success, redirecting to /dashboard');
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
          theme: 'filled_black',
          logo_alignment: 'left',
        });
      } catch (error) {
        console.error('[Signup] Google button setup failed:', error);
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

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.warn('[Signup] Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      console.log('[Signup] Register request started for:', payload.email);
      const registerResponse = await apiRegisterUser(payload);

      localStorage.setItem('eduroute:auth-token', registerResponse.token);
      saveUserProfile({ name: payload.name, email: payload.email });

      console.log('[Signup] Registration successful, redirecting to /verify-college');
      navigate('/verify-college');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      console.error('[Signup] Registration failed:', errorMessage);

      const isNotFoundError =
        errorMessage.includes('NOT_FOUND') ||
        errorMessage.includes('Page could not be found') ||
        errorMessage.includes('Unexpected response (404)');

      if (isNotFoundError) {
        console.warn('[Signup] API endpoint unavailable in this environment. Continuing to /verify-college.');
        saveUserProfile({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        });
        navigate('/verify-college');
        return;
      }

      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 font-['Inter',sans-serif] sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),transparent_38%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.26),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-[2rem] border border-white/20 bg-white/10 p-7 shadow-[0_20px_70px_rgba(8,47,73,0.45)] backdrop-blur-xl sm:p-9"
        >
          <Link to="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-black text-slate-900 shadow-[0_0_28px_rgba(56,189,248,0.45)]">E</div>
            <span className="text-xl font-semibold tracking-[0.2em] text-white">EDUROUTE</span>
          </Link>

          <p className="text-center text-sm text-cyan-200">Create Account Today</p>
          <h1 className="mt-2 text-center text-3xl font-semibold text-white">Start your learning journey</h1>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-300">Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleInputChange('name', event.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-white/15 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>
              {formErrors.name ? <p className="mt-1 text-xs text-rose-300">{formErrors.name}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-300">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleInputChange('email', event.target.value)}
                  placeholder="Enter email"
                  className="w-full rounded-2xl border border-white/15 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>
              {formErrors.email ? <p className="mt-1 text-xs text-rose-300">{formErrors.email}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => handleInputChange('password', event.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-white/15 bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>
              {formErrors.password ? <p className="mt-1 text-xs text-rose-300">{formErrors.password}</p> : null}
            </div>

            {apiError ? <p className="rounded-xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{apiError}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_8px_30px_rgba(56,189,248,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_10px_34px_rgba(139,92,246,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-white/20" />
            or continue with
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <div ref={googleButtonRef} aria-label="Google sign up" className="flex justify-center" />
          {googleError ? <p className="mt-3 text-center text-xs text-amber-200">{googleError}</p> : null}

          <div className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
              Sign in
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4" />
            Secure OTP verification after signup
          </div>
        </motion.div>
      </div>
    </div>
  );
};
