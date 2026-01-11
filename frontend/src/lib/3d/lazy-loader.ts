/**
 * Lazy loading utilities for 3D scenes
 * Handles dynamic imports and intersection observer-based loading
 */

import { useEffect, useRef, useState, RefObject } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

export interface LazyLoad3DOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

/**
 * Hook to lazy load 3D components when they enter the viewport
 */
export function useLazyLoad3D<T extends HTMLElement = HTMLDivElement>(
  options: LazyLoad3DOptions = {}
): [RefObject<T>, boolean, boolean] {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options

  // Use intersection observer with ref
  const elementRef = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.current)

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
      observer.disconnect()
    }
  }, [enabled, threshold, rootMargin])

  const ref = elementRef as RefObject<T>

  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (enabled && isVisible && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [enabled, isVisible, shouldLoad])

  return [ref, isVisible, shouldLoad]
}

/**
 * Dynamically import a 3D component
 */
export async function load3DComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  try {
    const module = await importFn()
    return module.default
  } catch (error) {
    console.error('Failed to load 3D component:', error)
    throw error
  }
}

/**
 * Preload 3D component for faster rendering
 */
export function preload3DComponent(
  importFn: () => Promise<any>
): Promise<void> {
  return new Promise((resolve, reject) => {
    importFn()
      .then(() => resolve())
      .catch(reject)
  })
}

/**
 * Lazy load multiple 3D components with priority
 */
export async function load3DComponentsWithPriority<T>(
  components: Array<{
    name: string
    importFn: () => Promise<{ default: T }>
    priority: number
  }>
): Promise<Map<string, T>> {
  // Sort by priority (higher priority first)
  const sorted = [...components].sort((a, b) => b.priority - a.priority)

  const loaded = new Map<string, T>()

  // Load components sequentially based on priority
  for (const component of sorted) {
    try {
      const module = await component.importFn()
      loaded.set(component.name, module.default)
    } catch (error) {
      console.error(`Failed to load component ${component.name}:`, error)
    }
  }

  return loaded
}

/**
 * Check if component should be loaded based on viewport visibility
 */
export function shouldLoadComponent(
  isVisible: boolean,
  hasLoaded: boolean,
  enabled: boolean = true
): boolean {
  return enabled && isVisible && !hasLoaded
}
