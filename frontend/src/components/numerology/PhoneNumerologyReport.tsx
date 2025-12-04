/**
 * Phone Numerology Report Component
 * Displays persisted phone numerology reports
 */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhoneReport } from '@/lib/numerology-api';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PhoneNumerologyReportProps {
  report: PhoneReport;
}

export function PhoneNumerologyReport({ report }: PhoneNumerologyReportProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Phone Numerology Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone Number Display (Masked) */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Phone Number</h3>
          <p className="font-mono text-lg">{report.phone_e164_display}</p>
          {report.country && (
            <Badge variant="secondary" className="mt-2">
              {report.country}
            </Badge>
          )}
        </div>

        {/* Core Number */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Core Number</h3>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold text-purple-600">
              {report.computed.core_number.reduced}
            </div>
            <div className="text-sm text-muted-foreground">
              (from {report.computed.core_number.raw_total})
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Reduction steps: {report.computed.core_number.reduction_steps.join(' → ')}
          </div>
        </div>

        {/* Dominant Digit */}
        {report.computed.dominant_digit && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Dominant Digit</h3>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {report.computed.dominant_digit}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Appears {report.computed.repeated_digits[report.computed.dominant_digit]} times
            </p>
          </div>
        )}

        {/* Repeated Digits */}
        {Object.keys(report.computed.repeated_digits).length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Digit Frequency</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(report.computed.repeated_digits)
                .sort((a, b) => b[1] - a[1])
                .map(([digit, count]) => (
                  <Badge key={digit} variant="secondary">
                    {digit}: {count}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Pair Sums */}
        {report.computed.pair_sums.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Pair Sums</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {report.computed.pair_sums.slice(0, 9).map((pair, idx) => (
                <div key={idx} className="p-2 bg-muted rounded text-center">
                  <div className="font-mono">{pair.pair}</div>
                  <div className="font-semibold">{pair.reduced}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LLM Explanation */}
        {report.explanation && (
          <div>
            <button
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <h3 className="text-sm font-medium">Explanation</h3>
              {isExplanationOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {isExplanationOpen && (
              <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Summary</h4>
                <p className="text-sm">{report.explanation.short_summary}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Detailed Explanation</h4>
                <p className="text-sm whitespace-pre-line">{report.explanation.long_explanation}</p>
              </div>
              {report.explanation.action_points.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Action Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {report.explanation.action_points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {report.explanation.confidence_notes && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Notes</h4>
                  <p className="text-xs text-muted-foreground">
                    {report.explanation.confidence_notes}
                  </p>
                </div>
              )}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {report.explanation_error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <strong>Explanation Error:</strong> {report.explanation_error}
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <div>Method: {report.method}</div>
          <div>Computed: {new Date(report.computed_at).toLocaleString()}</div>
          <div>Version: {report.version}</div>
        </div>
      </CardContent>
    </Card>
  );
}

