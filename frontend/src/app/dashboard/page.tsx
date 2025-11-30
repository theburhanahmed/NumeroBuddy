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
  LogOut,
  Settings,
  Activity,
  Zap,
  FileText,
  BookOpen,
  Bot,
  CreditCard,
  Info,
  Lightbulb
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { DashboardWidget } from '@/components/dashboard/dashboard-widget';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { CoPilotWidget } from '@/components/co-pilot/co-pilot-widget';
import { SmartCalendar } from '@/components/calendar/smart-calendar';
import { dashboardAPI, numerologyAPI, DashboardOverview, DailyReading, NumerologyProfile } from '@/lib/numerology-api';
import { featureDescriptions, getFeatureDescription } from '@/lib/feature-descriptions';
import { FeatureHelp } from '@/components/ui/feature-help';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      loadDashboard();
    }
  }, [user, loading, router]);

  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);
      const data = await dashboardAPI.getOverview();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

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

  if (loading || dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return null;
  }

  const dailyReading = dashboardData.daily_reading;
  const numerologyProfile = dashboardData.numerology_profile;

  return (
    <TooltipProvider>
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
              Welcome back, {user.full_name}!
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
            className="flex items-center gap-3"
          >
            <GlassButton 
              variant="secondary" 
              onClick={() => router.push('/profile')}
              icon={<Settings className="w-5 h-5" />}
            >
              Settings
            </GlassButton>
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

        {/* Today&apos;s Focus - Daily Reading */}
        {dailyReading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <DashboardWidget
              title="Today&apos;s Numerology Focus"
              icon={<Zap className="w-6 h-6" />}
              color="from-purple-500 to-pink-600"
              onClick={() => router.push('/daily-reading')}
              helpText={featureDescriptions['daily-reading'].detailed}
              description="Your personalized daily guidance based on numerology"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {dailyReading.personal_day_number}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Personal Day Number
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(dailyReading.reading_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <FeatureHelp 
                  variant="inline"
                  size="sm"
                  content="Your Personal Day Number reflects the numerological energy of today. Each day has its own vibration that influences your experiences."
                />
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Today&apos;s Affirmation
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    &ldquo;{dailyReading.affirmation}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Lucky Number: </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dailyReading.lucky_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Color: </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{dailyReading.lucky_color}</span>
                  </div>
                </div>
              </div>
            </DashboardWidget>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Insights & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Co-Pilot Widget */}
            <CoPilotWidget compact={false} />
            
            {/* Insights Panel */}
            <InsightsPanel />

            {/* Quick Actions */}
            <DashboardWidget
              title="Quick Actions"
              icon={<Zap className="w-6 h-6" />}
              color="from-blue-500 to-cyan-600"
              helpText="Quick access to the most commonly used features. Click any action to jump directly to that feature."
            >
              <div className="space-y-3">
                {[
                  { key: 'birth-chart', icon: Sparkles, color: 'text-blue-600 dark:text-blue-400' },
                  { key: 'daily-reading', icon: Calendar, color: 'text-purple-600 dark:text-purple-400' },
                  { key: 'ai-chat', icon: MessageCircle, color: 'text-pink-600 dark:text-pink-400' },
                  { key: 'compatibility', icon: Heart, color: 'text-red-600 dark:text-red-400' },
                  { key: 'people', icon: Users, color: 'text-cyan-600 dark:text-cyan-400' },
                  { key: 'reports', icon: FileText, color: 'text-orange-600 dark:text-orange-400' },
                  { key: 'remedies', icon: TrendingUp, color: 'text-green-600 dark:text-green-400' },
                  { key: 'decisions', icon: Lightbulb, color: 'text-emerald-600 dark:text-emerald-400' }
                ].map((action) => {
                  const feature = getFeatureDescription(action.key);
                  if (!feature) return null;
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.key}
                      onClick={() => router.push(feature.path)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-start gap-3 group"
                    >
                      <Icon className={`w-5 h-5 ${action.color} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {feature.short.split('.')[0]}
                        </span>
                        {feature.short.length > 50 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block line-clamp-1">
                            {feature.short.substring(feature.short.indexOf('.') + 1).trim()}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </DashboardWidget>
          </div>

          {/* Right Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {user.subscription_plan 
                        ? user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1)
                        : 'Free'}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {numerologyProfile && (
                <GlassCard variant="elevated" className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Life Path</p>
                      <p className="font-semibold text-gray-900 dark:text-white text-2xl">
                        {numerologyProfile.life_path_number}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              <GlassCard variant="elevated" className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Total Readings</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-2xl">
                      {dashboardData.stats.total_readings}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Features Grid - Organized by Categories */}
            <div className="space-y-8">
                {/* Core Tools */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Core Tools</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="Core Tools"
                      content="Essential numerology tools for understanding your personal numbers and daily guidance. These features form the foundation of your numerology journey."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['birth-chart', 'daily-reading', 'life-path'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* AI & Intelligence */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI & Intelligence</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="AI & Intelligence"
                      content="AI-powered features that provide instant insights, answer questions, and help you make better decisions using numerology."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['ai-chat', 'decisions'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Relationships */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relationships</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="Relationships"
                      content="Tools for analyzing relationships, managing multiple people's profiles, and understanding compatibility through numerology."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['compatibility', 'people'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Reports & Analysis */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analysis</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="Reports & Analysis"
                      content="Create comprehensive numerology reports, browse templates, and generate detailed analyses for yourself or others."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['reports', 'templates', 'numerology-report'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="Services"
                      content="Additional services including expert consultations, personalized remedies, and subscription management."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['consultations', 'remedies'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Account */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account</h2>
                    <FeatureHelp
                      variant="icon"
                      size="sm"
                      title="Account"
                      content="Manage your account settings, subscription, and profile information."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {['subscription', 'profile'].map((key, index) => {
                      const feature = getFeatureDescription(key);
                      if (!feature) return null;
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <DashboardWidget
                            title={feature.short.split('.')[0]}
                            icon={<Icon className="w-6 h-6" />}
                            color={feature.color}
                            description={feature.short}
                            helpText={feature.detailed}
                            onClick={() => router.push(feature.path)}
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.short}</p>
                            <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                              {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </DashboardWidget>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Recent Activity */}
        {dashboardData.recent_activities && dashboardData.recent_activities.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h2>
            <GlassCard variant="default" className="p-6">
              <div className="space-y-4">
                {dashboardData.recent_activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.activity_type_display}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
        </div>
      </div>
    </TooltipProvider>
  );
}
