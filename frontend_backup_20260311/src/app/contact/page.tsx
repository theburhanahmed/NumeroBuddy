'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MailIcon,
  MessageSquareIcon,
  MapPinIcon,
  ClockIcon,
  SendIcon,
} from 'lucide-react'
import { GlassBackground } from '@/components/glass/glass-background'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'
import { CosmicButton } from '@/components/glassmorphism/cosmic-button'
import { toast } from 'sonner'

const contactInfo = [
  {
    icon: <MailIcon className="w-6 h-6" />,
    title: 'Email Us',
    content: 'support@numerai.com',
    description: 'For general inquiries and support',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Live Chat',
    content: 'Available 24/7',
    description: 'Instant help from our AI assistant',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    title: 'Location',
    content: 'San Francisco, CA',
    description: 'Serving seekers worldwide',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: 'Response Time',
    content: 'Within 24 hours',
    description: 'We typically respond faster',
    color: 'from-green-500 to-emerald-600',
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours",
    })
  }

  return (
    <div className="relative min-h-screen bg-[#0a1628] overflow-hidden">
      <GlassBackground starCount={80} />
      <LandingNav />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-display text-white mb-6 leading-tight">
            We&apos;re Here to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Help You
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have questions about numerology or our platform? Our team is ready
            to assist you on your cosmic journey.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity`}
              />
              <div className="relative p-6 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-center h-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {info.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-cyan-400 font-semibold mb-2">{info.content}</p>
                <p className="text-sm text-white/60">{info.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative p-8 rounded-3xl bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20">
            <h2 className="text-2xl font-display text-white mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <SendIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-white/70 mb-6">
                  Thank you for reaching out. We&apos;ll get back to you within 24
                  hours.
                </p>
                <CosmicButton
                  variant="secondary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </CosmicButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    required
                  />
                </div>
                <CosmicButton
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={isSubmitting}
                  icon={<SendIcon className="w-5 h-5" />}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </CosmicButton>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <LandingFooter />
    </div>
  )
}