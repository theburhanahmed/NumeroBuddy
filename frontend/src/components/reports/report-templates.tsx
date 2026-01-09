'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Star, Plus, Edit, Trash2, Download } from 'lucide-react';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { reportAPI } from '@/lib/numerology-api';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  report_type: string;
  is_premium: boolean;
  is_custom: boolean;
  owner?: string;
  created_at: string;
}

interface ReportTemplatesProps {
  onCreateTemplate?: () => void;
  onSelectTemplate?: (template: ReportTemplate) => void;
}

export function ReportTemplates({ onCreateTemplate, onSelectTemplate }: ReportTemplatesProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [myTemplates, setMyTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    fetchTemplates();
    fetchMyTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await reportAPI.getReportTemplates();
      setTemplates(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTemplates = async () => {
    try {
      const response = await reportAPI.getMyReportTemplates();
      setMyTemplates(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch my templates:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await reportAPI.deleteReportTemplate(templateId);
      fetchMyTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Failed to delete template');
    }
  };

  const displayTemplates = activeTab === 'all' ? templates : myTemplates;

  if (loading) {
    return (
      <SpaceCard variant="premium" className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </SpaceCard>
    );
  }

  return (
    <SpaceCard variant="premium" className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Report Templates
          </h2>
          <TouchOptimizedButton
            variant="primary"
            onClick={onCreateTemplate}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Template
          </TouchOptimizedButton>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
            }`}
          >
            All Templates
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my'
                ? 'bg-cyan-500 text-white'
                : 'bg-[#1a2942]/40 text-white/70 hover:bg-[#1a2942]/60'
            }`}
          >
            My Templates ({myTemplates.length})
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#1a2942]/40 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer"
            onClick={() => onSelectTemplate && onSelectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">{template.name}</h3>
              </div>
              {template.is_premium && (
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              )}
            </div>

            <p className="text-sm text-white/70 mb-3 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="capitalize">{template.report_type.replace('_', ' ')}</span>
              {template.is_custom && (
                <span className="text-cyan-400">Custom</span>
              )}
            </div>

            {activeTab === 'my' && (
              <div className="mt-3 flex gap-2">
                <TouchOptimizedButton
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                  }}
                  icon={<Edit className="w-3 h-3" />}
                >
                  Edit
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.id);
                  }}
                  icon={<Trash2 className="w-3 h-3" />}
                >
                  Delete
                </TouchOptimizedButton>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {displayTemplates.length === 0 && (
        <div className="text-center py-12 text-white/50">
          {activeTab === 'all' ? 'No templates available' : 'You haven\'t created any templates yet'}
        </div>
      )}
    </SpaceCard>
  );
}