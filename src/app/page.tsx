'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiShield,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiClock,
  FiStar,
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiHeart,
  FiZap,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import SearchForm from '@/components/search/SearchForm';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function HomePage() {
  const stats = [
    { value: '2M+', label: 'Active Users', icon: FiUsers },
    { value: '500K+', label: 'Rides Shared', icon: FiMapPin },
    { value: '₹50Cr+', label: 'Money Saved', icon: FiDollarSign },
    { value: '10K+', label: 'Tons CO₂ Saved', icon: FiHeart },
  ];

  const features = [
    {
      icon: FiSearch,
      title: 'Smart Search',
      description: 'Find rides instantly with AI-powered route matching. Filter by time, price, preferences, and driver ratings.',
    },
    {
      icon: FiShield,
      title: 'Verified Profiles',
      description: 'Every driver and passenger is verified. ID checks, ratings, and reviews keep you safe.',
    },
    {
      icon: FiDollarSign,
      title: 'Fair Pricing',
      description: 'Split fuel costs fairly. No surge pricing, no hidden fees. Save up to 75% compared to cabs.',
    },
    {
      icon: FiZap,
      title: 'Instant Booking',
      description: 'Book a seat in seconds. Get instant confirmation and real-time updates on your ride.',
    },
    {
      icon: FiStar,
      title: 'Rating System',
      description: 'Rate every ride. Build trust with detailed reviews. Only the best drivers stay on top.',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Join a community of conscious commuters. Share rides, stories, and reduce your carbon footprint.',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Search Your Route',
      description: 'Enter your origin, destination, and travel date. We\'ll find the perfect ride for you.',
    },
    {
      step: '02',
      title: 'Choose & Book',
      description: 'Compare rides, check driver profiles and reviews, then book your seat instantly.',
    },
    {
      step: '03',
      title: 'Travel Together',
      description: 'Meet your driver at the pickup point, enjoy the ride, and save money while reducing emissions.',
    },
    {
      step: '04',
      title: 'Rate & Review',
      description: 'After your trip, rate your experience to help build a trusted community.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Daily Commuter',
      quote: 'goPair saves me ₹3000 every month on my Delhi to Noida commute. The drivers are verified and the rides are always on time!',
      rating: 5,
    },
    {
      name: 'Rahul Mehta',
      role: 'Weekend Traveler',
      quote: 'I\'ve made friends through goPair! The community aspect is amazing. Plus, my weekend trips cost 70% less now.',
      rating: 5,
    },
    {
      name: 'Anita Desai',
      role: 'Driver Partner',
      quote: 'As a driver, goPair helps me offset my fuel costs significantly. The passengers are great and the platform is smooth.',
      rating: 5,
    },
  ];

  return (
    <div className="page-transition">
      {/* ──────── HERO SECTION ──────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/8 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-700/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-badge mb-6 px-4 py-2"
            >
              <HiOutlineSparkles className="text-primary-400" />
              <span>India's Most Trusted Carpooling Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Share Rides.{' '}
              <span className="gradient-text">Save Money.</span>
              <br />
              Reduce Emissions.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            >
              Connect with fellow travelers heading your way. Save up to 75% on
              travel costs while making every journey an adventure.
            </motion.p>
          </div>

          {/* Search Form */}
          <SearchForm variant="hero" />

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-8 text-sm"
          >
            <span className="text-gray-500">Popular routes:</span>
            {['Delhi → Jaipur', 'Mumbai → Pune', 'Bangalore → Chennai', 'Hyderabad → Vijayawada'].map(
              (route) => (
                <Link
                  key={route}
                  href={`/search?origin=${route.split(' → ')[0]}&destination=${route.split(' → ')[1]}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {route}
                </Link>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* ──────── STATS SECTION ──────── */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="mx-auto text-2xl text-primary-400 mb-3" />
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FEATURES SECTION ──────── */}
      <section className="py-20" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="glass-badge mb-4 inline-block">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need for{' '}
              <span className="gradient-text">seamless rides</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built with cutting-edge technology and designed for the modern commuter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all">
                  <feature.icon className="text-primary-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── HOW IT WORKS ──────── */}
      <section className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="glass-badge mb-4 inline-block">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Get started in{' '}
              <span className="gradient-text">4 easy steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                {...stagger}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 relative overflow-hidden"
              >
                <span className="absolute -top-4 -right-2 text-8xl font-bold text-white/[0.03]">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-primary-400 tracking-wider">
                    STEP {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── TESTIMONIALS ──────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="glass-badge mb-4 inline-block">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar
                      key={j}
                      className="text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA SECTION ──────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start{' '}
                <span className="gradient-text">sharing rides?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join millions of smart commuters who save money, reduce
                emissions, and enjoy better journeys every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search" className="glass-button py-3 px-8 text-base">
                  <FiSearch /> Find a Ride
                </Link>
                <Link
                  href="/publish"
                  className="glass-button-secondary py-3 px-8 text-base"
                >
                  <FiTrendingUp /> Offer a Ride
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
