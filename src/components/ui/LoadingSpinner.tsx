'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-primary-500/20 border-t-primary-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-sm text-gray-400">{text}</p>
    </div>
  );
}
