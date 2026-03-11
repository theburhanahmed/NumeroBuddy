import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import { CosmicPageLayout } from '../components/CosmicPageLayout';
import { SpaceCard } from '../components/SpaceCard';
import { TouchOptimizedButton } from '../components/TouchOptimizedButton';
import { CrystalNumerologyCube } from '../components/CrystalNumerologyCube';
import { peopleAPI, Person } from '../lib/people-api';
export function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await peopleAPI.list();
        setPeople(Array.isArray(res) ? res : []);
      } catch (e: any) {
        setError(e?.message || 'Unable to load people.');
        setPeople([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);
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

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white">
                People Manager
              </h1>
              <p className="text-white/70">
                Track relationships and compatibility
              </p>
            </div>
          </div>
          <TouchOptimizedButton
            variant="primary"
            size="md"
            icon={<PlusIcon className="w-5 h-5" />}
            ariaLabel="Add person">

            Add Person
          </TouchOptimizedButton>
        </div>
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
          delay: 0.1
        }}
        className="mb-8">

        <SpaceCard variant="premium" className="p-6 md:p-8">
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4">
            Your Network
          </h2>
          <p className="text-white/70 leading-relaxed">
            Keep track of important people in your life and understand your
            numerological compatibility. Add family, friends, partners, and
            colleagues to see how your numbers align.
          </p>
        </SpaceCard>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="text-white/60">Loading people…</div>
        )}
        {error && !isLoading && (
          <div className="text-red-400">{error}</div>
        )}
        {!isLoading && !error && people.length === 0 && (
          <div className="text-white/60">No people added yet.</div>
        )}
        {people.map((person, index) =>
        <motion.div
          key={person.id}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2 + index * 0.1
          }}
          whileHover={{
            y: -4
          }}>

            <SpaceCard variant="default" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">👤</div>
                <div className="flex gap-2">
                  <button
                  className="w-8 h-8 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 flex items-center justify-center text-cyan-400 transition-colors"
                  aria-label="Edit person">

                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-colors"
                  aria-label="Delete person">

                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-1">
                {person.name}
              </h3>
              <p className="text-cyan-400 text-sm mb-4">
                {person.relationship || '—'}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Birth Date:</span>
                  <span className="text-sm text-white">{person.birth_date || '—'}</span>
                </div>
              </div>

              <TouchOptimizedButton
              variant="ghost"
              size="sm"
              className="w-full mt-4"
              ariaLabel={`View details for ${person.name}`}>

                View Details
              </TouchOptimizedButton>
            </SpaceCard>
          </motion.div>
        )}

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
            delay: 0.5
          }}
          whileHover={{
            y: -4
          }}>

          <SpaceCard
            variant="default"
            className="p-6 h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/50 transition-colors">

            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
              <PlusIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Add New Person
            </h3>
            <p className="text-sm text-white/60 text-center">
              Track compatibility with someone new
            </p>
          </SpaceCard>
        </motion.div>
      </div>
    </CosmicPageLayout>);

}