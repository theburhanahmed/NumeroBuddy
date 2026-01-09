'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, FileText, Download } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { reportAPI } from '@/lib/numerology-api';

interface GeneratedReport {
  id: string;
  title: string;
  report_type: string;
  generated_at: string;
  person_name?: string;
}

interface ReportComparisonData {
  id: string;
  report1: GeneratedReport;
  report2: GeneratedReport;
  comparison_data: {
    differences: Array<{
      field: string;
      report1_value: any;
      report2_value: any;
    }>;
    similarities: string[];
    summary: string;
  };
  created_at: string;
}

interface ReportComparisonProps {
  report1Id?: string;
  report2Id?: string;
}

export function ReportComparison({ report1Id, report2Id }: ReportComparisonProps) {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [selectedReport1, setSelectedReport1] = useState<string>(report1Id || '');
  const [selectedReport2, setSelectedReport2] = useState<string>(report2Id || '');
  const [comparison, setComparison] = useState<ReportComparisonData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    if (report1Id && report2Id) {
      handleCompare();
    }
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getGeneratedReports();
      setReports(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleCompare = async () => {
    if (!selectedReport1 || !selectedReport2) {
      alert('Please select two reports to compare');
      return;
    }

    if (selectedReport1 === selectedReport2) {
      alert('Please select two different reports');
      return;
    }

    try {
      setLoading(true);
      const response = await reportAPI.compareReports({
        report1_id: selectedReport1,
        report2_id: selectedReport2,
      });
      setComparison(response);
    } catch (error) {
      console.error('Failed to compare reports:', error);
      alert('Failed to compare reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!comparison) return;

    const dataStr = JSON.stringify(comparison, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-comparison-${comparison.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-cyan-400" />
          Report Comparison
        </h2>
        <p className="text-white/70">Compare two numerology reports side by side</p>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Report 1
          </label>
          <select
            value={selectedReport1}
            onChange={(e) => setSelectedReport1(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a2942]/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select report</option>
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.title} ({new Date(report.generated_at).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Report 2
          </label>
          <select
            value={selectedReport2}
            onChange={(e) => setSelectedReport2(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a2942]/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select report</option>
            {reports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.title} ({new Date(report.generated_at).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      <TouchOptimizedButton
        variant="primary"
        onClick={handleCompare}
        disabled={loading || !selectedReport1 || !selectedReport2}
        icon={<GitCompare className="w-4 h-4" />}
        className="mb-6"
      >
        {loading ? 'Comparing...' : 'Compare Reports'}
      </TouchOptimizedButton>

      {/* Comparison Results */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-cyan-500/20">
            <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
            <p className="text-white/80">{comparison.comparison_data.summary}</p>
          </div>

          {/* Differences */}
          {comparison.comparison_data.differences.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Differences</h3>
              <div className="space-y-3">
                {comparison.comparison_data.differences.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10"
                  >
                    <div className="font-semibold text-white mb-2 capitalize">
                      {diff.field.replace('_', ' ')}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-white/60 mb-1">Report 1</div>
                        <div className="text-white">{String(diff.report1_value)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 mb-1">Report 2</div>
                        <div className="text-white">{String(diff.report2_value)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similarities */}
          {comparison.comparison_data.similarities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Similarities</h3>
              <div className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10">
                <ul className="space-y-2">
                  {comparison.comparison_data.similarities.map((similarity, idx) => (
                    <li key={idx} className="text-white/80 flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      <span>{similarity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Export */}
          <TouchOptimizedButton
            variant="secondary"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Export Comparison
          </TouchOptimizedButton>
        </motion.div>
      )}
    </SpaceCard>
  );
}