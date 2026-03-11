import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareIcon, SendIcon, SparklesIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function AIChatPage() {
  const [messages, setMessages] = useState([
  {
    role: 'assistant',
    content:
    "Hello! I'm your AI Numerology Guide. Ask me anything about numerology, your numbers, or cosmic guidance.",
    timestamp: '10:30 AM'
  }]
  );
  const [input, setInput] = useState('');
  const suggestedQuestions = [
  'What does my Life Path number mean?',
  'How can I improve my relationships?',
  'What are master numbers?',
  'Tell me about my destiny number'];

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages([...messages, newMessage]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content:
        "That's a great question! Based on your numerology profile, I can provide insights...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };
  return (
    <CosmicPageLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <MessageSquareIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              AI Numerologist
            </h1>
            <p className="text-white/70">
              24/7 cosmic guidance at your fingertips
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SpaceCard variant="premium" className="p-6 h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  <div
                  className={`max-w-[80%] ${message.role === 'user' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-[#0a1628]/60 border border-cyan-500/20'} rounded-2xl p-4`}>

                    {message.role === 'assistant' &&
                  <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-purple-400 font-semibold">
                          AI Numerologist
                        </span>
                      </div>
                  }
                    <p className="text-white leading-relaxed">
                      {message.content}
                    </p>
                    <p className="text-xs text-white/40 mt-2">
                      {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about numerology..."
                className="flex-1 px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors" />

              <TouchOptimizedButton
                variant="primary"
                size="md"
                onClick={handleSend}
                icon={<SendIcon className="w-5 h-5" />}
                ariaLabel="Send message">

                Send
              </TouchOptimizedButton>
            </div>
          </SpaceCard>
        </div>

        <div className="space-y-6">
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
            }}>

            <SpaceCard variant="default" className="p-6">
              <h3 className="text-lg font-['Playfair_Display'] font-bold text-white mb-4">
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) =>
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-3 bg-[#0a1628]/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-sm text-white/80 transition-colors">

                    {question}
                  </button>
                )}
              </div>
            </SpaceCard>
          </motion.div>

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
              delay: 0.3
            }}>

            <SpaceCard variant="default" className="p-6">
              <h3 className="text-lg font-['Playfair_Display'] font-bold text-white mb-4">
                What I Can Help With
              </h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Interpret your numerology numbers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Provide daily guidance and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Answer questions about compatibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Explain numerology concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Offer cosmic timing advice</span>
                </li>
              </ul>
            </SpaceCard>
          </motion.div>
        </div>
      </div>
    </CosmicPageLayout>);

}