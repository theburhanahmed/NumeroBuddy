/**
 * Glow Shader for Numbers and Orbs
 * Creates a glowing effect around 3D objects
 */

export const glowVertexShader = `
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

export const glowFragmentShader = `
  uniform float time;
  uniform float glowIntensity;
  uniform vec3 color;
  uniform vec3 glowColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    // Fresnel effect for edge glow
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 2.0);
    
    // Pulsing glow based on time
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    float glow = fresnel * glowIntensity * (1.0 + pulse * 0.5);
    
    // Combine base color with glow
    vec3 finalColor = mix(color, glowColor, glow);
    float alpha = 0.8 + glow * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

/**
 * Create glow shader material
 */
export function createGlowMaterial(
  color: string = '#00d4ff',
  glowColor: string = '#ffffff',
  glowIntensity: number = 1.5
) {
  return {
    uniforms: {
      time: { value: 0 },
      glowIntensity: { value: glowIntensity },
      color: { value: { r: 0, g: 0.831, b: 1 } }, // #00d4ff in RGB
      glowColor: { value: { r: 1, g: 1, b: 1 } }, // White glow
    },
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
  }
}
