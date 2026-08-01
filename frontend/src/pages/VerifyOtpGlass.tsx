import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { GlassBackground } from '../components/GlassBackground';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api-client';

export function VerifyOtpGlass() {
  const { verifyOTP } = useAuth();
  const location = useLocation();
  const initialEmail = new URLSearchParams(location.search).get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Enter the six-digit code sent to your email.');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
    } catch (err: any) {
      setError(err?.message || 'Unable to verify your account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Enter your email address first.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await authAPI.resendOTP({ email });
      setMessage('A new verification code has been sent.');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to resend the verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden flex items-center justify-center px-4">
      <GlassBackground starCount={80} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-semibold text-2xl tracking-wide">NUMEROBUDDY</span>
        </div>
        <div className="p-8 md:p-10 rounded-3xl bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-2">Verify Your Account</h1>
            <p className="text-white/60 text-sm">{message}</p>
          </div>
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-sm text-red-400">{error}</p></div>}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="verificationEmail" className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <div className="relative">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input id="verificationEmail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} className="w-full pl-12 pr-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400" />
              </div>
            </div>
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-white mb-2">Verification Code</label>
              <input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" required maxLength={6} disabled={isLoading} className="w-full px-4 py-3 bg-[#0a1628]/60 border border-cyan-500/20 rounded-xl text-white text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-white/40 focus:outline-none focus:border-cyan-400" />
            </div>
            <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>
          <button type="button" onClick={handleResend} disabled={isLoading} className="w-full mt-5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
            Resend verification code
          </button>
        </div>
      </motion.div>
    </div>
  );
}
