import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon } from
'lucide-react';
export function LandingFooter() {
  const navigate = useNavigate();
  const footerLinks = {
    product: [
    {
      label: 'How It Works',
      href: '/how-it-works'
    },
    {
      label: 'Features',
      href: '/features'
    },
    {
      label: 'AI Numerologist',
      href: '/ai-numerologist'
    },
    {
      label: 'Birth Chart Demo',
      href: '/birth-chart-demo'
    },
    {
      label: 'Pricing',
      href: '/pricing'
    }],

    resources: [
    {
      label: 'Blog',
      href: '/blog'
    },
    {
      label: 'Community',
      href: '/community'
    },
    {
      label: 'Consultants',
      href: '/consultants'
    },
    {
      label: 'Help Center',
      href: '/contact'
    }],

    company: [
    {
      label: 'About Us',
      href: '/about'
    },
    {
      label: 'Careers',
      href: '/careers'
    },
    {
      label: 'Contact',
      href: '/contact'
    }],

    legal: [
    {
      label: 'Terms of Service',
      href: '/terms'
    },
    {
      label: 'Privacy Policy',
      href: '/privacy'
    },
    {
      label: 'Cookie Policy',
      href: '/cookies'
    },
    {
      label: 'Disclaimer',
      href: '/disclaimer'
    }]

  };
  return (
    <footer className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 border-t border-cyan-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-['Playfair_Display'] text-white">
                NumerAI
              </span>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Discover your cosmic destiny with AI-powered numerology insights
            </p>
            <div className="flex gap-4">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-cyan-400 transition-colors"
                whileHover={{
                  scale: 1.1,
                  y: -2
                }}>

                <TwitterIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-cyan-400 transition-colors"
                whileHover={{
                  scale: 1.1,
                  y: -2
                }}>

                <FacebookIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-cyan-400 transition-colors"
                whileHover={{
                  scale: 1.1,
                  y: -2
                }}>

                <InstagramIcon className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-cyan-400 transition-colors"
                whileHover={{
                  scale: 1.1,
                  y: -2
                }}>

                <LinkedinIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) =>
              <li key={link.label}>
                  <button
                  onClick={() => navigate(link.href)}
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm">

                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) =>
              <li key={link.label}>
                  <button
                  onClick={() => navigate(link.href)}
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm">

                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) =>
              <li key={link.label}>
                  <button
                  onClick={() => navigate(link.href)}
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm">

                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) =>
              <li key={link.label}>
                  <button
                  onClick={() => navigate(link.href)}
                  className="text-white/70 hover:text-cyan-400 transition-colors text-sm">

                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyan-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm text-center sm:text-left">
            © 2024 NumerAI. All rights reserved.
          </p>
          <p className="text-white/60 text-sm text-center sm:text-right">
            Made with ✨ and cosmic energy
          </p>
        </div>
      </div>
    </footer>);

}