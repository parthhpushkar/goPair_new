'use client';

import { FiStar } from 'react-icons/fi';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function StarRating({
  rating,
  onRate,
  size = 'md',
  readonly = true,
}: StarRatingProps) {
  const sizeMap = { sm: 14, md: 18, lg: 24 };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRate?.(star)}
          className={`${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform`}
        >
          <FiStar
            size={sizeMap[size]}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}
