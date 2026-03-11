import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  TrendingUpIcon } from
'lucide-react';
import { GlassPageLayout } from '../components/GlassPageLayout';
export function BlogGlass() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories: { id: string; name: string }[] = [];
  const posts: any[] = [];

  return (
    <GlassPageLayout showNav={true} starCount={80}>
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-center mb-16">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              📚 Cosmic Wisdom
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Numerology
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Insights & Guides
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Explore articles, guides, and insights to deepen your understanding
            of numerology and unlock your cosmic potential.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="max-w-2xl mx-auto">

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <SearchIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-4 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors" />

            </div>
          </motion.div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}
          className="flex flex-wrap justify-center gap-3 mb-16">

          {categories.map((category) =>
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-full backdrop-blur-xl transition-all ${selectedCategory === category.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-[#1a2942]/40 border border-cyan-500/20 text-white/70 hover:text-white hover:border-cyan-500/40'}`}>

              {category.name}
              <span className="ml-2 text-xs opacity-60">
                ({category.count})
              </span>
            </button>
          )}
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className="mb-20">

          <div className="p-10 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 text-center">
            <TrendingUpIcon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-white mb-2">Content Hub</h2>
            <p className="text-white/70">
              Blog content will appear here once it’s connected to the backend.
            </p>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.5
          }}>

          <h2 className="text-2xl font-serif text-white mb-8">
            Recent Articles
          </h2>
          <div className="text-white/60">
            No articles yet.
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.8
          }}
          className="text-center mt-20">

          <div className="p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/30 backdrop-blur-xl">
            <SparklesIcon className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Get Cosmic Insights Weekly
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for weekly numerology insights, tips,
              and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors" />

              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </GlassPageLayout>);

}