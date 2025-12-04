/**
 * Phone Numerology Page
 * Generate and view phone numerology reports
 */
'use client';

import { useState, useEffect } from 'react';
import { PhoneNumerologyForm } from '@/components/numerology/PhoneNumerologyForm';
import { PhoneNumerologyReport } from '@/components/numerology/PhoneNumerologyReport';
import { phoneNumerologyAPI, PhoneReport } from '@/lib/numerology-api';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function PhoneNumerologyPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState<PhoneReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Poll for latest report when job is queued
  useEffect(() => {
    if (!jobId || !user) return;

    const pollInterval = setInterval(async () => {
      try {
        const latest = await phoneNumerologyAPI.getLatestReport(user.id);
        if (latest && latest.computed_at) {
          setReport(latest);
          setJobId(null);
          clearInterval(pollInterval);
          toast({
            title: 'Report Ready',
            description: 'Your phone numerology report has been generated.',
          });
        }
      } catch (error) {
        // Ignore errors during polling
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [jobId, user, toast]);

  // Load latest report on mount
  useEffect(() => {
    if (!user) return;

    const loadLatest = async () => {
      setIsLoading(true);
      try {
        const latest = await phoneNumerologyAPI.getLatestReport(user.id);
        if (latest) {
          setReport(latest);
        }
      } catch (error) {
        // No report exists yet, that's okay
      } finally {
        setIsLoading(false);
      }
    };

    loadLatest();
  }, [user]);

  const handleReportGenerated = (newJobId: string) => {
    setJobId(newJobId);
    setReport(null); // Clear old report while generating
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Phone Numerology</h1>
        <p>Please log in to use this feature.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Phone Number Numerology Analysis</h1>
      
      <div className="space-y-6">
        <PhoneNumerologyForm 
          userId={user.id} 
          onReportGenerated={handleReportGenerated}
        />

        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {jobId && !report && (
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm">
              Your report is being generated. This may take a moment...
            </p>
          </div>
        )}

        {report && (
          <PhoneNumerologyReport report={report} />
        )}
      </div>
    </div>
  );
}

