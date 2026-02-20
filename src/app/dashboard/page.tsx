'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiBell,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiPlus,
  FiArrowRight,
} from 'react-icons/fi';
import { formatDate, formatTime, formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (session) {
      fetchDashboard();
    }
  }, [session, status]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setDashData(data);
    } catch (error) {
      console.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!session) return null;

  const stats = [
    {
      label: 'Rides Offered',
      value: dashData?.stats.ridesOffered || 0,
      icon: FiTrendingUp,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Rides Taken',
      value: dashData?.stats.ridesTaken || 0,
      icon: FiUsers,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Earnings',
      value: formatPrice(dashData?.stats.totalEarnings || 0),
      icon: FiDollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Notifications',
      value: dashData?.stats.unreadNotifications || 0,
      icon: FiBell,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back,{' '}
            <span className="gradient-text">
              {session.user?.name?.split(' ')[0]}
            </span>
          </h1>
          <p className="text-gray-400">Here&apos;s your ride-sharing overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="text-white text-lg" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/publish" className="glass-card p-6 group block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all">
                <FiPlus className="text-primary-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Offer a Ride</h3>
                <p className="text-sm text-gray-400">
                  Share your next journey and split costs
                </p>
              </div>
              <FiArrowRight className="ml-auto text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link href="/search" className="glass-card p-6 group block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all">
                <FiMapPin className="text-green-400 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Find a Ride</h3>
                <p className="text-sm text-gray-400">
                  Search for rides heading your way
                </p>
              </div>
              <FiArrowRight className="ml-auto text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Rides (as driver) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiCalendar className="text-primary-400" /> Upcoming Rides
            </h2>
            {dashData?.upcomingRides?.length > 0 ? (
              <div className="space-y-3">
                {dashData.upcomingRides.map((ride: any) => (
                  <Link
                    key={ride.id}
                    href={`/rides/${ride.id}`}
                    className="block p-4 rounded-xl hover:bg-white/5 transition-all border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">
                          {ride.origin} → {ride.destination}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={10} />
                            {formatDate(ride.departureDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock size={10} />
                            {formatTime(ride.departureTime)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-400">
                          {formatPrice(ride.price)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ride._count.bookings} booked
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No upcoming rides</p>
                <Link href="/publish" className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
                  Offer a ride →
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiUsers className="text-accent-400" /> My Bookings
            </h2>
            {dashData?.recentBookings?.length > 0 ? (
              <div className="space-y-3">
                {dashData.recentBookings.map((booking: any) => (
                  <Link
                    key={booking.id}
                    href={`/rides/${booking.ride.id}`}
                    className="block p-4 rounded-xl hover:bg-white/5 transition-all border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">
                          {booking.ride.origin} → {booking.ride.destination}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          with {booking.ride.driver.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            booking.status === 'confirmed'
                              ? 'glass-badge-success'
                              : booking.status === 'pending'
                              ? 'glass-badge-warning'
                              : 'glass-badge-danger'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No bookings yet</p>
                <Link href="/search" className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
                  Find a ride →
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
