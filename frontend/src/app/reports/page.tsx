'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Plus,
  Eye,
  Download,
  Filter,
  Calendar,
  User
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { useAuth } from '@/contexts/auth-context';

interface Report {
  id: string;
  title: string;
  person_name: string;
  template_name: string;
  generated_at: string;
  report_type: string;
}

interface Person {
  id: string;
  name: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  report_type: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPerson, setFilterPerson] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');

  useEffect(() => {
    fetchReports();
    fetchPeople();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/reports');
      // const data = await response.json();
      // setReports(data);
      
      // Mock data for demonstration
      setReports([
        {
          id: '1',
          title: 'Basic Birth Chart for John Doe',
          person_name: 'John Doe',
          template_name: 'Basic Birth Chart',
          generated_at: '2023-06-15T10:30:00Z',
          report_type: 'basic'
        },
        {
          id: '2',
          title: 'Detailed Analysis for Jane Smith',
          person_name: 'Jane Smith',
          template_name: 'Detailed Analysis',
          generated_at: '2023-06-10T14:45:00Z',
          report_type: 'detailed'
        },
        {
          id: '3',
          title: 'Compatibility Report for Alex Johnson',
          person_name: 'Alex Johnson',
          template_name: 'Compatibility Report',
          generated_at: '2023-06-05T09:15:00Z',
          report_type: 'compatibility'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeople = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // const response = await fetch('/api/people');
      // const data = await response.json();
      // setPeople(data);
      
      // Mock data for demonstration
      setPeople([
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Alex Johnson' }
      ]);
    } catch (error) {
      console.error('Failed to fetch people:', error);
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
        { id: '1', name: 'Basic Birth Chart', report_type: 'basic' },
        { id: '2', name: 'Detailed Analysis', report_type: 'detailed' },
        { id: '3', name: 'Compatibility Report', report_type: 'compatibility' },
        { id: '4', name: 'Career Guidance', report_type: 'career' },
        { id: '5', name: 'Relationship Analysis', report_type: 'relationship' }
      ]);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleGenerateReport = () => {
    router.push('/reports/generate');
  };

  const handleViewReport = (reportId: string) => {
    router.push(`/reports/${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // In a real implementation, this would download the report
    console.log('Downloading report:', reportId);
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPerson === '' || report.person_name === filterPerson) &&
    (filterTemplate === '' || report.template_name === filterTemplate)
  );

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
                Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                View and manage your generated numerology reports
              </p>
            </div>
            
            <GlassButton 
              variant="primary" 
              onClick={handleGenerateReport}
              icon={<Plus className="w-5 h-5" />}
            >
              Generate Report
            </GlassButton>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                value={filterPerson}
                onChange={(e) => setFilterPerson(e.target.value)}
              >
                <option value="">All People</option>
                {people.map(person => (
                  <option key={person.id} value={person.name}>{person.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
              >
                <option value="">All Templates</option>
                {templates.map(template => (
                  <option key={template.id} value={template.name}>{template.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reports.length}
                  </p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">People</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{people.length}</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Last Report</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reports.length > 0 ? new Date(reports[0].generated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Reports List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Generated Reports</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <GlassCard key={i} variant="default" className="p-6 h-24 animate-pulse">
                    <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                  </GlassCard>
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <GlassCard variant="default" className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Reports Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || filterPerson || filterTemplate 
                    ? 'No reports match your search or filters.' 
                    : 'Generate your first report to get started.'}
                </p>
                <GlassButton 
                  variant="primary" 
                  onClick={handleGenerateReport}
                  icon={<Plus className="w-5 h-5" />}
                >
                  Generate Report
                </GlassButton>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                    <GlassCard variant="default" className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {report.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {new Date(report.generated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {report.report_type}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <GlassButton 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleViewReport(report.id)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </GlassButton>
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.id)}
                          icon={<Download className="w-4 h-4" />}
                        >
                          Download
                        </GlassButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}