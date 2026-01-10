'use client'

/**
 * Life Path Orb - WebGL Version
 * Floating Life Path Number orb with glow shader
 * Falls back to CSS version when WebGL is unavailable
 */

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import * as THREE from 'three'
import { use3DPerformance } from '@/hooks/use-3d-performance'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface LifePathOrbProps {
  number?: number
  position?: [number, number, number]
  size?: number
  glowIntensity?: number
  rotationSpeed?: number
  pulseSpeed?: number
}

/**
 * Life Path Orb WebGL component
 */
export function LifePathOrb({
  number = 7,
  position = [0, 0, 0],
  size = 1,
  glowIntensity = 1.5,
  rotationSpeed = 0.5,
  pulseSpeed = 1,
}: LifePathOrbProps) {
  const meshRef = useRef<Mesh>(null)
  const prefersReducedMotion = useReducedMotion()
  const { shouldRender3D } = use3DPerformance()

  // Animate rotation and pulsing
  useFrame((state, delta) => {
    if (!meshRef.current || prefersReducedMotion || !shouldRender3D) return

    // Slow rotation
    meshRef.current.rotation.y += delta * rotationSpeed * 0.1

    // Pulse animation
    const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1
    meshRef.current.scale.setScalar(scale * size)
  })

  // Use standard material with emissive for better compatibility
  // Shader material can be added later if needed
  const glowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: 0x00d4ff, // Cyan
      emissive: 0x004d66,
      emissiveIntensity: 0.5 + glowIntensity * 0.3,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    })
  }, [glowIntensity])

  // Animate material properties
  useFrame(({ clock }) => {
    if (glowMaterial && 'emissiveIntensity' in glowMaterial) {
      // Pulse emissive intensity
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.3 + 0.7
      ;(glowMaterial as THREE.MeshStandardMaterial).emissiveIntensity = (0.5 + glowIntensity * 0.3) * pulse
    }
  })

  if (!shouldRender3D || prefersReducedMotion) {
    return null // Fallback handled by parent component
  }

  return (
    <mesh ref={meshRef} position={position} material={glowMaterial}>
      <sphereGeometry args={[1, 32, 32]} />
    </mesh>
  )
}
