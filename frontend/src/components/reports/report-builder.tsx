'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Save, Eye } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { reportAPI } from '@/lib/numerology-api';
import { peopleAPI } from '@/lib/numerology-api';

interface ReportSection {
  id: string;
  type: 'text' | 'numbers' | 'chart' | 'comparison';
  title: string;
  content: string;
  config: Record<string, any>;
}

interface ReportBuilderProps {
  onSave?: (report: any) => void;
}

export function ReportBuilder({ onSave }: ReportBuilderProps) {
  const [people, setPeople] = useState<any[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('');
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await peopleAPI.getPeople();
      setPeople(Array.isArray(response) ? response : []);
      if (Array.isArray(response) && response.length > 0) {
        setSelectedPerson(response[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch people:', error);
    }
  };

  const addSection = (type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      config: {},
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<ReportSection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = async () => {
    if (!selectedPerson || !reportTitle || sections.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const templateConfig = {
        sections: sections.map(s => ({
          type: s.type,
          title: s.title,
          content: s.content,
          config: s.config,
        })),
      };

      const report = await reportAPI.generateCustomReport({
        person_id: selectedPerson,
        template_config: templateConfig,
        title: reportTitle,
      });

      if (onSave) {
        onSave(report);
      }
    } catch (error) {
      console.error('Failed to save report:', error);
      alert('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          Report Builder
        </h2>
        <p className="text-white/70">Create custom numerology reports</p>
      </div>

      {/* Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Report Title
          </label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Enter report title"
            className="w-full px-4 py-2 bg-[#1a2942]/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Select Person
          </label>
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a2942]/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select a person</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Report Sections</h3>
          <div className="flex gap-2">
            <TouchOptimizedButton
              variant="secondary"
              size="sm"
              onClick={() => addSection('text')}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Text
            </TouchOptimizedButton>
            <TouchOptimizedButton
              variant="secondary"
              size="sm"
              onClick={() => addSection('numbers')}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Numbers
            </TouchOptimizedButton>
            <TouchOptimizedButton
              variant="secondary"
              size="sm"
              onClick={() => addSection('chart')}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Chart
            </TouchOptimizedButton>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">Section {idx + 1}</span>
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  placeholder="Section title"
                  className="w-full px-3 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
                />

                {section.type === 'text' && (
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Enter content"
                    rows={4}
                    className="w-full px-3 py-2 bg-[#0a1629]/60 border border-white/5 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
                  />
                )}

                {section.type === 'numbers' && (
                  <div className="text-sm text-white/60">
                    Numbers section will display numerology calculations
                  </div>
                )}

                {section.type === 'chart' && (
                  <div className="text-sm text-white/60">
                    Chart section will display visualization
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {sections.length === 0 && (
            <div className="text-center py-8 text-white/50">
              No sections added yet. Click the buttons above to add sections.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <TouchOptimizedButton
          variant="primary"
          onClick={handleSave}
          disabled={loading || !selectedPerson || !reportTitle || sections.length === 0}
          icon={<Save className="w-4 h-4" />}
        >
          {loading ? 'Saving...' : 'Save Report'}
        </TouchOptimizedButton>
        <TouchOptimizedButton
          variant="secondary"
          onClick={() => setPreviewMode(!previewMode)}
          icon={<Eye className="w-4 h-4" />}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </TouchOptimizedButton>
      </div>
    </SpaceCard>
  );
}