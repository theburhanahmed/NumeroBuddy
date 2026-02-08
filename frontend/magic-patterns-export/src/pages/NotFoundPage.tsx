import React from 'react';
import { motion } from 'framer-motion';
import { SearchXIcon, HomeIcon, CompassIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function NotFoundPage() {
  const navigate = useNavigate();
  const suggestions = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon className="w-5 h-5" />
  },
  {
    label: 'Daily Readings',
    path: '/daily-readings',
    icon: <CompassIcon className="w-5 h-5" />
  },
  {
    label: 'Birth Chart',
    path: '/birth-chart',
    icon: <CompassIcon className="w-5 h-5" />
  }];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AccessibleSpaceBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
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
            type: 'spring'
          }}>

          <SpaceCard variant="premium" className="p-8 md:p-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <SearchXIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
              404
            </h1>

            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
              Page Not Found
            </h2>

            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              This cosmic path doesn't exist in our universe. Let's guide you
              back to familiar territory.
            </p>

            <div className="mb-8">
              <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/')}
                icon={<HomeIcon className="w-5 h-5" />}
                ariaLabel="Go to homepage">

                Go to Homepage
              </TouchOptimizedButton>
            </div>

            <div className="pt-8 border-t border-cyan-500/20">
              <p className="text-sm text-white/60 mb-4">
                Or explore these popular pages:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {suggestions.map((item) =>
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl text-white transition-colors">

                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                )}
              </div>
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </div>);

}