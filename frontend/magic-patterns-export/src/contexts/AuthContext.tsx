import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
interface User {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  profileImage?: string;
  createdAt: string;
  subscription?: 'free' | 'pro' | 'premium';
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
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('numerai_user');
    const storedProfile = localStorage.getItem('numerai_profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProfile) {
      setNumerologyProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'Sarah Johnson',
        email,
        birthDate: '1990-03-15',
        createdAt: new Date().toISOString(),
        subscription: 'free',
        hasCompletedOnboarding: true
      };
      const profile = calculateNumerologyProfile(mockUser.birthDate);
      setUser(mockUser);
      setNumerologyProfile(profile);
      localStorage.setItem('numerai_user', JSON.stringify(mockUser));
      localStorage.setItem('numerai_profile', JSON.stringify(profile));
    } finally {
      setIsLoading(false);
    }
  };
  const signup = async (
  name: string,
  email: string,
  password: string,
  birthDate: string) =>
  {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        birthDate,
        createdAt: new Date().toISOString(),
        subscription: 'free',
        hasCompletedOnboarding: false
      };
      const profile = calculateNumerologyProfile(birthDate);
      setUser(newUser);
      setNumerologyProfile(profile);
      localStorage.setItem('numerai_user', JSON.stringify(newUser));
      localStorage.setItem('numerai_profile', JSON.stringify(profile));
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    setNumerologyProfile(null);
    localStorage.removeItem('numerai_user');
    localStorage.removeItem('numerai_profile');
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