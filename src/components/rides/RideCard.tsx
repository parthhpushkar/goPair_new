'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiSmile,
  FiPackage,
  FiWind,
} from 'react-icons/fi';
import { MdPets } from 'react-icons/md';
import { formatDate, formatTime, formatPrice, getInitials } from '@/lib/utils';

interface RideCardProps {
  ride: {
    id: string;
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    estimatedArrival?: string;
    price: number;
    availableSeats: number;
    seats: number;
    allowPets: boolean;
    allowSmoking: boolean;
    allowLuggage: boolean;
    driver: {
      id: string;
      name: string;
      image?: string;
      rating: number;
      totalRides: number;
      verified: boolean;
    };
    vehicle?: {
      make: string;
      model: string;
      color: string;
    };
  };
  index?: number;
}

export default function RideCard({ ride, index = 0 }: RideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/rides/${ride.id}`}>
        <div className="glass-card p-5 cursor-pointer group">
          {/* Route Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary-500 ring-4 ring-primary-500/20" />
                  <span className="font-semibold text-white text-lg">{ride.origin}</span>
                </div>
              </div>
              <div className="ml-1.5 border-l-2 border-dashed border-white/10 h-5" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-500/20" />
                <span className="font-semibold text-white text-lg">{ride.destination}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold gradient-text">{formatPrice(ride.price)}</span>
              <p className="text-xs text-gray-400 mt-0.5">per seat</p>
            </div>
          </div>

          {/* Date, Time, Seats */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="glass-badge flex items-center gap-1.5">
              <FiClock size={12} />
              {formatDate(ride.departureDate)} • {formatTime(ride.departureTime)}
            </div>
            {ride.estimatedArrival && (
              <div className="glass-badge flex items-center gap-1.5">
                <FiArrowRight size={12} />
                ETA {formatTime(ride.estimatedArrival)}
              </div>
            )}
            <div
              className={`glass-badge flex items-center gap-1.5 ${
                ride.availableSeats <= 1 ? 'glass-badge-warning' : 'glass-badge-success'
              }`}
            >
              <FiUsers size={12} />
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 mb-4">
            {ride.allowLuggage && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FiPackage size={14} /> Luggage
              </div>
            )}
            {ride.allowPets && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MdPets size={14} /> Pets OK
              </div>
            )}
            {!ride.allowSmoking && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FiWind size={14} /> No Smoking
              </div>
            )}
          </div>

          {/* Driver Info */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                {ride.driver.image ? (
                  <img
                    src={ride.driver.image}
                    alt={ride.driver.name || 'Driver'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(ride.driver.name || 'U')
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{ride.driver.name}</span>
                  {ride.driver.verified && (
                    <span className="text-xs text-primary-400">✓</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-0.5">
                    <FiStar className="text-yellow-400" size={11} />
                    <span>{ride.driver.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <span>{ride.driver.totalRides} rides</span>
                </div>
              </div>
            </div>

            {ride.vehicle && (
              <div className="text-right text-xs text-gray-400">
                <p>
                  {ride.vehicle.color} {ride.vehicle.make}
                </p>
                <p>{ride.vehicle.model}</p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
