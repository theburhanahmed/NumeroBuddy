import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
interface ConstellationConnectionsProps {
  cardCount: number;
  containerRef?: React.RefObject<HTMLDivElement>;
}
interface Point {
  x: number;
  y: number;
}
export function ConstellationConnections({
  cardCount,
  containerRef
}: ConstellationConnectionsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<
    Array<{
      start: Point;
      end: Point;
    }>>(
    []);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    const updateConnections = () => {
      if (!containerRef?.current) return;
      const container = containerRef.current;
      const cards = container.querySelectorAll('[data-constellation-node]');
      if (cards.length === 0) return;
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
      const points: Point[] = [];
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        // Get center point of each card relative to container
        points.push({
          x: cardRect.left - containerRect.left + cardRect.width / 2,
          y: cardRect.top - containerRect.top + cardRect.height / 2
        });
      });
      // Create connections between nearby cards (not all cards)
      const newConnections: Array<{
        start: Point;
        end: Point;
      }> = [];
      // Connect each card to its 1-2 nearest neighbors
      points.forEach((point, i) => {
        const distances = points.
        map((p, j) => ({
          index: j,
          distance: Math.sqrt(
            Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2)
          )
        })).
        filter((d) => d.index !== i).
        sort((a, b) => a.distance - b.distance);
        // Connect to 1-2 nearest neighbors (creates organic constellation pattern)
        const neighborsToConnect = Math.min(2, distances.length);
        for (let n = 0; n < neighborsToConnect; n++) {
          const neighbor = distances[n];
          // Only add if distance is reasonable (not too far apart)
          if (neighbor.distance < 400) {
            // Avoid duplicate connections
            const isDuplicate = newConnections.some(
              (conn) =>
              conn.start === point && conn.end === points[neighbor.index] ||
              conn.end === point && conn.start === points[neighbor.index]
            );
            if (!isDuplicate) {
              newConnections.push({
                start: point,
                end: points[neighbor.index]
              });
            }
          }
        }
      });
      setConnections(newConnections);
    };
    // Initial update
    updateConnections();
    // Update on resize
    window.addEventListener('resize', updateConnections);
    // Update after a delay to ensure cards are rendered
    const timer = setTimeout(updateConnections, 100);
    return () => {
      window.removeEventListener('resize', updateConnections);
      clearTimeout(timer);
    };
  }, [cardCount, containerRef]);
  if (connections.length === 0) return null;
  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}>

      <defs>
        <linearGradient
          id="connectionGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%">

          <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
          <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
          <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
        </linearGradient>
      </defs>

      {connections.map((connection, index) =>
      <motion.line
        key={index}
        x1={connection.start.x}
        y1={connection.start.y}
        x2={connection.end.x}
        y2={connection.end.y}
        stroke="url(#connectionGradient)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{
          pathLength: 0,
          opacity: 0
        }}
        animate={{
          pathLength: 1,
          opacity: 1
        }}
        transition={{
          duration: 1.5,
          delay: index * 0.1,
          ease: 'easeInOut'
        }} />

      )}

      {/* Add subtle glow nodes at connection points */}
      {connections.
      flatMap((conn) => [conn.start, conn.end]).
      map((point, index) =>
      <motion.circle
        key={`node-${index}`}
        cx={point.x}
        cy={point.y}
        r="2"
        fill="rgba(6, 182, 212, 0.6)"
        initial={{
          scale: 0,
          opacity: 0
        }}
        animate={{
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.05
        }}>

            <animate
          attributeName="opacity"
          values="0.4;0.8;0.4"
          dur="3s"
          repeatCount="indefinite" />

          </motion.circle>
      )}
    </svg>);

}