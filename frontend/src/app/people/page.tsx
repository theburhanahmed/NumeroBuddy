'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Calendar, 
  FileText, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { GlassCard } from '@/components/glassmorphism/glass-card';
import { GlassButton } from '@/components/glassmorphism/glass-button';
import { useAuth } from '@/contexts/auth-context';

interface Person {
  id: string;
  name: string;
  birth_date: string;
  relationship: string;
  created_at: string;
}

export default function PeopleManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPeople();
  }, []);

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
          relationship: 'self',
          created_at: '2023-01-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          birth_date: '1985-12-03',
          relationship: 'spouse',
          created_at: '2023-02-20'
        },
        {
          id: '3',
          name: 'Alex Johnson',
          birth_date: '2010-08-22',
          relationship: 'child',
          created_at: '2023-03-10'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = () => {
    router.push('/people/add');
  };

  const handleViewPerson = (personId: string) => {
    router.push(`/people/${personId}`);
  };

  const handleEditPerson = (personId: string) => {
    router.push(`/people/${personId}/edit`);
  };

  const handleDeletePerson = async (personId: string) => {
    if (confirm('Are you sure you want to delete this person?')) {
      try {
        // In a real implementation, this would delete via the API
        // await fetch(`/api/people/${personId}`, { method: 'DELETE' });
        setPeople(people.filter(person => person.id !== personId));
      } catch (error) {
        console.error('Failed to delete person:', error);
      }
    }
  };

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.relationship.toLowerCase().includes(searchTerm.toLowerCase())
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
                People Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage the people you want to generate numerology reports for
              </p>
            </div>
            
            <GlassButton 
              variant="primary" 
              onClick={handleAddPerson}
              icon={<UserPlus className="w-5 h-5" />}
            >
              Add Person
            </GlassButton>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people..."
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total People</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {people.length}
                  </p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Reports Generated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Today</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* People List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your People</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <GlassCard key={i} variant="default" className="p-6 h-24 animate-pulse">
                    <div className="h-6 bg-white/50 dark:bg-gray-800/50 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-white/50 dark:bg-gray-800/50 rounded w-1/2"></div>
                  </GlassCard>
                ))}
              </div>
            ) : filteredPeople.length === 0 ? (
              <GlassCard variant="default" className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No People Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm ? 'No people match your search.' : 'Add your first person to get started.'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeople.map((person) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                    <GlassCard variant="default" className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {person.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {new Date(person.birth_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {person.relationship}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <GlassButton 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleViewPerson(person.id)}
                          icon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </GlassButton>
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPerson(person.id)}
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </GlassButton>
                        <GlassButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePerson(person.id)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </GlassButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard 
                variant="default" 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/reports')}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">View Reports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See all generated reports</p>
              </GlassCard>
              
              <GlassCard 
                variant="default" 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/reports/generate')}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Generate Reports</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create new numerology reports</p>
              </GlassCard>
              
              <GlassCard 
                variant="default" 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/templates')}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center text-white mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Report Templates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Browse available templates</p>
              </GlassCard>
              
              <GlassCard 
                variant="default" 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push('/people')}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Manage People</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add or edit people</p>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}