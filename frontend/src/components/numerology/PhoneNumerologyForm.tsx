/**
 * Phone Numerology Form Component
 * Input form with client-side preview
 */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { phoneNumerologyAPI, PhonePreview } from '@/lib/numerology-api';
import { Loader2, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface PhoneNumerologyFormProps {
  userId: string;
  onReportGenerated?: (jobId: string) => void;
}

export function PhoneNumerologyForm({ userId, onReportGenerated }: PhoneNumerologyFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryHint, setCountryHint] = useState('');
  const [method, setMethod] = useState<'core' | 'full' | 'compatibility'>('core');
  const [convertVanity, setConvertVanity] = useState(false);
  const [preview, setPreview] = useState<PhonePreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPreview(true);
    try {
      const result = await phoneNumerologyAPI.preview({
        phone_number: phoneNumber,
        country_hint: countryHint || undefined,
        method,
        convert_vanity: convertVanity,
      });
      setPreview(result);
    } catch (error: any) {
      toast({
        title: 'Preview Error',
        description: error.response?.data?.error || 'Failed to generate preview',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await phoneNumerologyAPI.generateReport({
        phone_number: phoneNumber,
        country_hint: countryHint || undefined,
        method,
        persist: true,
        force_refresh: false,
        convert_vanity: convertVanity,
      });
      
      toast({
        title: 'Report Queued',
        description: 'Your phone numerology report is being generated. This may take a moment.',
      });
      
      if (onReportGenerated) {
        onReportGenerated(result.job_id);
      }
    } catch (error: any) {
      toast({
        title: 'Generation Error',
        description: error.response?.data?.error || 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone Number Numerology
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (415) 555-2671"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            aria-label="Phone number input"
          />
          <p className="text-sm text-muted-foreground">
            Enter your phone number in any format. We&apos;ll sanitize it automatically.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country Hint (Optional)</Label>
          <Input
            id="country"
            type="text"
            placeholder="US, GB, IN, etc."
            value={countryHint}
            onChange={(e) => setCountryHint(e.target.value)}
            maxLength={10}
            aria-label="Country hint"
          />
          <p className="text-sm text-muted-foreground">
            ISO country code to help parse the phone number.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Calculation Method</Label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value as 'core' | 'full' | 'compatibility')}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            aria-label="Calculation method"
          >
            <option value="core">Core (National digits only)</option>
            <option value="full">Full (All digits including country code)</option>
            <option value="compatibility">Compatibility</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="convertVanity"
            checked={convertVanity}
            onChange={(e) => setConvertVanity(e.target.checked)}
            className="rounded border-gray-300"
            aria-label="Convert vanity numbers"
          />
          <Label htmlFor="convertVanity" className="text-sm font-normal">
            Convert vanity numbers (e.g., 1-800-FLOWERS)
          </Label>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handlePreview}
            disabled={isLoadingPreview || !phoneNumber.trim()}
            variant="outline"
            className="flex-1"
          >
            {isLoadingPreview ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Previewing...
              </>
            ) : (
              'Preview'
            )}
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !phoneNumber.trim()}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>
        </div>

        {preview && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
            <h3 className="font-semibold">Preview</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>{' '}
                <span className="font-mono">{preview.phone_display}</span>
              </div>
              {preview.country && (
                <div>
                  <span className="text-sm text-muted-foreground">Country:</span>{' '}
                  <Badge variant="secondary">{preview.country}</Badge>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Core Number:</span>{' '}
                <Badge className="ml-2">
                  {preview.computed.core_number.reduced}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  (from {preview.computed.core_number.raw_total})
                </span>
              </div>
              {preview.computed.dominant_digit && (
                <div>
                  <span className="text-sm text-muted-foreground">Dominant Digit:</span>{' '}
                  <Badge variant="outline" className="ml-2">
                    {preview.computed.dominant_digit}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

