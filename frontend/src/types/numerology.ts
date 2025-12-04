/**
 * TypeScript type definitions for numerology features.
 */

export interface NumerologyProfile {
  id: string;
  life_path_number: number;
  destiny_number: number;
  soul_urge_number: number;
  personality_number: number;
  attitude_number: number;
  maturity_number: number;
  balance_number: number;
  personal_year_number: number;
  personal_month_number: number;
  calculation_system: 'pythagorean' | 'chaldean';
  calculated_at: string;
  updated_at: string;
}

export interface NumberInterpretation {
  number: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  career: string[];
  relationships: string;
  life_purpose: string;
}

export interface LoShuGrid {
  grid: {
    [key: string]: {
      number: number;
      count: number;
      is_present: boolean;
      strength: 'strong' | 'present' | 'missing';
      meaning: string;
    };
  };
  missing_numbers: number[];
  strong_numbers: number[];
  number_frequency: Record<number, number>;
  interpretation: string;
}

export interface BirthChart {
  profile: NumerologyProfile;
  interpretations: {
    life_path_number: NumberInterpretation;
    destiny_number: NumberInterpretation;
    soul_urge_number: NumberInterpretation;
    personality_number: NumberInterpretation;
    attitude_number: NumberInterpretation;
    maturity_number: NumberInterpretation;
    balance_number: NumberInterpretation;
    personal_year_number: NumberInterpretation;
    personal_month_number: NumberInterpretation;
  };
  lo_shu_grid?: LoShuGrid;
}

export interface DailyReading {
  id: string;
  reading_date: string;
  personal_day_number: number;
  lucky_number: number;
  lucky_color: string;
  auspicious_time: string;
  activity_recommendation: string;
  warning: string;
  affirmation: string;
  actionable_tip: string;
  raj_yog_status?: string | null;
  raj_yog_insight?: string | null;
  llm_explanation?: string | null;
  explanation_id?: string | null;
  generated_at: string;
}

export interface ReadingHistory {
  count: number;
  page: number;
  page_size: number;
  results: DailyReading[];
}

export type NumberType = 
  | 'life_path_number'
  | 'destiny_number'
  | 'soul_urge_number'
  | 'personality_number'
  | 'attitude_number'
  | 'maturity_number'
  | 'balance_number'
  | 'personal_year_number'
  | 'personal_month_number';

export interface NumberCardData {
  type: NumberType;
  value: number;
  name: string;
  description: string;
  color: 'purple' | 'gold' | 'blue';
}

// New type definitions for additional features

export interface LifePathAnalysis {
  number: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  career: string[];
  relationships: string;
  advice: string;
}

export interface CompatibilityCheck {
  id: string;
  user: string;
  partner_name: string;
  partner_birth_date: string;
  relationship_type: 'romantic' | 'business' | 'friendship' | 'family';
  compatibility_score: number;
  strengths: string[];
  challenges: string[];
  advice: string;
  created_at: string;
}

export interface Remedy {
  id: string;
  user: string;
  remedy_type: 'gemstone' | 'color' | 'ritual' | 'mantra' | 'dietary' | 'exercise';
  title: string;
  description: string;
  recommendation: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RemedyTracking {
  id: string;
  user: string;
  remedy: string;
  date: string;
  is_completed: boolean;
  notes: string;
  created_at: string;
}

export interface Expert {
  id: string;
  name: string;
  email: string;
  specialty: 'relationship' | 'career' | 'spiritual' | 'health' | 'general';
  experience_years: number;
  rating: number;
  bio: string;
  profile_picture_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  user: string;
  expert: string;
  expert_name: string;
  expert_specialty: string;
  consultation_type: 'video' | 'chat' | 'phone';
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
  review?: ConsultationReview;
}

export interface ConsultationReview {
  id: string;
  consultation: string;
  rating: number;
  review_text: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface PinnacleCycle {
  number: number;
  age: string;
  title: string;
}

export interface NumerologyReport {
  full_name: string;
  birth_date: string;
  life_path_number: number;
  life_path_title: string;
  destiny_number: number;
  destiny_title: string;
  soul_urge_number: number;
  soul_urge_title: string;
  personality_number: number;
  personality_title: string;
  birthday_number: number;
  birthday_title: string;
  challenge_number: number;
  challenge_title: string;
  pinnacle_cycle: PinnacleCycle[];
  summary: string;
}

export interface RajYogDetection {
  id: string;
  is_detected: boolean;
  yog_type: 'leadership' | 'spiritual' | 'material' | 'creative' | 'service' | 'master' | 'other' | null;
  yog_name: string | null;
  strength_score: number;
  contributing_numbers: {
    life_path: number;
    destiny: number;
    soul_urge?: number;
    personality?: number;
  };
  detected_combinations: Array<{
    type: string;
    name: string;
    numbers: Record<string, number>;
    description: string;
  }>;
  calculation_system: 'pythagorean' | 'chaldean';
  detected_at: string;
  updated_at: string;
}

export interface Explanation {
  id: string;
  explanation_type: 'raj_yog' | 'daily' | 'weekly' | 'yearly' | 'number' | 'general';
  title: string;
  content: string;
  llm_provider: string | null;
  llm_model: string | null;
  tokens_used: number | null;
  cost: number | null;
  context_data: Record<string, any>;
  is_cached: boolean;
  generated_at: string;
  expires_at: string | null;
}

export interface WeeklyReport {
  id: string;
  week_start_date: string;
  week_end_date: string;
  week_number: number;
  year: number;
  weekly_number: number;
  personal_year_number: number;
  personal_month_number: number;
  main_theme: string;
  weekly_summary: string;
  daily_insights: Array<{
    date: string;
    day_name: string;
    personal_day_number: number;
    lucky_number: number | null;
    lucky_color: string | null;
    activity: string | null;
    affirmation: string | null;
    raj_yog_status: string | null;
  }>;
  weekly_trends: {
    most_common_day_number: number | null;
    number_frequency: Record<number, number>;
    raj_yog_days: number;
    total_days: number;
    energy_pattern: {
      high: number;
      medium: number;
      low: number;
    };
    dominant_energy: 'high' | 'medium' | 'low';
  };
  recommendations: string[];
  challenges: string[];
  opportunities: string[];
  raj_yog_status: string | null;
  raj_yog_insights: string | null;
  llm_summary: string | null;
  explanation_id: string | null;
  generated_at: string;
  updated_at: string;
}

export interface YearlyReport {
  id: string;
  year: number;
  personal_year_number: number;
  personal_year_cycle: 'beginning' | 'middle' | 'end';
  annual_overview: string;
  major_themes: string[];
  month_by_month: Record<string, {
    month_name: string;
    personal_month_number: number;
    theme: string;
    description: string;
  }>;
  key_dates: Array<{
    date: string;
    type: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
  annual_raj_yog_status: string | null;
  raj_yog_patterns: Array<{
    type: string;
    description: string;
    strength: number;
    active_weeks: number;
  }>;
  raj_yog_insights: string | null;
  llm_overview: string | null;
  explanation_id: string | null;
  generated_at: string;
  updated_at: string;
}
