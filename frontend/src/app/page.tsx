'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  StarIcon, 
  HeartIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  MoonIcon, 
  SunIcon, 
  MenuIcon, 
  XIcon, 
  ChevronDownIcon, 
  BookOpenIcon, 
  FileTextIcon, 
  HelpCircleIcon, 
  PlusIcon, 
  MinusIcon 
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';

export default function Home() {
  const router = useRouter();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      {/* Enhanced Glassmorphic Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 z-50 border-b border-white/20 dark:border-gray-700/30 shadow-lg"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NumerAI
            </span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('blog')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Blog
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('footer')} 
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Terms & Privacy
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button 
              onClick={toggleTheme}
              className="p-2.5 sm:p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-md"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <MoonIcon className="w-5 h-5 text-gray-700" /> : 
                <SunIcon className="w-5 h-5 text-yellow-400" />
              }
            </motion.button>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <GlassButton variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Login
              </GlassButton>
              <GlassButton variant="primary" size="sm" onClick={() => router.push('/register')}>
                Sign Up
              </GlassButton>
            </div>
            
            {/* Mobile Menu Toggle */}
            <motion.button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? 
                <XIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : 
                <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              }
            </motion.button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/20 dark:border-gray-700/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-3">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Blog
                </button>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 transition-colors font-medium"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => scrollToSection('footer')} 
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 transition-colors font-medium"
                >
                  Terms & Privacy
                </button>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                  <GlassButton 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </GlassButton>
                  <GlassButton 
                    variant="primary" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            Discover Your Personalized Numerology Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock the secrets of your life path, destiny, and daily guidance
            through the ancient wisdom of numerology powered by AI
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlassButton 
              variant="primary" 
              size="lg" 
              onClick={() => router.push('/dashboard')}
              icon={<SparklesIcon className="w-5 h-5" />}
            >
              Get Started Free
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              View Sample Report
            </GlassButton>
          </motion.div>
          
          {/* Preview Cards */}
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeaturePreviewCard 
              icon={<StarIcon className="w-6 h-6" />} 
              title="Life Path Analysis" 
              description="Understand your core purpose and life direction" 
              delay={0.5} 
            />
            <FeaturePreviewCard 
              icon={<SparklesIcon className="w-6 h-6" />} 
              title="Daily Readings" 
              description="Personalized guidance for each day" 
              delay={0.6} 
            />
            <FeaturePreviewCard 
              icon={<HeartIcon className="w-6 h-6" />} 
              title="Compatibility" 
              description="Check relationship and business compatibility" 
              delay={0.7} 
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for your numerology journey
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard 
              icon={<SparklesIcon className="w-8 h-8" />} 
              title="AI Numerologist" 
              description="Chat with our AI-powered numerologist for instant insights and guidance" 
              delay={0.2} 
            />
            <FeatureCard 
              icon={<TrendingUpIcon className="w-8 h-8" />} 
              title="Personalized Remedies" 
              description="Get custom recommendations for gemstones, colors, and rituals" 
              delay={0.3} 
            />
            <FeatureCard 
              icon={<UsersIcon className="w-8 h-8" />} 
              title="Expert Consultations" 
              description="Book sessions with professional numerologists" 
              delay={0.4} 
            />
            <FeatureCard 
              icon={<HeartIcon className="w-8 h-8" />} 
              title="Compatibility Checker" 
              description="Analyze relationships and business partnerships" 
              delay={0.5} 
            />
            <FeatureCard 
              icon={<StarIcon className="w-8 h-8" />} 
              title="Birth Chart" 
              description="Detailed visualization of your numerology profile" 
              delay={0.6} 
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="w-8 h-8" />} 
              title="Daily Insights" 
              description="Receive personalized readings and affirmations" 
              delay={0.7} 
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Join thousands of satisfied users
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <TestimonialCard 
              name="Sarah Johnson" 
              text="NumerAI helped me understand my life path and make better decisions. The daily readings are incredibly accurate!" 
              rating={5} 
              delay={0.2} 
            />
            <TestimonialCard 
              name="Michael Chen" 
              text="The AI numerologist is amazing! It's like having a personal guide available 24/7. Highly recommend!" 
              rating={5} 
              delay={0.3} 
            />
            <TestimonialCard 
              name="Emma Davis" 
              text="I was skeptical at first, but the compatibility checker was spot-on. It saved my business partnership!" 
              rating={5} 
              delay={0.4} 
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Explore numerology wisdom and guidance
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <BlogCard 
              title="Understanding Your Life Path Number" 
              excerpt="Discover how your life path number reveals your true purpose and destiny in this comprehensive guide." 
              date="March 15, 2024" 
              readTime="5 min read" 
              delay={0.2} 
            />
            <BlogCard 
              title="The Power of Master Numbers" 
              excerpt="Learn about the significance of master numbers 11, 22, and 33 in numerology and their spiritual meaning." 
              date="March 12, 2024" 
              readTime="7 min read" 
              delay={0.3} 
            />
            <BlogCard 
              title="Numerology in Daily Life" 
              excerpt="Practical ways to apply numerology insights to improve your relationships, career, and personal growth." 
              date="March 10, 2024" 
              readTime="6 min read" 
              delay={0.4} 
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about NumerAI
            </p>
          </motion.div>
          <div className="space-y-4">
            <FAQItem 
              question="What is numerology?" 
              answer="Numerology is the ancient practice of understanding the mystical relationship between numbers and life events. It helps reveal insights about your personality, life path, and destiny through the analysis of numbers derived from your birth date and name." 
              delay={0.1} 
            />
            <FAQItem 
              question="How accurate is NumerAI?" 
              answer="NumerAI combines traditional numerology wisdom with advanced AI technology to provide highly personalized and accurate readings. Our AI is trained on thousands of numerology texts and real-world cases to deliver insights that resonate with your unique journey." 
              delay={0.2} 
            />
            <FAQItem 
              question="Is my data secure?" 
              answer="Absolutely. We take your privacy seriously and use industry-standard encryption to protect your personal information. Your birth details and readings are stored securely and never shared with third parties." 
              delay={0.3} 
            />
            <FAQItem 
              question="Can I try NumerAI for free?" 
              answer="Yes! We offer a free tier that includes basic numerology readings and limited AI chat access. You can upgrade to our premium plans anytime to unlock advanced features like detailed reports, compatibility analysis, and unlimited AI consultations." 
              delay={0.4} 
            />
            <FAQItem 
              question="What makes NumerAI different from other numerology apps?" 
              answer="NumerAI is the first platform to combine traditional numerology with AI-powered insights. Our intelligent system learns from your interactions to provide increasingly personalized guidance, making it like having a personal numerologist available 24/7." 
              delay={0.5} 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard variant="elevated" className="p-8 sm:p-12 text-center bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Discover Your Path?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of users who have found clarity and direction
              through numerology
            </p>
            <GlassButton 
              variant="secondary" 
              size="lg" 
              onClick={() => router.push('/dashboard')}
            >
              Start Your Journey Today
            </GlassButton>
          </GlassCard>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer id="footer" className="py-12 sm:py-16 px-4 sm:px-6 backdrop-blur-xl bg-gray-900/90 dark:bg-gray-950/90 text-white border-t border-white/10 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold">NumerAI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Discover your personalized numerology insights with AI-powered
                wisdom
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reports
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('faq')} 
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')} 
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 NumerAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturePreviewCard({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard variant="elevated" className="p-6 text-center h-full">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard variant="default" className="p-6 h-full">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function TestimonialCard({
  name,
  text,
  rating,
  delay
}: {
  name: string;
  text: string;
  rating: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard variant="elevated" className="p-6 h-full flex flex-col">
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed flex-grow">
          &quot;{text}&quot;
        </p>
        <p className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {name}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  delay
}: {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <GlassCard variant="default" className="p-6 h-full flex flex-col cursor-pointer group">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
          <BookOpenIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>{date}</span>
          <span>{readTime}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FAQItem({
  question,
  answer,
  delay
}: {
  question: string;
  answer: string;
  delay: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <GlassCard variant="default" className="overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-purple-500/5 transition-colors"
          aria-expanded={isOpen}
        >
          <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
            {question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            {isOpen ? (
              <MinusIcon className="w-5 h-5 text-purple-600" />
            ) : (
              <PlusIcon className="w-5 h-5 text-purple-600" />
            )}
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}