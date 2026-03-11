import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, MenuIcon } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
interface GlassNavProps {
  showLinks?: boolean;
  ctaText?: string;
  ctaAction?: () => void;
}
export function GlassNav({
  showLinks = true,
  ctaText = 'START FREE JOURNEY',
  ctaAction
}: GlassNavProps) {
  const navigate = useNavigate();
  const handleCTA = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      navigate('/signup');
    }
  };
  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: -20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 max-w-7xl mx-auto">

      {/* Logo */}
      <motion.div
        className="flex items-center gap-3 cursor-pointer min-h-[44px]"
        onClick={() => navigate('/')}
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}>

        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <span className="text-white font-semibold text-base md:text-lg tracking-wide">
          NUMEROBUDDY
        </span>
      </motion.div>

      {/* Nav Links */}
      {showLinks &&
      <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <motion.a
          href="/"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            HOME
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
          <motion.a
          href="/features"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            FEATURES
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
          <motion.a
          href="/pricing"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            PRICING
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
          <motion.a
          href="/how-it-works"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            HOW IT WORKS
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
          <motion.a
          href="/blog"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            BLOG
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
          <motion.a
          href="/contact"
          className="hover:text-white transition-colors py-2 relative"
          whileHover={{
            y: -2
          }}>

            CONTACT
            <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
            initial={{
              scaleX: 0
            }}
            whileHover={{
              scaleX: 1
            }}
            transition={{
              duration: 0.2
            }} />

          </motion.a>
        </div>
      }

      {/* CTA Button - Using new CosmicButton with ripple effect */}
      <CosmicButton
        onClick={handleCTA}
        variant="secondary"
        size="md"
        icon={<SparklesIcon className="w-4 h-4 text-cyan-400" />}>

        {ctaText}
      </CosmicButton>

      {/* Mobile Menu */}
      <motion.button
        className="md:hidden text-white p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
        whileHover={{
          scale: 1.1
        }}
        whileTap={{
          scale: 0.95
        }}>

        <MenuIcon className="w-6 h-6" />
      </motion.button>
    </motion.nav>);

}