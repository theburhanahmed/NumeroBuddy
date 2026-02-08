# Numerobuddy - AI-Powered Cosmic Numerology Platform

> Discover your cosmic destiny through ancient numerology wisdom combined with cutting-edge AI technology.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0.0-3178c6.svg)
![Tailwind](https://img.shields.io/badge/tailwind-3.3.0-38bdf8.svg)

## 🌌 Overview

Numerobuddy is a premium numerology platform that combines the ancient wisdom of numbers with modern AI technology. Our cosmic-themed interface provides users with personalized insights, daily readings, compatibility checks, and comprehensive birth chart analysis.

## ✨ Features

### Core Features
- 🤖 **AI Numerologist Chat** - 24/7 AI-powered numerology guidance
- 📊 **Birth Chart Analysis** - Complete numerological blueprint
- 📅 **Daily Readings** - Personalized cosmic guidance every day
- 💑 **Compatibility Checker** - Relationship insights based on numbers
- 🗺️ **Life Path Analysis** - Deep dive into your life's journey
- 💎 **Cosmic Remedies** - Personalized guidance for alignment

### Premium Features
- 📈 **Forecasts** - Future predictions and cosmic timing
- 👥 **Consultations** - Expert numerologist sessions
- 📝 **Custom Reports** - Detailed PDF downloads
- 🔮 **Advanced Tools** - Name, business, phone numerology

## 🎨 Design System

### Cosmic Theme
- **Primary Colors**: Cyan/Blue gradients (`#00d4ff` → `#2563eb`)
- **Accent Colors**: Purple, Pink, Green gradients
- **Typography**: Playfair Display (headings) + Inter (body)
- **Style**: Glassmorphism with cosmic space backgrounds

### Key Components
- `CosmicPageLayout` - Reusable page wrapper
- `SpaceCard` - Glassmorphism cards (premium & default)
- `TouchOptimizedButton` - Accessible 44px+ buttons
- `CrystalNumerologyCube` - 3D number visualization
- `CosmicTooltip` - Helpful contextual hints

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete documentation.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing

### Key Libraries
- `lucide-react` - Icon library
- `sonner` - Toast notifications
- `three.js` - 3D visualizations (via React Three Fiber)

### Performance
- Lazy loading with `React.Suspense`
- Intersection Observer for off-screen content
- Code splitting by route
- Optimized 3D components

## 📁 Project Structure

```
numerobuddy/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CosmicPageLayout.tsx
│   │   ├── SpaceCard.tsx
│   │   ├── TouchOptimizedButton.tsx
│   │   ├── CrystalNumerologyCube.tsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── NumerologyReport.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── AIChatContext.tsx
│   │   └── ...
│   ├── hooks/              # Custom hooks
│   │   ├── useReducedMotion.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── ...
│   ├── utils/              # Utility functions
│   └── App.tsx             # Root component
├── DESIGN_SYSTEM.md        # Design system docs
└── README.md               # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/numerobuddy.git

# Navigate to project
cd numerobuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://api.numerobuddy.com
VITE_OPENAI_API_KEY=your_openai_key
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px (`md:`)
- **Desktop**: 1024px+ (`lg:`)

### Mobile Optimizations
- 44px+ touch targets on all interactive elements
- Reduced particle counts for performance
- Simplified animations on low-end devices
- Touch-optimized swipeable cards

## ♿ Accessibility

### WCAG AA Compliance
- ✅ Semantic HTML structure
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators on all focusable elements
- ✅ Skip to content link
- ✅ Screen reader friendly
- ✅ Reduced motion support

### Components
- `<SkipToContent />` - Skip navigation
- `<FocusVisibleStyles />` - Global focus styles
- Proper heading hierarchy (h1 → h2 → h3)

## 🎭 Animation Philosophy

### Principles
- **Purpose-driven**: Every animation serves a function
- **Smooth & Natural**: Spring animations for organic feel
- **Staggered Entrance**: Sequential reveals for hierarchy
- **Hover on Actionable Only**: No hover on static content

### Common Patterns
```tsx
// Entrance animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}

// Hover (buttons/cards only)
whileHover={{ y: -4, scale: 1.02 }}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to production
npm run deploy
```

## 🔐 Security

- All user data encrypted at rest and in transit
- JWT-based authentication
- HTTPS only in production
- Regular security audits
- GDPR compliant

## 📊 Performance Metrics

### Current Benchmarks
- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Cumulative Layout Shift**: < 0.1

### Optimizations
- Code splitting by route
- Lazy loading for heavy components
- Image optimization with WebP
- CDN for static assets

## 🗺️ Roadmap

### Q1 2024
- [x] Core numerology features
- [x] AI chat integration
- [x] Cosmic design system
- [ ] Mobile app (React Native)

### Q2 2024
- [ ] Voice-guided readings
- [ ] Real-time collaboration
- [ ] Advanced 3D visualizations
- [ ] Custom theme builder

### Q3 2024
- [ ] API for third-party integrations
- [ ] White-label solutions
- [ ] Enterprise features
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 👥 Team

- **Design Lead** - Cosmic UX/UI
- **Tech Lead** - React/TypeScript architecture
- **AI Engineer** - Numerology AI integration
- **Numerology Expert** - Content & accuracy

## 📞 Support

- **Email**: support@numerobuddy.com
- **Discord**: [Join our community](https://discord.gg/numerobuddy)
- **Documentation**: [docs.numerobuddy.com](https://docs.numerobuddy.com)
- **Status**: [status.numerobuddy.com](https://status.numerobuddy.com)

## 🙏 Acknowledgments

- Ancient numerology wisdom from various traditions
- OpenAI for AI capabilities
- React community for amazing tools
- Our users for valuable feedback

---

**Made with ✨ and 🌌 by the Numerobuddy team**

**Version**: 1.0.0 | **Last Updated**: December 2024
