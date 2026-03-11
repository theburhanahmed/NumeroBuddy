'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
import { TouchOptimizedButton } from './TouchOptimizedButton';
export function InteractiveDemo() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState('');
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const calculateLifePath = (date: string) => {
    if (!date) return;
    setIsCalculating(true);
    // Simulate calculation delay for effect
    setTimeout(() => {
      const [year, month, day] = date.split('-');
      // Calculate Life Path number
      const sumDigits = (num: string): number => {
        return num.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      };
      const reduceToSingleDigit = (num: number): number => {
        // Master numbers (11, 22, 33) are not reduced
        if (num === 11 || num === 22 || num === 33) return num;
        if (num < 10) return num;
        return reduceToSingleDigit(sumDigits(num.toString()));
      };
      const daySum = reduceToSingleDigit(sumDigits(day));
      const monthSum = reduceToSingleDigit(sumDigits(month));
      const yearSum = reduceToSingleDigit(sumDigits(year));
      const total = daySum + monthSum + yearSum;
      const lifePath = reduceToSingleDigit(total);
      setLifePathNumber(lifePath);
      setIsCalculating(false);
    }, 1500);
  };
  const lifePathMeanings: {
    [key: number]: {
      title: string;
      description: string;
      color: string;
    };
  } = {
    1: {
      title: 'The Leader',
      description: 'Independent, ambitious, and pioneering',
      color: 'from-red-500 to-rose-600'
    },
    2: {
      title: 'The Peacemaker',
      description: 'Diplomatic, intuitive, and cooperative',
      color: 'from-orange-500 to-amber-600'
    },
    3: {
      title: 'The Creative',
      description: 'Expressive, optimistic, and artistic',
      color: 'from-yellow-500 to-orange-600'
    },
    4: {
      title: 'The Builder',
      description: 'Practical, disciplined, and reliable',
      color: 'from-green-500 to-emerald-600'
    },
    5: {
      title: 'The Freedom Seeker',
      description: 'Adventurous, versatile, and dynamic',
      color: 'from-cyan-500 to-blue-600'
    },
    6: {
      title: 'The Nurturer',
      description: 'Responsible, caring, and harmonious',
      color: 'from-blue-500 to-indigo-600'
    },
    7: {
      title: 'The Seeker',
      description: 'Analytical, spiritual, and introspective',
      color: 'from-purple-500 to-violet-600'
    },
    8: {
      title: 'The Powerhouse',
      description: 'Ambitious, authoritative, and successful',
      color: 'from-pink-500 to-rose-600'
    },
    9: {
      title: 'The Humanitarian',
      description: 'Compassionate, idealistic, and generous',
      color: 'from-indigo-500 to-purple-600'
    },
    11: {
      title: 'The Illuminator',
      description: 'Intuitive, inspirational, and visionary',
      color: 'from-cyan-400 to-purple-600'
    },
    22: {
      title: 'The Master Builder',
      description: 'Practical visionary, powerful manifester',
      color: 'from-amber-500 to-rose-600'
    },
    33: {
      title: 'The Master Teacher',
      description: 'Compassionate guide, spiritual healer',
      color: 'from-green-500 to-cyan-600'
    }
  };
  return <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-12">
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
        }} className="inline-block mb-6">
            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              ✨ Try It Now
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Discover Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Life Path Number
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Enter your birth date to instantly calculate your Life Path number
            and unlock your cosmic blueprint
          </p>
        </motion.div>

        {/* Interactive Calculator */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.2
      }}>
          <SpaceCard variant="premium" className="p-8 md:p-12">
            {!lifePathNumber ?
          // Input form
          <div className="max-w-md mx-auto">
                <label htmlFor="birthdate" className="block text-white font-semibold mb-3 text-center">
                  Enter Your Birth Date
                </label>
                <input id="birthdate" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-[#1a2942]/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors mb-6" />

                <TouchOptimizedButton variant="primary" size="lg" onClick={() => calculateLifePath(birthDate)} disabled={!birthDate || isCalculating} className="w-full" icon={isCalculating ? <SparklesIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />} ariaLabel="Calculate your Life Path number">
                  {isCalculating ? 'Calculating...' : 'Calculate My Life Path'}
                </TouchOptimizedButton>

                <p className="text-xs text-white/50 text-center mt-4">
                  Your data is never stored or shared
                </p>
              </div> :
          // Result display
          <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5
          }} className="text-center">
                {/* Life Path Number */}
                <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 200
            }} className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${lifePathMeanings[lifePathNumber].color} flex items-center justify-center shadow-2xl`}>
                  <span className="text-6xl font-bold text-white">
                    {lifePathNumber}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h3 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }} className="text-3xl font-['Playfair_Display'] font-bold text-white mb-3">
                  {lifePathMeanings[lifePathNumber].title}
                </motion.h3>

                {/* Description */}
                <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5
            }} className="text-lg text-white/70 mb-8 max-w-md mx-auto">
                  {lifePathMeanings[lifePathNumber].description}
                </motion.p>

                {/* CTA */}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6
            }} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <TouchOptimizedButton variant="primary" size="lg" onClick={() => router.push('/signup')} icon={<ArrowRightIcon className="w-5 h-5" />} ariaLabel="Get your full reading">
                    Get Full Reading
                  </TouchOptimizedButton>

                  <TouchOptimizedButton variant="secondary" size="lg" onClick={() => {
                setLifePathNumber(null);
                setBirthDate('');
              }} ariaLabel="Try another date">
                    Try Another Date
                  </TouchOptimizedButton>
                </motion.div>

                {/* Teaser */}
                <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.8
            }} className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <p className="text-sm text-cyan-300">
                    ✨ This is just the beginning! Sign up for your complete
                    numerology profile including Destiny, Soul Urge, and
                    Personality numbers.
                  </p>
                </motion.div>
              </motion.div>}
          </SpaceCard>
        </motion.div>

        {/* Why it matters */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.4
      }} className="grid sm:grid-cols-3 gap-6 mt-12">
          {[{
          icon: '🎯',
          title: 'Life Purpose',
          desc: 'Understand your core mission'
        }, {
          icon: '💪',
          title: 'Strengths',
          desc: 'Discover your natural talents'
        }, {
          icon: '🌟',
          title: 'Growth Path',
          desc: 'Navigate challenges with clarity'
        }].map((item, index) => <motion.div key={item.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.5 + index * 0.1
        }} className="text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-white/60">{item.desc}</p>
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}