/**
 * Hook to monitor 3D performance and disable 3D on low-end devices
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import {
  detectDeviceCapabilities,
  initFPSMonitor,
  shouldDisable3D,
  getRecommended3DSettings,
  type DeviceCapabilities,
} from '@/lib/3d/performance'
import { useReducedMotion } from './use-reduced-motion'

export interface Use3DPerformanceReturn {
  capabilities: DeviceCapabilities
  shouldRender3D: boolean
  settings: ReturnType<typeof getRecommended3DSettings>
  fps: number
  isPerformanceStable: boolean
  disable3D: () => void
  enable3D: () => void
}

export function use3DPerformance(
  minFPS: number = 30,
  autoDisable: boolean = true
): Use3DPerformanceReturn {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null)
  const [shouldRender3D, setShouldRender3D] = useState(true)
  const [fps, setFPS] = useState(60)
  const [isPerformanceStable, setIsPerformanceStable] = useState(true)
  const fpsMonitorRef = useRef<ReturnType<typeof initFPSMonitor> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // Detect device capabilities on mount
  useEffect(() => {
    const caps = detectDeviceCapabilities()
    setCapabilities(caps)

    // Initialize FPS monitoring if WebGL is available
    if (caps.hasWebGL) {
      fpsMonitorRef.current = initFPSMonitor(60)
      
      // Monitor FPS periodically
      const interval = setInterval(() => {
        if (fpsMonitorRef.current) {
          const currentFPS = fpsMonitorRef.current.getFPS()
          const performance = fpsMonitorRef.current.checkPerformance()
          
          setFPS(currentFPS)
          setIsPerformanceStable(performance.isStable)

          // Auto-disable 3D if performance is poor
          if (autoDisable && shouldDisable3D(currentFPS, minFPS)) {
            setShouldRender3D(false)
          }
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    } else {
      // No WebGL support, disable 3D
      setShouldRender3D(false)
    }
  }, [autoDisable, minFPS])

  // Disable 3D if user prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldRender3D(false)
    }
  }, [prefersReducedMotion])

  const disable3D = useCallback(() => {
    setShouldRender3D(false)
  }, [])

  const enable3D = useCallback(() => {
    if (capabilities?.hasWebGL && !prefersReducedMotion) {
      setShouldRender3D(true)
    }
  }, [capabilities, prefersReducedMotion])

  const settings = capabilities
    ? getRecommended3DSettings()
    : {
        dpr: [1, 1.5],
        shadows: false,
        antialias: false,
        pixelRatio: 1,
      }

  return {
    capabilities: capabilities || {
      hasWebGL: false,
      hasWebGL2: false,
      isLowEndDevice: true,
      isMobile: false,
      maxTextureSize: 2048,
      vendor: '',
      renderer: '',
      supportsShadows: false,
      recommendedPixelRatio: 1,
    },
    shouldRender3D: shouldRender3D && !prefersReducedMotion,
    settings,
    fps,
    isPerformanceStable,
    disable3D,
    enable3D,
  }
}
