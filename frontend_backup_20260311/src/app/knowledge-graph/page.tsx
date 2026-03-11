'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { knowledgeGraphAPI } from '@/lib/numerology-api';
import { SpaceCard } from '@/components/space/space-card';
import { TouchOptimizedButton } from '@/components/buttons/touch-optimized-button';
import { CosmicPageLayout } from '@/components/cosmic/cosmic-page-layout';
import { Loader2, Network, Sparkles, Search, Link2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

type TabType = 'patterns' | 'connections' | 'insights' | 'query';

export default function KnowledgeGraphPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [patterns, setPatterns] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('patterns');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [queryResult, setQueryResult] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (activeTab === 'patterns') {
      fetchPatterns();
    } else if (activeTab === 'insights') {
      fetchInsights();
    }
  }, [isAuthenticated, router, activeTab]);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      const data = await knowledgeGraphAPI.discoverPatterns();
      setPatterns(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to discover patterns',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async (number: number) => {
    try {
      setLoading(true);
      const data = await knowledgeGraphAPI.findConnections(number);
      setConnections(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to find connections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await knowledgeGraphAPI.generateInsights();
      setInsights(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to generate insights',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    const queryType = (document.getElementById('query-type') as HTMLSelectElement)?.value || 'patterns';
    const queryParams: Record<string, any> = {};

    if (queryType === 'connections') {
      const number = parseInt((document.getElementById('query-number') as HTMLInputElement)?.value || '0');
      if (!number || number < 1 || number > 9) {
        toast({
          title: 'Error',
          description: 'Please enter a valid number between 1 and 9',
          variant: 'destructive',
        });
        return;
      }
      queryParams.number = number;
    }

    try {
      setLoading(true);
      const result = await knowledgeGraphAPI.queryGraph(queryType, queryParams);
      setQueryResult(result);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to query graph',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'patterns' as TabType, label: 'Patterns', icon: Network, description: 'Discover numerology patterns' },
    { id: 'connections' as TabType, label: 'Connections', icon: Link2, description: 'Find number connections' },
    { id: 'insights' as TabType, label: 'Insights', icon: Sparkles, description: 'AI-generated insights' },
    { id: 'query' as TabType, label: 'Query', icon: Search, description: 'Advanced graph queries' },
  ];

  return (
    <CosmicPageLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Knowledge Graph
          </h1>
          <p className="text-white/70">
            Discover patterns, connections, and insights across your numerology universe
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all
                  flex items-center gap-2
                  ${isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-white/70 hover:text-white hover:bg-[#1a2942]/60'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <>
                  {patterns.length > 0 ? (
                    patterns.map((pattern, index) => (
                      <SpaceCard key={index} variant="premium" className="p-6" glow>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{pattern.title || pattern.name || `Pattern ${index + 1}`}</h3>
                            {pattern.description && (
                              <p className="text-white/80 mb-3">{pattern.description}</p>
                            )}
                          </div>
                          {pattern.strength && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pattern.strength >= 0.8 ? 'bg-green-500/20 text-green-300' :
                              pattern.strength >= 0.5 ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {Math.round(pattern.strength * 100)}% Strength
                            </span>
                          )}
                        </div>
                        {pattern.numbers && pattern.numbers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {pattern.numbers.map((num: number, i: number) => (
                              <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm font-semibold">
                                {num}
                              </span>
                            ))}
                          </div>
                        )}
                        {pattern.insights && (
                          <div className="mt-4 pt-4 border-t border-cyan-500/20">
                            <p className="text-white/90 text-sm">{pattern.insights}</p>
                          </div>
                        )}
                      </SpaceCard>
                    ))
                  ) : (
                    <SpaceCard variant="premium" className="p-6 text-center">
                      <p className="text-white/70">No patterns discovered yet. Complete more numerology analyses to discover patterns.</p>
                    </SpaceCard>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <SpaceCard variant="premium" className="p-6" glow>
                <h3 className="text-xl font-bold text-white mb-4">Find Number Connections</h3>
                <div className="flex gap-4">
                  <input
                    type="number"
                    min="1"
                    max="9"
                    placeholder="Enter number (1-9)"
                    value={selectedNumber || ''}
                    onChange={(e) => setSelectedNumber(parseInt(e.target.value) || null)}
                    className="flex-1 bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
                  />
                  <TouchOptimizedButton
                    variant="primary"
                    onClick={() => selectedNumber && fetchConnections(selectedNumber)}
                    disabled={!selectedNumber || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Finding...
                      </>
                    ) : (
                      'Find Connections'
                    )}
                  </TouchOptimizedButton>
                </div>
              </SpaceCard>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <>
                  {connections.length > 0 ? (
                    <div className="space-y-4">
                      {connections.map((connection, index) => (
                        <SpaceCard key={index} variant="premium" className="p-6" glow>
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-2">
                                Connection to {connection.target_number || connection.number}
                              </h4>
                              {connection.description && (
                                <p className="text-white/80 mb-3">{connection.description}</p>
                              )}
                              {connection.relationship_type && (
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  connection.relationship_type === 'strong' ? 'bg-green-500/20 text-green-300' :
                                  connection.relationship_type === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {connection.relationship_type}
                                </span>
                              )}
                            </div>
                            {connection.strength && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-cyan-400">
                                  {Math.round(connection.strength * 100)}%
                                </div>
                                <p className="text-white/70 text-xs">Strength</p>
                              </div>
                            )}
                          </div>
                        </SpaceCard>
                      ))}
                    </div>
                  ) : selectedNumber && (
                    <SpaceCard variant="premium" className="p-6 text-center">
                      <p className="text-white/70">No connections found for number {selectedNumber}</p>
                    </SpaceCard>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
              ) : (
                <>
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <SpaceCard key={index} variant="premium" className="p-6" glow>
                        <div className="flex items-start gap-3 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">{insight.title || `Insight ${index + 1}`}</h3>
                            {insight.category && (
                              <span className="inline-block px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300 mb-2">
                                {insight.category}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-white/90 mb-3">{insight.insight || insight.description}</p>
                        {insight.recommendations && insight.recommendations.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-cyan-500/20">
                            <h4 className="text-sm font-semibold text-white mb-2">Recommendations:</h4>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                  <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </SpaceCard>
                    ))
                  ) : (
                    <SpaceCard variant="premium" className="p-6 text-center">
                      <p className="text-white/70">No insights available yet. Generate more numerology data to receive insights.</p>
                    </SpaceCard>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'query' && (
            <div className="space-y-6">
              <SpaceCard variant="premium" className="p-6" glow>
                <h3 className="text-xl font-bold text-white mb-4">Advanced Graph Query</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Query Type</label>
                    <select
                      id="query-type"
                      className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
                      defaultValue="patterns"
                    >
                      <option value="patterns">Discover Patterns</option>
                      <option value="connections">Find Connections</option>
                      <option value="insights">Generate Insights</option>
                    </select>
                  </div>
                  <div id="query-number-container" className="hidden">
                    <label className="block text-white/70 text-sm mb-2">Number (1-9)</label>
                    <input
                      id="query-number"
                      type="number"
                      min="1"
                      max="9"
                      placeholder="Enter number"
                      className="w-full bg-[#1a2942] border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-white/40"
                    />
                  </div>
                  <TouchOptimizedButton
                    variant="primary"
                    onClick={handleQuery}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Querying...
                      </>
                    ) : (
                      'Execute Query'
                    )}
                  </TouchOptimizedButton>
                </div>
              </SpaceCard>

              {queryResult && (
                <SpaceCard variant="premium" className="p-6" glow>
                  <h3 className="text-xl font-bold text-white mb-4">Query Results</h3>
                  <pre className="bg-[#0a1628] p-4 rounded-lg overflow-auto text-white/90 text-sm">
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                </SpaceCard>
              )}
            </div>
          )}
        </div>
      </div>
    </CosmicPageLayout>
  );
}

