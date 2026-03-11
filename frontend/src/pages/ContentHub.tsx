import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  VideoIcon,
  HeadphonesIcon,
  FileTextIcon,
  PlayCircleIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function ContentHub() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Articles', 'Videos', 'Podcasts', 'Guides'];
  const content = [
  {
    type: 'article',
    title: 'Mastering Your Life Path Number',
    description:
    'A comprehensive guide to understanding and working with your Life Path number.',
    duration: '12 min read',
    category: 'Articles',
    icon: <FileTextIcon className="w-5 h-5" />,
    image: '📖'
  },
  {
    type: 'video',
    title: 'Introduction to Numerology',
    description:
    'Learn the basics of numerology in this beginner-friendly video series.',
    duration: '25 min watch',
    category: 'Videos',
    icon: <VideoIcon className="w-5 h-5" />,
    image: '🎥'
  },
  {
    type: 'podcast',
    title: 'Cosmic Conversations: Episode 12',
    description:
    'Deep dive into master numbers with expert numerologist Dr. Sarah Chen.',
    duration: '45 min listen',
    category: 'Podcasts',
    icon: <HeadphonesIcon className="w-5 h-5" />,
    image: '🎧'
  },
  {
    type: 'guide',
    title: 'Numerology for Business Success',
    description:
    'Step-by-step guide to using numerology for business decisions and growth.',
    duration: '20 min read',
    category: 'Guides',
    icon: <BookOpenIcon className="w-5 h-5" />,
    image: '💼'
  },
  {
    type: 'video',
    title: 'Compatibility Secrets Revealed',
    description:
    'Discover how to use numerology to improve your relationships.',
    duration: '18 min watch',
    category: 'Videos',
    icon: <VideoIcon className="w-5 h-5" />,
    image: '💕'
  },
  {
    type: 'article',
    title: 'The Power of Personal Year Numbers',
    description:
    'Learn how to calculate and interpret your Personal Year number for better planning.',
    duration: '8 min read',
    category: 'Articles',
    icon: <FileTextIcon className="w-5 h-5" />,
    image: '📅'
  }];

  const filteredContent =
  selectedCategory === 'All' ?
  content :
  content.filter((item) => item.category === selectedCategory);
  return (
    <CosmicPageLayout>
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
              Content Hub
            </h1>
            <p className="text-white/70">Learn, grow, and master numerology</p>
          </div>
        </div>
      </motion.div>

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

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Welcome to Your Learning Journey
          </h2>
          <p className="text-white/70 leading-relaxed">
            Explore our curated collection of articles, videos, podcasts, and
            guides designed to deepen your understanding of numerology and help
            you apply cosmic wisdom to your daily life.
          </p>
        </SpaceCard>
      </motion.div>

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
        className="mb-8">

        <div className="flex flex-wrap gap-3">
          {categories.map((category) =>
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl transition-colors ${selectedCategory === category ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white' : 'bg-[#0a1628]/60 border-2 border-cyan-500/20 text-white/70 hover:border-cyan-500/40'}`}>

              {category}
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item, index) =>
        <motion.div
          key={item.title}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3 + index * 0.1
          }}
          whileHover={{
            y: -4
          }}>

            <SpaceCard variant="default" className="p-6 h-full flex flex-col">
              <div className="text-5xl mb-4">{item.image}</div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-cyan-400">{item.icon}</span>
                <span className="text-xs px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-400">
                  {item.category}
                </span>
              </div>

              <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-3">
                {item.title}
              </h3>

              <p className="text-white/70 mb-4 flex-1 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{item.duration}</span>
                <TouchOptimizedButton
                variant="ghost"
                size="sm"
                icon={<PlayCircleIcon className="w-4 h-4" />}
                ariaLabel={`View ${item.title}`}>

                  View
                </TouchOptimizedButton>
              </div>
            </SpaceCard>
          </motion.div>
        )}
      </div>
    </CosmicPageLayout>);

}