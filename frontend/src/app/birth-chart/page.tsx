/**
 * Birth Chart Page - Display user&apos;s complete numerology profile.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { numerologyAPI } from '@/lib/numerology-api';
import { BirthChart, NumberCardData, NumberType, NumberInterpretation } from '@/types/numerology';
import { BirthChartGrid } from '@/components/numerology/birth-chart-grid';
import { NumberDetailModal } from '@/components/numerology/number-detail-modal';
import { LoShuGrid } from '@/components/numerology/lo-shu-grid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Calculator, Sparkles, Download } from 'lucide-react';

const numberNames: Record<NumberType, string> = {
  life_path_number: 'Life Path Number',
  destiny_number: 'Destiny Number',
  soul_urge_number: 'Soul Urge Number',
  personality_number: 'Personality Number',
  attitude_number: 'Attitude Number',
  maturity_number: 'Maturity Number',
  balance_number: 'Balance Number',
  personal_year_number: 'Personal Year Number',
  personal_month_number: 'Personal Month Number',
};

const numberDescriptions: Record<NumberType, string> = {
  life_path_number: 'Your mission in life and major lessons to learn',
  destiny_number: 'Your natural talents and abilities you were born with',
  soul_urge_number: 'Your inner desires and what truly motivates you',
  personality_number: 'How others see and perceive you',
  attitude_number: 'Your natural reaction to new situations',
  maturity_number: 'Your wisdom and strengths in later years',
  balance_number: 'How you maintain equilibrium during challenges',
  personal_year_number: 'The major themes of your current year',
  personal_month_number: 'The energies influencing your current month',
};

const numberColors: Record<NumberType, 'purple' | 'gold' | 'blue'> = {
  life_path_number: 'purple',
  destiny_number: 'purple',
  soul_urge_number: 'purple',
  personality_number: 'blue',
  attitude_number: 'blue',
  maturity_number: 'blue',
  balance_number: 'blue',
  personal_year_number: 'gold',
  personal_month_number: 'gold',
};

export default function BirthChartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [birthChart, setBirthChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<{
    type: NumberType;
    interpretation: NumberInterpretation;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBirthChart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await numerologyAPI.getBirthChart();
      setBirthChart(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile not found - show calculate button
        setBirthChart(null);
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to load birth chart',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchBirthChart();
  }, [user, router, fetchBirthChart]);

  const handleCalculateProfile = async () => {
    try {
      setCalculating(true);
      await numerologyAPI.calculateProfile();
      toast({
        title: 'Success',
        description: 'Your numerology profile has been calculated!',
      });
      await fetchBirthChart();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to calculate profile',
        variant: 'destructive',
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      // Create a link to the PDF endpoint
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/numerology/birth-chart/pdf/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `birth_chart_${user?.full_name.replace(/\s+/g, '_') || 'numerai'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Birth chart exported successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to export PDF',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleNumberClick = (type: string) => {
    if (!birthChart) return;

    const numberType = type as NumberType;
    const interpretation = birthChart.interpretations[numberType];

    if (interpretation) {
      setSelectedNumber({ type: numberType, interpretation });
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Calculator className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Calculate Your Birth Chart</h1>
          <p className="text-muted-foreground text-lg">
            Unlock the secrets of your numerology profile and discover insights into your life path,
            destiny, and personal characteristics.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
            <p className="text-muted-foreground">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Important:</span> Make sure your profile is complete with your full name and birth date before calculating.
            </p>
          </div>
          <div className="max-w-2xl mx-auto text-muted-foreground space-y-4 mt-6 text-left bg-secondary p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-foreground">Why Calculate Your Birth Chart?</h3>
            <p>
              Your birth chart is the foundation of your numerology profile, calculated using your birth date
              and name. It reveals the core numbers that influence your personality, life purpose, and potential.
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span><strong>Life Path Number:</strong> Your mission in life and major lessons to learn</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span><strong>Destiny Number:</strong> Your natural talents and abilities you were born with</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span><strong>Soul Urge Number:</strong> Your inner desires and what truly motivates you</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span><strong>Personality Number:</strong> How others see and perceive you</span>
              </div>
            </div>
            <p className="mt-4">
              Understanding these numbers can help you make better decisions, recognize your strengths,
              and navigate life&apos;s challenges with greater awareness.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleCalculateProfile}
            disabled={calculating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {calculating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Profile
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            <span className="font-medium">Note:</span> Your birth chart calculation requires your complete profile information including your full name and accurate birth date.
          </p>
        </div>
      </div>
    );
  }

  const numbers: NumberCardData[] = (Object.keys(numberNames) as NumberType[]).map(
    (type) => ({
      type,
      value: birthChart.profile[type],
      name: numberNames[type],
      description: numberDescriptions[type],
      color: numberColors[type],
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Birth Chart</h1>
          <p className="text-muted-foreground text-lg">
            Explore the numerology numbers that define your unique path
          </p>
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <h2 className="text-xl font-semibold mb-3">What is a Birth Chart?</h2>
            <p className="text-muted-foreground mb-3">
              Your Birth Chart is a comprehensive numerology profile calculated using your birth date and name. 
              It reveals the core numbers that influence your personality, life purpose, and potential.
            </p>
            <p className="text-muted-foreground">
              Understanding these numbers can help you make better decisions, recognize your strengths, 
              and navigate life&apos;s challenges with greater awareness. Each number provides unique insights 
              into different aspects of your character and destiny.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Life Path Number</h3>
              <p className="text-sm text-muted-foreground">
                Your mission in life and the major lessons you&apos;re here to learn.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Destiny Number</h3>
              <p className="text-sm text-muted-foreground">
                Your natural talents, abilities, and the gifts you bring to the world.
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Soul Urge Number</h3>
              <p className="text-sm text-muted-foreground">
                Your inner motivations, desires, and what truly drives you at the soul level.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleExportPDF} disabled={exporting} variant="outline">
          {exporting ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </div>

      <BirthChartGrid numbers={numbers} onNumberClick={handleNumberClick} />

      {/* Lo Shu Grid Section */}
      {birthChart.lo_shu_grid && (
        <div className="mt-12">
          <LoShuGrid gridData={birthChart.lo_shu_grid} />
        </div>
      )}

      <NumberDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        interpretation={selectedNumber?.interpretation || null}
        numberName={selectedNumber ? numberNames[selectedNumber.type] : ''}
      />
    </div>
  );
}