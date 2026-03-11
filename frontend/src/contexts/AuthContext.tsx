import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../lib/api-client';

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
        const accessToken = localStorage.getItem('access_token');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          const birthDate = parsedUser.date_of_birth || parsedUser.birthDate;
          if (birthDate) {
            const profile = calculateNumerologyProfile(birthDate);
            setNumerologyProfile(profile);
          }
          setIsLoading(false);
          return;
        }

        if (accessToken) {
          const response = await userAPI.getProfile();
          const profileUser = (response as any).data;
          setUser(profileUser);
          localStorage.setItem('user', JSON.stringify(profileUser));
          const birthDate = profileUser.date_of_birth || profileUser.birthDate;
          if (birthDate) {
            const profile = calculateNumerologyProfile(birthDate);
            setNumerologyProfile(profile);
            localStorage.setItem('numerai_profile', JSON.stringify(profile));
          }
        }
      } catch (error) {
        // If token is invalid, clear any stale data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          localStorage.removeItem('numerai_profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);
  const calculateNumerologyProfile = (birthDate: string): NumerologyProfile => {
    // Simple mock calculation - in production, use real numerology algorithms
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const lifePath = (day + month + year) % 9 || 9;
    const destiny = day * month % 9 || 9;
    const soulUrge = (month + year) % 9 || 9;
    const personality = (day + year) % 9 || 9;
    const birthDay = day % 9 || 9;
    return {
      lifePath,
      destiny,
      soulUrge,
      personality,
      birthDay
    };
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

      const birthDate = authUser.date_of_birth || authUser.birthDate;
      if (birthDate) {
        const profile = calculateNumerologyProfile(birthDate);
        setNumerologyProfile(profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('numerai_profile', JSON.stringify(profile));
        }
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
      }
      navigate('/login');
      setIsLoading(false);
    }
  };
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedUser = {
        ...user,
        ...data
      };
      setUser(updatedUser);
      localStorage.setItem('numerai_user', JSON.stringify(updatedUser));
      // Recalculate profile if birth date changed
      if (data.birthDate) {
        const profile = calculateNumerologyProfile(data.birthDate);
        setNumerologyProfile(profile);
        localStorage.setItem('numerai_profile', JSON.stringify(profile));
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
    localStorage.setItem('numerai_user', JSON.stringify(updatedUser));
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