import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './api-config';
import { cachedFetch, cacheKeys, cache } from './api-cache';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Simple toast helper using window.alert for now.
// This can be upgraded later to use a dedicated toast component.
function showErrorToast(message: string, title = 'Error') {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}: ${message}`);
  } else {
    console.error(`${title}: ${message}`);
  }
}

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const errorData = error.response?.data as any;
    const errorMessage = errorData?.error?.message || errorData?.message || '';
    const isAuthError =
      error.response?.status === 401 ||
      (error.response?.status === 400 &&
        typeof errorMessage === 'string' &&
        (errorMessage.toLowerCase().includes('authentication') ||
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('unauthorized')));

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/api/v1/auth/refresh-token/`, {
          refresh: refreshToken,
        });

        const { access_token } = (response as any).data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access_token);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/login', '/register', '/reset-password', '/reset-password/confirm'];
          const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith('/auth/');

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');

          if (!isPublicPath) {
            window.location.href = '/login';
            showErrorToast('Please log in again.', 'Session Expired');
          }
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (status !== 401) {
        let message = 'An unexpected error occurred.';

        if (typeof data?.error === 'string') {
          message = data.error;
        } else if (data?.detail) {
          message = data.detail;
        } else if (data?.message) {
          message = data.message;
        } else if (status === 500) {
          message = 'Server error. Please try again later.';
        } else if (status === 404) {
          message = 'Resource not found.';
        } else if (status === 403) {
          message = 'You do not have permission to perform this action.';
        }

        showErrorToast(message, 'Error');
      }
    } else if (error.request) {
      showErrorToast('Please check your internet connection.', 'Network Error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const authAPI = {
  appleSignIn: (data: { identity_token: string; authorization_code?: string }) =>
    apiClient.post('/api/v1/auth/social/apple/', data),
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    confirm_password: string;
    full_name: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    timezone?: string;
    location?: string;
  }) => apiClient.post('/api/v1/auth/register/', data),
  verifyOTP: (data: { email?: string; phone?: string; otp: string }) =>
    apiClient.post('/api/v1/auth/verify-otp/', data),
  resendOTP: (data: { email?: string; phone?: string }) =>
    apiClient.post('/api/v1/auth/resend-otp/', data),
  login: (data: { email?: string; phone?: string; password: string }) =>
    apiClient.post('/api/v1/auth/login/', data),
  logout: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/logout/', { refresh_token: refreshToken }),
  refreshToken: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/refresh-token/', { refresh: refreshToken }),
  requestPasswordReset: (email: string) =>
    apiClient.post('/api/v1/auth/password-reset/', { email }),
  confirmPasswordReset: (data: { email: string; otp: string; new_password: string }) =>
    apiClient.post('/api/v1/auth/password-reset/confirm/', data),
  requestPasswordResetToken: (email: string) =>
    apiClient.post('/api/v1/auth/reset-password/token/', { email }),
  confirmPasswordResetToken: (data: {
    token: string;
    new_password: string;
    confirm_password: string;
  }) => apiClient.post('/api/v1/auth/reset-password/token/confirm/', data),
  googleOAuth: (accessToken: string) =>
    apiClient.post('/api/v1/auth/social/google/', { access_token: accessToken }),
};

export type PlanKey = 'free' | 'basic' | 'premium' | 'elite';

export interface FeatureEntitlement {
  enabled: boolean;
  limits: Record<string, unknown>;
  display_name: string;
  category: string;
  required_plan: PlanKey | null;
}

export interface Entitlements {
  effective_plan: PlanKey;
  billing_plan: PlanKey;
  subscription_status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  pending_plan: PlanKey | null;
  pending_change_status: string | null;
  features: Record<string, FeatureEntitlement>;
}

export const entitlementsAPI = {
  getMine: () => apiClient.get<Entitlements>('/api/v1/entitlements/me/'),
};

export const paymentsAPI = {
  getSubscriptionStatus: () => apiClient.get('/api/v1/payments/subscription-status/'),
  getBillingHistory: () => apiClient.get('/api/v1/payments/billing-history/'),
  createCheckoutSession: (plan: PlanKey) => apiClient.post('/api/v1/payments/create-checkout-session/', { plan }),
};

export const reportsAPI = {
  list: () => apiClient.get('/api/v1/reports/'),
  listUniversal: (params?: { type?: string; search?: string; saved?: boolean }) => apiClient.get('/api/v1/reports/universal/', { params }),
  saveUniversal: (data: { report_type: string; title: string; input_data?: Record<string, unknown>; calculated_results?: Record<string, unknown>; ai_insights?: unknown[]; recommendations?: unknown[]; remedies?: unknown[]; metadata?: Record<string, unknown> }) => apiClient.post('/api/v1/reports/universal/', data),
  updateUniversal: (reportId: string, data: Record<string, unknown>) => apiClient.patch(`/api/v1/reports/universal/${reportId}/`, data),
  deleteUniversal: (reportId: string) => apiClient.delete(`/api/v1/reports/universal/${reportId}/`),
  duplicateUniversal: (reportId: string) => apiClient.post(`/api/v1/reports/universal/${reportId}/`),
  getPdfUrl: (reportId: string) => `/api/v1/reports/${reportId}/pdf/`,
};

export const dashboardAPI = {
  getOverview: () => apiClient.get('/api/v1/dashboard/overview/'),
};

export const notificationsAPI = {
  getPreferences: () => apiClient.get('/api/v1/notifications/preferences/'),
  updatePreference: (data: { notification_type: string; channel: 'email' | 'push' | 'in_app'; enabled: boolean }) =>
    apiClient.patch('/api/v1/notifications/preferences/', data),
};

export const aiChatAPI = {
  sendMessage: (message: string, conversationId?: string) =>
    apiClient.post('/api/v1/ai/chat/', { message, conversation_id: conversationId }),
  getConversations: () =>
    apiClient.get('/api/v1/ai/conversations/'),
  getConversationMessages: (conversationId: string) =>
    apiClient.get(`/api/v1/ai/conversations/${conversationId}/messages/`),
  getCoPilotSuggestions: () =>
    apiClient.post('/api/v1/ai-co-pilot/suggest/'),
  analyzeCoPilotDecision: (data: { decision: string; options?: string[] }) =>
    apiClient.post('/api/v1/ai-co-pilot/analyze-decision/', data),
  getCoPilotInsights: () =>
    apiClient.get('/api/v1/ai-co-pilot/insights/'),
};

export const userAPI = {
  getProfile: () =>
    cachedFetch(
      cacheKeys.userProfile(),
      async () => {
        try {
          return await apiClient.get('/api/v1/users/profile/');
        } catch (err: any) {
          if (err?.response?.status === 404) {
            return { data: {} };
          }
          throw err;
        }
      },
      {
        ttl: PROFILE_CACHE_TTL,
        staleWhileRevalidate: true,
      }
    ),
  updateProfile: async (data: {
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    timezone?: string;
    location?: string;
    bio?: string;
    profile_picture_url?: string;
  }) => {
    const response = await apiClient.patch('/api/v1/users/profile/', data);
    cache.invalidate(cacheKeys.userProfile());
    return response;
  },
};

