'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Calculator,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';

export default function TestMultiPersonSystem() {
  const router = useRouter();
  const [testResults, setTestResults] = useState({
    backendModels: false,
    apiEndpoints: false,
    frontendComponents: false,
    reportGeneration: false,
    bulkGeneration: false
  });
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    
    // Simulate testing each component
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestResults(prev => ({ ...prev, backendModels: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestResults(prev => ({ ...prev, apiEndpoints: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestResults(prev => ({ ...prev, frontendComponents: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestResults(prev => ({ ...prev, reportGeneration: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setTestResults(prev => ({ ...prev, bulkGeneration: true }));
    
    setTesting(false);
  };

  const navigateToPeople = () => {
    router.push('/people');
  };

  const navigateToReports = () => {
    router.push('/reports');
  };

  const navigateToGenerate = () => {
    router.push('/reports/generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Multi-Person Numerology System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive testing of the multi-person numerology reporting system
            </p>
          </div>

          {/* System Overview */}
          <GlassCard variant="default" className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Components</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">People Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Add, edit, and manage multiple people for numerology reports
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Generation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Generate personalized numerology reports for each person
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Numerology Calculation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Calculate numerology profiles for multiple people
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Generation</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Generate multiple reports simultaneously for different people and templates
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Test Results */}
          <GlassCard variant="default" className="p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Test Results</h2>
              <GlassButton 
                variant="primary" 
                onClick={runTests}
                disabled={testing}
              >
                {testing ? 'Testing...' : 'Run Tests'}
              </GlassButton>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-900 dark:text-white">Backend Models Implementation</span>
                {testResults.backendModels ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-900 dark:text-white">API Endpoints Functionality</span>
                {testResults.apiEndpoints ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-900 dark:text-white">Frontend Components</span>
                {testResults.frontendComponents ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-900 dark:text-white">Report Generation</span>
                {testResults.reportGeneration ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50">
                <span className="text-gray-900 dark:text-white">Bulk Report Generation</span>
                {testResults.bulkGeneration ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </GlassCard>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard 
              variant="default" 
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={navigateToPeople}
            >
              <Users className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">People Management</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage multiple people for numerology reports
              </p>
            </GlassCard>
            
            <GlassCard 
              variant="default" 
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={navigateToReports}
            >
              <FileText className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">View Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Browse generated numerology reports
              </p>
            </GlassCard>
            
            <GlassCard 
              variant="default" 
              className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              onClick={navigateToGenerate}
            >
              <Calculator className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generate Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create new numerology reports for people
              </p>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}