/**
 * Scroll Parallax Manager
 * Handles scroll-based parallax effects for 3D scenes
 * Uses GSAP ScrollTrigger when available, falls back to native scroll
 */

import { useEffect, useRef, RefObject } from 'react'

export interface ScrollParallaxOptions {
  speed?: number
  enabled?: boolean
  offset?: number
}

/**
 * Hook to create scroll-based parallax effect
 */
export function useScrollParallax<T extends HTMLElement = HTMLDivElement>(
  options: ScrollParallaxOptions = {}
): RefObject<T> {
  const { speed = 0.5, enabled = true, offset = 0 } = options
  const elementRef = useRef<T>(null)

  useEffect(() => {
    if (!enabled || !elementRef.current) return

    let gsap: any
    let ScrollTrigger: any
    let cleanup: (() => void) | null = null

    // Try to load GSAP ScrollTrigger
    const loadGSAP = async () => {
      try {
        const gsapModule = await import('gsap')
        const scrollTriggerModule = await import('gsap/ScrollTrigger')
        gsap = gsapModule.gsap
        ScrollTrigger = scrollTriggerModule.ScrollTrigger
        if (gsap && ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger)
        }

        // Use GSAP ScrollTrigger for smooth parallax
        const trigger = ScrollTrigger.create({
          trigger: elementRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self: any) => {
            if (elementRef.current) {
              const yPos = self.progress * 100 * speed + offset
              elementRef.current.style.transform = `translateY(${yPos}px)`
            }
          },
        })

        cleanup = () => {
          trigger.kill()
        }
      } catch (error) {
        // Fallback to native scroll
        console.warn('GSAP ScrollTrigger not available, using native scroll:', error)

        const handleScroll = () => {
          if (!elementRef.current) return

          const rect = elementRef.current.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const elementTop = rect.top
          const elementHeight = rect.height

          // Calculate scroll progress
          const scrollProgress =
            (windowHeight - elementTop) / (windowHeight + elementHeight)
          const clampedProgress = Math.max(0, Math.min(1, scrollProgress))

          // Apply parallax transform
          const yPos = clampedProgress * 100 * speed + offset
          elementRef.current.style.transform = `translateY(${yPos}px)`
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Initial calculation

        cleanup = () => {
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }

    loadGSAP()

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [enabled, speed, offset])

  return elementRef
}

/**
 * Create multiple parallax layers
 */
export function createParallaxLayers(
  elements: Array<{ ref: RefObject<HTMLElement>; speed: number }>
): () => void {
  let cleanup: (() => void)[] = []

  elements.forEach(({ ref, speed }) => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      const scrollProgress =
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress))

      const yPos = clampedProgress * 100 * speed
      element.style.transform = `translateY(${yPos}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    cleanup.push(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })

  return () => {
    cleanup.forEach((fn) => fn())
  }
}
