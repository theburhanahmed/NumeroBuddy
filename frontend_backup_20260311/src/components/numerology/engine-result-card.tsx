'use client';

import React from 'react';
import { SpaceCard } from '@/components/space/space-card';
import { AlertTriangleIcon, InfoIcon, AlertCircleIcon } from 'lucide-react';
import type { EngineWarning } from '@/types/numerobuddy-engines';
import { cn } from '@/lib/utils';

interface EngineResultCardProps {
  title: string;
  result: Record<string, unknown>;
  warnings?: EngineWarning[] | Array<Record<string, unknown>> | null;
  children?: React.ReactNode;
  className?: string;
}

function normalizeWarnings(
  warnings: EngineWarning[] | Array<Record<string, unknown>> | null | undefined
): EngineWarning[] {
  if (!warnings) return [];
  if (Array.isArray(warnings)) {
    return warnings.map((w) => ({
      type: (w as EngineWarning).type ?? 'unknown',
      severity: (w as EngineWarning).severity ?? 'medium',
      message: (w as EngineWarning).message ?? String(w),
      override: (w as EngineWarning).override,
    }));
  }
  return [];
}

export function EngineResultCard({
  title,
  result,
  warnings: rawWarnings,
  children,
  className,
}: EngineResultCardProps) {
  const warnings = normalizeWarnings(rawWarnings);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangleIcon className="w-4 h-4 text-amber-400" />;
      case 'medium':
        return <AlertCircleIcon className="w-4 h-4 text-amber-500/80" />;
      case 'info':
        return <InfoIcon className="w-4 h-4 text-blue-400" />;
      default:
        return <InfoIcon className="w-4 h-4 text-white/60" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'medium':
        return 'bg-amber-500/5 border-amber-500/20';
      case 'info':
        return 'bg-blue-500/5 border-blue-500/20';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <SpaceCard variant="default" className={cn('overflow-hidden', className)}>
      <div className="p-4 md:p-5">
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>

        {children}

        {Object.keys(result).length > 0 && (
          <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-3 text-sm">
            <pre className="text-white/80 whitespace-pre-wrap break-words font-sans">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-white/80">Warnings &amp; conflict resolution</p>
            <ul className="space-y-2">
              {warnings.map((w, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2 rounded-lg border p-2.5 text-sm',
                    getSeverityBg(w.severity)
                  )}
                >
                  {getSeverityIcon(w.severity)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90">{w.message}</p>
                    {w.override && (
                      <span className="inline-block mt-1 text-xs text-amber-400/90">
                        Overrides optimistic traits
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SpaceCard>
  );
}
