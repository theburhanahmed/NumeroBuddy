import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}
const testimonials: Testimonial[] = [
{
  name: 'Sarah Chen',
  role: 'Life Coach',
  avatar: '👩‍💼',
  rating: 5,
  text: "numerobuddy's insights helped me understand my life purpose with incredible clarity. The AI chat feature is like having a personal numerologist available 24/7."
},
{
  name: 'Marcus Rodriguez',
  role: 'Entrepreneur',
  avatar: '👨‍💻',
  rating: 5,
  text: 'The compatibility checker saved my business partnership. Understanding our numerological dynamics helped us work together more effectively.'
},
{
  name: 'Priya Sharma',
  role: 'Spiritual Guide',
  avatar: '🧘‍♀️',
  rating: 5,
  text: 'As a professional numerologist, I was skeptical of AI. But numerobuddy combines ancient wisdom with modern technology beautifully. Highly recommend!'
},
{
  name: 'James Wilson',
  role: 'Software Engineer',
  avatar: '👨‍🔬',
  rating: 5,
  text: 'The accuracy is mind-blowing. The daily readings have become part of my morning routine, and the birth chart visualization is stunning.'
},
{
  name: 'Elena Popov',
  role: 'Artist',
  avatar: '🎨',
  rating: 5,
  text: 'numerobuddy helped me find my creative flow again. The remedies section with crystal recommendations was exactly what I needed.'
},
{
  name: 'David Kim',
  role: 'Financial Advisor',
  avatar: '💼',
  rating: 5,
  text: 'I use numerobuddy for timing major decisions. The forecasts have been remarkably accurate, and the interface is beautiful and intuitive.'
}];

export function TestimonialsSection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
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
          className="text-center mb-16">

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
              ⭐ Trusted by Thousands
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            What Our Users
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Are Saying
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of people who have discovered their cosmic destiny
            with numerobuddy
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) =>
          <motion.div
            key={testimonial.name}
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
              delay: index * 0.1
            }}>

              <SpaceCard variant="premium" className="p-6 h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-4">
                  <QuoteIcon className="w-8 h-8 text-cyan-400/30" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) =>
                <StarIcon
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400" />

                )}
                </div>

                {/* Testimonial Text */}
                <p className="text-white/80 leading-relaxed mb-6 flex-grow">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-cyan-500/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center text-2xl border border-cyan-500/30">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-white/60">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </SpaceCard>
            </motion.div>
          )}
        </div>

      </div>
    </section>);

}