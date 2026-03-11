'use client';

import { useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n/config';

// Simple translation hook (can be enhanced with next-intl)
export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('en');
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Load saved locale
    const saved = localStorage.getItem('locale');
    if (saved && locales.includes(saved as Locale)) {
      setLocale(saved as Locale);
    }
    loadMessages(saved as Locale || 'en');
  }, []);

  const loadMessages = async (loc: Locale) => {
    try {
      const msgs = await import(`@/i18n/messages/${loc}.json`);
      setMessages(msgs.default);
    } catch (error) {
      // Fallback to English
      const msgs = await import('@/i18n/messages/en.json');
      setMessages(msgs.default);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!messages) return key;
    
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    if (typeof value !== 'string') return key;
    
    // Simple parameter replacement
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  const changeLocale = async (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    await loadMessages(newLocale);
  };

  return { t, locale, changeLocale };
}

