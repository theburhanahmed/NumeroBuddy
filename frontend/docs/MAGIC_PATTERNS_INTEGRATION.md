# Magic Patterns Design Integration

This document explains how to integrate designs from [Magic Patterns](https://www.magicpatterns.com) into the NumerAI frontend.

## Full Copy Integration Complete ✓

A **full design copy** from the Magic Patterns export (`magic-patterns-export.zip`) has been integrated:

- **Design system** – Export CSS variables (space colors, spacing, typography `.text-h1`–`.text-body`, `.font-display`/`.font-body`), glass and neon utilities merged into `app/globals.css`.
- **Layout & shell** – `LandingNav` and `LandingFooter` replaced with export design (Product dropdown, 5-column footer, NumerAI routes). Root layout unchanged; landing pages use `AccessibleSpaceBackground` + nav + content + footer.
- **Core UI** – `GlassCard` and `GlassButton` retained; **CosmicButton** added at `@/components/glassmorphism/cosmic-button` (primary/secondary/ghost, ripple, shimmer). **ConstellationConnections** and **LiveTrustSignals** added under `@/components/landing/`.
- **Home page** – Rebuilt to match export: hero (headline + planet visualization), LiveStatsCounter, TrustBadges, HowItWorksPreview, InteractiveDemo, features grid with ConstellationConnections + GlassCard, VideoExplainer, CaseStudies, Testimonials, pricing (GlassCard + CosmicButton), BlogPreview, FAQSection, NewsletterSignup, LandingFooter.
- **Other pages** – About and Contact updated to export layout (mission/vision, values, timeline, CTA on About; 4 contact info cards + form on Contact). Nav/footer links point to NumerAI routes (`/subscription`, `/terms-of-service`, `/privacy-policy`, `/cookie-policy`, `/disclaimer`, `/forum`, `/consultations`, etc.).

**Export path:** `frontend/magic-patterns-export/` (extracted from `frontend/magic-patterns-export.zip`).

## Your Design Link

**Design URL:** https://www.magicpatterns.com/c/omgujsqex3rs7vewupgrsr

To add future designs:

## Step 1: Export the Code

1. **Log in** to [Magic Patterns](https://www.magicpatterns.com)
2. **Open your design** using the link above
3. **Export the code** using one of these methods:
   - **Download Code:** Click the Export button (top right) → Download as `.zip`
   - **GitHub Sync:** Connect your repo for two-way sync (Settings → Integrations)

## Step 2: Extract & Place Components

1. Extract the downloaded `.zip` (if using Download)
2. Place components in the appropriate directories:
   - **Page layouts** → `src/components/layout/` or `src/components/cosmic/`
   - **UI components** → `src/components/ui/` or feature-specific folders
   - **Shared design system** → `src/design-system/` (align with `tokens.ts`)

## Step 3: Align with Design Tokens

Our design system uses centralized tokens in `src/design-system/tokens.ts`. When integrating Magic Patterns components:

| Magic Patterns | Use Our Token |
|----------------|---------------|
| Colors | `tokens.colors` – primary `#8b5cf6`, space theme `#00d4ff` cyan |
| Spacing | `tokens.spacing` – 4px base unit |
| Typography | `tokens.typography` – Inter (sans), Playfair Display (serif) |
| Shadows | `tokens.shadows.space` for cosmic cards |
| Border radius | `tokens.borderRadius` – `rounded-3xl` for cards |

**Tailwind classes** in our theme:
- `bg-space-navy`, `text-space-cyan` for cosmic palette
- `liquid-glass`, `glass-card` for glassmorphism
- `from-blue-50 via-purple-50 to-pink-50` for gradients

## Step 4: Performance Checklist

- Use `next/dynamic` for heavy components (3D, charts)
- Add `'use client'` only where needed (interactivity, hooks)
- Prefer direct imports: `@/components/glassmorphism/glass-card` over barrel imports
- Lazy-load below-the-fold content

## Canonical Component Paths (Post-Consolidation)

Use these paths to avoid duplicates:

- **GlassCard** → `@/components/glassmorphism/glass-card`
- **GlassButton** → `@/components/glassmorphism/glass-button`
- **CosmicButton** → `@/components/glassmorphism/cosmic-button`
- **ConstellationConnections** → `@/components/landing/constellation-connections`
- **LiveTrustSignals** → `@/components/landing/live-trust-signals`
- **FloatingOrbs** → `@/components/effects/floating-orbs`
- **AmbientParticles** → `@/components/effects/ambient-particles`
- **LoadingSpinner** → `@/components/loading/loading-spinner`
- **PageLayout** → `@/components/layout/page-layout` (with nav) or `@/components/ui/page-layout` (effects only)
- **CosmicPageLayout** → `@/components/cosmic/cosmic-page-layout`
