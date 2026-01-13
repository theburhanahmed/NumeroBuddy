import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, ClockIcon, ArrowRightIcon, TrendingUpIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}
const blogPosts: BlogPost[] = [{
  id: '1',
  title: 'Understanding Your Life Path Number: A Complete Guide',
  excerpt: 'Discover the profound meaning behind your Life Path number and how it shapes your destiny, relationships, and life purpose.',
  category: 'Numerology Basics',
  date: '2024-01-15',
  readTime: '8 min',
  image: '🔢',
  featured: true
}, {
  id: '2',
  title: 'Master Numbers 11, 22, 33: The Spiritual Powerhouses',
  excerpt: 'Explore the rare and powerful Master Numbers and their significance in numerology. Learn if you carry one of these special vibrations.',
  category: 'Advanced',
  date: '2024-01-12',
  readTime: '6 min',
  image: '✨'
}, {
  id: '3',
  title: 'Numerology and Relationships: Finding Your Perfect Match',
  excerpt: 'Use numerology to understand compatibility in love, friendship, and business. Discover which Life Paths complement yours.',
  category: 'Relationships',
  date: '2024-01-10',
  readTime: '10 min',
  image: '💕'
}, {
  id: '4',
  title: 'Using Numerology for Career Success and Fulfillment',
  excerpt: "Align your career path with your numerological blueprint. Find work that resonates with your soul's purpose.",
  category: 'Career',
  date: '2024-01-08',
  readTime: '7 min',
  image: '💼'
}];
export function BlogPreview() {
  const navigate = useNavigate();
  return <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="flex items-center justify-between mb-12">
          <div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
                📚 Learn & Grow
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-4">
              Latest from Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Cosmic Blog
              </span>
            </h2>

            <p className="text-xl text-white/70 max-w-2xl">
              Insights, guides, and wisdom to deepen your numerology journey
            </p>
          </div>

          <motion.button initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} onClick={() => navigate('/blog')} className="hidden md:flex items-center gap-2 px-6 py-3 bg#[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-white hover:border-cyan-400 transition-colors">
            View All Posts
            <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Featured Post */}
        {blogPosts[0].featured && <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="mb-8">
            <SpaceCard variant="premium" className="overflow-hidden cursor-pointer group" onClick={() => navigate(`/blog/${blogPosts[0].id}`)}>
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Image */}
                <div className="flex items-center justify-center text-9xl">
                  {blogPosts[0].image}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-400 text-xs font-semibold">
                      FEATURED
                    </span>
                    <span className="text-sm text-white/60">
                      {blogPosts[0].category}
                    </span>
                  </div>

                  <h3 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {blogPosts[0].title}
                  </h3>

                  <p className="text-white/70 leading-relaxed mb-6">
                    {blogPosts[0].excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                </div>
              </div>
            </SpaceCard>
          </motion.div>}

        {/* Recent Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post, index) => <motion.div key={post.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }}>
              <SpaceCard variant="default" className="h-full cursor-pointer group hover:border-cyan-500/40 transition-colors" onClick={() => navigate(`/blog/${post.id}`)}>
                <div className="p-6">
                  {/* Image */}
                  <div className="text-6xl mb-4 text-center">{post.image}</div>

                  {/* Category */}
                  <span className="text-xs text-cyan-400 font-semibold mb-2 block">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h4 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-white/50 pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>)}
        </div>

        {/* Mobile View All Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="md:hidden text-center mt-8">
          <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-white">
            View All Posts
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>;
}