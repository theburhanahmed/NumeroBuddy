import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { SpaceCard } from './SpaceCard';
interface FAQItem {
  question: string;
  answer: string;
}
const faqs: FAQItem[] = [
{
  question: 'What is numerology and how does it work?',
  answer:
  'Numerology is the ancient study of numbers and their cosmic significance. It analyzes the numbers in your birth date and name to reveal insights about your personality, life path, and destiny. Our AI combines thousands of years of numerological wisdom with modern technology to provide accurate, personalized readings.'
},
{
  question: 'How accurate are the AI-powered readings?',
  answer:
  'Our AI is trained on extensive numerological databases and validated against traditional numerology practices. Users report 98% satisfaction with accuracy. The AI continuously learns and improves, combining ancient wisdom with pattern recognition to provide increasingly precise insights.'
},
{
  question: 'What makes numerobuddy different from other numerology apps?',
  answer:
  'numerobuddy uniquely combines AI technology with traditional numerology, offering 24/7 chat support, interactive 3D visualizations, and personalized daily guidance. Our platform is designed by numerology experts and built with cutting-edge technology for the most comprehensive experience available.'
},
{
  question: 'Can I try numerobuddy before subscribing?',
  answer:
  'Yes! We offer a free plan that includes basic readings, 3 daily insights, and community access. You can explore the platform and experience the quality of our insights before upgrading to Premium for unlimited access.'
},
{
  question: 'How do I calculate my Life Path number?',
  answer:
  'Your Life Path number is calculated by reducing your birth date to a single digit. For example, if you were born on March 15, 1990: 3 + 1 + 5 + 1 + 9 + 9 + 0 = 28, then 2 + 8 = 10, then 1 + 0 = 1. Your Life Path number would be 1. Our platform does this automatically when you enter your birth date.'
},
{
  question: 'Is my personal information secure?',
  answer:
  'Absolutely. We use bank-level SSL encryption to protect your data. Your information is never shared with third parties, and you can delete your account and all associated data at any time. Privacy and security are our top priorities.'
},
{
  question: 'Can I use numerobuddy for relationship compatibility?',
  answer:
  'Yes! Our Compatibility Checker analyzes the numerological dynamics between two people, providing insights for romantic relationships, friendships, and business partnerships. It examines Life Path numbers, Destiny numbers, and other key factors to show areas of harmony and potential challenges.'
},
{
  question: 'Do you offer consultations with human numerologists?',
  answer:
  'Yes, Premium and Enterprise users can book one-on-one consultations with certified numerology experts. These sessions provide deeper, personalized guidance and the opportunity to ask specific questions about your reading.'
}];

function FAQItem({ faq, index }: {faq: FAQItem;index: number;}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true
      }}
      transition={{
        delay: index * 0.05
      }}>

      <SpaceCard
        variant="default"
        className="overflow-hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white flex-1">
              {faq.question}
            </h3>
            <motion.div
              animate={{
                rotate: isOpen ? 180 : 0
              }}
              transition={{
                duration: 0.3
              }}
              className="text-cyan-400 flex-shrink-0">

              <ChevronDownIcon className="w-5 h-5" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen &&
            <motion.div
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height: 'auto',
                opacity: 1
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="overflow-hidden">

                <p className="text-white/70 leading-relaxed mt-4 pt-4 border-t border-cyan-500/20">
                  {faq.answer}
                </p>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </SpaceCard>
    </motion.div>);

}
export function FAQSection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-16">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}
            className="inline-block mb-6">

            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold backdrop-blur-xl">
              Got Questions?
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Frequently Asked
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              Questions
            </span>
          </h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to know about numerobuddy and numerology
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) =>
          <FAQItem key={faq.question} faq={faq} index={index} />
          )}
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mt-12">

          <p className="text-white/70 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">

            Contact Support
          </a>
        </motion.div>
      </div>
    </section>);

}