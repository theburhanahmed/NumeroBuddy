'use client'

/**
 * Lo Shu 3D Grid - WebGL Component (R3F)
 * Must be rendered inside Canvas context
 */

import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface LoShu3DGridWebGLProps {
  grid: (number | null)[][] // 3x3 grid, null for missing numbers
  onNumberClick?: (number: number, row: number, col: number) => void
  enableHover?: boolean
}

/**
 * Lo Shu 3D Grid WebGL Component (R3F)
 * Renders inside Canvas context
 */
export function LoShu3DGridWebGL({
  grid,
  onNumberClick,
  enableHover = true,
}: LoShu3DGridWebGLProps) {
  const groupRef = useRef<Group>(null)
  const prefersReducedMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Tile material
  const tileMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1a2942,
        emissive: 0x0a1628,
        emissiveIntensity: 0.3,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.8,
      }),
    []
  )

  // Hovered tile material
  const hoveredTileMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x004d66,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  // Border material
  const borderMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.5,
      }),
    []
  )

  // Animate grid floating
  useFrame((state, delta) => {
    if (!groupRef.current || prefersReducedMotion) return

    // Subtle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  const tileSize = 1.5
  const spacing = 0.2
  const gridSize = tileSize * 3 + spacing * 2
  const startX = -gridSize / 2 + tileSize / 2
  const startZ = -gridSize / 2 + tileSize / 2

  return (
    <group ref={groupRef}>
      {/* Grid tiles */}
      {grid.map((row, rowIndex) =>
        row.map((number, colIndex) => {
          const x = startX + colIndex * (tileSize + spacing)
          const z = startZ + rowIndex * (tileSize + spacing)
          const index = rowIndex * 3 + colIndex
          const isHovered = hoveredIndex === index

          return (
            <GridTile
              key={`${rowIndex}-${colIndex}`}
              position={[x, 0, z]}
              size={tileSize}
              number={number}
              material={isHovered ? hoveredTileMaterial : tileMaterial}
              borderMaterial={borderMaterial}
              isHovered={isHovered}
              onHover={() => enableHover && setHoveredIndex(index)}
              onLeave={() => enableHover && setHoveredIndex(null)}
              onClick={() => {
                if (number !== null) {
                  onNumberClick?.(number, rowIndex, colIndex)
                }
              }}
            />
          )
        })
      )}
    </group>
  )
}

/**
 * Individual grid tile component (R3F)
 */
function GridTile({
  position,
  size,
  number,
  material,
  borderMaterial,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  position: [number, number, number]
  size: number
  number: number | null
  material: THREE.MeshStandardMaterial
  borderMaterial: THREE.MeshBasicMaterial
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const meshRef = useRef<Mesh>(null)
  const numberRef = useRef<Group>(null)

  // Animate number floating
  useFrame((state) => {
    if (!meshRef.current || !numberRef.current) return

    // Hover elevation
    const targetY = isHovered ? 0.3 : 0
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.1
    )

    // Number floating animation
    if (number !== null && numberRef.current) {
      numberRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + number) * 0.15 + 0.5
    }
  })

  return (
    <group position={position}>
      {/* Tile base */}
      <mesh
        ref={meshRef}
        material={material}
        onPointerEnter={onHover}
        onPointerLeave={onLeave}
        onClick={onClick}
      >
        <boxGeometry args={[size, 0.1, size]} />
      </mesh>

      {/* Tile border */}
      <mesh material={borderMaterial}>
        <boxGeometry args={[size + 0.05, 0.12, size + 0.05]} />
      </mesh>

      {/* Number (if present) */}
      {number !== null ? (
        <group ref={numberRef} position={[0, 0.5, 0]}>
          {/* Use HTML for number text (simpler for Next.js) */}
          <Html position={[0, 0, 0]} center>
            <div className="text-6xl font-bold text-cyan-400 font-['Playfair_Display'] drop-shadow-lg pointer-events-none">
              {number}
            </div>
          </Html>
        </group>
      ) : (
        // Hollow space indicator
        <group position={[0, 0.05, 0]}>
          <mesh>
            <ringGeometry args={[size * 0.3, size * 0.35, 32]} />
            <meshBasicMaterial
              color={0x00d4ff}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}
