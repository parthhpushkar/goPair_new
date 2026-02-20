'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiX,
  FiArrowRight,
  FiPackage,
  FiInfo,
} from 'react-icons/fi';
import { MdPets } from 'react-icons/md';

export default function PublishRidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    estimatedArrival: '',
    seats: '3',
    price: '',
    description: '',
    vehicleId: '',
    allowPets: false,
    allowSmoking: false,
    allowLuggage: true,
    recurring: false,
  });

  const [stops, setStops] = useState<{ name: string; price: string }[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (session) {
      fetchVehicles();
    }
  }, [session, status]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/user/vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addStop = () => {
    setStops([...stops, { name: '', price: '' }]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: string, value: string) => {
    const updated = [...stops];
    (updated[index] as any)[field] = value;
    setStops(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stops: stops.filter((s) => s.name.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to publish ride');
        return;
      }

      toast.success('Ride published successfully!');
      router.push(`/rides/${data.id}`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Offer a <span className="gradient-text">Ride</span>
            </h1>
            <p className="text-gray-400">
              Share your ride and split costs with fellow travelers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <FiMapPin className="text-primary-400" /> Route Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Departure City *
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g., Delhi"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Arrival City *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Jaipur"
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              {/* Intermediate Stops */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400 ml-1">
                    Stops Along the Way
                  </label>
                  <button
                    type="button"
                    onClick={addStop}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    <FiPlus size={12} /> Add Stop
                  </button>
                </div>
                {stops.map((stop, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <input
                      type="text"
                      value={stop.name}
                      onChange={(e) => updateStop(i, 'name', e.target.value)}
                      placeholder="Stop name"
                      className="glass-input flex-1"
                    />
                    <input
                      type="number"
                      value={stop.price}
                      onChange={(e) => updateStop(i, 'price', e.target.value)}
                      placeholder="₹ Price"
                      className="glass-input w-28"
                    />
                    <button
                      type="button"
                      onClick={() => removeStop(i)}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <FiCalendar className="text-primary-400" /> Schedule
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Est. Arrival Time
                  </label>
                  <input
                    type="time"
                    name="estimatedArrival"
                    value={formData.estimatedArrival}
                    onChange={handleChange}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <FiDollarSign className="text-primary-400" /> Pricing & Seats
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Price per Seat (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    className="glass-input"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">
                    Available Seats *
                  </label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    className="glass-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <option key={n} value={n} className="bg-dark-950">
                        {n} seat{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            {vehicles.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  🚗 Vehicle
                </h2>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="glass-input"
                >
                  <option value="" className="bg-dark-950">Select a vehicle (optional)</option>
                  {vehicles.map((v: any) => (
                    <option key={v.id} value={v.id} className="bg-dark-950">
                      {v.color} {v.make} {v.model} ({v.year}) - {v.plate}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Preferences */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <FiInfo className="text-primary-400" /> Preferences
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'allowLuggage', label: 'Luggage OK', icon: FiPackage },
                  { name: 'allowPets', label: 'Pets OK', icon: MdPets },
                  { name: 'recurring', label: 'Recurring', icon: FiClock },
                ].map(({ name, label, icon: Icon }) => (
                  <label
                    key={name}
                    className="glass flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-all"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      checked={(formData as any)[name]}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <Icon className="text-gray-400" />
                    <span className="text-sm text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-5">
                Additional Details
              </h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any additional info about the ride... (pickup point details, music preferences, etc.)"
                className="glass-input min-h-[100px] resize-y"
                rows={3}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full py-4 text-base disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  Publish Ride <FiArrowRight />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
