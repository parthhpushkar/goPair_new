'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiBell,
  FiMessageSquare,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiStar,
  FiCheck,
} from 'react-icons/fi';
import { timeAgo } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const iconMap: Record<string, any> = {
  booking: FiCalendar,
  message: FiMessageSquare,
  review: FiStar,
  ride: FiUsers,
  default: FiBell,
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (session) fetchNotifications();
  }, [session, status]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications read');
    }
  };

  if (loading) return <LoadingSpinner text="Loading notifications..." />;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiBell className="text-primary-400" /> Notifications
          </h1>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="glass-button-secondary text-sm py-2 px-4"
            >
              <FiCheck /> Mark all read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const Icon = iconMap[notif.type] || iconMap.default;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={notif.link || '#'}
                    className={`glass-card p-4 flex items-start gap-4 ${
                      !notif.read ? 'border-primary-500/30' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        !notif.read
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              !notif.read ? 'text-white' : 'text-gray-400'
                            }`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {notif.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-600 shrink-0">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                    )}
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
            <FiBell className="mx-auto text-4xl text-gray-600 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">All caught up!</h3>
            <p className="text-sm text-gray-400">No notifications at the moment</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
