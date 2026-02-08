import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnimatedShaderBackground } from '../components/ui/animated-shader-background';
import { CosmicButton } from '../components/CosmicButton';
import { SparklesIcon, ArrowLeftIcon } from 'lucide-react';
export function ShaderBackgroundDemo() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Shader Background */}
      <AnimatedShaderBackground />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        {/* Back Button */}
        <motion.button
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors">

          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </motion.button>

        {/* Hero Content */}
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
          className="text-center max-w-4xl">

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
              delay: 0.3
            }}
            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">

            <SparklesIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">
              WebGL Shader Background
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
            Aurora Borealis
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              Shader Effect
            </span>
          </h1>

          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Real-time WebGL shader rendering with Three.js. Dynamic aurora
            effects with fractal noise and procedural animation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CosmicButton
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
              icon={<SparklesIcon className="w-5 h-5" />}>

              Explore NumeroBuddy
            </CosmicButton>

            <CosmicButton
              onClick={() => window.open('https://threejs.org/docs/', '_blank')}
              variant="secondary"
              size="lg">

              Learn Three.js
            </CosmicButton>
          </div>
        </motion.div>

        {/* Technical Info */}
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
            delay: 0.6
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">

          <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Technology</p>
              <p className="text-sm text-white font-semibold">
                Three.js + GLSL
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Render</p>
              <p className="text-sm text-white font-semibold">WebGL 2.0</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">FPS</p>
              <p className="text-sm text-white font-semibold">60</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);

}