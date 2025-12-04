'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { numerologyAPI } from '@/lib/numerology-api';
import { DailyReading, RajYogDetection } from '@/types/numerology';
import { ReadingCard } from '@/components/numerology/reading-card';
import { RajYogBadge } from '@/components/numerology/raj-yog-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, addDays, isToday, isFuture } from 'date-fns';

export default function DailyReadingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [todayReading, setTodayReading] = useState<DailyReading | null>(null);
  const [readingHistory, setReadingHistory] = useState<DailyReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedReading, setSelectedReading] = useState<DailyReading | null>(null);
  const [rajYogDetection, setRajYogDetection] = useState<RajYogDetection | null>(null);

  const fetchTodayReading = useCallback(async () => {
    try {
      const data = await numerologyAPI.getDailyReading();
      setTodayReading(data);
      setSelectedReading(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load today&apos;s reading',
        variant: 'destructive',
      });
      // Set null on error to prevent undefined issues
      setTodayReading(null);
      setSelectedReading(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchReadingHistory = useCallback(async () => {
    try {
      const data = await numerologyAPI.getReadingHistory(1, 7);
      // Ensure data.results exists and is an array before setting state
      if (data && Array.isArray(data.results)) {
        setReadingHistory(data.results);
      } else {
        setReadingHistory([]);
      }
    } catch (error: any) {
      console.error('Failed to load reading history:', error);
      // Set empty array on error to prevent undefined issues
      setReadingHistory([]);
    }
  }, []);

  const fetchReadingForDate = useCallback(async (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const data = await numerologyAPI.getDailyReading(dateStr);
      setSelectedReading(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load reading for selected date',
        variant: 'destructive',
      });
      // Set null on error to prevent undefined issues
      setSelectedReading(null);
    }
  }, [toast]);

  const fetchRajYogDetection = useCallback(async () => {
    try {
      const detection = await numerologyAPI.getRajYogDetection();
      setRajYogDetection(detection);
    } catch (error: any) {
      console.error('Failed to load Raj Yog detection:', error);
      // Don't show error toast for Raj Yog - it's optional
      setRajYogDetection(null);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchTodayReading();
    fetchReadingHistory();
    fetchRajYogDetection();
  }, [user, router, fetchTodayReading, fetchReadingHistory, fetchRajYogDetection]);

  useEffect(() => {
    if (isToday(selectedDate)) {
      setSelectedReading(todayReading);
    } else {
      fetchReadingForDate(selectedDate);
    }
  }, [selectedDate, todayReading, fetchReadingForDate]);

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const handleNextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    if (!isFuture(nextDate)) {
      setSelectedDate(nextDate);
    }
  };

  const handleShare = async () => {
    if (!todayReading) return;

    const shareText = `My numerology reading for today:

Personal Day Number: ${todayReading.personal_day_number}
Lucky Number: ${todayReading.lucky_number}
Lucky Color: ${todayReading.lucky_color}

Affirmation: "${todayReading.affirmation}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Daily Numerology Reading',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied!',
        description: 'Reading copied to clipboard',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Daily Reading</h1>
          <p className="text-muted-foreground text-lg">
            Your personalized numerology guidance for each day
          </p>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
            Your daily reading is calculated based on your personal numerology numbers and the current date
            to provide insights and guidance tailored specifically to you. Each day brings unique energies
            and opportunities that can influence your decisions and experiences.
          </p>
        </div>
        {todayReading && isToday(selectedDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </div>

      {/* Date Navigator */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousDay}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 min-w-[200px] justify-center">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold">
            {format(selectedDate, 'MMMM d, yyyy')}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
          disabled={isFuture(addDays(selectedDate, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
        <p>
          Navigate through your daily readings to see how the energies have shifted over time.
          Each reading is personalized based on your unique numerology profile and the specific date.
        </p>
      </div>

      {/* Raj Yog Badge - Show prominently for today's reading */}
      {isToday(selectedDate) && rajYogDetection && (
        <div className="max-w-3xl mx-auto mb-6 flex justify-center">
          <RajYogBadge detection={rajYogDetection} size="lg" showDetails={true} />
        </div>
      )}

      {/* Current Reading */}
      {selectedReading ? (
        <div className="max-w-3xl mx-auto">
          <ReadingCard reading={selectedReading} isToday={isToday(selectedDate)} />
          
          {/* Show Raj Yog insight if available in reading */}
          {selectedReading.raj_yog_insight && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                <span>✨</span> Raj Yog Insight
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                {selectedReading.raj_yog_insight}
              </p>
            </div>
          )}
          
          {/* Show LLM explanation if available */}
          {selectedReading.llm_explanation && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                <span>🤖</span> AI-Powered Insight
              </h3>
              <p className="text-purple-800 dark:text-purple-200 text-sm whitespace-pre-wrap">
                {selectedReading.llm_explanation}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No reading available for this date
          </p>
        </div>
      )}

      {/* Reading History */}
      {Array.isArray(readingHistory) && readingHistory.length > 0 && isToday(selectedDate) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Readings</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
            Review your recent daily readings to identify patterns and recurring themes in your life.
            These insights can help you understand how numerology influences your experiences over time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingHistory.slice(1).map((reading) => (
              <ReadingCard key={reading.id} reading={reading} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}