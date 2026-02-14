import { Fragment } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">Get Started</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <p className="text-slate-600 mb-8">
            Join thousands of learners on their journey to landing their dream tech role.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleSignup}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
