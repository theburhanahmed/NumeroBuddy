'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Calendar, Sparkles, BarChart3 } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  description?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  context?: string;
}

const defaultActions: QuickAction[] = [
  {
    id: 'daily-reading',
    label: 'Daily Reading',
    icon: Calendar,
    route: '/numerology/daily-reading',
    color: 'from-cyan-500 to-blue-600',
    description: 'Get your numerology reading for today',
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: FileText,
    route: '/reports/generate',
    color: 'from-purple-500 to-pink-600',
    description: 'Create a comprehensive numerology report',
  },
  {
    id: 'visualizations',
    label: 'Visualizations',
    icon: BarChart3,
    route: '/visualizations',
    color: 'from-yellow-500 to-orange-600',
    description: 'Explore interactive numerology visualizations',
  },
  {
    id: 'remedies',
    label: 'Remedies',
    icon: Sparkles,
    route: '/remedies',
    color: 'from-green-500 to-emerald-600',
    description: 'Discover personalized remedies',
  },
];

export function QuickActions({ actions = defaultActions, context }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = (route: string) => {
    router.push(route);
  };

  return (
    <SpaceCard variant="premium" className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Quick Actions
        </h2>
        {context && (
          <p className="text-sm text-white/60 mt-1">Context: {context}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              onClick={() => handleActionClick(action.route)}
              className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all text-left`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="font-semibold text-sm">{action.label}</div>
              {action.description && (
                <div className="text-xs text-white/80 mt-1 line-clamp-2">
                  {action.description}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </SpaceCard>
  );
}
