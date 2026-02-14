import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem('eduroute:is-authenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">E</div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">EDUROUTE</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          New here?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            create an account
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

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95"
            >
              Sign in <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
