/**
 * RajYogBadge component - Display Raj Yog detection status with animations.
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RajYogDetection } from '@/types/numerology';
import { Sparkles, Crown, Star } from 'lucide-react';
import React from 'react';

interface RajYogBadgeProps {
  detection: RajYogDetection | null;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const yogTypeColors: Record<string, string> = {
  leadership: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
  spiritual: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
  material: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
  creative: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
  service: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
  master: 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white',
  other: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white',
};

const yogTypeIcons: Record<string, React.ReactNode> = {
  leadership: <Crown className="w-4 h-4" />,
  spiritual: <Sparkles className="w-4 h-4" />,
  material: <Star className="w-4 h-4" />,
  creative: <Sparkles className="w-4 h-4" />,
  service: <Star className="w-4 h-4" />,
  master: <Crown className="w-4 h-4" />,
  other: <Star className="w-4 h-4" />,
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

export function RajYogBadge({ 
  detection, 
  size = 'md', 
  showDetails = false,
  className 
}: RajYogBadgeProps) {
  if (!detection || !detection.is_detected) {
    return (
      <Badge 
        variant="outline" 
        className={cn('border-gray-300 text-gray-600', sizeClasses[size], className)}
      >
        No Raj Yog
      </Badge>
    );
  }

  const yogType = detection.yog_type || 'other';
  const colorClass = yogTypeColors[yogType] || yogTypeColors.other;
  const icon = yogTypeIcons[yogType] || yogTypeIcons.other;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Badge 
        className={cn(
          'inline-flex items-center gap-1.5 font-semibold shadow-lg',
          'animate-pulse hover:animate-none transition-all',
          colorClass,
          sizeClasses[size]
        )}
      >
        {icon}
        <span>{detection.yog_name || 'Raj Yog Detected'}</span>
        {detection.strength_score >= 80 && (
          <span className="ml-1 text-xs opacity-90">⭐</span>
        )}
      </Badge>
      
      {showDetails && (
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Strength:</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn('h-full rounded-full transition-all', colorClass)}
                style={{ width: `${detection.strength_score}%` }}
              />
            </div>
            <span className="font-semibold">{detection.strength_score}/100</span>
          </div>
          
          {detection.detected_combinations.length > 0 && (
            <div className="mt-2">
              <p className="font-medium mb-1">Detected Combinations:</p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                {detection.detected_combinations.map((combo, idx) => (
                  <li key={idx} className="text-xs">
                    {combo.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

