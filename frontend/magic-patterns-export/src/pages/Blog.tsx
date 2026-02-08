import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { LandingNav } from '../components/LandingNav';
import { LandingFooter } from '../components/LandingFooter';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function Blog() {
  const posts = [
  {
    title: 'Understanding Your Life Path Number',
    excerpt:
    "Discover how your Life Path number reveals your life's purpose and the journey you're meant to take.",
    category: 'Numerology Basics',
    readTime: '5 min read',
    date: 'Dec 15, 2024',
    image: '📖'
  },
  {
    title: 'The Power of Master Numbers',
    excerpt:
    'Master numbers 11, 22, and 33 carry special significance. Learn what they mean for your spiritual path.',
    category: 'Advanced Topics',
    readTime: '7 min read',
    date: 'Dec 12, 2024',
    image: '✨'
  },
  {
    title: 'Numerology in Relationships',
    excerpt:
    'How compatible are you with your partner? Explore the numerological aspects of love and relationships.',
    category: 'Relationships',
    readTime: '6 min read',
    date: 'Dec 10, 2024',
    image: '💕'
  },
  {
    title: 'Choosing a Business Name with Numerology',
    excerpt:
    'Your business name carries energy. Learn how to choose a name that attracts success and abundance.',
    category: 'Business',
    readTime: '8 min read',
    date: 'Dec 8, 2024',
    image: '💼'
  },
  {
    title: 'Daily Numerology Rituals',
    excerpt:
    'Simple practices to align with your numbers every day and harness cosmic energy for personal growth.',
    category: 'Practices',
    readTime: '4 min read',
    date: 'Dec 5, 2024',
    image: '🌅'
  },
  {
    title: 'The History of Numerology',
    excerpt:
    'From ancient civilizations to modern practice, explore the rich history of numerological wisdom.',
    category: 'History',
    readTime: '10 min read',
    date: 'Dec 1, 2024',
    image: '📜'
  }];

  const categories = [
  'All',
  'Numerology Basics',
  'Advanced Topics',
  'Relationships',
  'Business',
  'Practices'];

  return (
    <div className="relative min-h-screen">
      <AccessibleSpaceBackground />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 pt-28">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Numerology Blog
              </h1>
              <p className="text-white/70">
                Insights, guides, and cosmic wisdom
              </p>
            </div>
          </div>
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
            delay: 0.1
          }}
          className="mb-8">

          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) =>
            <button
              key={category}
              className={`px-4 py-2 rounded-xl transition-colors ${index === 0 ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white' : 'bg-[#0a1628]/60 border-2 border-cyan-500/20 text-white/70 hover:border-cyan-500/40'}`}>

                {category}
              </button>
            )}
          </div>
        </motion.div>

        {/* Blog Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              delay: 0.2 + index * 0.1
            }}
            whileHover={{
              y: -4
            }}>

              <SpaceCard variant="default" className="p-6 h-full flex flex-col">
                <div className="text-5xl mb-4">{post.image}</div>

                <div className="mb-3">
                  <span className="text-xs px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                  {post.title}
                </h3>

                <p className="text-white/70 mb-4 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <span>{post.date}</span>
                </div>

                <TouchOptimizedButton
                variant="ghost"
                size="sm"
                icon={<ArrowRightIcon className="w-4 h-4" />}
                ariaLabel={`Read ${post.title}`}
                className="w-full">

                  Read More
                </TouchOptimizedButton>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </div>

      <LandingFooter />
    </div>);

}