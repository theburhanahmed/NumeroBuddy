import apiClient from './api-client';

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
  birth_date?: string;
  full_name?: string;
}

export interface DailyReadingParams {
  date?: string;
}

export interface DashboardInsight {
  type: string;
  title: string;
  description: string;
  priority?: string;
  category?: string;
}

export interface DashboardActivityItem {
  type: string;
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  path?: string;
}

export interface DashboardRecommendation {
  type: string;
  title: string;
  description: string;
  path?: string;
  priority?: string;
  category?: string;
}

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedDate?: string;
}

export interface PlatformStats {
  users_online: number;
  readings_today: number;
  satisfaction_rate: number;
  avg_response_time: number;
}

export const numerologyAPI = {
  async getHealth() {
    const response = await apiClient.get('/api/v1/health/');
    return response.data;
  },

  async getNumerologyProfile(): Promise<NumerologyProfile | null> {
    const response = await apiClient.get('/api/v1/numerology/profile/');
    return response.data as NumerologyProfile;
  },

  async getBirthChart() {
    const response = await apiClient.get('/api/v1/numerology/birth-chart/');
    return response.data;
  },

  async getLoShuGrid(params?: { enhanced?: boolean }) {
    const response = await apiClient.get('/api/v1/numerology/lo-shu-grid/', {
      params,
    });
    return response.data;
  },

  async getLifePathAnalysis() {
    const response = await apiClient.get('/api/v1/numerology/life-path-analysis/');
    return response.data;
  },

  async getFullReport() {
    const response = await apiClient.get('/api/v1/numerology/full-report/');
    return response.data;
  },

  async getDailyReading(params: DailyReadingParams = {}) {
    const response = await apiClient.get('/api/v1/numerology/daily-reading/', {
      params,
    });
    return response.data;
  },

  async checkCompatibility(data: {
    partner_name: string;
    partner_birth_date: string;
    relationship_type?: string;
  }) {
    const response = await apiClient.post('/api/v1/numerology/compatibility-check/', data);
    return response.data;
  },

  async getCompatibilityHistory(params?: { page?: number; page_size?: number }) {
    const response = await apiClient.get('/api/v1/numerology/compatibility-history/', {
      params,
    });
    return response.data;
  },

  async getForecasts(params?: { year?: number }) {
    const response = await apiClient.get('/api/v1/numerology/predictive/', {
      params,
    });
    return response.data;
  },

  async getRemedies() {
    const response = await apiClient.get('/api/v1/numerology/remedies/');
    return response.data;
  },

  async analyzeBusiness(data: {
    business_name: string;
    registration_number?: string;
    launch_date?: string;
  }) {
    const response = await apiClient.post('/api/v1/numerology/business/', data);
    return response.data;
  },

  async analyzePhoneAsset(phone_number: string) {
    const response = await apiClient.post('/api/v1/numerology/phone-asset/', { phone_number });
    return response.data;
  },

  async analyzeVehicle(license_plate: string) {
    const response = await apiClient.post('/api/v1/numerology/vehicle/', { license_plate });
    return response.data;
  },

  async previewNameNumerology(data: {
    name: string;
    name_type?: string;
    system?: 'pythagorean' | 'chaldean';
    transliterate?: boolean;
  }) {
    const response = await apiClient.post('/api/v1/name-numerology/preview/', data);
    return response.data;
  },

  async findBestDates(data: {
    birth_date: string;
    event_type: string;
    start_date: string;
    end_date: string;
    limit?: number;
  }) {
    const response = await apiClient.post('/api/v1/numerology/timing/best-dates/', data);
    return response.data;
  },

  async getDashboardInsights(): Promise<{ insights: DashboardInsight[]; count: number }> {
    const response = await apiClient.get('/api/v1/numerology/dashboard/insights/');
    return response.data as { insights: DashboardInsight[]; count: number };
  },

  async getDashboardActivity(params?: {
    limit?: number;
    types?: string[];
  }): Promise<{ activities: DashboardActivityItem[]; count: number }> {
    const response = await apiClient.get('/api/v1/numerology/dashboard/activity/', {
      params: {
        limit: params?.limit,
        ...(params?.types?.length ? { types: params.types } : {}),
      },
      paramsSerializer: {
        // Axios v1 supports custom serializer. Keep it simple: repeat types.
        serialize: (p: any) => {
          const parts: string[] = [];
          Object.entries(p || {}).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              v.forEach((vv) => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(vv))}`));
            } else if (v !== undefined && v !== null) {
              parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
            }
          });
          return parts.join('&');
        },
      } as any,
    });
    return response.data as { activities: DashboardActivityItem[]; count: number };
  },

  async getDashboardRecommendations(): Promise<{ recommendations: DashboardRecommendation[]; count: number }> {
    const response = await apiClient.get('/api/v1/numerology/dashboard/recommendations/');
    return response.data as { recommendations: DashboardRecommendation[]; count: number };
  },

  async getAchievements(): Promise<{ achievements: AchievementData[] }> {
    const response = await apiClient.get('/api/v1/rewards/achievements/');
    return response.data;
  },

  async getPlatformStats(): Promise<PlatformStats> {
    const response = await apiClient.get('/api/v1/analytics/platform-stats/');
    return response.data;
  },

  async getExperts() {
    const response = await apiClient.get('/api/v1/experts/');
    return response.data;
  },
};

