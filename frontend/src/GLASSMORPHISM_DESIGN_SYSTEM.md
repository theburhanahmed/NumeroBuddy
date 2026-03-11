
# Glassmorphism Design System - NumeroBuddy

## 🎨 Complete Style Guide for Platform-Wide Consistency

This document defines the glassmorphism design system used across all NumeroBuddy pages and components.

---

## 🌌 Core Visual Language

### **Theme: Cosmic Numerology**
The design reflects the mystical, cosmic nature of numerology through:
- **Deep space backgrounds** - Infinite cosmic possibilities
- **Glassmorphism cards** - Transparency and clarity
- **Planetary elements** - Cosmic forces and cycles
- **Animated stars** - Universal rhythm and energy
- **Gradient orbs** - Numerical vibrations

---

## 🎨 Color Palette

### **Base Colors:**
```css
--bg-primary: #0a1628;        /* Deep cosmic blue */
--bg-card: #1a2942;           /* Card background (40% opacity) */
--border-default: #06b6d4;    /* Cyan-500 (20% opacity) */
--border-hover: #06b6d4;      /* Cyan-500 (40% opacity) */
```

### **Gradient Colors:**
```css
/* Primary */
--gradient-cyan: from-cyan-400 to-blue-600
--gradient-blue: from-blue-500 to-cyan-600

/* Secondary */
--gradient-purple: from-purple-500 to-indigo-600
--gradient-pink: from-pink-500 to-rose-600

/* Accent */
--gradient-green: from-green-500 to-emerald-600
--gradient-amber: from-amber-500 to-orange-600
--gradient-red: from-red-500 to-rose-600
```

### **Text Colors:**
```css
--text-primary: rgba(255, 255, 255, 1)      /* White */
--text-secondary: rgba(255, 255, 255, 0.7)  /* White 70% */
--text-tertiary: rgba(255, 255, 255, 0.6)   /* White 60% */
--text-muted: rgba(255, 255, 255, 0.5)      /* White 50% */
```

---

## 📐 Layout System

### **Container Widths:**
```css
max-w-7xl   /* Main content (1280px) */
max-w-5xl   /* Medium content (1024px) */
max-w-4xl   /* Narrow content (896px) */
max-w-2xl   /* Text content (672px) */
```

### **Spacing Scale:**
```css
py-20       /* Section vertical padding (80px) */
py-12       /* Section vertical padding mobile (48px) */
px-8        /* Horizontal padding (32px) */
px-4        /* Horizontal padding mobile (16px) */

gap-8       /* Grid gap (32px) */
gap-6       /* Grid gap medium (24px) */
gap-4       /* Grid gap small (16px) */
```

### **Grid Layouts:**
```css
/* Features Grid */
grid md:grid-cols-2 lg:grid-cols-3 gap-8

/* Pricing Grid */
grid md:grid-cols-3 gap-8

/* Dashboard Stats */
grid grid-cols-2 lg:grid-cols-4 gap-6

/* Two Column */
grid lg:grid-cols-2 gap-8
```

---

## 🎴 Component Styles

### **Glassmorphism Cards:**
```tsx
className="
  p-8 
  rounded-3xl 
  bg-[#1a2942]/40 
  backdrop-blur-xl 
  border border-cyan-500/20 
  hover:border-cyan-500/40 
  transition-all
"
```

### **Buttons:**

**Primary Button:**
```tsx
className="
  px-8 py-3 
  rounded-full 
  bg-gradient-to-r from-cyan-500 to-blue-600 
  text-white font-semibold 
  shadow-lg shadow-cyan-500/30 
  hover:shadow-cyan-500/50 
  transition-all
"
```

**Secondary Button:**
```tsx
className="
  px-6 py-2 
  rounded-full 
  border border-cyan-400/30 
  bg-cyan-500/10 
  backdrop-blur-xl 
  text-white 
  hover:bg-cyan-500/20 
  transition-all
"
```

**Icon Button:**
```tsx
className="
  w-10 h-10 
  rounded-full 
  bg-[#1a2942]/40 
  backdrop-blur-xl 
  border border-cyan-500/20 
  flex items-center justify-center 
  text-white/60 
  hover:text-white 
  hover:border-cyan-500/40 
  transition-all
"
```

### **Gradient Icons:**
```tsx
className="
  w-16 h-16 
  rounded-2xl 
  bg-gradient-to-br from-cyan-400 to-blue-600 
  flex items-center justify-center 
  text-white 
  shadow-lg
"
```

### **Badges:**
```tsx
className="
  px-4 py-2 
  bg-gradient-to-r from-cyan-500/20 to-blue-600/20 
  border border-cyan-500/30 
  rounded-full 
  text-cyan-400 text-sm font-semibold 
  backdrop-blur-xl
"
```

---

## 📝 Typography

### **Font Families:**
```css
/* Headlines */
font-family: Georgia, 'Times New Roman', serif;
/* Use: font-serif */

/* Body Text */
font-family: Inter, system-ui, sans-serif;
/* Use: (default) */
```

