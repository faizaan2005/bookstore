import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/bookstoreService';
import toast from 'react-hot-toast';

const InputField = ({ icon: Icon, label, type = 'text', ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 w-4 h-4" />
        <input type={isPassword && show ? 'text' : type} className="input-field pl-10 pr-10" {...props} />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.user.firstName}!`);
      navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full" />
        <BookOpen className="w-16 h-16 text-white mb-6" />
        <h2 className="text-4xl font-bold text-white text-center mb-4">Welcome Back!</h2>
        <p className="text-primary-100 text-center text-lg max-w-sm">Sign in to continue your reading journey with millions of books.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
          {['📗 50K+ Books', '⭐ 4.9 Rating', '🚀 Fast Delivery', '🔒 Secure'].map(item => (
            <div key={item} className="bg-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium">{item}</div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center lg:hidden">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Book<span className="text-primary-600">Verse</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign in</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your credentials to access your account</p>

          {/* Demo Accounts */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ label: '👤 Demo User', email: 'john@example.com', pass: 'user123' },
              { label: '⚙️ Demo Admin', email: 'admin@bookstore.com', pass: 'admin123' }].map(demo => (
              <button key={demo.label} type="button"
                onClick={() => setForm({ email: demo.email, password: demo.pass })}
                className="text-xs py-2.5 px-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-medium">
                {demo.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField icon={Mail} label="Email Address" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <InputField icon={Lock} label="Password" type="password" placeholder="Enter your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.data);
      toast.success(`Welcome to BookVerse, ${res.data.user.firstName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-700 via-primary-600 to-cyan-600 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative text-center">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-4xl font-bold text-white mb-4">Join BookVerse</h2>
          <p className="text-white/80 text-lg max-w-sm">Create your account and unlock access to thousands of amazing books.</p>
          <div className="mt-8 space-y-3">
            {['✅ Free shipping on orders over $50', '✅ Exclusive member discounts', '✅ Personalized recommendations', '✅ Order tracking & history'].map(item => (
              <div key={item} className="text-white/90 text-sm">{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white mb-8 block">
            Book<span className="text-primary-600">Verse</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Start your reading journey today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField icon={User} label="First Name" placeholder="John"
                value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
              <InputField icon={User} label="Last Name" placeholder="Doe"
                value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <InputField icon={Mail} label="Email Address" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <InputField icon={Phone} label="Phone (optional)" placeholder="+1 234 567 8900"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <InputField icon={Lock} label="Password" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset instructions sent!');
    } catch {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{sent ? 'Check Your Email' : 'Forgot Password?'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {sent ? `We sent reset instructions to ${email}` : "No worries! Enter your email and we'll send reset instructions."}
            </p>
          </div>
          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField icon={Mail} label="Email Address" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-primary-600 hover:underline">← Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
