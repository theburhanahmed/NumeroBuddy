import type { Config } from "tailwindcss"
// Inline tokens so Tailwind config resolves when run from any cwd (frontend/ or monorepo root)
const tokens = {
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  containerWidths: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1400px', full: '100%' },
  colors: {
    space: { black: '#000000', navy: '#0a1628', blue: '#1a2942', cyan: '#00d4ff', cyanGlow: 'rgba(0, 212, 255, 0.5)', white: '#ffffff' },
  },
  spacing: { 0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px', 20: '80px', 24: '96px', 32: '128px', 40: '160px', 48: '192px', 64: '256px', section: { sm: '4rem', md: '5rem', lg: '6rem' }, card: { sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem' } },
  typography: {
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], serif: ['Playfair Display', 'serif'], mono: ['ui-monospace', 'monospace'] },
    fontSize: { xs: ['0.75rem', { lineHeight: '1rem' }], sm: ['0.875rem', { lineHeight: '1.25rem' }], base: ['1rem', { lineHeight: '1.5rem' }], lg: ['1.125rem', { lineHeight: '1.75rem' }], xl: ['1.25rem', { lineHeight: '1.75rem' }], '2xl': ['1.5rem', { lineHeight: '2rem' }], '3xl': ['1.875rem', { lineHeight: '2.25rem' }], '4xl': ['2.25rem', { lineHeight: '2.5rem' }], '5xl': ['3rem', { lineHeight: '1' }], '6xl': ['3.75rem', { lineHeight: '1' }], '7xl': ['4.5rem', { lineHeight: '1' }], '8xl': ['6rem', { lineHeight: '1' }], '9xl': ['8rem', { lineHeight: '1' }] },
    fontWeight: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800', black: '900' },
    lineHeight: { none: '1', tight: '1.25', snug: '1.375', normal: '1.5', relaxed: '1.625', loose: '2' },
    letterSpacing: { tighter: '-0.05em', tight: '-0.025em', normal: '0em', wide: '0.025em', wider: '0.05em', widest: '0.1em' },
  },
  shadows: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)', inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)', space: { card: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)', cardPremium: '0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 40px rgba(0, 212, 255, 0.1)', cardHover: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 212, 255, 0.2)', button: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.5)', buttonHover: '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3), 0 0 90px rgba(0, 212, 255, 0.2)' }, glass: { glow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)', glowHover: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 90px rgba(139, 92, 246, 0.2)' } },
  durations: { instant: '0.15s', fast: '0.3s', normal: '0.5s', slow: '0.8s', ambient: '8s' },
  easing: { linear: 'linear', easeIn: 'cubic-bezier(0.4, 0, 1, 1)', easeOut: 'cubic-bezier(0, 0, 0.2, 1)', easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  zIndex: { base: 0, dropdown: 1000, sticky: 1020, fixed: 1030, modalBackdrop: 1040, modal: 1050, popover: 1060, tooltip: 1070, notification: 1080 },
  backdropBlur: { none: '0', sm: '4px', DEFAULT: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '40px' },
}

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: tokens.breakpoints.sm,
        md: tokens.breakpoints.md,
        lg: tokens.breakpoints.lg,
        xl: tokens.breakpoints.xl,
        "2xl": tokens.containerWidths["2xl"],
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Space/Cosmic theme colors from design tokens
        space: {
          black: tokens.colors.space.black,
          navy: tokens.colors.space.navy,
          blue: tokens.colors.space.blue,
          cyan: tokens.colors.space.cyan,
          'cyan-glow': tokens.colors.space.cyanGlow,
          white: tokens.colors.space.white,
        },
        // 3D-specific colors for WebGL
        '3d': {
          glow: {
            cyan: 'rgba(0, 212, 255, 0.6)',
            purple: 'rgba(168, 85, 247, 0.6)',
            blue: 'rgba(59, 130, 246, 0.6)',
            pink: 'rgba(236, 72, 153, 0.6)',
            gold: 'rgba(245, 158, 11, 0.6)',
          },
          energy: {
            cyan: '#00d4ff',
            purple: '#a855f7',
            blue: '#3b82f6',
            pink: '#ec4899',
            gold: '#f59e0b',
          },
        },
      },
      spacing: {
        ...Object.fromEntries(
          Object.entries(tokens.spacing).map(([key, value]) => [key, value])
        ),
      } as Record<string, string>,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...tokens.typography.fontFamily.sans],
        serif: [...tokens.typography.fontFamily.serif],
        mono: [...tokens.typography.fontFamily.mono],
      },
      fontSize: {
        ...Object.fromEntries(
          Object.entries(tokens.typography.fontSize).map(([key, value]) => [
            key,
            Array.isArray(value) ? [...value] : [value],
          ])
        ),
      } as Record<string, string | [string, string] | [string, { lineHeight?: string; letterSpacing?: string; fontWeight?: string | number }]>,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      letterSpacing: tokens.typography.letterSpacing,
      boxShadow: {
        ...tokens.shadows,
      } as unknown as Record<string, string | string[]>,
      transitionDuration: {
        ...tokens.durations,
      },
      transitionTimingFunction: {
        ...tokens.easing,
      },
      zIndex: Object.fromEntries(
        Object.entries(tokens.zIndex).map(([k, v]) => [k, String(v)])
      ) as Record<string, string>,
      backdropBlur: {
        ...Object.fromEntries(
          Object.entries(tokens.backdropBlur).map(([key, value]) => [key, value])
        ),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.5)" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)" },
        },
        planetRotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "twinkle": "twinkle 3s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "orbit": "orbit var(--orbit-duration, 20s) linear infinite",
        "planet-rotate": "planetRotate 60s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config