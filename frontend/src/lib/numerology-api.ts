/**
 * Numerology API client for NumerAI frontend.
 */
import apiClient from './api-client';

// Type definitions
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
  generated_at: string;
}

export interface ReadingHistory {
  count: number;
  page: number;
  page_size: number;
  results: DailyReading[];
}

export interface AIChatResponse {
  conversation_id: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    created_at: string;
  };
  suggested_followups: string[];
}

export interface AIConversation {
  id: string;
  user: string;
  started_at: string;
  last_message_at: string | null;
  message_count: number;
  is_active: boolean;
}

export interface AIMessage {
  id: string;
  conversation: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used: number | null;
  created_at: string;
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

// New type definitions for multi-person numerology
export interface Person {
  id: string;
  name: string;
  birth_date: string;
  relationship: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonNumerologyProfile {
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

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  report_type: string;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneratedReport {
  id: string;
  user: string;
  person: string;
  template: string;
  title: string;
  content: any;
  generated_at: string;
  expires_at: string | null;
}

// API methods
export const numerologyAPI = {
  /**
   * Calculate numerology profile for the current user.
   */
  async calculateProfile(system: 'pythagorean' | 'chaldean' = 'pythagorean'): Promise<{
    message: string;
    profile: NumerologyProfile;
  }> {
    const response = await apiClient.post('/numerology/calculate/', { system });
    return response.data;
  },

  /**
   * Get the user's numerology profile.
   */
  async getProfile(): Promise<NumerologyProfile> {
    const response = await apiClient.get('/numerology/profile/');
    return response.data;
  },

  /**
   * Get the user's birth chart with interpretations.
   */
  async getBirthChart(): Promise<BirthChart> {
    const response = await apiClient.get('/numerology/birth-chart/');
    return response.data;
  },

  /**
   * Get daily reading for a specific date or today.
   */
  async getDailyReading(date?: string): Promise<DailyReading> {
    const params = date ? { date } : {};
    const response = await apiClient.get('/numerology/daily-reading/', { params });
    return response.data;
  },

  /**
   * Get reading history with pagination.
   */
  async getReadingHistory(page: number = 1, pageSize: number = 10): Promise<ReadingHistory> {
    const response = await apiClient.get('/numerology/reading-history/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  /**
   * Chat with AI numerologist.
   */
  async aiChat(message: string): Promise<AIChatResponse> {
    const response = await apiClient.post('/ai/chat/', { message });
    return response.data;
  },

  /**
   * Get user's AI conversations.
   */
  async getConversations(): Promise<AIConversation[]> {
    const response = await apiClient.get('/ai/conversations/');
    return response.data;
  },

  /**
   * Get messages for a specific conversation.
   */
  async getConversationMessages(conversationId: string): Promise<AIMessage[]> {
    const response = await apiClient.get(`/ai/conversations/${conversationId}/messages/`);
    return response.data;
  },

  // New API methods for additional features

  /**
   * Get detailed life path analysis for the user.
   */
  async getLifePathAnalysis(): Promise<LifePathAnalysis> {
    const response = await apiClient.get('/numerology/life-path-analysis/');
    return response.data;
  },

  /**
   * Check compatibility with another person.
   */
  async checkCompatibility(data: {
    partner_name: string;
    partner_birth_date: string;
    relationship_type: 'romantic' | 'business' | 'friendship' | 'family';
  }): Promise<CompatibilityCheck> {
    const response = await apiClient.post('/numerology/compatibility-check/', data);
    return response.data;
  },

  /**
   * Get user's compatibility check history.
   */
  async getCompatibilityHistory(): Promise<CompatibilityCheck[]> {
    const response = await apiClient.get('/numerology/compatibility-history/');
    return response.data;
  },

  /**
   * Get personalized remedies for the user.
   */
  async getPersonalizedRemedies(): Promise<Remedy[]> {
    const response = await apiClient.get('/numerology/remedies/');
    return response.data;
  },

  /**
   * Track remedy practice.
   */
  async trackRemedy(remedyId: string, data: {
    date: string;
    is_completed: boolean;
    notes?: string;
  }): Promise<RemedyTracking> {
    const response = await apiClient.post(`/numerology/remedies/${remedyId}/track/`, data);
    return response.data;
  },

  /**
   * Get full numerology report.
   */
  async getFullNumerologyReport(): Promise<NumerologyReport> {
    const response = await apiClient.get('/numerology/full-report/');
    return response.data;
  },

  /**
   * Get Lo Shu Grid.
   */
  async getLoShuGrid(): Promise<LoShuGrid> {
    const response = await apiClient.get('/numerology/lo-shu-grid/');
    return response.data;
  }
};

// API methods for experts and consultations
export const expertAPI = {
  /**
   * Get list of available experts.
   */
  async getExperts(): Promise<Expert[]> {
    const response = await apiClient.get('/experts/');
    return response.data;
  },

  /**
   * Get details of a specific expert.
   */
  async getExpert(expertId: string): Promise<Expert> {
    const response = await apiClient.get(`/experts/${expertId}/`);
    return response.data;
  }
};

// API methods for consultations
export const consultationAPI = {
  /**
   * Book a consultation with an expert.
   */
  async bookConsultation(data: {
    expert: string;
    consultation_type: 'video' | 'chat' | 'phone';
    scheduled_at: string;
    duration_minutes?: number;
    notes?: string;
  }): Promise<Consultation> {
    const response = await apiClient.post('/consultations/book/', data);
    return response.data;
  },

  /**
   * Get user's upcoming consultations.
   */
  async getUpcomingConsultations(): Promise<Consultation[]> {
    const response = await apiClient.get('/consultations/upcoming/');
    return response.data;
  },

  /**
   * Get user's past consultations.
   */
  async getPastConsultations(): Promise<Consultation[]> {
    const response = await apiClient.get('/consultations/past/');
    return response.data;
  },

  /**
   * Rate a completed consultation.
   */
  async rateConsultation(consultationId: string, data: {
    rating: number;
    review_text?: string;
    is_anonymous?: boolean;
  }): Promise<ConsultationReview> {
    const response = await apiClient.post(`/consultations/${consultationId}/rate/`, data);
    return response.data;
  }
};

// API methods for people management
export const peopleAPI = {
  /**
   * Get list of people for the current user.
   */
  async getPeople(): Promise<Person[]> {
    const response = await apiClient.get('/people/');
    // Handle paginated response
    if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Create a new person.
   */
  async createPerson(data: {
    name: string;
    birth_date: string;
    relationship: string;
    notes?: string;
  }): Promise<Person> {
    const response = await apiClient.post('/people/', data);
    return response.data;
  },

  /**
   * Get details of a specific person.
   */
  async getPerson(personId: string): Promise<Person> {
    const response = await apiClient.get(`/people/${personId}/`);
    return response.data;
  },

  /**
   * Update a specific person.
   */
  async updatePerson(personId: string, data: {
    name?: string;
    birth_date?: string;
    relationship?: string;
    notes?: string;
    is_active?: boolean;
  }): Promise<Person> {
    const response = await apiClient.put(`/people/${personId}/`, data);
    return response.data;
  },

  /**
   * Delete a specific person (soft delete).
   */
  async deletePerson(personId: string): Promise<void> {
    await apiClient.delete(`/people/${personId}/`);
  },

  /**
   * Calculate numerology profile for a specific person.
   */
  async calculatePersonNumerology(personId: string, system: 'pythagorean' | 'chaldean' = 'pythagorean'): Promise<{
    message: string;
    profile: PersonNumerologyProfile;
  }> {
    const response = await apiClient.post(`/people/${personId}/calculate/`, { system });
    return response.data;
  },

  /**
   * Get numerology profile for a specific person.
   */
  async getPersonNumerologyProfile(personId: string): Promise<PersonNumerologyProfile | null> {
    try {
      const response = await apiClient.get(`/people/${personId}/profile/`);
      return response.data;
    } catch (error: any) {
      // Handle 404 errors gracefully - it's okay if profile doesn't exist yet
      if (error.response?.status === 404) {
        return null;
      }
      // Re-throw other errors
      throw error;
    }
  }
};

// API methods for report templates and generation
export const reportAPI = {
  /**
   * Get list of available report templates.
   */
  async getReportTemplates(): Promise<ReportTemplate[]> {
    const response = await apiClient.get('/report-templates/');
    // Handle paginated response
    if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Generate a new report for a person using a template.
   */
  async generateReport(data: {
    person_id: string;
    template_id: string;
  }): Promise<GeneratedReport> {
    const response = await apiClient.post('/reports/generate/', data);
    return response.data;
  },

  /**
   * Generate multiple reports at once.
   */
  async bulkGenerateReports(data: {
    person_ids: string[];
    template_ids: string[];
  }): Promise<{
    reports: GeneratedReport[];
    errors: string[];
  }> {
    const response = await apiClient.post('/reports/bulk-generate/', data);
    return response.data;
  },

  /**
   * Get list of user's generated reports.
   */
  async getGeneratedReports(): Promise<GeneratedReport[]> {
    const response = await apiClient.get('/reports/');
    // Handle paginated response
    if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get a specific generated report.
   */
  async getGeneratedReport(reportId: string): Promise<GeneratedReport> {
    const response = await apiClient.get(`/reports/${reportId}/`);
    return response.data;
  }
};

// Dashboard API types and methods
export interface DashboardWidget {
  id: string;
  widget_type: string;
  widget_type_display: string;
  position: number;
  is_visible: boolean;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  activity_type: string;
  activity_type_display: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface QuickInsight {
  id: string;
  insight_type: string;
  insight_type_display: string;
  title: string;
  content: string;
  action_url?: string;
  action_text?: string;
  priority: number;
  is_read: boolean;
  expires_at?: string;
  created_at: string;
}

export interface DashboardOverview {
  widgets: DashboardWidget[];
  insights: QuickInsight[];
  recent_activities: UserActivity[];
  daily_reading?: DailyReading;
  numerology_profile?: NumerologyProfile;
  upcoming_events: any[];
  stats: {
    total_readings: number;
    profile_calculated: boolean;
    unread_insights: number;
  };
}

export const dashboardAPI = {
  /**
   * Get unified dashboard overview.
   */
  async getOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get('/dashboard/overview/');
    return response.data;
  },

  /**
   * Get user's dashboard widgets.
   */
  async getWidgets(): Promise<DashboardWidget[]> {
    const response = await apiClient.get('/dashboard/widgets/');
    return response.data;
  },

  /**
   * Create or update a dashboard widget.
   */
  async createWidget(data: {
    widget_type: string;
    position?: number;
    config?: Record<string, any>;
  }): Promise<DashboardWidget> {
    const response = await apiClient.post('/dashboard/widgets/', data);
    return response.data;
  },

  /**
   * Update a dashboard widget.
   */
  async updateWidget(widgetId: string, data: Partial<DashboardWidget>): Promise<DashboardWidget> {
    const response = await apiClient.put(`/dashboard/widgets/${widgetId}/`, data);
    return response.data;
  },

  /**
   * Delete a dashboard widget.
   */
  async deleteWidget(widgetId: string): Promise<void> {
    await apiClient.delete(`/dashboard/widgets/${widgetId}/`);
  },

  /**
   * Reorder dashboard widgets.
   */
  async reorderWidgets(widgetPositions: Array<{ id: string; position: number }>): Promise<DashboardWidget[]> {
    const response = await apiClient.post('/dashboard/widgets/reorder/', {
      widget_positions: widgetPositions
    });
    return response.data;
  },

  /**
   * Get AI-generated insights.
   */
  async getInsights(limit?: number, unreadOnly?: boolean): Promise<QuickInsight[]> {
    const params: any = {};
    if (limit) params.limit = limit;
    if (unreadOnly) params.unread_only = 'true';
    const response = await apiClient.get('/dashboard/insights/', { params });
    return response.data;
  },

  /**
   * Mark an insight as read.
   */
  async markInsightRead(insightId: string): Promise<QuickInsight> {
    const response = await apiClient.post(`/dashboard/insights/${insightId}/mark-read/`);
    return response.data;
  }
};

// Calendar API types and methods
export interface NumerologyEvent {
  id: string;
  event_type: string;
  event_type_display: string;
  event_date: string;
  title: string;
  description: string;
  numerology_number?: number;
  importance: number;
  is_recurring: boolean;
  created_at: string;
}

export interface PersonalCycle {
  id: string;
  cycle_type: string;
  cycle_type_display: string;
  cycle_number: number;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
}

export interface AuspiciousDate {
  id: string;
  activity_type: string;
  activity_type_display: string;
  activity_description: string;
  auspicious_date: string;
  numerology_score: number;
  reasoning: string;
  created_at: string;
}

export interface CalendarReminder {
  id: string;
  reminder_type: string;
  reminder_type_display: string;
  title: string;
  description: string;
  reminder_date: string;
  reminder_time?: string;
  numerology_context: string;
  is_completed: boolean;
  is_recurring: boolean;
  recurrence_pattern: string;
  created_at: string;
  updated_at: string;
}

export interface DateInsight {
  date: string;
  personal_day_number: number;
  personal_year_number: number;
  personal_month_number: number;
  weekday: string;
  insight: string;
}

export const calendarAPI = {
  /**
   * Get numerology events for a date range.
   */
  async getEvents(startDate?: string, endDate?: string): Promise<NumerologyEvent[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await apiClient.get('/calendar/events/', { params });
    // Handle paginated response
    if (response.data && 'results' in response.data) {
      return response.data.results;
    }
    // Fallback for non-paginated response
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Find auspicious dates for activities.
   */
  async findAuspiciousDates(data: {
    activity_type?: string;
    start_date?: string;
    end_date?: string;
    preferred_numbers?: number[];
  }): Promise<Array<{
    date: string;
    personal_day_number: number;
    score: number;
    reasoning: string;
  }>> {
    const params: any = {};
    if (data.activity_type) params.activity_type = data.activity_type;
    if (data.start_date) params.start_date = data.start_date;
    if (data.end_date) params.end_date = data.end_date;
    if (data.preferred_numbers) params.preferred_numbers = data.preferred_numbers.join(',');
    const response = await apiClient.get('/calendar/auspicious-dates/', { params });
    return response.data;
  },

  /**
   * Create a calendar reminder.
   */
  async createReminder(data: {
    reminder_type: string;
    title: string;
    description?: string;
    reminder_date: string;
    reminder_time?: string;
    numerology_context?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
  }): Promise<CalendarReminder> {
    const response = await apiClient.post('/calendar/reminders/', data);
    return response.data;
  },

  /**
   * Get personal cycles.
   */
  async getPersonalCycles(startDate?: string, daysAhead?: number): Promise<Array<{
    type: string;
    date: string;
    number: number;
    title: string;
  }>> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (daysAhead) params.days_ahead = daysAhead;
    const response = await apiClient.get('/calendar/cycles/', { params });
    return response.data;
  },

  /**
   * Get numerology insight for a specific date.
   */
  async getDateInsight(date?: string): Promise<DateInsight> {
    const params: any = {};
    if (date) params.date = date;
    const response = await apiClient.get('/calendar/date-insight/', { params });
    return response.data;
  }
};

// Co-Pilot API types and methods
export interface CoPilotSuggestion {
  type: string;
  title: string;
  content: string;
  action_url?: string;
  action_text?: string;
  priority: number;
}

export interface DecisionAnalysis {
  decision_id?: string;
  decision_text: string;
  decision_date: string;
  personal_day_number: number;
  personal_year_number: number;
  personal_month_number: number;
  timing_score: number;
  timing_reasoning: string[];
  recommendation: string;
  suggested_actions: string[];
}

export const coPilotAPI = {
  /**
   * Get proactive suggestions from Co-Pilot.
   */
  async getSuggestions(): Promise<CoPilotSuggestion[]> {
    const response = await apiClient.post('/ai-co-pilot/suggest/');
    return response.data;
  },

  /**
   * Analyze a decision with numerology.
   */
  async analyzeDecision(data: {
    decision_text: string;
    decision_date?: string;
  }): Promise<DecisionAnalysis> {
    const response = await apiClient.post('/ai-co-pilot/analyze-decision/', data);
    return response.data;
  },

  /**
   * Get personalized insights.
   */
  async getInsights(): Promise<CoPilotSuggestion[]> {
    const response = await apiClient.get('/ai-co-pilot/insights/');
    return response.data;
  }
};

// Decision Engine API types and methods
export interface Decision {
  id: string;
  decision_text: string;
  decision_category: string;
  decision_date: string;
  timing_score: number;
  recommendation: string;
  is_made: boolean;
  outcome_recorded: boolean;
}

export const decisionAPI = {
  /**
   * Analyze a decision.
   */
  async analyzeDecision(data: {
    decision_text: string;
    decision_category?: string;
    decision_date?: string;
  }): Promise<DecisionAnalysis> {
    const response = await apiClient.post('/decisions/analyze/', data);
    return response.data;
  },

  /**
   * Get decision history.
   */
  async getHistory(limit?: number): Promise<Decision[]> {
    const params: any = {};
    if (limit) params.limit = limit;
    const response = await apiClient.get('/decisions/history/', { params });
    return response.data;
  },

  /**
   * Record decision outcome.
   */
  async recordOutcome(decisionId: string, data: {
    outcome_type: string;
    outcome_description: string;
    satisfaction_score?: number;
    actual_date?: string;
    notes?: string;
  }): Promise<void> {
    await apiClient.post(`/decisions/${decisionId}/outcome/`, data);
  },

  /**
   * Get decision recommendations.
   */
  async getRecommendations(category?: string): Promise<any[]> {
    const params: any = {};
    if (category) params.category = category;
    const response = await apiClient.get('/decisions/recommendations/', { params });
    return response.data;
  },

  /**
   * Get success rate.
   */
  async getSuccessRate(): Promise<{
    total_decisions: number;
    success_rate: number;
    average_satisfaction: number;
  }> {
    const response = await apiClient.get('/decisions/success-rate/');
    return response.data;
  }
};

// Analytics API types and methods
export interface PersonalAnalytics {
  period_days: number;
  total_actions: number;
  engagement_score: number;
  feature_usage: Array<{ action_type: string; count: number }>;
  daily_activity: Record<string, number>;
  average_daily_actions: number;
}

export const analyticsAPI = {
  /**
   * Get personal analytics.
   */
  async getPersonalAnalytics(days?: number): Promise<PersonalAnalytics> {
    const params: any = {};
    if (days) params.days = days;
    const response = await apiClient.get('/analytics/personal/', { params });
    return response.data;
  },

  /**
   * Get behavioral insights.
   */
  async getInsights(): Promise<any[]> {
    const response = await apiClient.get('/analytics/insights/');
    return response.data;
  },

  /**
   * Get growth metrics.
   */
  async getGrowthMetrics(periodDays?: number): Promise<any> {
    const params: any = {};
    if (periodDays) params.period_days = periodDays;
    const response = await apiClient.get('/analytics/growth/', { params });
    return response.data;
  },

  /**
   * Track behavior.
   */
  async trackBehavior(data: {
    action_type: string;
    action_details?: Record<string, any>;
    session_id?: string;
  }): Promise<void> {
    await apiClient.post('/analytics/track/', data);
  }
};

// Knowledge Graph API types and methods
export const knowledgeGraphAPI = {
  /**
   * Discover patterns.
   */
  async discoverPatterns(): Promise<any[]> {
    const response = await apiClient.get('/knowledge-graph/patterns/');
    return response.data;
  },

  /**
   * Find number connections.
   */
  async findConnections(number: number): Promise<any[]> {
    const response = await apiClient.get('/knowledge-graph/connections/', {
      params: { number }
    });
    return response.data;
  },

  /**
   * Generate insights.
   */
  async generateInsights(): Promise<any[]> {
    const response = await apiClient.get('/knowledge-graph/insights/');
    return response.data;
  },

  /**
   * Query graph.
   */
  async queryGraph(queryType: string, params: Record<string, any>): Promise<any> {
    const response = await apiClient.post('/knowledge-graph/query/', {
      query_type: queryType,
      params
    });
    return response.data;
  }
};
