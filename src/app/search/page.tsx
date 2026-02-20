'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiFilter, FiSliders, FiX } from 'react-icons/fi';
import SearchForm from '@/components/search/SearchForm';
import RideCard from '@/components/rides/RideCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('departureDate');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [preferences, setPreferences] = useState({
    allowPets: false,
    allowLuggage: false,
    noSmoking: false,
  });

  useEffect(() => {
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    if (origin || destination) {
      fetchRides();
    }
  }, [searchParams]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const origin = searchParams.get('origin');
      const destination = searchParams.get('destination');
      const date = searchParams.get('date');
      const passengers = searchParams.get('passengers');

      if (origin) params.set('origin', origin);
      if (destination) params.set('destination', destination);
      if (date) params.set('date', date);
      if (passengers) params.set('passengers', passengers);
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/rides?${params.toString()}`);
      const data = await res.json();
      setRides(data.rides || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRides = rides.filter((ride) => {
    if (ride.price < priceRange[0] || ride.price > priceRange[1]) return false;
    if (preferences.allowPets && !ride.allowPets) return false;
    if (preferences.allowLuggage && !ride.allowLuggage) return false;
    if (preferences.noSmoking && ride.allowSmoking) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchForm variant="compact" />
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-72 shrink-0 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-5 sticky top-24"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiSliders /> Filters
                  </h3>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-400 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="glass-input text-sm"
                  >
                    <option value="departureDate" className="bg-dark-950">Earliest Departure</option>
                    <option value="price" className="bg-dark-950">Lowest Price</option>
                    <option value="createdAt" className="bg-dark-950">Newest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-400 mb-2 block">
                    Max Price: ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-primary-500"
                  />
                </div>

                {/* Preferences */}
                <div className="space-y-3">
                  <label className="text-xs font-medium text-gray-400 mb-2 block">
                    Preferences
                  </label>
                  {[
                    { key: 'allowLuggage', label: 'Luggage Allowed' },
                    { key: 'allowPets', label: 'Pets Allowed' },
                    { key: 'noSmoking', label: 'No Smoking' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(preferences as any)[key]}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary-500"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Results List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {loading
                    ? 'Searching...'
                    : searchParams.get('origin')
                    ? `${filteredRides.length} ride${filteredRides.length !== 1 ? 's' : ''} found`
                    : 'Search for rides above'}
                </h2>
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden glass-button-secondary text-sm py-2 px-4"
                >
                  <FiFilter /> Filters
                </button>
              </div>

              {loading ? (
                <LoadingSpinner text="Finding the best rides for you..." />
              ) : filteredRides.length > 0 ? (
                <div className="space-y-4">
                  {filteredRides.map((ride, i) => (
                    <RideCard key={ride.id} ride={ride} index={i} />
                  ))}
                </div>
              ) : searchParams.get('origin') ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <div className="text-6xl mb-4">🛣️</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No rides found
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    No rides match your search criteria. Try adjusting your
                    filters or search for a different date.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Where are you heading?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Enter your origin and destination above to find available rides
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
