import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, VideoIcon, CheckIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
export function ConsultationBooking() {
  const [selectedExpert, setSelectedExpert] = useState('dr-sarah-chen');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  const experts = [
  {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    specialty: 'Life Path & Career',
    price: 99
  },
  {
    id: 'michael-torres',
    name: 'Michael Torres',
    specialty: 'Relationships',
    price: 89
  },
  {
    id: 'emma-williams',
    name: 'Emma Williams',
    specialty: 'Business',
    price: 129
  }];

  const availableTimes = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM'];

  const handleBooking = () => {
    setStep(4);
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
              Book Consultation
            </h1>
            <p className="text-white/70">
              Schedule your session with an expert
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
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
          delay: 0.1
        }}
        className="mb-8">

        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[1, 2, 3].map((num) =>
          <div key={num} className="flex items-center flex-1">
              <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-cyan-500 text-white' : 'bg-cyan-500/20 text-white/40'}`}>

                {step > num ? <CheckIcon className="w-5 h-5" /> : num}
              </div>
              {num < 3 &&
            <div
              className={`flex-1 h-1 mx-2 ${step > num ? 'bg-cyan-500' : 'bg-cyan-500/20'}`} />

            }
            </div>
          )}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-white/60">
          <span>Select Expert</span>
          <span>Choose Date</span>
          <span>Confirm</span>
        </div>
      </motion.div>

      {step === 1 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Select Your Expert
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {experts.map((expert) =>
          <SpaceCard
            key={expert.id}
            variant={selectedExpert === expert.id ? 'premium' : 'default'}
            className={`p-6 cursor-pointer transition-all ${selectedExpert === expert.id ? 'ring-2 ring-cyan-500' : ''}`}
            onClick={() => setSelectedExpert(expert.id)}>

                <div className="text-center">
                  <div className="text-5xl mb-4">👨‍⚕️</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {expert.name}
                  </h3>
                  <p className="text-cyan-400 text-sm mb-4">
                    {expert.specialty}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    ${expert.price}
                  </div>
                  <p className="text-xs text-white/60">per session</p>
                </div>
              </SpaceCard>
          )}
          </div>
          <TouchOptimizedButton
          variant="primary"
          size="lg"
          onClick={() => setStep(2)}
          className="w-full max-w-md mx-auto block"
          ariaLabel="Continue to date selection">

            Continue
          </TouchOptimizedButton>
        </motion.div>
      }

      {step === 2 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6">
            Choose Date & Time
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <SpaceCard variant="premium" className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-400" />
                Select Date
              </h3>
              <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a1628]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />

            </SpaceCard>

            <SpaceCard variant="premium" className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-cyan-400" />
                Select Time
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((time) =>
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-xl transition-colors ${selectedTime === time ? 'bg-cyan-500 text-white' : 'bg-[#0a1628]/60 text-white/70 hover:bg-cyan-500/20'}`}>

                    {time}
                  </button>
              )}
              </div>
            </SpaceCard>
          </div>
          <div className="flex gap-4 max-w-md mx-auto">
            <TouchOptimizedButton
            variant="secondary"
            size="lg"
            onClick={() => setStep(1)}
            className="flex-1"
            ariaLabel="Go back">

              Back
            </TouchOptimizedButton>
            <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={() => setStep(3)}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
            ariaLabel="Continue to confirmation">

              Continue
            </TouchOptimizedButton>
          </div>
        </motion.div>
      }

      {step === 3 &&
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}>

          <SpaceCard variant="premium" className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-6 text-center">
              Confirm Your Booking
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-4 bg-[#0a1628]/40 rounded-xl">
                <span className="text-white/70">Expert:</span>
                <span className="text-white font-semibold">
                  {experts.find((e) => e.id === selectedExpert)?.name}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-[#0a1628]/40 rounded-xl">
                <span className="text-white/70">Date:</span>
                <span className="text-white font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between p-4 bg-[#0a1628]/40 rounded-xl">
                <span className="text-white/70">Time:</span>
                <span className="text-white font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between p-4 bg-[#0a1628]/40 rounded-xl">
                <span className="text-white/70">Price:</span>
                <span className="text-white font-semibold text-xl">
                  ${experts.find((e) => e.id === selectedExpert)?.price}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <TouchOptimizedButton
              variant="secondary"
              size="lg"
              onClick={() => setStep(2)}
              className="flex-1"
              ariaLabel="Go back">

                Back
              </TouchOptimizedButton>
              <TouchOptimizedButton
              variant="primary"
              size="lg"
              onClick={handleBooking}
              icon={<VideoIcon className="w-5 h-5" />}
              className="flex-1"
              ariaLabel="Confirm booking">

                Confirm Booking
              </TouchOptimizedButton>
            </div>
          </SpaceCard>
        </motion.div>
      }

      {step === 4 &&
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}>

          <SpaceCard
          variant="premium"
          className="p-12 max-w-2xl mx-auto text-center">

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
              Booking Confirmed!
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Your consultation has been scheduled. You'll receive a
              confirmation email with the video call link shortly.
            </p>
            <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            ariaLabel="Go to dashboard">

              Go to Dashboard
            </TouchOptimizedButton>
          </SpaceCard>
        </motion.div>
      }
    </CosmicPageLayout>);

}