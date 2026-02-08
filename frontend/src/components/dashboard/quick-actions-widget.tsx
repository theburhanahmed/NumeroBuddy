'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Users, Sparkles } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { SpaceButton } from '@/components/space/space-button';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'report',
    label: 'Generate my report',
    icon: FileText,
    path: '/reports/generate?person=self',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'reading',
    label: 'Your Daily Reading',
    icon: Calendar,
    path: '/daily-reading',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'compatibility',
    label: 'Compatibility (You vs Partner)',
    icon: Users,
    path: '/compatibility',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'remedies',
    label: 'View Remedies',
    icon: Sparkles,
    path: '/remedies',
    color: 'from-green-500 to-emerald-600',
  },
];

export function QuickActionsWidget() {
  const router = useRouter();

  return (
    <SpaceCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              onClick={() => router.push(action.path)}
              className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white flex flex-col items-center gap-2 transition-all hover:scale-105`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </SpaceCard>
  );
}

