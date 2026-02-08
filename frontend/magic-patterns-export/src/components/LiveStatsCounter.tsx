import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, SparklesIcon, TrendingUpIcon, ZapIcon } from 'lucide-react';
interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  color: string;
}
function AnimatedCounter({
  target,
  duration = 2000,
  suffix = ''




}: {target: number;duration?: number;suffix?: string;}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * easeOutQuart));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>);

}
export function LiveStatsCounter() {
  const [isVisible, setIsVisible] = useState(false);
  const stats: Stat[] = [
  {
    icon: <UsersIcon className="w-6 h-6" />,
    value: 1247,
    label: 'Users Online',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    value: 342,
    label: 'Readings Today',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    value: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    value: 3,
    suffix: 's',
    label: 'Avg Response Time',
    color: 'from-amber-500 to-orange-600'
  }];

  return (
    <section className="relative py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
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
          onViewportEnter={() => setIsVisible(true)}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
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
              delay: index * 0.1
            }}
            className="relative group">

              <div className="p-6 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                {/* Pulsing indicator */}
                <div className="absolute top-4 right-4">
                  <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="w-2 h-2 rounded-full bg-green-400" />

                </div>

                {/* Icon */}
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center text-white mb-4`}>

                  {stat.icon}
                </div>

                {/* Value */}
                <div
                className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>

                  {isVisible ?
                <AnimatedCounter target={stat.value} suffix={stat.suffix} /> :

                '0'
                }
                </div>

                {/* Label */}
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Live indicator text */}
        <motion.div
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.5
          }}
          className="text-center mt-6">

          <div className="inline-flex items-center gap-2 text-sm text-white/60">
            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="w-2 h-2 rounded-full bg-green-400" />

            <span>Live stats updated in real-time</span>
          </div>
        </motion.div>
      </div>
    </section>);

}