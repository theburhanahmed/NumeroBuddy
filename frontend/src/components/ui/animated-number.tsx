'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedNumberProps {
  number: string;
  label: string;
  delay?: number;
}

export function AnimatedNumber({
  number,
  label,
  delay = 0
}: AnimatedNumberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className="relative group"
    >
      <div className="bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 text-center transition-all group-hover:scale-105 group-hover:shadow-xl">
        <motion.div
          className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {number}
        </motion.div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

