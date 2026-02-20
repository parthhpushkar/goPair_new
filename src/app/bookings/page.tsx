'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { formatDate, formatTime, formatPrice, getInitials } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (session) fetchBookings();
  }, [session, status]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading bookings..." />;

  const filteredBookings = bookings.filter((b) =>
    filter === 'all' ? true : b.status === filter
  );

  const statusConfig: Record<string, { color: string; icon: any }> = {
    pending: { color: 'glass-badge-warning', icon: FiClock },
    confirmed: { color: 'glass-badge-success', icon: FiCheckCircle },
    cancelled: { color: 'glass-badge-danger', icon: FiXCircle },
    completed: { color: 'glass-badge', icon: FiCheckCircle },
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          My <span className="gradient-text">Bookings</span>
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap ${
                filter === f
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'glass-button-secondary border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking, i) => {
              const config = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/rides/${booking.ride.id}`}>
                    <div className="glass-card p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FiMapPin className="text-primary-400" size={14} />
                            <span className="font-semibold text-white">
                              {booking.ride.origin}
                            </span>
                            <FiArrowRight className="text-gray-500" size={12} />
                            <span className="font-semibold text-white">
                              {booking.ride.destination}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiCalendar size={11} />
                              {formatDate(booking.ride.departureDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock size={11} />
                              {formatTime(booking.ride.departureTime)}
                            </span>
                            <span>
                              Driver: {booking.ride.driver.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-primary-400">
                              {formatPrice(booking.totalPrice)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className={`${config.color} flex items-center gap-1`}>
                            <StatusIcon size={12} />
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-sm text-gray-400 mb-4">
              {filter !== 'all'
                ? `No ${filter} bookings. Try a different filter.`
                : 'Start by searching for a ride!'}
            </p>
            <Link href="/search" className="glass-button inline-flex py-2.5 px-6 text-sm">
              Find a Ride
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
