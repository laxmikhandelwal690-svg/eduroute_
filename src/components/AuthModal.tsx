import { Fragment } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
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
      <motion.div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="premium-border rounded-[32px] bg-[rgba(8,15,35,0.9)] p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Get Started</h2>
            <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-8 text-slate-300">Join thousands of learners on their journey to landing their dream tech role.</p>

          <div className="space-y-3">
            <button onClick={handleSignup} className="glow-button w-full rounded-2xl py-4 font-bold text-white">Create Account</button>
            <button onClick={() => { onClose(); navigate('/login'); }} className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 font-bold text-white hover:bg-white/10">Sign In</button>
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
};
