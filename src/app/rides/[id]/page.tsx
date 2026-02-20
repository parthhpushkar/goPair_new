'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiCalendar,
  FiMessageSquare,
  FiShield,
  FiPackage,
  FiWind,
  FiArrowLeft,
  FiCheckCircle,
} from 'react-icons/fi';
import { MdPets } from 'react-icons/md';
import { formatDate, formatTime, formatPrice, getInitials, timeAgo } from '@/lib/utils';
import StarRating from '@/components/ui/StarRating';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function RideDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    fetchRide();
  }, [id]);

  const fetchRide = async () => {
    try {
      const res = await fetch(`/api/rides/${id}`);
      const data = await res.json();
      if (res.ok) {
        setRide(data);
      }
    } catch (error) {
      console.error('Failed to fetch ride');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setBooking(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: id, seats: bookingSeats }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Booking failed');
        return;
      }

      toast.success('Ride booked successfully!');
      fetchRide();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async () => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: id,
          targetId: ride.driverId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        toast.success('Review submitted!');
        setReviewModalOpen(false);
        fetchRide();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) return <LoadingSpinner text="Loading ride details..." />;
  if (!ride) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Ride not found</h2>
          <p className="text-gray-400 mb-4">This ride may have been removed or doesn't exist.</p>
          <Link href="/search" className="glass-button">
            <FiArrowLeft /> Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const isDriver = (session?.user as any)?.id === ride.driverId;
  const hasBooked = ride.bookings?.some(
    (b: any) => b.userId === (session?.user as any)?.id && ['pending', 'confirmed'].includes(b.status)
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft /> Back to search results
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full bg-primary-500 ring-4 ring-primary-500/20" />
                <h1 className="text-2xl font-bold text-white">{ride.origin}</h1>
              </div>

              {ride.stops?.map((stop: any) => (
                <div key={stop.id} className="flex items-center gap-3 ml-1.5 my-2">
                  <div className="border-l-2 border-dashed border-white/10 h-5 ml-0.5" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 ring-2 ring-gray-500/20 -ml-1" />
                  <span className="text-sm text-gray-400">{stop.name}</span>
                  {stop.price && (
                    <span className="text-xs text-primary-400">{formatPrice(stop.price)}</span>
                  )}
                </div>
              ))}

              <div className="ml-1.5 border-l-2 border-dashed border-white/10 h-6" />
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-accent-500 ring-4 ring-accent-500/20" />
                <h1 className="text-2xl font-bold text-white">{ride.destination}</h1>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="glass-badge flex items-center gap-1.5">
                  <FiCalendar size={12} /> {formatDate(ride.departureDate)}
                </span>
                <span className="glass-badge flex items-center gap-1.5">
                  <FiClock size={12} /> {formatTime(ride.departureTime)}
                </span>
                {ride.estimatedArrival && (
                  <span className="glass-badge flex items-center gap-1.5">
                    ETA {formatTime(ride.estimatedArrival)}
                  </span>
                )}
                <span
                  className={`glass-badge flex items-center gap-1.5 ${
                    ride.availableSeats <= 1 ? 'glass-badge-warning' : 'glass-badge-success'
                  }`}
                >
                  <FiUsers size={12} /> {ride.availableSeats} of {ride.seats} seats left
                </span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/5">
                {ride.allowLuggage && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FiPackage /> Luggage OK
                  </span>
                )}
                {ride.allowPets && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <MdPets /> Pets OK
                  </span>
                )}
                {!ride.allowSmoking && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FiWind /> No Smoking
                  </span>
                )}
              </div>

              {ride.description && (
                <div className="mt-5 pt-5 border-t border-white/5">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {ride.description}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Vehicle */}
            {ride.vehicle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">🚗 Vehicle</h3>
                <p className="text-gray-300">
                  {ride.vehicle.color} {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.year})
                </p>
                <p className="text-sm text-gray-400 mt-1">Plate: {ride.vehicle.plate}</p>
              </motion.div>
            )}

            {/* Passengers */}
            {ride.bookings?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Passengers ({ride.bookings.filter((b: any) => b.status === 'confirmed').length})
                </h3>
                <div className="space-y-3">
                  {ride.bookings
                    .filter((b: any) => b.status === 'confirmed')
                    .map((b: any) => (
                      <div key={b.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                          {getInitials(b.user.name || 'U')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{b.user.name}</p>
                          <p className="text-xs text-gray-400">
                            {b.seats} seat{b.seats > 1 ? 's' : ''} • {formatPrice(b.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            {ride.reviews?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Reviews ({ride.reviews.length})
                </h3>
                <div className="space-y-4">
                  {ride.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-white/5 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                          {getInitials(review.author.name || 'U')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{review.author.name}</p>
                          <p className="text-xs text-gray-500">{timeAgo(review.createdAt)}</p>
                        </div>
                        <div className="ml-auto">
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-400 ml-11">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sticky top-24"
            >
              <div className="text-center mb-5">
                <span className="text-3xl font-bold gradient-text">
                  {formatPrice(ride.price)}
                </span>
                <p className="text-sm text-gray-400">per seat</p>
              </div>

              {!isDriver && ride.availableSeats > 0 && !hasBooked && (
                <>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                      Number of Seats
                    </label>
                    <select
                      value={bookingSeats}
                      onChange={(e) => setBookingSeats(parseInt(e.target.value))}
                      className="glass-input"
                    >
                      {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n} className="bg-dark-950">
                          {n} seat{n > 1 ? 's' : ''} — {formatPrice(ride.price * n)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleBook}
                    disabled={booking}
                    className="glass-button w-full py-3 text-base disabled:opacity-50"
                  >
                    {booking ? 'Booking...' : `Book ${bookingSeats} Seat${bookingSeats > 1 ? 's' : ''}`}
                  </button>
                </>
              )}

              {hasBooked && (
                <div className="flex items-center gap-2 justify-center text-green-400 py-3">
                  <FiCheckCircle />
                  <span className="font-medium">Booked</span>
                </div>
              )}

              {ride.availableSeats === 0 && !hasBooked && (
                <p className="text-center text-yellow-400 text-sm py-3">
                  This ride is fully booked
                </p>
              )}

              {isDriver && (
                <p className="text-center text-primary-400 text-sm py-3">
                  This is your ride
                </p>
              )}

              {/* Leave review */}
              {session && !isDriver && hasBooked && (
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="glass-button-secondary w-full mt-3 py-2.5"
                >
                  <FiStar /> Leave a Review
                </button>
              )}
            </motion.div>

            {/* Driver Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-4">Driver</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold text-white">
                  {ride.driver.image ? (
                    <img
                      src={ride.driver.image}
                      alt={ride.driver.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(ride.driver.name || 'U')
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{ride.driver.name}</p>
                    {ride.driver.verified && (
                      <FiShield className="text-primary-400" size={14} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiStar className="text-yellow-400" size={12} />
                    <span>{ride.driver.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span>{ride.driver.totalRides} rides</span>
                  </div>
                </div>
              </div>

              {ride.driver.bio && (
                <p className="text-sm text-gray-400 mb-4">{ride.driver.bio}</p>
              )}

              <p className="text-xs text-gray-500">
                Member since {formatDate(ride.driver.createdAt)}
              </p>

              {session && !isDriver && (
                <Link
                  href={`/messages?userId=${ride.driver.id}`}
                  className="glass-button-secondary w-full mt-4 py-2.5"
                >
                  <FiMessageSquare /> Contact Driver
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Leave a Review"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Rating</label>
            <StarRating rating={reviewRating} onRate={setReviewRating} readonly={false} size="lg" />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Comment (optional)</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="glass-input min-h-[80px]"
              placeholder="Share your experience..."
            />
          </div>
          <button onClick={handleReview} className="glass-button w-full py-3">
            Submit Review
          </button>
        </div>
      </Modal>
    </div>
  );
}
