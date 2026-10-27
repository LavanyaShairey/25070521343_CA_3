import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  BadgeCheck,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'Apex Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Junior)',
    studentId: '',
    role: 'student',
    clubAffiliation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fillDemoStudent = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: `Rohan Verma ${randomNum}`,
      email: `rohan.student${randomNum}@campus.edu`,
      password: 'password123',
      confirmPassword: 'password123',
      college: 'Apex Institute of Technology',
      department: 'Computer Science & Engineering',
      year: '3rd Year (Junior)',
      studentId: `AIT-CS-2023-${randomNum}`,
      role: 'student',
      clubAffiliation: 'ACM Student Chapter',
    });
    showToast('Demo Student details populated!', 'info');
  };

  const fillDemoOrganizer = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: `Dr. Neha Sen ${randomNum}`,
      email: `neha.organizer${randomNum}@campus.edu`,
      password: 'password123',
      confirmPassword: 'password123',
      college: 'Apex Institute of Technology',
      department: 'Information Technology',
      year: 'Faculty / Alumni',
      studentId: `FAC-IT-${randomNum}`,
      role: 'organizer',
      clubAffiliation: 'Google Developer Student Club (GDSC)',
    });
    showToast('Demo Club Organizer details populated!', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register(formData);

      if (res.success) {
        showToast('🎉 Account created & stored in MongoDB successfully!', 'success');
        navigate('/events');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please verify MongoDB is running.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col justify-center items-center relative overflow-hidden bg-dark-900">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 bg-dark-850/90 shadow-2xl p-6 sm:p-10 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>MongoDB Connected Storage</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your <span className="text-amber-400">EventHive</span> Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Join the premier college event hub. Register for hackathons, claim digital passes, or organize your own campus events.
          </p>
        </div>

        {/* Demo Autofill Buttons */}
        <div className="mt-6 p-3 rounded-2xl bg-dark-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Fast 1-Click Demo Fill:
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/30 transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={fillDemoOrganizer}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-indigo-300 hover:text-indigo-200 text-xs font-semibold border border-indigo-500/30 transition-colors"
            >
              Demo Organizer
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              College or Personal Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="student@college.edu or name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                College / Institution
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Student ID / Roll No.
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="studentId"
                  placeholder="e.g. 25CS1048"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Department / Major
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Computer Science & Engineering">Computer Science & Engg</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Comm</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Management & Business">Management & Business</option>
                <option value="Design & Media Arts">Design & Media Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                <option value="4th Year (Senior)">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Faculty / Alumni">Faculty / Alumni</option>
              </select>
            </div>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'student' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.role === 'student'
                    ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                    : 'bg-dark-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Student Attendee</p>
                <p className="text-[10px] text-slate-400 mt-0.5">RSVP for events & tickets</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'organizer' }))}
                className={`p-3 rounded-xl border text-left transition-all ${
                  formData.role === 'organizer'
                    ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300'
                    : 'bg-dark-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-white">Club Organizer</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Host and publish campus events</p>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-glow-hive flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Save to MongoDB</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer switch to Login */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