### **Font Sizes:**
```css
/* Display */
text-7xl    /* 72px - Hero headlines */
text-6xl    /* 60px - Page headlines */
text-5xl    /* 48px - Section headlines */

/* Headings */
text-4xl    /* 36px - H1 */
text-3xl    /* 30px - H2 */
text-2xl    /* 24px - H3 */
text-xl     /* 20px - H4 */

/* Body */
text-lg     /* 18px - Large body */
text-base   /* 16px - Default body */
text-sm     /* 14px - Small text */
text-xs     /* 12px - Tiny text */
```

### **Font Weights:**
```css
font-bold       /* 700 - Headlines */
font-semibold   /* 600 - Subheadings */
font-normal     /* 400 - Body text */
```

---

## ✨ Animation System

### **Entrance Animations:**
```tsx
// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8 }}

// Fade in from left
initial={{ opacity: 0, x: -50 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8 }}

// Scale in
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5 }}
```

### **Stagger Delays:**
```tsx
// Cards in grid
transition={{ delay: index * 0.1 }}

// Sequential sections
transition={{ delay: 0.2 }} // Section 1
transition={{ delay: 0.4 }} // Section 2
transition={{ delay: 0.6 }} // Section 3
```

### **Hover Effects:**
```tsx
// Scale up
group-hover:scale-110 transition-transform

// Glow effect
opacity-0 group-hover:opacity-100 transition-opacity

// Border highlight
hover:border-cyan-500/40 transition-all
```

### **Continuous Animations:**
```tsx
// Planet rotation
animate={{ rotate: 360 }}
transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}

// Floating orb
animate={{ y: [0, -10, 0] }}
transition={{ duration: 2, repeat: Infinity }}

// Pulsing star
className="animate-pulse"
style={{ animationDelay: `${Math.random() * 3}s` }}
```

---

## 🌟 Reusable Components

### **GlassBackground**
```tsx
import { GlassBackground } from './components/GlassBackground'

<GlassBackground 
  starCount={100}
  showPlanet={true}
  showMountains={true}
  showSilhouettes={true}
/>
```

### **GlassNav**
```tsx
import { GlassNav } from './components/GlassNav'

<GlassNav 
  showLinks={true}
  ctaText="GET STARTED"
  ctaAction={() => navigate('/signup')}
/>
```

### **GlassPageLayout**
```tsx
import { GlassPageLayout } from './components/GlassPageLayout'

<GlassPageLayout 
  showNav={true}
  showPlanet={false}
  starCount={80}
>
  {/* Page content */}
</GlassPageLayout>
```

---

## 📱 Responsive Design

### **Breakpoints:**
```css
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large screens */
```

### **Mobile Patterns:**
```tsx
// Hide on mobile, show on desktop
className="hidden md:flex"

// Show on mobile, hide on desktop
className="md:hidden"

// Responsive grid
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Responsive text
className="text-4xl md:text-6xl"

// Responsive spacing
className="px-4 md:px-8 py-12 md:py-20"
```

---

## 🎯 Usage Examples

### **Page Header:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center mb-16"
>
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1 }}
    className="inline-block mb-6"
  >
    <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
      ✨ Badge Text
    </span>
  </motion.div>

  <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
    Main Headline
    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
      Gradient Subheadline
    </span>
  </h1>

  <p className="text-xl text-white/60 max-w-2xl mx-auto">
    Description text goes here
  </p>
</motion.div>
```

### **Feature Card:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  className="group relative"
>
  {/* Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

  {/* Card */}
  <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
    {/* Icon */}
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
      <SparklesIcon className="w-8 h-8" />
    </div>

    {/* Title */}
    <h3 className="text-2xl font-serif text-white mb-4">
      Feature Title
    </h3>

    {/* Description */}
    <p className="text-white/70 leading-relaxed">
      Feature description goes here
    </p>
  </div>
</motion.div>
```

---

## ♿ Accessibility

### **Color Contrast:**
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio for body text
- Minimum 3:1 contrast ratio for large text

### **Keyboard Navigation:**
- All interactive elements focusable
- Visible focus states
- Logical tab order

### **Screen Readers:**
- Semantic HTML structure
- ARIA labels on buttons
- Descriptive link text
- Alt text on images

---

## 🚀 Performance

### **Optimizations:**
- GPU-accelerated transforms
- CSS backdrop-filter (hardware accelerated)
- Framer Motion (optimized animations)
- Lazy loading for heavy components
- Minimal re-renders

### **Best Practices:**
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Debounce scroll events
- Memoize expensive calculations

---

## 📋 Checklist for New Pages

- [ ] Use GlassBackground component
- [ ] Use GlassNav component
- [ ] Apply glassmorphism card styles
- [ ] Use gradient icons
- [ ] Add entrance animations
- [ ] Implement hover effects
- [ ] Test responsive breakpoints
- [ ] Verify accessibility
- [ ] Check performance (60fps)
- [ ] Ensure color contrast

---

## 🎊 Summary

This glassmorphism design system provides:
- **Consistency** across all pages
- **Distinctive** cosmic aesthetic
- **Professional** polish
- **Accessible** for all users
- **Performant** 60fps animations
- **Responsive** mobile-first design

Use this guide to maintain design consistency as you build new features and pages!
