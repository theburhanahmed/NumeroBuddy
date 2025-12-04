'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Gem, 
  Palette, 
  Sun, 
  Moon, 
  Utensils, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Crown,
  Zap,
  Star
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { numerologyAPI, FullNumerologyReport, RectificationSuggestion } from '@/lib/numerology-api';
import { useToast } from '@/components/ui/use-toast';

interface FullReportProps {
  onUpgrade?: () => void;
}

export function FullReport({ onUpgrade }: FullReportProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [report, setReport] = useState<FullNumerologyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await numerologyAPI.getFullNumerologyReport();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load report');
      toast({
        title: 'Error',
        description: 'Failed to load full numerology report',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRemedyIcon = (type: string) => {
    switch (type) {
      case 'gemstone': return <Gem className="w-5 h-5" />;
      case 'color': return <Palette className="w-5 h-5" />;
      case 'ritual': return <Sun className="w-5 h-5" />;
      case 'mantra': return <Moon className="w-5 h-5" />;
      case 'dietary': return <Utensils className="w-5 h-5" />;
      case 'exercise': return <Activity className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite': return <Crown className="w-5 h-5" />;
      case 'premium': return <Zap className="w-5 h-5" />;
      case 'basic': return <Star className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const FeatureSection = ({ 
    title, 
    available, 
    children, 
    upgradeMessage 
  }: { 
    title: string; 
    available: boolean; 
    children: React.ReactNode;
    upgradeMessage?: string;
  }) => {
    if (!available) {
      return (
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">{upgradeMessage || 'Upgrade to access this feature'}</p>
              <GlassButton onClick={() => onUpgrade?.() || router.push('/subscription')}>
                Upgrade Now
              </GlassButton>
            </div>
          </div>
          <div className="opacity-30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {title}
              <Lock className="w-5 h-5 text-gray-400" />
            </h3>
            {children}
          </div>
        </GlassCard>
      );
    }

    return (
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          {title}
          <Unlock className="w-5 h-5 text-green-500" />
        </h3>
        {children}
      </GlassCard>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Report</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Failed to load report'}</p>
              <GlassButton onClick={loadReport}>Retry</GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Full Numerology Report</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive analysis combining birth date, name, and phone numerology
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white">
                {getTierIcon(report.subscription_tier)}
                <span className="font-semibold capitalize">{report.subscription_tier}</span>
              </div>
            </div>
            {report.user_profile && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="font-semibold">{report.user_profile.full_name}</p>
                </div>
                {report.user_profile.date_of_birth && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="font-semibold">{new Date(report.user_profile.date_of_birth).toLocaleDateString()}</p>
                  </div>
                )}
                {report.user_profile.calculation_date && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Report Generated</p>
                    <p className="font-semibold">{new Date(report.user_profile.calculation_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Birth Date Numerology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Birth Date Numerology</h2>
            {report.birth_date_numerology && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Life Path</p>
                  <p className="text-2xl font-bold">{report.birth_date_numerology.life_path_number}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Destiny</p>
                  <p className="text-2xl font-bold">{report.birth_date_numerology.destiny_number}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Soul Urge</p>
                  <p className="text-2xl font-bold">{report.birth_date_numerology.soul_urge_number}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Personality</p>
                  <p className="text-2xl font-bold">{report.birth_date_numerology.personality_number}</p>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Name Numerology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FeatureSection
            title="Name Numerology"
            available={report.name_numerology_available}
            upgradeMessage="Upgrade to Basic plan or higher to access name numerology analysis"
          >
            {report.name_numerology ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-semibold">{report.name_numerology.name}</p>
                </div>
                {report.name_numerology.numbers && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expression</p>
                      <p className="text-xl font-bold">{report.name_numerology.numbers.expression?.reduced}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Soul Urge</p>
                      <p className="text-xl font-bold">{report.name_numerology.numbers.soul_urge?.reduced}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Personality</p>
                      <p className="text-xl font-bold">{report.name_numerology.numbers.personality?.reduced}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Vibration</p>
                      <p className="text-xl font-bold">{report.name_numerology.numbers.name_vibration}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No name numerology report available. Generate one to see your name analysis.</p>
            )}
          </FeatureSection>
        </motion.div>

        {/* Phone Numerology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FeatureSection
            title="Phone Numerology"
            available={report.phone_numerology_available}
            upgradeMessage="Upgrade to Premium plan or higher to access phone numerology analysis"
          >
            {report.phone_numerology ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="font-semibold">{report.phone_numerology.phone_e164_display || report.phone_numerology.phone_e164}</p>
                </div>
                {report.phone_numerology.computed && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Core Number</p>
                    <p className="text-2xl font-bold">{report.phone_numerology.computed.core_number?.reduced}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No phone numerology report available. Generate one to see your phone analysis.</p>
            )}
          </FeatureSection>
        </motion.div>

        {/* Lo Shu Grid */}
        {report.lo_shu_grid_available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FeatureSection
              title="Lo Shu Grid"
              available={report.lo_shu_grid_available}
              upgradeMessage="Upgrade to Basic plan or higher to access Lo Shu Grid analysis"
            >
              {report.lo_shu_grid && (
                <div className="space-y-4">
                  {report.lo_shu_grid.missing_numbers && report.lo_shu_grid.missing_numbers.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Missing Numbers</p>
                      <div className="flex gap-2">
                        {report.lo_shu_grid.missing_numbers.map((num: number) => (
                          <span key={num} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-400">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {report.lo_shu_grid.strong_numbers && report.lo_shu_grid.strong_numbers.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Strong Numbers</p>
                      <div className="flex gap-2">
                        {report.lo_shu_grid.strong_numbers.map((num: number) => (
                          <span key={num} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-400">
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </FeatureSection>
          </motion.div>
        )}

        {/* Rectification Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FeatureSection
            title="Rectification Suggestions"
            available={report.rectification_suggestions_available}
            upgradeMessage="Upgrade to Basic plan or higher to access personalized rectification suggestions"
          >
            {report.rectification_suggestions && report.rectification_suggestions.length > 0 ? (
              <div className="space-y-4">
                {report.rectification_suggestions.map((suggestion: RectificationSuggestion, index: number) => (
                  <GlassCard key={index} className="p-4" variant="subtle">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${
                        suggestion.type === 'gemstone' ? 'from-purple-500/20 to-indigo-500/20' :
                        suggestion.type === 'color' ? 'from-blue-500/20 to-sky-500/20' :
                        suggestion.type === 'ritual' ? 'from-amber-500/20 to-orange-500/20' :
                        suggestion.type === 'mantra' ? 'from-green-500/20 to-emerald-500/20' :
                        suggestion.type === 'dietary' ? 'from-red-500/20 to-pink-500/20' :
                        'from-teal-500/20 to-cyan-500/20'
                      }`}>
                        {getRemedyIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{suggestion.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority)} bg-opacity-20`}>
                            {suggestion.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{suggestion.description}</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{suggestion.recommendation}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Reason: {suggestion.reason}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No rectification suggestions available at this time.</p>
            )}
          </FeatureSection>
        </motion.div>

        {/* Additional Features for Premium/Elite */}
        {report.detailed_analysis_available && report.detailed_analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <FeatureSection
              title="Detailed Analysis"
              available={report.detailed_analysis_available}
            >
              <div className="space-y-4">
                {Object.entries(report.detailed_analysis).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <h4 className="font-semibold mb-2 capitalize">{key.replace('_', ' ')}</h4>
                    {value && typeof value === 'object' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {value.description || value.title || JSON.stringify(value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FeatureSection>
          </motion.div>
        )}

        {report.compatibility_insights_available && report.compatibility_insights && report.compatibility_insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <FeatureSection
              title="Compatibility Insights"
              available={report.compatibility_insights_available}
            >
              <div className="space-y-4">
                {report.compatibility_insights.map((insight: any, index: number) => (
                  <GlassCard key={index} className="p-4" variant="subtle">
                    <h4 className="font-semibold mb-2">{insight.partner_name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compatibility Score: {insight.compatibility_score}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type: {insight.relationship_type}</p>
                  </GlassCard>
                ))}
              </div>
            </FeatureSection>
          </motion.div>
        )}

        {/* Elite Features */}
        {report.raj_yog_analysis_available && report.raj_yog_analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FeatureSection
              title="Raj Yog Analysis"
              available={report.raj_yog_analysis_available}
              upgradeMessage="Upgrade to Elite plan to access Raj Yog analysis"
            >
              {report.raj_yog_analysis.is_detected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Raj Yog Detected: {report.raj_yog_analysis.yog_name}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Strength Score: {report.raj_yog_analysis.strength_score}%</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No Raj Yog detected in your numerology profile.</p>
              )}
            </FeatureSection>
          </motion.div>
        )}

        {report.yearly_forecast_available && report.yearly_forecast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <FeatureSection
              title="Yearly Forecast"
              available={report.yearly_forecast_available}
              upgradeMessage="Upgrade to Elite plan to access yearly forecast"
            >
              <div className="space-y-4">
                <h4 className="font-semibold">Year {report.yearly_forecast.year}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.yearly_forecast.annual_overview}</p>
                {report.yearly_forecast.major_themes && report.yearly_forecast.major_themes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Major Themes</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {report.yearly_forecast.major_themes.map((theme: string, index: number) => (
                        <li key={index}>{theme}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </FeatureSection>
          </motion.div>
        )}

        {report.expert_recommendations_available && report.expert_recommendations && report.expert_recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <FeatureSection
              title="Expert Recommendations"
              available={report.expert_recommendations_available}
              upgradeMessage="Upgrade to Elite plan to access expert recommendations"
            >
              <div className="space-y-4">
                {report.expert_recommendations.map((rec: any, index: number) => (
                  <GlassCard key={index} className="p-4" variant="subtle">
                    <h4 className="font-semibold mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                  </GlassCard>
                ))}
              </div>
            </FeatureSection>
          </motion.div>
        )}
      </div>
    </div>
  );
}

