/**
 * Performance utilities for 3D rendering
 * Detects device capabilities and manages FPS monitoring
 */

export interface DeviceCapabilities {
  hasWebGL: boolean
  hasWebGL2: boolean
  isLowEndDevice: boolean
  isMobile: boolean
  maxTextureSize: number
  vendor: string
  renderer: string
  supportsShadows: boolean
  recommendedPixelRatio: number
}

let deviceCapabilities: DeviceCapabilities | null = null
let fpsMonitor: { current: number; lastTime: number; frameCount: number } | null = null

/**
 * Detect device capabilities
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  if (deviceCapabilities) {
    return deviceCapabilities
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  let hasWebGL = false
  let hasWebGL2 = false
  let maxTextureSize = 2048
  let vendor = ''
  let renderer = ''
  let supportsShadows = true

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null

    if (gl) {
      hasWebGL = true
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        vendor = (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string) || ''
        renderer = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) || ''
      }

      maxTextureSize = (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 2048

      // Check for shadow support
      supportsShadows = gl.getExtension('WEBGL_depth_texture') !== null && !isMobile
    }

    if (gl2) {
      hasWebGL2 = true
    }
  } catch (e) {
    console.warn('WebGL detection failed:', e)
  }

  // Detect low-end devices
  const hardwareConcurrency = navigator.hardwareConcurrency || 2
  const deviceMemory = (navigator as any).deviceMemory || 4
  const isLowEndDevice =
    isMobile ||
    hardwareConcurrency <= 2 ||
    deviceMemory <= 2 ||
    !hasWebGL2 ||
    maxTextureSize < 2048

  // Recommended pixel ratio (limit on mobile/low-end devices)
  const recommendedPixelRatio = isLowEndDevice
    ? Math.min(window.devicePixelRatio || 1, 1.5)
    : Math.min(window.devicePixelRatio || 1, 2)

  // Disable shadows on mobile/low-end devices
  if (isLowEndDevice || !supportsShadows) {
    supportsShadows = false
  }

  deviceCapabilities = {
    hasWebGL,
    hasWebGL2,
    isLowEndDevice,
    isMobile,
    maxTextureSize,
    vendor,
    renderer,
    supportsShadows,
    recommendedPixelRatio,
  }

  return deviceCapabilities
}

/**
 * Initialize FPS monitoring
 */
export function initFPSMonitor(targetFPS: number = 60): {
  getFPS: () => number
  reset: () => void
  checkPerformance: () => { fps: number; isStable: boolean }
} {
  if (fpsMonitor) {
    return {
      getFPS: () => fpsMonitor!.current,
      reset: () => {
        fpsMonitor!.current = 0
        fpsMonitor!.frameCount = 0
        fpsMonitor!.lastTime = performance.now()
      },
      checkPerformance: () => {
        const fps = fpsMonitor!.current
        return {
          fps,
          isStable: fps >= targetFPS * 0.8, // 80% of target FPS is considered stable
        }
      },
    }
  }

  fpsMonitor = {
    current: 60,
    lastTime: performance.now(),
    frameCount: 0,
  }

  let lastTime = performance.now()
  let frameCount = 0
  let fps = 60

  function updateFPS() {
    frameCount++
    const currentTime = performance.now()
    const delta = currentTime - lastTime

    if (delta >= 1000) {
      // Update every second
      fps = Math.round((frameCount * 1000) / delta)
      if (fpsMonitor) {
        fpsMonitor.current = fps
        fpsMonitor.frameCount = frameCount
        fpsMonitor.lastTime = currentTime
      }
      frameCount = 0
      lastTime = currentTime
    }

    requestAnimationFrame(updateFPS)
  }

  updateFPS()

  return {
    getFPS: () => (fpsMonitor ? fpsMonitor.current : 60),
    reset: () => {
      if (fpsMonitor) {
        fpsMonitor.current = 60
        fpsMonitor.frameCount = 0
        fpsMonitor.lastTime = performance.now()
      }
      frameCount = 0
      lastTime = performance.now()
    },
    checkPerformance: () => {
      const currentFPS = fpsMonitor ? fpsMonitor.current : 60
      return {
        fps: currentFPS,
        isStable: currentFPS >= targetFPS * 0.8,
      }
    },
  }
}

/**
 * Check if 3D should be disabled based on performance
 */
export function shouldDisable3D(
  currentFPS: number,
  minFPS: number = 30
): boolean {
  if (currentFPS < minFPS) {
    return true
  }

  const capabilities = detectDeviceCapabilities()
  return !capabilities.hasWebGL || capabilities.isLowEndDevice
}

/**
 * Get recommended 3D settings based on device capabilities
 */
export function getRecommended3DSettings(): {
  dpr: number[]
  shadows: boolean
  antialias: boolean
  pixelRatio: number
} {
  const capabilities = detectDeviceCapabilities()

  return {
    dpr: capabilities.isLowEndDevice ? [1, 1.5] : [1, 2],
    shadows: capabilities.supportsShadows && !capabilities.isLowEndDevice,
    antialias: !capabilities.isLowEndDevice,
    pixelRatio: capabilities.recommendedPixelRatio,
  }
}
