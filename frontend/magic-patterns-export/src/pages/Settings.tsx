import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  CreditCardIcon,
  LogOutIcon,
  SaveIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CosmicTooltip } from '../components/CosmicTooltip';
export function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <UserIcon className="w-5 h-5" />
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <BellIcon className="w-5 h-5" />
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: <ShieldIcon className="w-5 h-5" />
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCardIcon className="w-5 h-5" />
  }];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <CosmicPageLayout>
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
        className="mb-8">

        <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-white/70">Manage your account and preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
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
          }}>

          <SpaceCard variant="default" className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30' : 'text-white/70 hover:bg-cyan-500/10 hover:text-white'}`}>

                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              )}
            </nav>

            {/* Logout Button */}
            <div className="mt-6 pt-6 border-t border-cyan-500/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">

                <LogOutIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </SpaceCard>
        </motion.div>

        {/* Content Area */}
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

          <SpaceCard variant="premium" className="p-6 md:p-8">
            {activeTab === 'profile' &&
            <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                    Profile Information
                  </h2>
                </div>

                {/* Profile Form */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                    type="text"
                    defaultValue="Sarah Johnson"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email
                    </label>
                    <input
                    type="email"
                    defaultValue="sarah@example.com"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                      Birth Date
                      <CosmicTooltip
                      content="Used for accurate numerology calculations"
                      icon />

                    </label>
                    <input
                    type="date"
                    defaultValue="1990-05-15"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

                  </div>

                  <div className="flex gap-3 pt-4">
                    <TouchOptimizedButton
                    variant="primary"
                    icon={<SaveIcon className="w-5 h-5" />}
                    ariaLabel="Save changes">

                      Save Changes
                    </TouchOptimizedButton>
                    <TouchOptimizedButton
                    variant="secondary"
                    ariaLabel="Cancel">

                      Cancel
                    </TouchOptimizedButton>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'notifications' &&
            <div className="space-y-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                {
                  label: 'Daily Readings',
                  description: 'Receive your daily numerology insights'
                },
                {
                  label: 'Weekly Forecasts',
                  description: 'Get weekly cosmic predictions'
                },
                {
                  label: 'Special Events',
                  description: 'Notifications about cosmic events'
                },
                {
                  label: 'Product Updates',
                  description: 'News about new features'
                }].
                map((item) =>
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 bg-[#0a1628]/40 rounded-xl border border-cyan-500/10">

                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-white/60">
                          {item.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked />

                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-600"></div>
                      </label>
                    </div>
                )}
                </div>
              </div>
            }

            {activeTab === 'privacy' &&
            <div className="space-y-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                  Privacy & Security
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-[#0a1628]/40 rounded-xl border border-cyan-500/10">
                    <h3 className="font-semibold text-white mb-2">
                      Change Password
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <TouchOptimizedButton variant="secondary" size="sm">
                      Update Password
                    </TouchOptimizedButton>
                  </div>

                  <div className="p-4 bg-[#0a1628]/40 rounded-xl border border-cyan-500/10">
                    <h3 className="font-semibold text-white mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <TouchOptimizedButton variant="secondary" size="sm">
                      Enable 2FA
                    </TouchOptimizedButton>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <h3 className="font-semibold text-red-400 mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-white/60 mb-4">
                      Permanently delete your account and all associated data
                    </p>
                    <TouchOptimizedButton variant="secondary" size="sm">
                      Delete Account
                    </TouchOptimizedButton>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'billing' &&
            <div className="space-y-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
                  Billing & Subscription
                </h2>

                <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-xl border border-cyan-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Premium Plan
                      </h3>
                      <p className="text-white/70">$9.99/month</p>
                    </div>
                    <div className="px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/30">
                      <span className="text-sm font-semibold text-cyan-400">
                        Active
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">
                    Next billing date: January 15, 2024
                  </p>
                  <div className="flex gap-3">
                    <TouchOptimizedButton variant="secondary" size="sm">
                      Manage Subscription
                    </TouchOptimizedButton>
                    <TouchOptimizedButton variant="ghost" size="sm">
                      View Invoices
                    </TouchOptimizedButton>
                  </div>
                </div>
              </div>
            }
          </SpaceCard>
        </motion.div>
      </div>
    </CosmicPageLayout>);

}