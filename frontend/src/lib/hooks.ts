/**
 * Custom hooks for NumerAI frontend.
 */
import { useState, useEffect } from 'react';
import { 
  numerologyAPI, 
  expertAPI, 
  consultationAPI,
  LifePathAnalysis,
  CompatibilityCheck,
  Remedy,
  RemedyTracking,
  Expert,
  Consultation,
  ConsultationReview,
  NumerologyReport
} from './numerology-api';

// Hook for life path analysis
export const useLifePathAnalysis = () => {
  const [analysis, setAnalysis] = useState<LifePathAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getLifePathAnalysis();
      setAnalysis(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch life path analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return { analysis, loading, error, refetch: fetchAnalysis };
};

// Hook for compatibility checks
export const useCompatibilityChecks = () => {
  const [checks, setChecks] = useState<CompatibilityCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChecks = async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getCompatibilityHistory();
      setChecks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch compatibility checks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecks();
  }, []);

  return { checks, loading, error, refetch: fetchChecks };
};

// Hook for personalized remedies
export const usePersonalizedRemedies = () => {
  const [remedies, setRemedies] = useState<Remedy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemedies = async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getPersonalizedRemedies();
      setRemedies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch personalized remedies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemedies();
  }, []);

  return { remedies, loading, error, refetch: fetchRemedies };
};

// Hook for tracking remedy practice
export const useRemedyTracking = (remedyId: string) => {
  const [tracking, setTracking] = useState<RemedyTracking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const trackRemedy = async (data: {
    date: string;
    is_completed: boolean;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      const result = await numerologyAPI.trackRemedy(remedyId, data);
      setTracking(result);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to track remedy');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { tracking, loading, error, trackRemedy };
};

// Hook for experts
export const useExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const data = await expertAPI.getExperts();
      setExperts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch experts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return { experts, loading, error, refetch: fetchExperts };
};

// Hook for consultations
export const useConsultations = () => {
  const [upcoming, setUpcoming] = useState<Consultation[]>([]);
  const [past, setPast] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcoming = async () => {
    try {
      const data = await consultationAPI.getUpcomingConsultations();
      setUpcoming(data);
    } catch (err) {
      setError('Failed to fetch upcoming consultations');
      console.error(err);
    }
  };

  const fetchPast = async () => {
    try {
      const data = await consultationAPI.getPastConsultations();
      setPast(data);
    } catch (err) {
      setError('Failed to fetch past consultations');
      console.error(err);
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUpcoming(), fetchPast()]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch consultations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { 
    upcoming, 
    past, 
    loading, 
    error, 
    refetch: fetchAll,
    fetchUpcoming,
    fetchPast
  };
};

// Hook for booking consultations
export const useBookConsultation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bookConsultation = async (data: {
    expert: string;
    consultation_type: 'video' | 'chat' | 'phone';
    scheduled_at: string;
    duration_minutes?: number;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      const result = await consultationAPI.bookConsultation(data);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to book consultation');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, bookConsultation };
};

// Hook for rating consultations
export const useRateConsultation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const rateConsultation = async (consultationId: string, data: {
    rating: number;
    review_text?: string;
    is_anonymous?: boolean;
  }) => {
    try {
      setLoading(true);
      const result = await consultationAPI.rateConsultation(consultationId, data);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to rate consultation');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, rateConsultation };
};

// Hook for numerology report
export const useNumerologyReport = () => {
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getFullNumerologyReport();
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch numerology report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return { report, loading, error, refetch: fetchReport };
};