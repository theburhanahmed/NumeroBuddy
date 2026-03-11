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

  async getDailyReading(params: DailyReadingParams = {}) {
    const response = await apiClient.get('/api/v1/numerology/daily-reading/', {
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
};

