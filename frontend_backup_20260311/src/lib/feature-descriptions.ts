import { 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  User, 
  Star,
  Heart,
  TrendingUp,
  Users,
  FileText,
  BookOpen,
  Bot,
  Settings,
  CreditCard,
  Scissors
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface FeatureDescription {
  short: string;
  detailed: string;
  benefits: string[];
  useCase: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

export const featureDescriptions: Record<string, FeatureDescription> = {
  'birth-chart': {
    short: 'View your complete numerology profile with all core numbers',
    detailed: 'Your birth chart displays all your core numerology numbers calculated from your birth date and full name. It includes Life Path, Destiny, Soul Urge, Personality, Attitude, Maturity, and Balance numbers, each with detailed interpretations.',
    benefits: [
      'See all your numerology numbers in one place',
      'Understand the meaning behind each number',
      'Gain insights into your personality and life path',
      'Download as PDF for future reference'
    ],
    useCase: 'Use this when you want a comprehensive overview of your numerology profile or need to understand what your numbers mean.',
    icon: Sparkles,
    color: 'from-blue-500 to-purple-600',
    path: '/birth-chart'
  },
  'daily-reading': {
    short: 'Get personalized daily guidance based on your numerology',
    detailed: 'Receive a unique daily reading tailored to your numerology profile. Each reading includes your Personal Day Number, an affirmation, lucky numbers and colors, and actionable tips for the day.',
    benefits: [
      'Start each day with personalized guidance',
      'Know your lucky numbers and colors',
      'Receive daily affirmations',
      'Get actionable tips for success'
    ],
    useCase: 'Check this every morning to understand the numerological energy of the day and how to make the most of it.',
    icon: Calendar,
    color: 'from-purple-500 to-pink-600',
    path: '/daily-reading'
  },
  'life-path': {
    short: 'Discover your life purpose and path through numerology',
    detailed: 'Your Life Path Number is the most important number in numerology, revealing your life purpose, natural talents, and the lessons you are here to learn. Get an in-depth analysis of what this means for you.',
    benefits: [
      'Understand your life purpose',
      'Discover your natural talents',
      'Learn about challenges and opportunities',
      'Get guidance on career and relationships'
    ],
    useCase: 'Explore this when you want to understand your deeper purpose or are facing major life decisions.',
    icon: User,
    color: 'from-indigo-500 to-purple-600',
    path: '/life-path'
  },
  'ai-chat': {
    short: 'Chat with an AI numerologist for instant insights',
    detailed: 'Ask questions about your numerology profile, get interpretations of numbers, or seek guidance on life decisions. Our AI numerologist has access to your profile and can provide personalized answers.',
    benefits: [
      'Get instant answers to numerology questions',
      'Receive personalized interpretations',
      'Explore your numbers in detail',
      'Get guidance on decisions'
    ],
    useCase: 'Use this when you have specific questions about your numbers or need quick numerology insights.',
    icon: MessageCircle,
    color: 'from-pink-500 to-red-600',
    path: '/ai-chat'
  },
  'compatibility': {
    short: 'Analyze relationships and compatibility through numerology',
    detailed: 'Compare numerology profiles to understand relationship dynamics. Check compatibility with romantic partners, business partners, family members, or friends. Learn about strengths and potential challenges.',
    benefits: [
      'Understand relationship dynamics',
      'Identify compatibility strengths',
      'Discover potential challenges',
      'Get guidance for better relationships'
    ],
    useCase: 'Use this when starting a new relationship, understanding existing relationships, or choosing business partners.',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    path: '/compatibility'
  },
  'remedies': {
    short: 'Get personalized remedies and recommendations',
    detailed: 'Receive customized recommendations for gemstones, colors, mantras, rituals, and other remedies based on your numerology profile. Track your progress as you implement these remedies.',
    benefits: [
      'Discover beneficial gemstones',
      'Learn about lucky colors',
      'Get personalized mantras',
      'Track remedy progress'
    ],
    useCase: 'Use this when you want to enhance positive energies or balance challenging numbers in your chart.',
    icon: TrendingUp,
    color: 'from-green-500 to-teal-600',
    path: '/remedies'
  },
  'people': {
    short: 'Manage numerology profiles for family, friends, and clients',
    detailed: 'Add and manage numerology profiles for multiple people. Calculate their numerology numbers, generate reports, and compare compatibility. Perfect for families or numerology practitioners.',
    benefits: [
      'Store multiple people\'s profiles',
      'Generate reports for others',
      'Compare compatibility easily',
      'Organize by relationships'
    ],
    useCase: 'Use this to manage numerology profiles for your family members, clients, or anyone you want to analyze.',
    icon: Users,
    color: 'from-cyan-500 to-blue-600',
    path: '/people'
  },
  'reports': {
    short: 'Generate detailed numerology reports',
    detailed: 'Create comprehensive numerology reports for yourself or others. Choose from different templates, customize content, and export as PDF. Perfect for keeping records or sharing with others.',
    benefits: [
      'Create professional reports',
      'Choose from multiple templates',
      'Customize report content',
      'Export and share easily'
    ],
    useCase: 'Use this when you need a detailed, shareable numerology report or want to track numerology insights over time.',
    icon: FileText,
    color: 'from-orange-500 to-red-600',
    path: '/reports'
  },
  'templates': {
    short: 'Browse and use numerology report templates',
    detailed: 'Explore a library of numerology report templates. Each template focuses on different aspects like basic profiles, detailed analysis, compatibility reports, or yearly forecasts. Select templates for bulk report generation.',
    benefits: [
      'Access pre-designed templates',
      'Choose templates by purpose',
      'Save time on report creation',
      'Ensure consistent formatting'
    ],
    useCase: 'Use this when you want to create reports with professional formatting or need templates for specific purposes.',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    path: '/templates'
  },
  'consultations': {
    short: 'Book sessions with professional numerologists',
    detailed: 'Schedule consultations with certified numerology experts. Choose from video, phone, or chat sessions. Get personalized readings, ask questions, and receive detailed guidance.',
    benefits: [
      'Access expert numerologists',
      'Get personalized guidance',
      'Ask specific questions',
      'Receive detailed interpretations'
    ],
    useCase: 'Use this when you need in-depth guidance from a professional or have complex questions about your numerology.',
    icon: Users,
    color: 'from-teal-500 to-green-600',
    path: '/consultations'
  },
  'subscription': {
    short: 'Manage your subscription and billing',
    detailed: 'View and manage your subscription plan, billing history, and payment methods. Upgrade or downgrade your plan, view invoices, and access premium features based on your subscription level.',
    benefits: [
      'Manage subscription easily',
      'View billing history',
      'Upgrade for more features',
      'Access premium content'
    ],
    useCase: 'Use this to manage your account subscription, view invoices, or change your plan.',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600',
    path: '/subscription'
  },
  'decisions': {
    short: 'Get numerology guidance for important decisions',
    detailed: 'Use numerology to guide your decision-making process. Enter dates or options, and get numerological insights to help you choose the best path forward based on timing and numbers.',
    benefits: [
      'Make better decisions',
      'Understand timing factors',
      'Get numerological insights',
      'Reduce decision anxiety'
    ],
    useCase: 'Use this when facing important decisions and want numerological guidance on timing and choices.',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    path: '/decisions'
  },
  'numerology-report': {
    short: 'Access comprehensive numerology analysis reports',
    detailed: 'View your complete numerology analysis with all numbers, interpretations, and insights in a structured report format. Includes detailed explanations, career guidance, relationship insights, and more.',
    benefits: [
      'Complete numerology analysis',
      'Detailed interpretations',
      'Career and life guidance',
      'Comprehensive insights'
    ],
    useCase: 'Use this when you want a full numerology analysis report with all details in one place.',
    icon: FileText,
    color: 'from-slate-500 to-gray-600',
    path: '/numerology-report'
  },
  'profile': {
    short: 'Manage your account settings and profile',
    detailed: 'Update your personal information, birth details, name, and account settings. Your profile information is used to calculate your numerology numbers, so keep it accurate.',
    benefits: [
      'Keep information up to date',
      'Ensure accurate calculations',
      'Manage account settings',
      'Update preferences'
    ],
    useCase: 'Use this to update your birth information, name changes, or account settings.',
    icon: Settings,
    color: 'from-gray-500 to-slate-600',
    path: '/profile'
  }
};

export function getFeatureDescription(key: string): FeatureDescription | undefined {
  return featureDescriptions[key];
}

export function getAllFeatures(): FeatureDescription[] {
  return Object.values(featureDescriptions);
}

