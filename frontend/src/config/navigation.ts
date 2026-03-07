/**
 * Single source of truth for app navigation.
 * Used by CosmicNavbar, MobileBottomNav, and MobileMoreSheet.
 */
import type { LucideIcon } from 'lucide-react';
import {
  TrendingUpIcon,
  HeartIcon,
  UsersIcon,
  Users2Icon,
  CalendarIcon,
  StarIcon,
  HashIcon,
  MountainIcon,
  Grid3x3Icon,
  BookOpenIcon,
  ClockIcon,
  FileTextIcon,
  PhoneIcon,
  BriefcaseIcon,
  CarIcon,
  FileText,
  Plus,
  GitCompare as Compare,
  FileStack,
  SparklesIcon,
  HomeIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  VideoIcon,
  UserIcon,
} from 'lucide-react';

export interface SubmenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface MainNavItem {
  label: string;
  path?: string;
  hasSubmenu?: boolean;
  action?: () => void;
}

/** Submenus keyed by parent nav label. Injected with openChat at runtime for Chat. */
export const submenuItems: Record<string, SubmenuItem[]> = {
  'My Numerology': [
    { label: 'Life Path', path: '/life-path', icon: TrendingUpIcon },
    { label: 'Birth Chart', path: '/birth-chart', icon: StarIcon },
    { label: 'All Numbers', path: '/my-numerology/all-numbers', icon: HashIcon },
    { label: 'Pinnacles & Challenges', path: '/my-numerology/pinnacles', icon: MountainIcon },
    { label: 'Lo Shu Grid', path: '/lo-shu-grid', icon: Grid3x3Icon },
    { label: 'Karmic Analysis', path: '/my-numerology/karmic', icon: SparklesIcon },
  ],
  Relationships: [
    { label: 'Compatibility', path: '/compatibility', icon: HeartIcon },
    { label: 'Compare People', path: '/relationships/compare', icon: UsersIcon },
    { label: 'Family Numerology', path: '/generational-numerology', icon: Users2Icon },
  ],
  'Timing & Cycles': [
    { label: 'Daily Reading', path: '/daily-reading', icon: BookOpenIcon },
    { label: 'Forecasts', path: '/forecasts', icon: TrendingUpIcon },
    { label: 'Auspicious Dates', path: '/auspicious-dates', icon: CalendarIcon },
    { label: 'Personal Cycles', path: '/timing-cycles/personal', icon: ClockIcon },
  ],
  Tools: [
    { label: 'Name Analysis', path: '/name-numerology', icon: FileTextIcon },
    { label: 'Phone Analysis', path: '/phone-numerology', icon: PhoneIcon },
    { label: 'Business Analysis', path: '/business-name-numerology', icon: BriefcaseIcon },
    { label: 'Asset Analysis', path: '/tools/assets', icon: CarIcon },
  ],
  Reports: [
    { label: 'My Reports', path: '/reports', icon: FileText },
    { label: 'Generate Reports', path: '/reports/generate', icon: Plus },
    { label: 'Combine Reports', path: '/reports/combine', icon: Compare },
    { label: 'Bulk Generate', path: '/reports/bulk-generate', icon: FileStack },
  ],
};

/** Main nav items for desktop (CosmicNavbar). action for Chat is set at runtime. */
export function getMainNavItems(openChat: () => void): MainNavItem[] {
  return [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Numerology', path: '/my-numerology', hasSubmenu: true },
    { label: 'Relationships', path: '/relationships', hasSubmenu: true },
    { label: 'Timing & Cycles', path: '/timing-cycles', hasSubmenu: true },
    { label: 'Tools', path: '/tools', hasSubmenu: true },
    { label: 'Reports', path: '/reports', hasSubmenu: true },
    { label: 'Remedies', path: '/remedies' },
    { label: 'Chat', action: openChat },
    { label: 'Consultations', path: '/consultations' },
  ];
}

/** Mobile bottom bar items. */
export const mobileBottomNavItems = [
  { id: 'home', label: 'Home', icon: HomeIcon, path: '/dashboard' },
  { id: 'numbers', label: 'My Numbers', icon: HashIcon, path: '/my-numerology' },
  { id: 'timing', label: 'Timing', icon: ClockIcon, path: '/timing-cycles' },
  { id: 'chat', label: 'Chat', icon: MessageSquareIcon, action: 'chat' as const },
  { id: 'more', label: 'More', icon: MoreHorizontalIcon, action: 'more' as const },
];

/** Links shown in the mobile "More" sheet. */
export const mobileMoreLinks = [
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { label: 'Reports', path: '/reports', icon: FileTextIcon },
  { label: 'Consultations', path: '/consultations', icon: VideoIcon },
  { label: 'Profile', path: '/profile', icon: UserIcon },
];
