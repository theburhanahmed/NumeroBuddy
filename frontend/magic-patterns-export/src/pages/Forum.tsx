import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  TrendingUpIcon } from
'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function Forum() {
  const categories = [
  {
    name: 'Life Path Discussions',
    posts: 234,
    icon: '🛤️'
  },
  {
    name: 'Compatibility & Love',
    posts: 189,
    icon: '💕'
  },
  {
    name: 'Career & Business',
    posts: 156,
    icon: '💼'
  },
  {
    name: 'Spiritual Growth',
    posts: 198,
    icon: '✨'
  }];

  const threads = [
  {
    title: 'Understanding Life Path 7 - Seeking Advice',
    author: 'SoulSeeker22',
    category: 'Life Path Discussions',
    replies: 23,
    likes: 45,
    lastActive: '2 hours ago',
    trending: true
  },
  {
    title: 'Master Number 11 - Anyone else experiencing this?',
    author: 'CosmicTraveler',
    category: 'Spiritual Growth',
    replies: 18,
    likes: 32,
    lastActive: '4 hours ago',
    trending: true
  },
  {
    title: 'Best business name for a Life Path 8?',
    author: 'Entrepreneur88',
    category: 'Career & Business',
    replies: 15,
    likes: 28,
    lastActive: '6 hours ago',
    trending: false
  },
  {
    title: 'Life Path 3 and 5 compatibility - Success stories?',
    author: 'LoveSeeker',
    category: 'Compatibility & Love',
    replies: 31,
    likes: 56,
    lastActive: '1 day ago',
    trending: false
  }];

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

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
              <MessageSquareIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                Community Forum
              </h1>
              <p className="text-white/70">Connect with fellow seekers</p>
            </div>
          </div>
          <TouchOptimizedButton
            variant="primary"
            size="md"
            ariaLabel="Create new post">

            New Post
          </TouchOptimizedButton>
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

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) =>
          <motion.div
            key={category.name}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2 + index * 0.05
            }}
            whileHover={{
              y: -4
            }}>

              <SpaceCard variant="default" className="p-6 cursor-pointer">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-white/60">{category.posts} posts</p>
              </SpaceCard>
            </motion.div>
          )}
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
          delay: 0.3
        }}>

        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
          Recent Discussions
        </h2>
        <div className="space-y-4">
          {threads.map((thread, index) =>
          <motion.div
            key={thread.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4 + index * 0.1
            }}
            whileHover={{
              y: -2
            }}>

              <SpaceCard variant="default" className="p-6 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {thread.title}
                      </h3>
                      {thread.trending &&
                    <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full text-orange-400 text-xs">
                          <TrendingUpIcon className="w-3 h-3" />
                          Trending
                        </span>
                    }
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>by {thread.author}</span>
                      <span className="px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-xs">
                        {thread.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{thread.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUpIcon className="w-4 h-4" />
                    <span>{thread.likes} likes</span>
                  </div>
                  <span className="ml-auto">
                    Last active {thread.lastActive}
                  </span>
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CosmicPageLayout>);

}