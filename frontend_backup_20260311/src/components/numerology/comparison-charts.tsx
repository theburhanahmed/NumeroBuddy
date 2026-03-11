'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Radar, TrendingUp as Scatter, Download } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { numerologyAPI } from '@/lib/numerology-api';
import { peopleAPI } from '@/lib/numerology-api';

interface ComparisonChartsData {
  bar_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  radar_chart: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  scatter_plot: Array<{
    x: number;
    y: number;
    label: string;
  }>;
  compatibility_scores: Array<{
    person1: string;
    person2: string;
    score: number;
  }>;
  profiles_count: number;
}

interface ComparisonChartsProps {
  personIds?: string[];
  data?: ComparisonChartsData;
}

export function ComparisonCharts({ personIds, data }: ComparisonChartsProps) {
  const [chartData, setChartData] = useState<ComparisonChartsData | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [chartType, setChartType] = useState<'bar' | 'radar' | 'scatter'>('bar');
  const [people, setPeople] = useState<any[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>(personIds || []);

  useEffect(() => {
    if (!data && selectedPeople.length > 0) {
      fetchComparisonData();
    }
    fetchPeople();
  }, [selectedPeople]);

  const fetchPeople = async () => {
    try {
      const response = await peopleAPI.getPeople();
      setPeople(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    }
  };

  const fetchComparisonData = async () => {
    if (selectedPeople.length === 0) return;
    
    try {
      setLoading(true);
      const response = await numerologyAPI.getNumerologyComparisonCharts({
        person_ids: selectedPeople
      });
      setChartData(response);
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!chartData) return;
    
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'numerology-comparison.json';
    link.click();
    URL.revokeObjectURL(url);
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

  if (!chartData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-4">Compare Numerology Profiles</h2>
          <p className="text-white/70 mb-4">Select people to compare their numerology numbers</p>
          
          <div className="space-y-2">
            {people.map((person) => (
              <label key={person.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPeople.includes(person.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPeople([...selectedPeople, person.id]);
                    } else {
                      setSelectedPeople(selectedPeople.filter(id => id !== person.id));
                    }
                  }}
                  className="w-4 h-4 text-cyan-500 rounded"
                />
                <span className="text-white">{person.name}</span>
              </label>
            ))}
          </div>

          {selectedPeople.length > 0 && (
            <TouchOptimizedButton
              variant="primary"
              onClick={fetchComparisonData}
              className="mt-4"
            >
              Compare Selected
            </TouchOptimizedButton>
          )}
        </div>
      </SpaceCard>
    );
  }

  const renderBarChart = () => {
    if (!chartData.bar_chart.datasets.length) return null;

    const maxValue = Math.max(
      ...chartData.bar_chart.datasets.flatMap(d => d.data),
      9
    );

    return (
      <div className="space-y-4">
        {chartData.bar_chart.labels.map((label, idx) => {
          const value = chartData.bar_chart.datasets[0]?.data[idx] || 0;
          const percentage = (value / maxValue) * 100;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm text-white/80">
                <span>{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
              <div className="h-6 bg-[#1a2942]/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRadarChart = () => {
    if (!chartData.radar_chart.datasets.length) return null;

    const maxValue = 9;
    const centerX = 200;
    const centerY = 200;
    const radius = 150;

    return (
      <div className="flex justify-center">
        <svg width="400" height="400" viewBox="0 0 400 400">
          {/* Grid circles */}
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <circle
              key={scale}
              cx={centerX}
              cy={centerY}
              r={radius * scale}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Grid lines */}
          {chartData.radar_chart.labels.map((_, idx) => {
            const angle = (idx * 2 * Math.PI) / chartData.radar_chart.labels.length - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygons */}
          {chartData.radar_chart.datasets.map((dataset, datasetIdx) => {
            const points = dataset.data.map((value, idx) => {
              const angle = (idx * 2 * Math.PI) / dataset.data.length - Math.PI / 2;
              const scaledRadius = (value / maxValue) * radius;
              const x = centerX + scaledRadius * Math.cos(angle);
              const y = centerY + scaledRadius * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={datasetIdx}
                points={points}
                fill={`rgba(6, 182, 212, ${0.3 - datasetIdx * 0.1})`}
                stroke="#06b6d4"
                strokeWidth="2"
              />
            );
          })}

          {/* Labels */}
          {chartData.radar_chart.labels.map((label, idx) => {
            const angle = (idx * 2 * Math.PI) / chartData.radar_chart.labels.length - Math.PI / 2;
            const x = centerX + (radius + 20) * Math.cos(angle);
            const y = centerY + (radius + 20) * Math.sin(angle);
            return (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-white/70"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderScatterPlot = () => {
    if (!chartData.scatter_plot.length) return null;

    const width = 400;
    const height = 400;
    const padding = 40;
    const xMax = 9;
    const yMax = 9;

    return (
      <div className="flex justify-center">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
            const x = padding + ((val / xMax) * (width - 2 * padding));
            const y = padding + ((val / yMax) * (height - 2 * padding));
            return (
              <g key={val}>
                <line
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={height - padding}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Data points */}
          {chartData.scatter_plot.map((point, idx) => {
            const x = padding + ((point.x / xMax) * (width - 2 * padding));
            const y = height - padding - ((point.y / yMax) * (height - 2 * padding));
            return (
              <g key={idx}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="#06b6d4"
                  className="cursor-pointer hover:fill-cyan-400"
                />
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className="text-xs fill-white/70"
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Axes labels */}
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-white/70"
          >
            Life Path Number
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            className="text-xs fill-white/70"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            Destiny Number
          </text>
        </svg>
      </div>
    );
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Comparison Charts
          </h2>
          <TouchOptimizedButton
            variant="secondary"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </TouchOptimizedButton>
        </div>

        {/* Chart type selector */}
        <div className="flex gap-2 mb-6">
          {(['bar', 'radar', 'scatter'] as const).map((type) => {
            const icons = {
              bar: BarChart3,
              radar: Radar,
              scatter: Scatter,
            };
            const Icon = icons[type];
            return (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  chartType === type
                    ? 'bg-cyan-500 text-white'
                    : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart display */}
      <div className="min-h-[400px]">
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'radar' && renderRadarChart()}
        {chartType === 'scatter' && renderScatterPlot()}
      </div>

      {/* Compatibility scores */}
      {chartData.compatibility_scores.length > 0 && (
        <div className="mt-8 p-4 bg-[#1a2942]/40 rounded-xl border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Compatibility Scores</h3>
          <div className="space-y-2">
            {chartData.compatibility_scores.map((score, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-white/80">
                  {score.person1} & {score.person2}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-[#1a2942]/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 font-semibold w-12 text-right">
                    {score.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SpaceCard>
  );
}