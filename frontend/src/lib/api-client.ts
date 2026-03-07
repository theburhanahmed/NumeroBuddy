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
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

import { toast } from "@/components/ui/use-toast";

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (Token Refresh)
    // Also handle 400 errors that might be authentication-related
    const errorData = error.response?.data as any;
    const errorMessage = errorData?.error?.message || errorData?.message || '';
    const isAuthError = error.response?.status === 401 || 
                       (error.response?.status === 400 && 
                        (typeof errorMessage === 'string' && (
                         errorMessage.toLowerCase().includes('authentication') ||
                         errorMessage.toLowerCase().includes('token') ||
                         errorMessage.toLowerCase().includes('unauthorized')
                        )));
    
    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/api/v1/auth/refresh-token/`, {
          refresh: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        // Only redirect if we're not on a public page (like '/')
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const publicPaths = ['/', '/login', '/register', '/reset-password', '/reset-password/confirm'];
          const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith('/auth/');
          
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // Only redirect if we're on a protected route
          if (!isPublicPath) {
            window.location.href = '/login';
            toast({
              title: "Session Expired",
              description: "Please log in again.",
              variant: "destructive",
            });
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;


      // Don't show toast for 401 as it's handled above (or redirects)
      if (status !== 401) {
        let message = "An unexpected error occurred.";

        if (data?.detail) {
          message = data.detail;
        } else if (data?.message) {
          message = data.message;
        } else if (status === 500) {
          message = "Server error. Please try again later.";
        } else if (status === 404) {
          message = "Resource not found.";
        } else if (status === 403) {
          message = "You do not have permission to perform this action.";
        }

        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } else if (error.request) {
      // Network error
      toast({
        title: "Network Error",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API endpoints
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

  // OTP-based password reset (legacy, kept for compatibility)
  requestPasswordReset: (email: string) =>
    apiClient.post('/api/v1/auth/password-reset/', { email }),

  confirmPasswordReset: (data: { email: string; otp: string; new_password: string }) =>
    apiClient.post('/api/v1/auth/password-reset/confirm/', data),

  // Token-based password reset (recommended)
  requestPasswordResetToken: (email: string) =>
    apiClient.post('/api/v1/auth/reset-password/token/', { email }),

  confirmPasswordResetToken: (data: { token: string; new_password: string; confirm_password: string }) =>
    apiClient.post('/api/v1/auth/reset-password/token/confirm/', data),

  googleOAuth: (accessToken: string) =>
    apiClient.post('/api/v1/auth/social/google/', { access_token: accessToken }),
};

const PROFILE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const userAPI = {
  getProfile: () =>
    cachedFetch(cacheKeys.userProfile(), async () => {
      try {
        return await apiClient.get('/api/v1/users/profile/');
      } catch (err: any) {
        if (err?.response?.status === 404) {
          return { data: {} };
        }
        throw err;
      }
    }, {
      ttl: PROFILE_CACHE_TTL,
      staleWhileRevalidate: true,
    }),
  updateProfile: async (data: {
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    timezone?: string;
    location?: string;
    bio?: string;
  }) => {
    const response = await apiClient.patch('/api/v1/users/profile/', data);
    cache.invalidate(cacheKeys.userProfile());
    return response;
  },
};

export const paymentsAPI = {
  createSubscription: (data: { plan: string; payment_method_id?: string }) =>
    apiClient.post('/api/v1/payments/create-subscription/', data),
  createCheckoutSession: (data: { plan: string; success_url?: string; cancel_url?: string }) =>
    apiClient.post('/api/v1/payments/create-checkout-session/', data),
  updateSubscription: (data: { plan?: string; cancel_at_period_end?: boolean }) =>
    apiClient.post('/api/v1/payments/update-subscription/', data),
  cancelSubscription: () =>
    apiClient.post('/api/v1/payments/cancel-subscription/'),
  getSubscriptionStatus: () => apiClient.get('/api/v1/payments/subscription-status/'),
  getBillingHistory: () => apiClient.get('/api/v1/payments/billing-history/'),
};

export const accountAPI = {
  deleteAccount: () => apiClient.post('/api/v1/users/delete-account/'),
  exportData: () => apiClient.post('/api/v1/users/export-data/', {}, { responseType: 'blob' }),
};

export const notificationAPI = {
  registerDevice: (data: {
    fcm_token: string;
    device_type: 'ios' | 'android' | 'web';
    device_name?: string;
  }) => apiClient.post('/api/v1/notifications/devices/', data),
  list: (params?: { page?: number }) => 
    apiClient.get('/api/v1/notifications/', { params }),
  markRead: (notificationId: string) =>
    apiClient.post(`/api/v1/notifications/${notificationId}/read/`),
  markAllRead: () =>
    apiClient.post('/api/v1/notifications/read-all/'),
  delete: (notificationId: string) =>
    apiClient.delete(`/api/v1/notifications/${notificationId}/`),
  getUnreadCount: () =>
    apiClient.get('/api/v1/notifications/unread-count/'),
  getPreferences: () =>
    apiClient.get('/api/v1/notifications/preferences/'),
  updatePreference: (data: {
    notification_type: string;
    channel: string;
    enabled: boolean;
  }) => apiClient.put('/api/v1/notifications/preferences/', data),
  bulkUpdatePreferences: (data: { preferences: Array<{ notification_type: string; channel: string; enabled: boolean }> }) =>
    apiClient.post('/api/v1/notifications/preferences/bulk-update/', data),
};

export const apiKeyAPI = {
  list: () => apiClient.get('/api/v1/users/api-keys/'),
  create: (data: { name: string }) => apiClient.post('/api/v1/users/api-keys/', data),
  revoke: (keyId: string) => apiClient.delete(`/api/v1/users/api-keys/${keyId}/`),
  deactivate: (keyId: string) => apiClient.post(`/api/v1/users/api-keys/${keyId}/deactivate/`),
};

export const developerAPI = {
  register: (data: { name: string; description?: string }) =>
    apiClient.post('/api/v1/developer/register/', data),
  listKeys: () => apiClient.get('/api/v1/developer/keys/'),
  getUsageStats: (keyId: string) => apiClient.get(`/api/v1/developer/keys/${keyId}/usage/`),
};

export const rewardsAPI = {
  getUserPoints: () => apiClient.get('/api/v1/rewards/points/'),
  getUserAchievements: () => apiClient.get('/api/v1/rewards/achievements/'),
  getRewardCatalog: () => apiClient.get('/api/v1/rewards/catalog/'),
};