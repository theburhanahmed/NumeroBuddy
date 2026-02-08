# Interactive Particle Background - Complete Guide

## 🌟 Overview

A fully interactive, customizable particle background component that creates a mesmerizing visual experience with mouse-reactive glowing particles and dynamic gravity effects.

---

## ✨ Features

### **Core Capabilities:**
- 🎯 **Mouse-Reactive** - Particles respond to cursor movement with gravity effects
- 💫 **Glowing Effects** - Dynamic glow intensity based on proximity to cursor
- 🔗 **Particle Connections** - Lines drawn between nearby particles
- 🎨 **Fully Customizable** - Control count, color, glow, gravity, and radius
- ♿ **Accessible** - Respects `prefers-reduced-motion` preference
- 📱 **Performance Optimized** - Efficient canvas rendering with RAF
- 🎭 **Smooth Animations** - Natural particle movement with physics

---

## 🚀 Quick Start

### **Basic Usage:**

```tsx
import { InteractiveParticleBackground } from './components/InteractiveParticleBackground'

function App() {
  return (
    <div className="relative min-h-screen">
      <InteractiveParticleBackground />
      
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  )
}
```

---

## 🎛️ Props & Configuration

### **Component Props:**

```tsx
interface InteractiveParticleBackgroundProps {
  particleCount?: number      // Number of particles (default: 100)
  particleColor?: string       // Hex color (default: '#22D3EE')
  glowIntensity?: number       // 0-1 (default: 0.8)
  gravityStrength?: number     // 0-1 (default: 0.5)
  mouseRadius?: number         // Pixels (default: 150)
  className?: string           // Additional CSS classes
}
```

### **Prop Details:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `particleCount` | number | 100 | Total number of particles (20-300 recommended) |
| `particleColor` | string | '#22D3EE' | Hex color code for particles and glow |
| `glowIntensity` | number | 0.8 | Glow brightness near cursor (0-1) |
| `gravityStrength` | number | 0.5 | Attraction force to cursor (0-1) |
| `mouseRadius` | number | 150 | Radius of mouse interaction area (px) |
| `className` | string | '' | Additional Tailwind classes |

---

## 🎨 Preset Configurations

### **Cosmic (Default):**
```tsx
<InteractiveParticleBackground
  particleColor="#22D3EE"
  particleCount={100}
  glowIntensity={0.8}
  gravityStrength={0.5}
  mouseRadius={150}
/>
```

### **Aurora:**
```tsx
<InteractiveParticleBackground
  particleColor="#A855F7"
  particleCount={150}
  glowIntensity={1.0}
  gravityStrength={0.3}
  mouseRadius={200}
/>
```

### **Fire:**
```tsx
<InteractiveParticleBackground
  particleColor="#F97316"
  particleCount={200}
  glowIntensity={0.9}
  gravityStrength={0.7}
  mouseRadius={120}
/>
```

### **Ocean:**
```tsx
<InteractiveParticleBackground
  particleColor="#06B6D4"
  particleCount={80}
  glowIntensity={0.6}
  gravityStrength={0.4}
  mouseRadius={180}
/>
```

---

## 🎯 Use Cases

### **1. Landing Pages**
```tsx
function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <InteractiveParticleBackground
        particleColor="#22D3EE"
        particleCount={120}
      />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold text-white">Welcome</h1>
      </div>
    </div>
  )
}
```

### **2. Hero Sections**
```tsx
function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      <InteractiveParticleBackground
        particleColor="#A855F7"
        glowIntensity={1.0}
        mouseRadius={200}
      />
      
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">
            Interactive Experience
          </h1>
          <p className="text-xl text-white/80">
            Move your mouse to interact with the particles
          </p>
        </div>
      </div>
    </section>
  )
}
```

### **3. Full-Page Backgrounds**
```tsx
function App() {
  return (
    <>
      <InteractiveParticleBackground className="fixed inset-0" />
      
      <div className="relative z-10">
        <Navbar />
        <Routes>
          {/* Your routes */}
        </Routes>
        <Footer />
      </div>
    </>
  )
}
```

---

## 🎨 Color Palette Suggestions

### **Brand Colors:**
```tsx
// Cyan (Tech/Modern)
particleColor="#22D3EE"

// Purple (Creative/Mystical)
particleColor="#A855F7"

// Orange (Energy/Fire)
particleColor="#F97316"

// Blue (Ocean/Trust)
particleColor="#06B6D4"

// Green (Nature/Growth)
particleColor="#10B981"

// Pink (Love/Playful)
particleColor="#EC4899"
```

---

## ⚡ Performance Optimization

### **Particle Count Guidelines:**

| Device | Recommended Count | Performance |
|--------|------------------|-------------|
| Mobile | 50-80 | Good |
| Tablet | 80-120 | Good |
| Desktop | 100-200 | Excellent |
| High-end | 200-300 | Excellent |

### **Optimization Tips:**

