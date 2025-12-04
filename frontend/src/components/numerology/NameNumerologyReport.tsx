/**
 * Name Numerology Report Component
 * Displays persisted name numerology reports
 */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NameReport } from '@/lib/numerology-api';
import { 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface NameNumerologyReportProps {
  report: NameReport;
}

export function NameNumerologyReport({ report }: NameNumerologyReportProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));
  const { toast } = useToast();

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = () => {
    const text = `Name Numerology Report for ${report.name}\n\n` +
      `Expression Number: ${report.numbers.expression.reduced}\n` +
      `Soul Urge Number: ${report.numbers.soul_urge.reduced}\n` +
      `Personality Number: ${report.numbers.personality.reduced}\n` +
      `Name Vibration: ${report.numbers.name_vibration}\n\n` +
      (report.explanation?.short_summary || '');
    
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Report copied to clipboard',
    });
  };

  const exportPDF = () => {
    // TODO: Implement PDF export
    toast({
      title: 'Coming Soon',
      description: 'PDF export will be available soon',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{report.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {report.name_type} • {report.system} • {new Date(report.computed_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Normalized Name */}
        <div>
          <p className="text-sm text-muted-foreground">
            Normalized: <strong>{report.normalized_name}</strong>
          </p>
        </div>

        {/* Numbers Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">{report.numbers.expression.reduced}</div>
            <div className="text-xs text-muted-foreground">Expression</div>
            <button
              onClick={() => toggleSection('expression')}
              className="text-xs text-blue-600 mt-1"
              aria-label="Toggle expression details"
            >
              <Info className="h-3 w-3 inline" />
            </button>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">{report.numbers.soul_urge.reduced}</div>
            <div className="text-xs text-muted-foreground">Soul Urge</div>
            <button
              onClick={() => toggleSection('soul_urge')}
              className="text-xs text-blue-600 mt-1"
              aria-label="Toggle soul urge details"
            >
              <Info className="h-3 w-3 inline" />
            </button>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">{report.numbers.personality.reduced}</div>
            <div className="text-xs text-muted-foreground">Personality</div>
            <button
              onClick={() => toggleSection('personality')}
              className="text-xs text-blue-600 mt-1"
              aria-label="Toggle personality details"
            >
              <Info className="h-3 w-3 inline" />
            </button>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold">{report.numbers.name_vibration}</div>
            <div className="text-xs text-muted-foreground">Vibration</div>
          </div>
        </div>

        {/* Reduction Steps (Expandable) */}
        {expandedSections.has('expression') && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Expression Reduction Steps</h4>
            <div className="text-sm">
              {report.numbers.expression.reduction_steps.join(' → ')}
            </div>
          </div>
        )}

        {/* Explanation */}
        {report.explanation ? (
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('summary')}
              className="w-full text-left flex justify-between items-center"
              aria-expanded={expandedSections.has('summary')}
              aria-label="Toggle summary"
            >
              <h3 className="font-semibold">Summary</h3>
              {expandedSections.has('summary') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('summary') && (
              <p className="text-sm">{report.explanation.short_summary}</p>
            )}

            <button
              onClick={() => toggleSection('explanation')}
              className="w-full text-left flex justify-between items-center"
              aria-expanded={expandedSections.has('explanation')}
              aria-label="Toggle full explanation"
            >
              <h3 className="font-semibold">Full Explanation</h3>
              {expandedSections.has('explanation') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('explanation') && (
              <div className="text-sm whitespace-pre-line">
                {report.explanation.long_explanation}
              </div>
            )}

            {report.explanation.action_points && report.explanation.action_points.length > 0 && (
              <>
                <h3 className="font-semibold">Action Points</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {report.explanation.action_points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </>
            )}

            {report.explanation.confidence_notes && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                <strong>Note:</strong> {report.explanation.confidence_notes}
              </div>
            )}
          </div>
        ) : report.explanation_error ? (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600">
            <strong>Explanation Error:</strong> {report.explanation_error}
          </div>
        ) : (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
            Explanation is being generated...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

