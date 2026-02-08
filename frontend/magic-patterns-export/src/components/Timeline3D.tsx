import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  SparklesIcon,
  BrainIcon,
  TrendingUpIcon } from
'lucide-react';
interface TimelineStep {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}
const steps: TimelineStep[] = [
{
  number: '01',
  icon: <CalendarIcon className="w-8 h-8" />,
  title: 'Enter Your Birth Date',
  description:
  'Provide your birth date and name. Your cosmic blueprint begins with these sacred numbers.',
  color: 'from-cyan-400 to-blue-600'
},
{
  number: '02',
  icon: <SparklesIcon className="w-8 h-8" />,
  title: 'Cosmic Calculation',
  description:
  'Our system analyzes numerological patterns, reducing numbers to their core essence and revealing hidden connections.',
  color: 'from-purple-500 to-indigo-600'
},
{
  number: '03',
  icon: <BrainIcon className="w-8 h-8" />,
  title: 'AI Interpretation',
  description:
  'Advanced AI processes thousands of numerological meanings, ancient wisdom, and modern insights to create your unique profile.',
  color: 'from-pink-500 to-rose-600'
},
{
  number: '04',
  icon: <TrendingUpIcon className="w-8 h-8" />,
  title: 'Daily Guidance',
  description:
  'Receive personalized daily readings, compatibility insights, and cosmic guidance tailored to your journey.',
  color: 'from-green-500 to-emerald-600'
}];

interface TimelineStepProps {
  step: TimelineStep;
  index: number;
  scrollProgress: number;
}
function TimelineStepCard({ step, index, scrollProgress }: TimelineStepProps) {
  // Calculate when this step should be active based on scroll
  const stepStart = index * 0.2;
  const stepEnd = stepStart + 0.25;
  const isActive = scrollProgress >= stepStart && scrollProgress <= stepEnd;
  // Z-axis movement: steps move forward as you scroll
  const zProgress = Math.max(
    0,
    Math.min(1, (scrollProgress - stepStart) / 0.25)
  );
  const getZ = () => {
    if (scrollProgress < stepStart) return -200 - index * 100;
    if (scrollProgress > stepEnd) return 100;
    return -200 - index * 100 + zProgress * 300;
  };
  const getOpacity = () => {
    if (scrollProgress < stepStart) return 0.3;
    if (scrollProgress > stepEnd) return 0.5;
    return 0.3 + zProgress * 0.7;
  };
  const getScale = () => {
    if (scrollProgress < stepStart) return 0.8;
    if (scrollProgress > stepEnd) return 0.9;
    return 0.8 + zProgress * 0.2;
  };
  const getRotateX = () => {
    if (scrollProgress < stepStart) return 15;
    if (scrollProgress > stepEnd) return -5;
    return 15 - zProgress * 20;
  };
  return (
    <motion.div
      animate={{
        opacity: getOpacity(),
        scale: getScale(),
        rotateX: getRotateX(),
        z: getZ()
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className="relative">

      <div
        className={`relative bg-[#1a2942]/60 backdrop-blur-2xl rounded-3xl border transition-all duration-500 ${isActive ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20' : 'border-cyan-500/20 shadow-lg'}`}
        style={{
          transform: `translateZ(${isActive ? '50px' : '0px'})`,
          transition: 'transform 0.5s ease-out'
        }}>

        <div className="p-8 md:p-12">
          {/* Number Badge */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg transition-all duration-500 ${isActive ? 'scale-110 shadow-2xl' : ''}`}
              style={{
                transform: `translateZ(${isActive ? '30px' : '0px'})`
              }}>

              {step.icon}
            </div>
            <span
              className={`text-8xl font-bold transition-all duration-500 ${isActive ? 'text-white/20' : 'text-white/10'}`}
              style={{
                fontFamily: 'Playfair Display'
              }}>

              {step.number}
            </span>
          </div>

          {/* Content */}
          <h3
            className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/70'}`}
            style={{
              fontFamily: 'Playfair Display'
            }}>

            {step.title}
          </h3>

          <p
            className={`text-lg leading-relaxed transition-colors duration-500 ${isActive ? 'text-white/80' : 'text-white/60'}`}>

            {step.description}
          </p>

          {/* Glow effect when active */}
          {isActive &&
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 pointer-events-none"
            style={{
              animation: 'pulse 2s ease-in-out infinite'
            }} />

          }
        </div>

        {/* Connection line to next step */}
        {index < steps.length - 1 &&
        <div
          className={`absolute left-1/2 -bottom-12 w-0.5 h-12 -translate-x-1/2 transition-all duration-500 ${isActive ? 'bg-gradient-to-b from-cyan-400 to-transparent' : 'bg-white/20'}`} />

        }
      </div>
    </motion.div>);

}
export function Timeline3D() {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      // Calculate scroll progress (0 to 1)
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="relative py-20">
      {/* Perspective container */}
      <div
        style={{
          perspective: '2000px',
          perspectiveOrigin: 'center center'
        }}>

        <div className="max-w-4xl mx-auto space-y-24">
          {steps.map((step, index) =>
          <TimelineStepCard
            key={step.number}
            step={step}
            index={index}
            scrollProgress={scrollProgress} />

          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          delay: 1
        }}>

        <div className="flex flex-col items-center gap-2">
          {steps.map((step, index) => {
            const stepStart = index * 0.2;
            const stepEnd = stepStart + 0.25;
            const isActive =
            scrollProgress >= stepStart && scrollProgress <= stepEnd;
            return (
              <motion.div
                key={step.number}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-cyan-400 scale-150 shadow-lg shadow-cyan-400/50' : 'bg-white/30'}`} />);


          })}
        </div>
      </motion.div>

      {/* Ambient particles for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }} />

        )}
      </div>
    </div>);

}