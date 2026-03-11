import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon } from
'lucide-react';
interface TrustSignal {
  id: string;
  icon: React.ReactNode;
  message: string;
  timestamp: string;
}
export function LiveTrustSignals() {
  const [currentSignal, setCurrentSignal] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const signals: TrustSignal[] = [
  {
    id: '1',
    icon: <CheckCircleIcon className="w-4 h-4 text-green-400" />,
    message: 'Sarah from New York just unlocked her Life Path analysis',
    timestamp: '2m ago'
  },
  {
    id: '2',
    icon: <SparklesIcon className="w-4 h-4 text-cyan-400" />,
    message: 'Michael upgraded to Premium for unlimited readings',
    timestamp: '5m ago'
  },
  {
    id: '3',
    icon: <TrendingUpIcon className="w-4 h-4 text-purple-400" />,
    message: '127 people discovered their compatibility today',
    timestamp: '8m ago'
  },
  {
    id: '4',
    icon: <UsersIcon className="w-4 h-4 text-blue-400" />,
    message: '50,000+ active seekers trust NumeroBuddy',
    timestamp: 'ongoing'
  }];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSignal((prev) => (prev + 1) % signals.length);
        setIsVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [signals.length]);
  return (
    <div className="fixed bottom-8 left-8 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible &&
        <motion.div
          key={signals[currentSignal].id}
          initial={{
            opacity: 0,
            x: -20,
            y: 20
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0
          }}
          exit={{
            opacity: 0,
            x: -20,
            y: 20
          }}
          transition={{
            duration: 0.3
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1a2942]/90 backdrop-blur-xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10 max-w-sm">

            <div className="flex-shrink-0">{signals[currentSignal].icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 font-medium truncate">
                {signals[currentSignal].message}
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                {signals[currentSignal].timestamp}
              </p>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}