'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Move3d } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { CrystalNumerologyCube } from '@/components/3d/crystal-numerology-cube';
import { numerologyAPI } from '@/lib/numerology-api';

interface Node {
  id: string;
  number: number;
  position: { x: number; y: number; z: number };
  associated_types: string[];
  is_master?: boolean;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

interface Numerology3DData {
  nodes: Node[];
  connections: Connection[];
  center: { x: number; y: number; z: number };
  bounds: { min: number; max: number };
}

interface Numerology3DVisualizationProps {
  data?: Numerology3DData;
}

export function Numerology3DVisualization({ data }: Numerology3DVisualizationProps) {
  const [visualizationData, setVisualizationData] = useState<Numerology3DData | null>(data || null);
  const [loading, setLoading] = useState(!data);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) {
      fetch3DData();
    }
  }, []);

  const fetch3DData = async () => {
    try {
      setLoading(true);
      const response = await numerologyAPI.get3DNumerologyVisualization();
      setVisualizationData(response);
    } catch (error) {
      console.error('Failed to fetch 3D visualization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setRotation({
      x: rotation.x + e.movementY * 0.5,
      y: rotation.y + e.movementX * 0.5,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  if (!visualizationData) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="text-center text-white/70">Failed to load 3D visualization</div>
      </SpaceCard>
    );
  }

  // Normalize positions to 0-400 range for SVG
  const normalizePosition = (pos: number, min: number, max: number) => {
    return ((pos - min) / (max - min)) * 400;
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Box className="w-6 h-6 text-cyan-400" />
          3D Numerology Visualization
        </h2>
        <p className="text-white/70 mb-2">Interactive 3D view of number relationships</p>
        <p className="text-sm text-white/50 flex items-center gap-2">
          <Move3d className="w-4 h-4" />
          Click and drag to rotate
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-96 bg-gradient-to-br from-[#0a1629] to-[#1a2942] rounded-xl overflow-hidden border border-cyan-500/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          className="absolute inset-0"
        >
          {/* Connections */}
          {visualizationData.connections.map((conn, idx) => {
            const fromNode = visualizationData.nodes.find(n => n.id === conn.from);
            const toNode = visualizationData.nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const x1 = normalizePosition(
              fromNode.position.x,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );
            const y1 = normalizePosition(
              fromNode.position.y,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );
            const x2 = normalizePosition(
              toNode.position.x,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );
            const y2 = normalizePosition(
              toNode.position.y,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth={conn.strength}
                className="transition-opacity hover:opacity-100"
              />
            );
          })}

          {/* Nodes */}
          {visualizationData.nodes.map((node) => {
            const x = normalizePosition(
              node.position.x,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );
            const y = normalizePosition(
              node.position.y,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            );
            const isSelected = selectedNode?.id === node.id;

            return (
              <g key={node.id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 20 : 15}
                  fill={node.is_master ? '#06b6d4' : '#8b5cf6'}
                  stroke={isSelected ? '#06b6d4' : 'rgba(255, 255, 255, 0.5)'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-white font-bold text-sm pointer-events-none"
                  fill="white"
                >
                  {node.number}
                </text>
              </g>
            );
          })}

          {/* Center point */}
          <circle
            cx={normalizePosition(
              visualizationData.center.x,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            )}
            cy={normalizePosition(
              visualizationData.center.y,
              visualizationData.bounds.min,
              visualizationData.bounds.max
            )}
            r="5"
            fill="#06b6d4"
            opacity="0.5"
          />
        </svg>

        {/* Alternative: Use existing 3D component */}
        <div className="absolute inset-0 flex items-center justify-center">
          <CrystalNumerologyCube
            number={visualizationData.nodes[0]?.number ?? 0}
            size="lg"
          />
        </div>
      </div>

      {/* Node details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#1a2942]/60 backdrop-blur-sm rounded-xl border border-cyan-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Number {selectedNode.number}
            {selectedNode.is_master && (
              <span className="ml-2 text-xs text-cyan-400">(Master Number)</span>
            )}
          </h3>
          <div className="space-y-2 text-white/80">
            <div>
              <span className="font-semibold">Position: </span>
              ({selectedNode.position.x.toFixed(2)}, {selectedNode.position.y.toFixed(2)}, {selectedNode.position.z.toFixed(2)})
            </div>
            {selectedNode.associated_types.length > 0 && (
              <div>
                <span className="font-semibold">Associated Types: </span>
                {selectedNode.associated_types.map((type, idx) => (
                  <span key={idx} className="text-cyan-400">
                    {type.replace('_', ' ')}
                    {idx < selectedNode.associated_types.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Connections info */}
      <div className="mt-4 text-sm text-white/60">
        {visualizationData.connections.length} connections between {visualizationData.nodes.length} numbers
      </div>
    </SpaceCard>
  );
}