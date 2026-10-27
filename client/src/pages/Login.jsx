import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if redirected because session expired
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired')) {
      showToast('Your session has expired. Please log in again.', 'info');
    }
  }, [location]);

  const handle1ClickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      setIsSubmitting(true);
      const res = await login(demoEmail, demoPassword);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/events');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email.trim(), password);

      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/events');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Invalid credentials. Please verify your email and password.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-dark-900">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-800 bg-dark-850/90 shadow-2xl p-6 sm:p-10 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MongoDB Community Server Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign In to <span className="text-amber-400">EventHive</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Access your campus passes, tickets, and college events.
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="mt-6 p-3.5 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Instant 1-Click Test Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handle1ClickLogin('alex.student@college.edu', 'password123')}
              className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/30 transition-all text-center"
            >
              Alex (Student)
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handle1ClickLogin('priya.organizer@campus.edu', 'password123')}
              className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-indigo-300 hover:text-indigo-200 text-xs font-bold border border-indigo-500/30 transition-all text-center"
            >
              Priya (Organizer)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              College Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="alex.student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-glow-hive flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Sign In to EventHive</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer switch to Register */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
