'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  User, 
  Star,
  Heart,
  TrendingUp,
  Users,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      title: "Birth Chart",
      description: "View your numerology profile",
      icon: <Sparkles className="w-6 h-6" />,
      path: "/birth-chart",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Daily Reading",
      description: "Your personalized guidance",
      icon: <Calendar className="w-6 h-6" />,
      path: "/daily-reading",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "AI Numerologist",
      description: "Chat with our AI expert",
      icon: <MessageCircle className="w-6 h-6" />,
      path: "/ai-chat",
      color: "from-pink-500 to-red-600"
    },
    {
      title: "Life Path Analysis",
      description: "Deep dive into your purpose",
      icon: <Star className="w-6 h-6" />,
      path: "/life-path",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Compatibility Checker",
      description: "Analyze relationships",
      icon: <Heart className="w-6 h-6" />,
      path: "/compatibility",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Personalized Remedies",
      description: "Custom recommendations",
      icon: <TrendingUp className="w-6 h-6" />,
      path: "/remedies",
      color: "from-green-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Welcome, {user.full_name}!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 mt-2"
            >
              {user.email || user.phone}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassButton 
              variant="secondary" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              icon={<LogOut className="w-5 h-5" />}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </GlassButton>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Account Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.is_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Subscription</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)}
                </p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Last Reading</p>
                <p className="font-semibold text-gray-900 dark:text-white">Today</p>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Life Path</p>
                <p className="font-semibold text-gray-900 dark:text-white">7</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Numerology Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard 
                  variant="default" 
                  className="p-6 h-full cursor-pointer"
                  onClick={() => router.push(feature.path)}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <GlassButton variant="secondary" className="w-full">
                    Explore
                  </GlassButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h2>
          <GlassCard variant="default" className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Birth Chart Generated</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today at 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Daily Reading Viewed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday at 8:15 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">AI Chat Session</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2 days ago at 3:45 PM</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}