'use client'

/**
 * Number Torus - WebGL Version
 * Numbers orbiting in torus formation
 * Falls back to CSS version when WebGL is unavailable
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'
import * as THREE from 'three'
import { use3DPerformance } from '@/hooks/use-3d-performance'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface NumberTorusProps {
  numbers?: number[]
  radius?: number
  tubeRadius?: number
  rotationSpeed?: number
  hoverExpand?: boolean
}

/**
 * Number Torus WebGL component
 * Displays numbers in a torus formation that can expand on hover
 */
export function NumberTorus({
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  radius = 3,
  tubeRadius = 1,
  rotationSpeed = 0.2,
  hoverExpand = true,
}: NumberTorusProps) {
  const groupRef = useRef<Group>(null)
  const prefersReducedMotion = useReducedMotion()
  const { shouldRender3D } = use3DPerformance()
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Material for number orbs
  const numberMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00d4ff, // Cyan
        emissive: 0x004d66,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  )

  // Calculate positions for numbers in torus formation
  const numberPositions = useMemo(() => {
    return numbers.map((num, index) => {
      const angle = (index / numbers.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0
      return { num, x, y, z, angle }
    })
  }, [numbers, radius])

  // Animate rotation
  useFrame((state, delta) => {
    if (!groupRef.current || prefersReducedMotion || !shouldRender3D) return

    // Rotate around Y axis
    groupRef.current.rotation.y += delta * rotationSpeed

    // Expand on hover (if any orb is hovered)
    const targetScale = hoveredIndex !== null && hoverExpand ? 1.2 : 1
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  if (!shouldRender3D || prefersReducedMotion) {
    return null // Fallback handled by parent component
  }

  return (
    <group ref={groupRef}>
      {/* Torus ring (visual guide) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, tubeRadius * 0.5, 16, 100]} />
        <meshBasicMaterial
          color={0x00d4ff}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Number orbs */}
      {numberPositions.map(({ num, x, y, z }, index) => (
        <NumberOrb
          key={index}
          number={num}
          position={[x, y, z]}
          material={numberMaterial}
          isHovered={hoveredIndex === index}
          onHover={() => hoverExpand && setHoveredIndex(index)}
          onLeave={() => hoverExpand && setHoveredIndex(null)}
        />
      ))}
    </group>
  )
}

/**
 * Individual number orb component
 */
function NumberOrb({
  number,
  position,
  material,
  isHovered,
  onHover,
  onLeave,
}: {
  number: number
  position: [number, number, number]
  material: THREE.MeshStandardMaterial
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return

    // Floating animation
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + number) * 0.2

    // Hover expansion
    const targetScale = isHovered ? 1.3 : 1
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      material={material}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      {/* TODO: Add text rendering for number using Text3D from drei */}
    </mesh>
  )
}
