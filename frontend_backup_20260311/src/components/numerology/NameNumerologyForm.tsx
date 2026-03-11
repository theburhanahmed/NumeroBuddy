/**
 * Name Numerology Form Component
 * Input form with client-side preview
 */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { nameNumerologyAPI, NamePreview } from '@/lib/numerology-api';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NameNumerologyFormProps {
  userId: string;
  onReportGenerated?: (jobId: string) => void;
}

export function NameNumerologyForm({ userId, onReportGenerated }: NameNumerologyFormProps) {
  const [name, setName] = useState('');
  const [nameType, setNameType] = useState<'birth' | 'current' | 'nickname'>('birth');
  const [system, setSystem] = useState<'pythagorean' | 'chaldean'>('pythagorean');
  const [transliterate, setTransliterate] = useState(true);
  const [preview, setPreview] = useState<NamePreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePreview = async () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPreview(true);
    try {
      const result = await nameNumerologyAPI.preview({
        name,
        system,
        transliterate,
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
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await nameNumerologyAPI.generateReport({
        name,
        name_type: nameType,
        system,
        transliterate,
        force_refresh: false,
      });
      
      toast({
        title: 'Report Queued',
        description: 'Your name numerology report is being generated. This may take a moment.',
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
        <CardTitle>Name Numerology Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name (e.g., John Doe)"
            aria-label="Name input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameType">Name Type</Label>
          <select
            id="nameType"
            value={nameType}
            onChange={(e) => setNameType(e.target.value as any)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            aria-label="Name type selection"
          >
            <option value="birth">Birth Name</option>
            <option value="current">Current Name</option>
            <option value="nickname">Nickname</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="system">Numerology System</Label>
          <select
            id="system"
            value={system}
            onChange={(e) => setSystem(e.target.value as any)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            aria-label="Numerology system selection"
          >
            <option value="pythagorean">Pythagorean</option>
            <option value="chaldean">Chaldean</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="transliterate"
            checked={transliterate}
            onChange={(e) => setTransliterate(e.target.checked)}
            className="rounded border-gray-300"
            aria-label="Apply transliteration"
          />
          <Label htmlFor="transliterate" className="cursor-pointer">
            Apply transliteration (for non-Latin characters)
          </Label>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            disabled={isLoadingPreview || !name.trim()}
            variant="outline"
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
            onClick={handleGenerate}
            disabled={isGenerating || !name.trim()}
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
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">Preview</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Normalized: <strong>{preview.normalized_name}</strong>
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Expression:</span>{' '}
                <strong>{preview.numbers.expression.reduced}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Soul Urge:</span>{' '}
                <strong>{preview.numbers.soul_urge.reduced}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Personality:</span>{' '}
                <strong>{preview.numbers.personality.reduced}</strong>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

