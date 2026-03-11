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
  const categories = [
  {
    id: 'all',
    name: 'All Posts',
    count: 24
  },
  {
    id: 'numerology',
    name: 'Numerology Basics',
    count: 8
  },
  {
    id: 'life-path',
    name: 'Life Path',
    count: 6
  },
  {
    id: 'relationships',
    name: 'Relationships',
    count: 5
  },
  {
    id: 'career',
    name: 'Career & Money',
    count: 5
  }];

  const featuredPost = {
    title: 'Understanding Your Life Path Number: A Complete Guide',
    excerpt:
    'Discover the profound meaning behind your Life Path number and how it shapes your destiny, relationships, and life purpose.',
    image:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=400&fit=crop',
    category: 'Numerology Basics',
    date: 'Dec 15, 2023',
    readTime: '8 min read',
    author: 'Sarah Chen'
  };
  const posts = [
  {
    title: 'The Power of Master Numbers: 11, 22, and 33',
    excerpt:
    'Master numbers carry special significance in numerology. Learn what it means if you have one.',
    category: 'Numerology Basics',
    date: 'Dec 12, 2023',
    readTime: '6 min read',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    title: 'Compatibility by the Numbers: Finding Your Perfect Match',
    excerpt:
    'Explore how numerology can reveal deep insights about relationship compatibility and harmony.',
    category: 'Relationships',
    date: 'Dec 10, 2023',
    readTime: '7 min read',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Career Success Through Your Destiny Number',
    excerpt:
    'Your Destiny number reveals your natural talents and ideal career path. Discover yours.',
    category: 'Career & Money',
    date: 'Dec 8, 2023',
    readTime: '5 min read',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: "Personal Year Cycles: Navigating Life's Rhythms",
    excerpt:
    'Learn how to use Personal Year numbers to make better decisions and plan for the future.',
    category: 'Life Path',
    date: 'Dec 5, 2023',
    readTime: '9 min read',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    title: 'Name Numerology: The Hidden Power of Your Name',
    excerpt:
    'Your name carries vibrational energy. Discover what your name reveals about your personality.',
    category: 'Numerology Basics',
    date: 'Dec 3, 2023',
    readTime: '6 min read',
    color: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Soul Urge Number: Understanding Your Inner Desires',
    excerpt:
    'Uncover your deepest motivations and what truly drives you at a soul level.',
    category: 'Life Path',
    date: 'Dec 1, 2023',
    readTime: '7 min read',
    color: 'from-blue-500 to-cyan-600'
  }];

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

          <div className="flex items-center gap-2 mb-6">
            <TrendingUpIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Featured Article
            </h2>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative overflow-hidden rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="inline-block mb-4">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-white/60 mb-6">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                    Read Article
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Image */}
                <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20" />
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover" />

                </div>
              </div>
            </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) =>
            <motion.div
              key={post.title}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.6 + index * 0.1
              }}
              className="group relative cursor-pointer">

                <div
                className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`} />

                <div className="relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all h-full flex flex-col">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span
                    className={`px-3 py-1 bg-gradient-to-r ${post.color} bg-opacity-20 border border-current rounded-full text-xs font-semibold`}>

                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-white/50 pt-4 border-t border-cyan-500/10">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
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