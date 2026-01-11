/**
 * Orb Shader for Pulsing Animation
 * Creates a pulsing orb effect for Life Path Numbers
 */

export const orbVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const orbFragmentShader = `
  uniform float time;
  uniform float pulseSpeed;
  uniform float pulseIntensity;
  uniform vec3 baseColor;
  uniform vec3 pulseColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    // Fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 1.5);
    
    // Pulsing effect
    float pulse = sin(time * pulseSpeed) * 0.5 + 0.5;
    float pulseGlow = pulse * pulseIntensity;
    
    // Combine base color with pulse
    vec3 finalColor = mix(baseColor, pulseColor, pulseGlow * fresnel);
    
    // Edge glow
    float edgeGlow = fresnel * (1.0 + pulseGlow);
    vec3 glowColor = mix(finalColor, pulseColor, edgeGlow * 0.5);
    
    float alpha = 0.9 + pulseGlow * 0.1;
    
    gl_FragColor = vec4(glowColor, alpha);
  }
`

/**
 * Create orb shader material
 */
export function createOrbMaterial(
  baseColor: string = '#4a9eff',
  pulseColor: string = '#00d4ff',
  pulseSpeed: number = 1.5,
  pulseIntensity: number = 0.5
) {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0.29, g: 0.62, b: 1.0 } // Default #4a9eff
  }

  const base = hexToRgb(baseColor)
  const pulse = hexToRgb(pulseColor)

  return {
    uniforms: {
      time: { value: 0 },
      pulseSpeed: { value: pulseSpeed },
      pulseIntensity: { value: pulseIntensity },
      baseColor: { value: base },
      pulseColor: { value: pulse },
    },
    vertexShader: orbVertexShader,
    fragmentShader: orbFragmentShader,
  }
}
