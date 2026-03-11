import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, XIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
export function VideoExplainer() {
  const [isPlaying, setIsPlaying] = useState(false);
  // Placeholder video - replace with actual video URL
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  // Use a stable local-ish thumbnail (gradient background with text)
  const thumbnailUrl =
    'https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?auto=compress&cs=tinysrgb&w=1280';
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-12">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              🎥 Watch & Learn
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            See numerobuddy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              In Action
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Watch this 2-minute video to discover how numerobuddy can transform your
            life through the power of numerology
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.2
          }}>

          <SpaceCard variant="premium" className="overflow-hidden p-0">
            <div className="relative aspect-video">
              {!isPlaying ?
              // Thumbnail with play button
              <div
                className="relative w-full h-full group cursor-pointer"
                onClick={() => setIsPlaying(true)}>

                  {/* Thumbnail image */}
                  <img
                  src={thumbnailUrl}
                  alt="numerobuddy explainer video thumbnail"
                  className="w-full h-full object-cover" />


                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Play button */}
                  <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{
                    scale: 1.1
                  }}
                  transition={{
                    duration: 0.2
                  }}>

                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-shadow">
                      <PlayIcon className="w-10 h-10 text-white ml-1" />
                    </div>
                  </motion.div>

                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm font-semibold">
                    2:15
                  </div>
                </div> :

              // Video player
              <div className="relative w-full h-full">
                  <iframe
                  src={`${videoUrl}?autoplay=1`}
                  title="numerobuddy Explainer Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full" />


                  {/* Close button */}
                  <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black transition-colors z-10"
                  aria-label="Close video">

                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              }
            </div>
          </SpaceCard>
        </motion.div>

        {/* Video highlights */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.4
          }}
          className="grid sm:grid-cols-3 gap-6 mt-12">

          {[
          {
            time: '0:15',
            title: 'AI-Powered Insights',
            desc: 'See how our AI analyzes your numbers'
          },
          {
            time: '0:45',
            title: 'Interactive Features',
            desc: 'Explore the 3D birth chart'
          },
          {
            time: '1:30',
            title: 'Real Results',
            desc: 'Hear from satisfied users'
          }].
          map((highlight, index) =>
          <motion.div
            key={highlight.time}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.5 + index * 0.1
            }}
            className="text-center">

              <div className="text-cyan-400 font-semibold mb-2">
                {highlight.time}
              </div>
              <h4 className="text-white font-semibold mb-1">
                {highlight.title}
              </h4>
              <p className="text-sm text-white/60">{highlight.desc}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}