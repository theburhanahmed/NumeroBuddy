import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  UserIcon,
  BellIcon,
  LockIcon,
  CreditCardIcon,
  DownloadIcon,
  LogOutIcon,
  SaveIcon } from
'lucide-react';
import { AppNavbar } from '../components/AppNavbar';
import { GlassBackground } from '../components/GlassBackground';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../lib/api-client';

const notificationOptions = [
  { notification_type: 'daily_reading', label: 'Daily Readings', description: 'Receive your daily numerology reading' },
  { notification_type: 'weekly_forecast', label: 'Weekly Forecasts', description: 'Get weekly cycle updates' },
  { notification_type: 'auspicious_dates', label: 'Special Dates', description: 'Alerts for auspicious dates' },
  { notification_type: 'product_updates', label: 'Product Updates', description: 'News about new features' },
];

export function SettingsGlass() {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing'>('profile');
  const [profile, setProfile] = useState({ name: '', email: '', birthDate: '', timezone: '', location: '', bio: '', profilePictureUrl: '' });
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setProfile({
      name: user?.full_name || '',
      email: user?.email || '',
      birthDate: user?.date_of_birth || user?.birthDate || '',
      timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      location: user?.location || '',
      bio: user?.bio || '',
      profilePictureUrl: user?.profile_picture_url || '',
    });
  }, [user]);

  useEffect(() => {
    notificationsAPI.getPreferences().then((response) => {
      setPreferences(Object.fromEntries(response.data.filter((item: any) => item.channel === 'push').map((item: any) => [item.notification_type, item.enabled])));
    }).catch(() => setSaveError('Unable to load notification preferences.'));
  }, []);
  const tabs = [
  {
    id: 'profile' as const,
    label: 'Profile',
    icon: <UserIcon className="w-5 h-5" />
  },
  {
    id: 'notifications' as const,
    label: 'Notifications',
    icon: <BellIcon className="w-5 h-5" />
  },
  {
    id: 'privacy' as const,
    label: 'Privacy',
    icon: <LockIcon className="w-5 h-5" />
  },
  {
    id: 'billing' as const,
    label: 'Billing',
    icon: <CreditCardIcon className="w-5 h-5" />
  }];

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={60} />

      <div className="relative z-10">
        
        <AppNavbar />

        <div className="max-w-5xl mx-auto px-8 py-8 pt-24">
          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="mb-12">

            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Settings
            </h1>
            <p className="text-xl text-white/70">
              Manage your account and preferences
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.1
              }}
              className="lg:col-span-1">

              <div className="p-4 rounded-2xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 space-y-2">
                {tabs.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : 'text-white/70 hover:text-white hover:bg-cyan-500/10'}`}>

                    {tab.icon}
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.2
              }}
              className="lg:col-span-3">

              <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
                {activeTab === 'profile' &&
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white mb-6">
                      Profile Information
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Full Name
                      </label>
                      <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                      setProfile({
                        ...profile,
                        name: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />

                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Email
                      </label>
                      <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />

                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Birth Date
                      </label>
                      <input
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) =>
                      setProfile({
                        ...profile,
                        birthDate: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />

                      <p className="text-xs text-white/50 mt-2">
                        Changing this will recalculate all your numbers
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Avatar URL</label>
                      <input type="url" value={profile.profilePictureUrl} onChange={(e) => setProfile({ ...profile, profilePictureUrl: e.target.value })} className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Timezone</label>
                      <input type="text" value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Location</label>
                      <input type="text" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Bio</label>
                      <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors" rows={4} />
                    </div>

                    {saveError && (
                      <p className="text-sm text-red-400">{saveError}</p>
                    )}
                    <button
                      onClick={async () => {
                        setIsSaving(true);
                        setSaveError(null);
                        try {
                          await updateProfile({
                            full_name: profile.name,
                            date_of_birth: profile.birthDate,
                            timezone: profile.timezone,
                            location: profile.location,
                            bio: profile.bio,
                            profile_picture_url: profile.profilePictureUrl,
                          });
                        } catch (e: any) {
                          setSaveError(e?.message || 'Unable to save changes.');
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
                      disabled={isSaving}
                    >
                      <SaveIcon className="w-5 h-5" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                }

                {activeTab === 'notifications' &&
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white mb-6">
                      Notification Preferences
                    </h2>

                    {notificationOptions.map((item) =>
                      <div key={item.notification_type} className="flex items-center justify-between p-4 rounded-xl bg-[#0a1628]/40 border border-cyan-500/10">
                        <div>
                          <div className="text-white font-semibold">{item.label}</div>
                          <div className="text-sm text-white/60">{item.description}</div>
                        </div>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={preferences[item.notification_type] ?? false}
                            onChange={async (event) => {
                              const enabled = event.target.checked;
                              try {
                                await notificationsAPI.updatePreference({ notification_type: item.notification_type, channel: 'push', enabled });
                                setPreferences((current) => ({ ...current, [item.notification_type]: enabled }));
                              } catch {
                                setSaveError('Unable to save notification preferences.');
                              }
                            }}
                          />
                          <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    )}
                  </div>
                }

                {activeTab === 'privacy' &&
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white mb-6">
                      Privacy & Data
                    </h2>

                    <div className="space-y-4">
                      <button className="w-full py-3 px-4 rounded-xl bg-[#0a1628]/60 border border-cyan-500/20 text-white hover:border-cyan-500/40 transition-all flex items-center justify-between">
                        <span>Download My Data</span>
                        <DownloadIcon className="w-5 h-5" />
                      </button>

                      <button className="w-full py-3 px-4 rounded-xl bg-[#0a1628]/60 border border-cyan-500/20 text-white hover:border-cyan-500/40 transition-all">
                        Change Password
                      </button>

                      <button className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 hover:bg-red-500/20 transition-all">
                        Delete Account
                      </button>
                    </div>
                  </div>
                }

                {activeTab === 'billing' &&
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white mb-6">
                      Subscription & Billing
                    </h2>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-400/30">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            Premium Plan
                          </div>
                          <div className="text-sm text-white/60">
                            $9.99/month
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-semibold">
                          Active
                        </div>
                      </div>
                      <div className="text-sm text-white/70">
                        Next billing date: January 15, 2025
                      </div>
                    </div>

                    <button className="w-full py-3 rounded-xl border border-cyan-400/30 text-white hover:bg-cyan-500/10 transition-all">
                      Manage Subscription
                    </button>
                  </div>
                }
              </div>
            </motion.div>
          </div>

          {/* Logout */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4
            }}
            className="mt-8 text-center">

            <button
              onClick={logout}
              className="px-8 py-3 rounded-full border border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 mx-auto"
            >
              <LogOutIcon className="w-5 h-5" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </div>);

}