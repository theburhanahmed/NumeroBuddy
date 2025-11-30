'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { knowledgeGraphAPI } from '@/lib/numerology-api';

interface GraphVisualizationProps {
  className?: string;
}

export function GraphVisualization({ className = '' }: GraphVisualizationProps) {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    try {
      setLoading(true);
      const data = await knowledgeGraphAPI.discoverPatterns();
      setPatterns(data);
    } catch (error) {
      console.error('Failed to load patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard variant="default" className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Knowledge Graph
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Discover patterns in your numerology
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
      ) : patterns.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No patterns discovered yet. Complete more numerology activities to discover patterns.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {patterns.map((pattern, idx) => (
            <motion.div
              key={pattern.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {pattern.pattern_type_display || 'Pattern Discovered'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {pattern.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                    {pattern.significance}
                  </p>
                  {pattern.confidence_score && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 dark:bg-purple-400 rounded-full"
                            style={{ width: `${pattern.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {Math.round(pattern.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

