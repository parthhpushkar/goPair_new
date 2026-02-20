'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiRepeat, FiSearch } from 'react-icons/fi';

export default function SearchForm({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);
    params.set('passengers', passengers.toString());
    router.push(`/search?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`${
        isHero ? 'glass-card p-6 md:p-8' : 'glass p-4'
      } w-full max-w-4xl mx-auto`}
    >
      <div className={`grid gap-4 ${isHero ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-5'}`}>
        {/* Origin */}
        <div className="relative">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">From</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Departure city"
              className="glass-input pl-10"
              required
            />
          </div>
        </div>

        {/* Swap Button (desktop) */}
        {isHero && (
          <div className="hidden md:flex items-end justify-center pb-1 -mx-6 lg:col-span-1 lg:hidden">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            >
              <FiRepeat size={16} />
            </button>
          </div>
        )}

        {/* Destination */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5 ml-1">
            <label className="text-xs font-medium text-gray-400">To</label>
            <button
              type="button"
              onClick={handleSwap}
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 md:hidden"
            >
              <FiRepeat size={10} /> Swap
            </button>
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Arrival city"
              className="glass-input pl-10"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Date</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="glass-input pl-10"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
            Passengers
          </label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="glass-input pl-10"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} className="bg-dark-950 text-white">
                  {n} {n === 1 ? 'passenger' : 'passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button type="submit" className="glass-button w-full md:w-auto min-w-[200px] py-3 text-base">
          <FiSearch className="text-lg" />
          Search Rides
          <FiArrowRight className="text-lg" />
        </button>
      </div>
    </motion.form>
  );
}
