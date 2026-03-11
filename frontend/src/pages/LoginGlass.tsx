import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon } from
'lucide-react';
import { GlassBackground } from '../components/GlassBackground';
import { useAuth } from '../contexts/AuthContext';
export function LoginGlass() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden flex items-center justify-center">
      <GlassBackground starCount={80} />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex items-center justify-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-semibold text-2xl tracking-wide">
            NUMEROBUDDY
          </span>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.1
          }}
          className="relative">

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl" />

          {/* Card */}
          <div className="relative p-8 md:p-10 rounded-3xl bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-white/60">
                Sign in to continue your cosmic journey
              </p>
            </div>

            {/* Error Message */}
            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">

                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            }

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white mb-2">

                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required
                    disabled={isLoading} />

                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white mb-2">

                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required
                    disabled={isLoading} />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    disabled={isLoading}>

                    {showPassword ?
                    <EyeOffIcon className="w-5 h-5" /> :

                    <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-cyan-500/30 bg-[#0a1628]/60 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                    disabled={isLoading} />

                  <span className="text-sm text-white/70">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  disabled={isLoading}>

                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">

                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-500/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1a2942] text-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="py-3 px-4 rounded-xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 text-white hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}>

                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor">

                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-semibold">Google</span>
              </button>

              <button
                className="py-3 px-4 rounded-xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 text-white hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}>

                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor">

                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-semibold">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-white/60">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  disabled={isLoading}>

                  Sign up
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: 0.3
          }}
          className="text-center mt-8">

          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors text-sm"
            disabled={isLoading}>

            ← Back to home
          </button>
        </motion.div>
      </div>
    </div>);

}