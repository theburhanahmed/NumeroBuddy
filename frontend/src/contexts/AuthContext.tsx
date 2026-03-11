import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../lib/api-client';
import { numerologyAPI, NumerologyProfile as ApiNumerologyProfile } from '../lib/numerology-api';

interface User {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  birthDate?: string;
  date_of_birth?: string;
  profileImage?: string;
  createdAt?: string;
  subscription?: 'free' | 'pro' | 'premium' | string;
  hasCompletedOnboarding?: boolean;
}
interface NumerologyProfile {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  birthDay: number;
}
interface AuthContextType {
  user: User | null;
  numerologyProfile: NumerologyProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
  name: string,
  email: string,
  password: string,
  birthDate: string)
  => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [numerologyProfile, setNumerologyProfile] =
  useState<NumerologyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const storedUser = localStorage.getItem('user');
        const storedProfile =
          localStorage.getItem('numerobuddy_profile') || localStorage.getItem('numerai_profile');
        const accessToken = localStorage.getItem('access_token');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (storedProfile) {
            try {
              const parsedProfile = JSON.parse(storedProfile) as NumerologyProfile;
              setNumerologyProfile(parsedProfile);
            } catch {
              // Ignore malformed cached profile
            }
          } else if (accessToken) {
            // Fallback: fetch real numerology profile from API
            const apiProfile = await safeFetchNumerologyProfile();
            if (apiProfile) {
              setNumerologyProfile(apiProfile);
              localStorage.setItem('numerobuddy_profile', JSON.stringify(apiProfile));
              localStorage.removeItem('numerai_profile');
            }
          }
          setIsLoading(false);
          return;
        }

        if (accessToken) {
          const response = await userAPI.getProfile();
          const profileUser = (response as any).data;
          setUser(profileUser);
          localStorage.setItem('user', JSON.stringify(profileUser));
          const apiProfile = await safeFetchNumerologyProfile();
          if (apiProfile) {
            setNumerologyProfile(apiProfile);
            localStorage.setItem('numerobuddy_profile', JSON.stringify(apiProfile));
            localStorage.removeItem('numerai_profile');
          }
        }
      } catch (error) {
        // If token is invalid, clear any stale data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('numerai_profile');
          localStorage.removeItem('numerobuddy_profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  const mapApiProfile = (profile: ApiNumerologyProfile): NumerologyProfile => ({
    lifePath: profile.life_path_number,
    destiny: profile.destiny_number,
    soulUrge: profile.soul_urge_number,
    personality: profile.personality_number,
    birthDay: profile.attitude_number,
  });

  const safeFetchNumerologyProfile = async (): Promise<NumerologyProfile | null> => {
    try {
      const apiProfile = await numerologyAPI.getNumerologyProfile();
      if (!apiProfile) return null;
      return mapApiProfile(apiProfile);
    } catch {
      return null;
    }
  };
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, refresh_token, user: authUser } = (response as any).data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(authUser));
      }

      setUser(authUser);
      const apiProfile = await safeFetchNumerologyProfile();
      if (apiProfile && typeof window !== 'undefined') {
        setNumerologyProfile(apiProfile);
        localStorage.setItem('numerobuddy_profile', JSON.stringify(apiProfile));
        localStorage.removeItem('numerai_profile');
      }
    } catch (error: any) {
      const message = error?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };
  const signup = async (
    name: string,
    email: string,
    password: string,
    birthDate: string
  ) => {
    setIsLoading(true);
    try {
      await authAPI.register({
        email,
        password,
        confirm_password: password,
        full_name: name,
        date_of_birth: birthDate,
      });
      // After successful registration, redirect to login for now
      navigate('/login');
    } catch (error: any) {
      const message = error?.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await authAPI.logout(refreshToken);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setNumerologyProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('numerai_profile');
        localStorage.removeItem('numerobuddy_profile');
      }
      navigate('/login');
      setIsLoading(false);
    }
  };
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        ...data,
      };
      setUser(updatedUser);
      localStorage.setItem('numerobuddy_user', JSON.stringify(updatedUser));
      localStorage.removeItem('numerai_user');

      // If birth date changed or no profile yet, refresh numerology profile from API
      if (data.birthDate || data.date_of_birth || !numerologyProfile) {
        const apiProfile = await safeFetchNumerologyProfile();
        if (apiProfile) {
          setNumerologyProfile(apiProfile);
          localStorage.setItem('numerobuddy_profile', JSON.stringify(apiProfile));
          localStorage.removeItem('numerai_profile');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const completeOnboarding = () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      hasCompletedOnboarding: true
    };
    setUser(updatedUser);
    localStorage.setItem('numerobuddy_user', JSON.stringify(updatedUser));
    localStorage.removeItem('numerai_user');
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        numerologyProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        completeOnboarding
      }}>

      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}