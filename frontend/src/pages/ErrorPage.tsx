import { motion } from 'framer-motion';
import { AlertCircleIcon, HomeIcon, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccessibleSpaceBackground } from '../components/AccessibleSpaceBackground';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}
export function ErrorPage({ resetError }: ErrorPageProps) {
  const navigate = useNavigate();
  const navigateAfterReset = (destination: number | string) => {
    resetError?.();
    if (typeof destination === 'number') {
      navigate(destination);
    } else {
      navigate(destination);
    }
  };
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertCircleIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl font-['Playfair_Display'] font-bold text-white mb-4">
              Oops! Something Went Wrong
            </h1>

            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              We encountered an unexpected error. Don't worry, the cosmic forces
              are working to fix it!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchOptimizedButton
                variant="secondary"
                size="lg"
                onClick={() => navigateAfterReset(-1)}
                icon={<ArrowLeftIcon className="w-5 h-5" />}
                ariaLabel="Go back">

                Go Back
              </TouchOptimizedButton>
              <TouchOptimizedButton
                variant="primary"
                size="lg"
                onClick={() => navigateAfterReset('/')}
                icon={<HomeIcon className="w-5 h-5" />}
                ariaLabel="Go to homepage">

                Go Home
              </TouchOptimizedButton>
            </div>

            <div className="mt-8 pt-8 border-t border-cyan-500/20">
              <p className="text-sm text-white/60">
                Error Code: 500 | If this persists, contact{' '}
                <a
                  href="mailto:support@numerobuddy.com"
                  className="text-cyan-400 hover:text-cyan-300">

                  support@numerobuddy.com
                </a>
              </p>
            </div>
          </SpaceCard>
        </motion.div>
      </div>
    </div>);

}