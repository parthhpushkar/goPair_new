'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiSearch,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiHome,
  FiBell,
  FiMessageSquare,
  FiGrid,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/search', label: 'Find a Ride', icon: FiSearch },
    { href: '/publish', label: 'Offer a Ride', icon: FiPlusCircle },
  ];

  const authLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { href: '/messages', label: 'Messages', icon: FiMessageSquare },
    { href: '/notifications', label: 'Notifications', icon: FiBell },
    { href: '/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-neon group-hover:shadow-neon-accent transition-shadow">
              <HiOutlineSparkles className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">goPair</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <link.icon className="text-base" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {session.user?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 glass-card p-2 z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                      </div>
                      {authLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <link.icon className="text-base" />
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
                      >
                        <FiLogOut className="text-base" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="glass-button-secondary text-sm px-5 py-2"
                >
                  Log In
                </Link>
                <Link href="/auth/register" className="glass-button text-sm px-5 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all text-gray-300"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5"
              >
                <FiHome /> Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <link.icon /> {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <link.icon /> {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 w-full"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-3">
                  <Link href="/auth/login" className="glass-button-secondary flex-1 text-center text-sm py-2.5">
                    Log In
                  </Link>
                  <Link href="/auth/register" className="glass-button flex-1 text-center text-sm py-2.5">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
