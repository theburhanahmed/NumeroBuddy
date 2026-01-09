'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Info } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { CosmicTooltip } from '@/components/cosmic/cosmic-tooltip';
import { numerologyAPI } from '@/lib/numerology-api';

interface HeatmapCell {
  number: number;
  row: number;
  col: number;
  frequency: number;
  intensity: number;
  strength: 'very_strong' | 'strong' | 'present' | 'missing';
  associated_types: string[];
}

interface NumerologyHeatmapData {
  cells: HeatmapCell[];
  frequency_map: Record<number, number>;
  max_frequency: number;
  total_numbers: number;
}

interface NumerologyHeatmapProps {
  data?: NumerologyHeatmapData;
}

export function NumerologyHeatmap({ data }: NumerologyHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<NumerologyHeatmapData | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      fetchHeatmapData();
    }
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.getNumerologyHeatmap();
      setHeatmapData(response);
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  if (!heatmapData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="text-center text-white/70">Failed to load heatmap</div>
      </SpaceCard>
    );
  }

  const getCellColor = (cell: HeatmapCell) => {
    if (cell.strength === 'very_strong') return 'from-cyan-500 to-blue-600';
    if (cell.strength === 'strong') return 'from-purple-500 to-pink-600';
    if (cell.strength === 'present') return 'from-yellow-500 to-orange-600';
    return 'from-gray-700 to-gray-800';
  };

  const getCellIntensity = (cell: HeatmapCell) => {
    return cell.intensity * 100;
  };

  const filteredCells = filterType
    ? heatmapData.cells.filter(cell => 
        cell.associated_types.some(type => type.toLowerCase().includes(filterType.toLowerCase()))
      )
    : heatmapData.cells;

  // Organize cells into 3x3 grid
  const gridCells: (HeatmapCell | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  filteredCells.forEach(cell => {
    gridCells[cell.row][cell.col] = cell;
  });

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Grid3x3 className="w-6 h-6 text-cyan-400" />
          Numerology Heatmap
        </h2>
        <p className="text-white/70 mb-4">Color-coded intensity map of your number strengths</p>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType(null)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filterType === null
                ? 'bg-cyan-500 text-white'
                : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
            }`}
          >
            All
          </button>
          {['life_path', 'destiny', 'soul_urge', 'personality'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-sm capitalize ${
                filterType === type
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {gridCells.flat().map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="aspect-square bg-[#1a2942]/20 rounded-xl border border-white/5"
              />
            );
          }

          const colorClass = getCellColor(cell);
          const intensity = getCellIntensity(cell);
          const isSelected = selectedCell?.number === cell.number;

          return (
            <motion.div
              key={cell.number}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`aspect-square rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 ring-4 ring-cyan-400/30'
                  : 'border-white/10 hover:border-cyan-500/50'
              }`}
              onClick={() => setSelectedCell(isSelected ? null : cell)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-full h-full rounded-lg bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center p-4 relative`}
                style={{ opacity: Math.max(0.3, intensity / 100) }}
              >
                <div className="text-4xl font-bold text-white mb-1">{cell.number}</div>
                <div className="text-xs text-white/80">
                  {cell.frequency} time{cell.frequency !== 1 ? 's' : ''}
                </div>
                {cell.strength !== 'missing' && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-2 h-2 rounded-full ${
                      cell.strength === 'very_strong' ? 'bg-cyan-400' :
                      cell.strength === 'strong' ? 'bg-purple-400' :
                      'bg-yellow-400'
                    }`} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cell details */}
      {selectedCell && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#1a2942]/60 backdrop-blur-sm rounded-xl border border-cyan-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Number {selectedCell.number}
          </h3>
          <div className="space-y-2 text-white/80">
            <div>
              <span className="font-semibold">Frequency: </span>
              {selectedCell.frequency} occurrence{selectedCell.frequency !== 1 ? 's' : ''}
            </div>
            <div>
              <span className="font-semibold">Strength: </span>
              <span className="capitalize">{selectedCell.strength.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="font-semibold">Intensity: </span>
              {Math.round(selectedCell.intensity * 100)}%
            </div>
            {selectedCell.associated_types.length > 0 && (
              <div>
                <span className="font-semibold">Associated Types: </span>
                {selectedCell.associated_types.map((type, idx) => (
                  <span key={idx} className="text-cyan-400">
                    {type.replace('_', ' ')}
                    {idx < selectedCell.associated_types.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          <span className="text-white/70">Very Strong (3+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-pink-600"></div>
          <span className="text-white/70">Strong (2)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-orange-600"></div>
          <span className="text-white/70">Present (1)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-700 to-gray-800"></div>
          <span className="text-white/70">Missing</span>
        </div>
      </div>
    </SpaceCard>
  );
}