import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  MailIcon,
  MessageSquareIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon } from
'lucide-react';
import { GlassPageLayout } from '../components/GlassPageLayout';
export function ContactGlass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    alert("Message sent! We'll get back to you within 24 hours.");
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  const updateField = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  const contactInfo = [
  {
    icon: <MailIcon className="w-6 h-6" />,
    title: 'Email Us',
    content: 'support@numerobuddy.com',
    description: 'For general inquiries and support',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Live Chat',
    content: 'Available 24/7',
    description: 'Instant help from our AI assistant',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    title: 'Location',
    content: 'San Francisco, CA',
    description: 'Serving seekers worldwide',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: 'Response Time',
    content: 'Within 24 hours',
    description: 'We typically respond faster',
    color: 'from-green-500 to-emerald-600'
  }];

  const socialLinks = [
  {
    name: 'Twitter',
    url: '#',
    icon: '𝕏'
  },
  {
    name: 'Facebook',
    url: '#',
    icon: 'f'
  },
  {
    name: 'Instagram',
    url: '#',
    icon: '📷'
  },
  {
    name: 'LinkedIn',
    url: '#',
    icon: 'in'
  }];

  return (
    <GlassPageLayout showNav={true} starCount={80}>
      <div className="max-w-7xl mx-auto px-8 py-20">
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
          className="text-center mb-20">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              💬 Get In Touch
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
            We're Here to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Help You
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have questions about numerology or our platform? Our team is ready
            to assist you on your cosmic journey.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
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
            delay: 0.2
          }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

          {contactInfo.map((info, index) =>
          <motion.div
            key={info.title}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.3 + index * 0.1
            }}
            className="group relative">

              <div
              className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`} />

              <div className="relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-center h-full">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>

                  {info.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-cyan-400 font-semibold mb-2">
                  {info.content}
                </p>
                <p className="text-sm text-white/60">{info.description}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content: Form + Info */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
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
              delay: 0.4
            }}
            className="relative">

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl blur-xl" />
            <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              <h2 className="text-2xl font-serif text-white mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white mb-2">

                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required />

                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white mb-2">

                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required />

                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-white mb-2">

                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    required>

                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-white mb-2">

                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    required />

                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">

                  <SendIcon className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>

          {/* Additional Info */}
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
              delay: 0.4
            }}
            className="space-y-8">

            {/* FAQ */}
            <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              <h3 className="text-xl font-serif text-white mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                {
                  q: 'How accurate is numerology?',
                  a: 'Numerology provides insights based on ancient wisdom and mathematical patterns. Many users find it remarkably accurate for self-discovery.'
                },
                {
                  q: 'Can I change my subscription?',
                  a: 'Yes! You can upgrade, downgrade, or cancel your subscription anytime from your account settings.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'Absolutely. We use bank-level encryption and never share your personal information with third parties.'
                }].
                map((faq, index) =>
                <div
                  key={index}
                  className="pb-4 border-b border-cyan-500/10 last:border-0">

                    <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
              <h3 className="text-xl font-serif text-white mb-6">
                Connect With Us
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {socialLinks.map((social) =>
                <a
                  key={social.name}
                  href={social.url}
                  className="aspect-square rounded-xl bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 flex items-center justify-center text-2xl text-white/60 hover:text-white transition-all"
                  aria-label={social.name}>

                    {social.icon}
                  </a>
                )}
              </div>
              <p className="text-sm text-white/60 mt-6 text-center">
                Follow us for daily numerology insights and cosmic wisdom
              </p>
            </div>

            {/* Support Hours */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/30">
              <h3 className="text-xl font-serif text-white mb-4">
                Support Hours
              </h3>
              <div className="space-y-2 text-white/70">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-green-400">9am - 6pm PST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="text-green-400">10am - 4pm PST</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Chat</span>
                  <span className="text-green-400">24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassPageLayout>);

}