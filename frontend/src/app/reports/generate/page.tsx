'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, 
  User,
  Users,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { useAuth } from '@/contexts/auth-context';

interface Person {
  id: string;
  name: string;
  birth_date: string;
  relationship: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  report_type: string;
  is_premium: boolean;
}

export default function GenerateReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generationMessage, setGenerationMessage] = useState('');

  useEffect(() => {
    fetchPeople();
    fetchTemplates();
    
    // Check if there are pre-selected people or templates from URL params
    const personId = searchParams.get('person');
    const templateId = searchParams.get('template');
    
    if (personId) {
      setSelectedPeople([personId]);
    }
    
    if (templateId) {
      setSelectedTemplates([templateId]);
    }
  }, [searchParams]);

  const fetchPeople = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/people');
      // const data = await response.json();
      // setPeople(data);
      
      // Mock data for demonstration
      setPeople([
        {
          id: '1',
          name: 'John Doe',
          birth_date: '1990-05-15',
          relationship: 'self'
        },
        {
          id: '2',
          name: 'Jane Smith',
          birth_date: '1985-12-03',
          relationship: 'spouse'
        },
        {
          id: '3',
          name: 'Alex Johnson',
          birth_date: '2010-08-22',
          relationship: 'child'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/report-templates');
      // const data = await response.json();
      // setTemplates(data);
      
      // Mock data for demonstration
      setTemplates([
        {
          id: '1',
          name: 'Basic Birth Chart',
          description: 'Essential numerology numbers and their meanings',
          report_type: 'basic',
          is_premium: false
        },
        {
          id: '2',
          name: 'Detailed Analysis',
          description: 'Comprehensive analysis of all numerology aspects',
          report_type: 'detailed',
          is_premium: true
        },
        {
          id: '3',
          name: 'Compatibility Report',
          description: 'Relationship compatibility analysis',
          report_type: 'compatibility',
          is_premium: false
        },
        {
          id: '4',
          name: 'Career Guidance',
          description: 'Career path and professional insights',
          report_type: 'career',
          is_premium: true
        },
        {
          id: '5',
          name: 'Relationship Analysis',
          description: 'Deep dive into relationship dynamics',
          report_type: 'relationship',
          is_premium: true
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleSelectPerson = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId) 
        : [...prev, personId]
    );
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId) 
        : [...prev, templateId]
    );
  };

  const handleSelectAllPeople = () => {
    if (selectedPeople.length === people.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople(people.map(p => p.id));
    }
  };

  const handleSelectAllTemplates = () => {
    if (selectedTemplates.length === templates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map(t => t.id));
    }
  };

  const handleGenerateReports = async () => {
    if (selectedPeople.length === 0 || selectedTemplates.length === 0) {
      setGenerationStatus('error');
      setGenerationMessage('Please select at least one person and one template');
      return;
    }

    setGenerating(true);
    setGenerationStatus('idle');
    setGenerationMessage('');

    try {
      // In a real implementation, this would call the API
      // const response = await fetch('/api/reports/bulk-generate/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     person_ids: selectedPeople,
      //     template_ids: selectedTemplates
      //   })
      // });
      // 
      // if (response.ok) {
      //   setGenerationStatus('success');
      //   setGenerationMessage(`Successfully generated ${selectedPeople.length * selectedTemplates.length} reports`);
      //   // Redirect to reports page after a delay
      //   setTimeout(() => {
      //     router.push('/reports');
      //   }, 2000);
      // } else {
      //   setGenerationStatus('error');
      //   setGenerationMessage('Failed to generate reports');
      // }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGenerationStatus('success');
      setGenerationMessage(`Successfully generated ${selectedPeople.length * selectedTemplates.length} reports`);
      
      // Redirect to reports page after a delay
      setTimeout(() => {
        router.push('/reports');
      }, 2000);
    } catch (error) {
      console.error('Failed to generate reports:', error);
      setGenerationStatus('error');
      setGenerationMessage('Failed to generate reports');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddPerson = () => {
    router.push('/people/add');
  };

  const handleBrowseTemplates = () => {
    router.push('/templates');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generate Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Select people and report templates to generate numerology reports
              </p>
            </div>
          </div>

          {/* Generation Status */}
          {generationStatus !== 'idle' && (
            <div className={`mb-6 p-4 rounded-2xl ${
              generationStatus === 'success' 
                ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center gap-3">
                {generationStatus === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <p className={`font-medium ${
                    generationStatus === 'success' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {generationMessage}
                  </p>
                  {generationStatus === 'success' && (
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      Redirecting to reports page...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* People Selection */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select People</h2>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSelectAllPeople}
                >
                  {selectedPeople.length === people.length ? 'Deselect All' : 'Select All'}
                </GlassButton>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <GlassCard key={i} variant="default" className="p-6 h-24 animate-pulse">
                      <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                    </GlassCard>
                  ))}
                </div>
              ) : people.length === 0 ? (
                <GlassCard variant="default" className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No People Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add people to generate reports for them
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={handleAddPerson}
                    icon={<Plus className="w-5 h-5" />}
                  >
                    Add Person
                  </GlassButton>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {people.map((person) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <GlassCard 
                        variant={selectedPeople.includes(person.id) ? "elevated" : "default"}
                        className={`p-6 cursor-pointer transition-all duration-200 ${
                          selectedPeople.includes(person.id) 
                            ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20' 
                            : ''
                        }`}
                        onClick={() => handleSelectPerson(person.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedPeople.includes(person.id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedPeople.includes(person.id) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {person.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {new Date(person.birth_date).toLocaleDateString()}
                              </p>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {person.relationship}
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Selection */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select Templates</h2>
                <GlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSelectAllTemplates}
                >
                  {selectedTemplates.length === templates.length ? 'Deselect All' : 'Select All'}
                </GlassButton>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <GlassCard key={i} variant="default" className="p-6 h-24 animate-pulse">
                      <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <GlassCard 
                        variant={selectedTemplates.includes(template.id) ? "elevated" : "default"}
                        className={`p-6 cursor-pointer transition-all duration-200 ${
                          selectedTemplates.includes(template.id) 
                            ? 'ring-2 ring-purple-500 bg-purple-50/50 dark:bg-purple-900/20' 
                            : ''
                        }`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                            selectedTemplates.includes(template.id)
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedTemplates.includes(template.id) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {template.name}
                              </h3>
                              {template.is_premium && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                              {template.description}
                            </p>
                            <div className="mt-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                {template.report_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-center">
                <GlassButton 
                  variant="ghost" 
                  onClick={handleBrowseTemplates}
                >
                  Browse All Templates
                </GlassButton>
              </div>
            </div>
          </div>

          {/* Summary and Action Buttons */}
          <div className="mt-12">
            {/* Selection Summary */}
            <GlassCard variant="default" className="p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Selection Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Selected People</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPeople.length} of {people.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Selected Templates</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedTemplates.length} of {templates.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Reports to Generate</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedPeople.length * selectedTemplates.length}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton 
                variant="secondary" 
                onClick={() => router.push('/reports')}
                disabled={generating}
              >
                Cancel
              </GlassButton>
              <GlassButton 
                variant="primary" 
                onClick={handleGenerateReports}
                disabled={generating || selectedPeople.length === 0 || selectedTemplates.length === 0}
                icon={generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              >
                {generating ? 'Generating...' : `Generate ${selectedPeople.length * selectedTemplates.length} Reports`}
              </GlassButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}