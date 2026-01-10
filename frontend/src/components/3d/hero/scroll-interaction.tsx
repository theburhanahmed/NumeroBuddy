'use client'

/**
 * Scroll Interaction - GSAP ScrollTrigger
 * Handles scroll-based camera/orb rotation for 3D hero scene
 */

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface ScrollInteractionProps {
  enabled?: boolean
  rotationSpeed?: number
  parallaxAmount?: number
}

/**
 * Scroll-based camera and scene rotation
 * Uses GSAP ScrollTrigger for smooth scroll-driven animations
 */
export function ScrollInteraction({
  enabled = true,
  rotationSpeed = 0.1,
  parallaxAmount = 0.5,
}: ScrollInteractionProps) {
  const { camera, scene } = useThree()
  const prefersReducedMotion = useReducedMotion()
  const scrollRef = useRef<number>(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return

    let gsap: any
    let ScrollTrigger: any

    // Dynamically import GSAP and ScrollTrigger
    const loadGSAP = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollTriggerModule = await import('gsap/ScrollTrigger')
        gsap = gsapModule.gsap
        ScrollTrigger = scrollTriggerModule.ScrollTrigger
        if (gsap && ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger)
        }

        // Set up scroll-based rotation
        ScrollTrigger.create({
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self: any) => {
            scrollRef.current = self.progress
          },
        })

        // Animate camera rotation based on scroll
        const animate = () => {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
          }

          const scrollProgress = scrollRef.current

          // Rotate camera around scene
          if (camera && scene) {
            const angle = scrollProgress * Math.PI * 2 * rotationSpeed
            camera.position.x = Math.sin(angle) * 5
            camera.position.z = Math.cos(angle) * 5
            camera.lookAt(0, 0, 0)

            // Parallax effect - move scene slightly
            scene.rotation.y = scrollProgress * Math.PI * parallaxAmount
          }

          rafRef.current = requestAnimationFrame(animate)
        }

        animate()
      } catch (error) {
        console.warn('GSAP ScrollTrigger not available, using fallback scroll:', error)
        
        // Fallback to native scroll
        const handleScroll = () => {
          const scrollProgress =
            window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
          scrollRef.current = scrollProgress

          if (camera && scene) {
            const angle = scrollProgress * Math.PI * 2 * rotationSpeed
            camera.position.x = Math.sin(angle) * 5
            camera.position.z = Math.cos(angle) * 5
            camera.lookAt(0, 0, 0)
            scene.rotation.y = scrollProgress * Math.PI * parallaxAmount
          }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
          window.removeEventListener('scroll', handleScroll)
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
          }
          if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
          }
        }
      }
    }

    loadGSAP()

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (ScrollTrigger && typeof ScrollTrigger.getAll === 'function') {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
  }, [enabled, prefersReducedMotion, rotationSpeed, parallaxAmount, camera, scene])

  return null // This component doesn't render anything
}
