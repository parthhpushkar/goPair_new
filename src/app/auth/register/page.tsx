'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPhone, FiArrowRight, FiShield, FiUsers, FiMapPin } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20">
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-500/8 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineSparkles className="text-white text-xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Join goPair</h1>
          <p className="text-sm text-gray-400">Create your account in seconds with just your phone number</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <FiPhone className="text-primary-400" />
            </div>
            <span>Quick sign up with phone verification</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <FiShield className="text-primary-400" />
            </div>
            <span>Verified users for safe rides</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <FiUsers className="text-primary-400" />
            </div>
            <span>Join 2M+ trusted commuters</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <FiMapPin className="text-primary-400" />
            </div>
            <span>Share rides across 500+ cities</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/auth/login')}
          className="glass-button w-full py-3 text-base"
        >
          <FiPhone className="text-lg" />
          Continue with Phone Number
          <FiArrowRight />
        </button>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center mt-4 text-xs text-gray-600">
          By continuing, you agree to our{' '}
          <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
