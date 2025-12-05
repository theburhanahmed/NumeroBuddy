'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MessageSquareIcon, MapPinIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { LandingNav } from '@/components/landing/landing-nav';
import { LandingFooter } from '@/components/landing/landing-footer';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidGlassHero } from '@/components/ui/liquid-glass-hero';
import { FloatingOrbs } from '@/components/FloatingOrbs';
import { AmbientParticles } from '@/components/AmbientParticles';
import { MagneticCard } from '@/components/ui/magnetic-card';
import { toast } from 'sonner';
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours"
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 transition-colors duration-500 relative overflow-hidden">
      <AmbientParticles />
      <FloatingOrbs />
      <LandingNav />

      {/* Hero Section */}
      <LiquidGlassHero title="Get In Touch" subtitle="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible." />

      {/* Contact Content */}
      <section className="section-spacing px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <ContactInfoCard icon={<MailIcon className="w-6 h-6" />} title="Email Us" content="support@numerai.com" delay={0.1} />
              <ContactInfoCard icon={<PhoneIcon className="w-6 h-6" />} title="Call Us" content="+1 (555) 123-4567" delay={0.2} />
              <ContactInfoCard icon={<MapPinIcon className="w-6 h-6" />} title="Visit Us" content={<>
                    123 Numerology Lane
                    <br />
                    San Francisco, CA 94102
                  </>} delay={0.3} />
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.4
            }}>
                <MagneticCard variant="liquid-premium" className="p-6">
                  <div className="liquid-glass-content">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                      <MessageSquareIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      Live Chat
                    </h3>
                    <p className="text-white/70 mb-3 text-sm">
                      Available Mon-Fri, 9am-5pm PST
                    </p>
                    <GlassButton variant="liquid" size="sm" className="w-full glass-glow">
                      Start Chat
                    </GlassButton>
                  </div>
                </MagneticCard>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div initial={{
              opacity: 0,
              x: 20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }}>
                <GlassCard variant="liquid-premium" className="p-8">
                  <div className="liquid-glass-content">
                    <h2 className="text-2xl font-bold mb-6 text-white">
                      Send Us a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-white/90 mb-2">
                            Your Name
                          </label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white/90 mb-2">
                            Email Address
                          </label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50" placeholder="your@email.com" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">
                          Subject
                        </label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50" placeholder="How can we help?" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">
                          Message
                        </label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={6} className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 resize-none" placeholder="Tell us more about your inquiry..." />
                      </div>

                      <GlassButton type="submit" variant="liquid" size="lg" className="w-full glass-glow" icon={<SendIcon className="w-5 h-5" />}>
                        Send Message
                      </GlassButton>
                    </form>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>;
}
function ContactInfoCard({
  icon,
  title,
  content,
  delay
}: any) {
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true
  }} transition={{
    delay
  }}>
      <MagneticCard variant="liquid-premium" className="p-6">
        <div className="liquid-glass-content">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
          <p className="text-white/70">{content}</p>
        </div>
      </MagneticCard>
    </motion.div>;
}