1. **Reduce particle count on mobile:**
```tsx
const isMobile = window.innerWidth < 768
const count = isMobile ? 60 : 120

<InteractiveParticleBackground particleCount={count} />
```

2. **Disable on low-end devices:**
```tsx
const isLowEnd = navigator.hardwareConcurrency <= 2

{!isLowEnd && <InteractiveParticleBackground />}
```

3. **Use `useReducedMotion` hook:**
```tsx
// Component automatically respects prefers-reduced-motion
// Shows static gradient fallback when motion is reduced
```

---

## ♿ Accessibility

### **Built-in Features:**

✅ **Reduced Motion Support**
- Automatically detects `prefers-reduced-motion`
- Shows static gradient fallback
- No animations for users who prefer reduced motion

✅ **Semantic HTML**
- Canvas has `aria-hidden="true"`
- Doesn't interfere with screen readers
- Content remains accessible

✅ **Performance**
- Efficient rendering
- No layout shifts
- Doesn't block main thread

---

## 🎭 Animation Details

### **Particle Behavior:**

1. **Movement:**
   - Random initial velocity
   - Friction applied (0.99x per frame)
   - Wrap-around at boundaries

2. **Mouse Interaction:**
   - Gravity force based on distance
   - Stronger pull when closer
   - Smooth acceleration

3. **Lifecycle:**
   - Particles fade over time
   - Respawn when life reaches 0
   - Opacity based on remaining life

4. **Visual Effects:**
   - Radial gradient glow
   - Proximity-based brightness
   - Connection lines between nearby particles

---

## 🔧 Advanced Customization

### **Custom Particle Logic:**

To modify particle behavior, edit the `InteractiveParticleBackground.tsx` component:

```tsx
// Adjust friction (line ~120)
particle.vx *= 0.99  // Lower = more friction

// Adjust gravity force (line ~105)
const force = (1 - distance / mouseRadius) * gravityStrength * 0.1

// Adjust connection distance (line ~165)
if (distance < 100)  // Increase for more connections
```

### **Custom Colors:**

```tsx
// Multiple color particles
const colors = ['#22D3EE', '#A855F7', '#F97316']
const randomColor = colors[Math.floor(Math.random() * colors.length)]
```

---

## 📱 Responsive Design

### **Mobile Considerations:**

```tsx
import { useMediaQuery } from '../hooks/useMediaQuery'

function ResponsiveParticles() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <InteractiveParticleBackground
      particleCount={isMobile ? 60 : 120}
      mouseRadius={isMobile ? 100 : 150}
      glowIntensity={isMobile ? 0.6 : 0.8}
    />
  )
}
```

---

## 🎯 Best Practices

### **DO:**
✅ Use as background for hero sections
✅ Adjust particle count based on device
✅ Choose colors that match your brand
✅ Test on different screen sizes
✅ Respect user motion preferences
✅ Keep content above particles (z-index)

### **DON'T:**
❌ Use too many particles (>300)
❌ Ignore reduced motion preferences
❌ Place critical content behind particles
❌ Use on every page (performance)
❌ Forget to test on mobile
❌ Use conflicting colors

---

## 🐛 Troubleshooting

### **Issue: Particles not visible**
**Solution:** Ensure content has `position: relative` and `z-index: 10`

### **Issue: Poor performance**
**Solution:** Reduce `particleCount` or disable on mobile

### **Issue: Particles don't react to mouse**
**Solution:** Check that canvas is not covered by other elements

### **Issue: Colors look wrong**
**Solution:** Use hex color format: `#RRGGBB`

---

## 📊 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Excellent performance |
| Firefox | ✅ Full | Excellent performance |
| Safari | ✅ Full | Good performance |
| Edge | ✅ Full | Excellent performance |
| Mobile Safari | ✅ Full | Reduce particle count |
| Mobile Chrome | ✅ Full | Reduce particle count |

---

## 🎓 Examples

### **Example 1: Themed Sections**
```tsx
function ThemedSections() {
  return (
    <>
      <section className="relative h-screen">
        <InteractiveParticleBackground
          particleColor="#22D3EE"
          particleCount={100}
        />
        <div className="relative z-10">Section 1</div>
      </section>
      
      <section className="relative h-screen">
        <InteractiveParticleBackground
          particleColor="#A855F7"
          particleCount={150}
        />
        <div className="relative z-10">Section 2</div>
      </section>
    </>
  )
}
```

### **Example 2: Dynamic Control**
```tsx
function DynamicParticles() {
  const [intensity, setIntensity] = useState(0.8)
  
  return (
    <>
      <InteractiveParticleBackground
        glowIntensity={intensity}
      />
      
      <div className="relative z-10">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </div>
    </>
  )
}
```

---

## 📞 Support

For questions or issues:
- Component: `components/InteractiveParticleBackground.tsx`
- Demo: `pages/ParticleDemo.tsx`
- Design System: `DESIGN_SYSTEM_DETAILED.md`

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Created by:** Numerobuddy Design Team
