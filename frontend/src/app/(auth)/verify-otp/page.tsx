'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import OTPForm from './otp-form';

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  
  return <OTPForm email={email} phone={phone} />;
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Verify Your Account
          </h1>
        </div>
        
        <Suspense 
          fallback={
            <GlassCard variant="elevated" className="p-8">
              <div className="space-y-6">
                <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                  <div className="h-12 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                  <div className="h-12 bg-white/50 dark:bg-gray-800/50 rounded animate-pulse"></div>
                </div>
              </div>
            </GlassCard>
          }
        >
          <VerifyOTPContent />
        </Suspense>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}