'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from 'lucide-react';

export function LandingFooter() {
  const router = useRouter();
  
  const scrollToSection = (id: string) => {
    router.push('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 backdrop-blur-xl bg-gray-900/90 dark:bg-gray-950/90 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">NumerAI</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Discover your personalized numerology insights with AI-powered wisdom
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Product</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                  Features
                </button>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors">
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
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
  );
}

