'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { CosmicTooltip } from '@/components/cosmic/cosmic-tooltip';
import { numerologyAPI } from '@/lib/numerology-api';

interface WheelPosition {
  number: number;
  angle: number;
  x: number;
  y: number;
  associated_types: string[];
  strength: number;
  is_master?: boolean;
}

interface NumerologyWheelData {
  positions: WheelPosition[];
  connections: Array<{
    from: number;
    to: number;
    type: string;
    strength: number;
  }>;
  center_number: number | null;
  number_types: Record<string, number>;
  total_numbers: number;
  master_numbers: number[];
}

interface NumerologyWheelProps {
  data?: NumerologyWheelData;
  onNumberClick?: (number: number) => void;
}

export function NumerologyWheel({ data, onNumberClick }: NumerologyWheelProps) {
  const [wheelData, setWheelData] = useState<NumerologyWheelData | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);

  useEffect(() => {
    if (!data) {
      fetchWheelData();
    }
  }, []);

  const fetchWheelData = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getNumerologyWheel();
      setWheelData(response);
    } catch (error) {
      console.error('Failed to fetch numerology wheel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  if (!wheelData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="text-center text-white/70">Failed to load numerology wheel</div>
      </SpaceCard>
    );
  }

  const radius = 180;
  const centerX = 250;
  const centerY = 250;
  const numberRadius = 30;

  const handleNumberClick = (number: number) => {
    setSelectedNumber(selectedNumber === number ? null : number);
    if (onNumberClick) {
      onNumberClick(number);
    }
  };

  const getNumberColor = (number: number, strength: number) => {
    if (strength >= 3) return 'from-cyan-500 to-blue-600';
    if (strength >= 2) return 'from-purple-500 to-pink-600';
    if (strength >= 1) return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Numerology Wheel
        </h2>
        <p className="text-white/70">Interactive visualization of your numerology numbers</p>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          className="w-full h-auto"
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 20}
            fill="none"
            stroke="rgba(6, 182, 212, 0.2)"
            strokeWidth="2"
          />

          {/* Connections */}
          {wheelData.connections.map((conn, idx) => {
            const fromPos = wheelData.positions.find(p => p.number === conn.from);
            const toPos = wheelData.positions.find(p => p.number === conn.to);
            if (!fromPos || !toPos) return null;

            const x1 = centerX + fromPos.x * radius;
            const y1 = centerY + fromPos.y * radius;
            const x2 = centerX + toPos.x * radius;
            const y2 = centerY + toPos.y * radius;

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth={conn.strength}
                strokeDasharray={conn.type === 'same_value' ? '0' : '5,5'}
              />
            );
          })}

          {/* Number positions */}
          {wheelData.positions.map((pos) => {
            const x = centerX + pos.x * radius;
            const y = centerY + pos.y * radius;
            const isSelected = selectedNumber === pos.number;
            const isHovered = hoveredNumber === pos.number;
            const colorClass = getNumberColor(pos.number, pos.strength);

            return (
              <g key={pos.number}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected || isHovered ? numberRadius + 5 : numberRadius}
                  fill={`url(#gradient-${pos.number})`}
                  stroke={isSelected ? '#06b6d4' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer"
                  onClick={() => handleNumberClick(pos.number)}
                  onMouseEnter={() => setHoveredNumber(pos.number)}
                  onMouseLeave={() => setHoveredNumber(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <defs>
                  <linearGradient id={`gradient-${pos.number}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={pos.strength >= 2 ? '#06b6d4' : '#8b5cf6'} />
                    <stop offset="100%" stopColor={pos.strength >= 2 ? '#3b82f6' : '#ec4899'} />
                  </linearGradient>
                </defs>
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-white font-bold text-lg pointer-events-none"
                  fill="white"
                >
                  {pos.number}
                </text>
                {pos.is_master && (
                  <text
                    x={x}
                    y={y + 20}
                    textAnchor="middle"
                    className="text-cyan-400 text-xs pointer-events-none"
                    fill="#06b6d4"
                  >
                    M
                  </text>
                )}
              </g>
            );
          })}

          {/* Center number */}
          {wheelData.center_number && (
            <g>
              <circle
                cx={centerX}
                cy={centerY}
                r={40}
                fill="rgba(6, 182, 212, 0.2)"
                stroke="#06b6d4"
                strokeWidth="2"
              />
              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-cyan-400 font-bold text-2xl"
                fill="#06b6d4"
              >
                {wheelData.center_number}
              </text>
            </g>
          )}
        </svg>

        {/* Number details panel */}
        {selectedNumber !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-[#1a2942]/60 backdrop-blur-sm rounded-xl border border-cyan-500/20"
          >
            {(() => {
              const pos = wheelData.positions.find(p => p.number === selectedNumber);
              if (!pos) return null;
              return (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Number {pos.number}
                    {pos.is_master && (
                      <span className="ml-2 text-xs text-cyan-400">(Master Number)</span>
                    )}
                  </h3>
                  <div className="space-y-2 text-white/80">
                    <div>
                      <span className="font-semibold">Strength: </span>
                      {pos.strength} occurrence{pos.strength !== 1 ? 's' : ''}
                    </div>
                    {pos.associated_types.length > 0 && (
                      <div>
                        <span className="font-semibold">Associated Types: </span>
                        {pos.associated_types.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <span className="text-white/70">Strong (3+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <span className="text-white/70">Moderate (2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600"></div>
            <span className="text-white/70">Present (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"></div>
            <span className="text-white/70">Missing</span>
          </div>
        </div>
      </div>
    </SpaceCard>
  );
}