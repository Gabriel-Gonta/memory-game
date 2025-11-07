'use client';

import { Card } from '@/lib/store';
import { motion } from 'framer-motion';
import { getIconByName } from '@/lib/icons';
import Image from 'next/image';
import { useState } from 'react';

import { GridSize, useGameStore } from '@/lib/store';

interface GameCardProps {
  card: Card;
  onClick: () => void;
  gridSize: GridSize;
  isMismatched?: boolean;
}

function CardContent({ card, isMatched = false }: { card: Card; isMatched?: boolean }) {
  const [imageError, setImageError] = useState(false);
  const textColor = isMatched 
    ? 'text-green-700 dark:text-green-800' 
    : 'text-gray-900 dark:text-gray-100';
  
  // Debug log for first card
  if (card.id === 'card-0') {
    console.log('🃏 CardContent rendering card:', {
      id: card.id,
      hasImage: !!card.image,
      hasEmoji: !!card.emoji,
      hasIconName: !!card.iconName,
      image: card.image,
      name: card.name,
    });
  }
  
  // Emoji theme (fruits)
  if (card.emoji) {
    return (
      <span className="text-4xl sm:text-5xl md:text-6xl" role="img" aria-label={card.name || 'Emoji'}>
        {card.emoji}
      </span>
    );
  }

  // Dynamic theme with image
  if (card.image) {
    // Special handling for flags - make them more visible with padding
    const isFlag = card.image.includes('flags') || card.image.includes('flag') || card.image.includes('restcountries');
    const isMovie = card.image.includes('tmdb.org');
    
    // If image failed to load, show fallback text
    if (imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center px-2">
          <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300">
            {card.name || 'Movie'}
          </span>
        </div>
      );
    }
    
    return (
      <div className={`relative w-full h-full flex items-center justify-center rounded-full overflow-hidden ${isFlag ? 'bg-white dark:bg-slate-100 p-2' : isMovie ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
        <Image
          src={card.image}
          alt={card.name || 'Card'}
          fill
          sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
          className={`${isFlag ? 'object-contain' : 'object-cover'} rounded-full`}
          onError={() => setImageError(true)}
          unoptimized={isMovie} // TMDB images may need unoptimized
        />
      </div>
    );
  }

  // Icon theme
  if (card.iconName) {
    const IconComponent = getIconByName(card.iconName);
    if (IconComponent) {
      return (
        <IconComponent
          className={`w-1/2 h-1/2 ${textColor}`}
          strokeWidth={2.5}
        />
      );
    }
  }

  // Numbers theme
  return (
    <span className={`font-bold text-lg sm:text-xl md:text-2xl ${textColor}`}>
      {card.value}
    </span>
  );
}

export function GameCard({ card, onClick, gridSize, isMismatched = false }: GameCardProps) {
  const { settings } = useGameStore();
  let sizeClass: string;
  
  if (gridSize === 'custom') {
    // Calculate size based on custom dimensions
    const totalCards = (settings.customWidth || 4) * (settings.customHeight || 4);
    if (totalCards <= 16) {
      sizeClass = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24';
    } else if (totalCards <= 36) {
      sizeClass = 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20';
    } else {
      sizeClass = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14';
    }
  } else {
    switch (gridSize) {
      case '4x4':
        sizeClass = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24';
        break;
      case '6x6':
        sizeClass = 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20';
        break;
      default:
        sizeClass = 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24';
    }
  }

  if (card.isMatched) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
        animate={{ 
          scale: [0.8, 1.2, 1],
          opacity: [0, 1, 1],
          rotate: [180, 0, 0],
        }}
        transition={{ 
          duration: 0.6, 
          ease: 'easeOut',
          times: [0, 0.5, 1],
        }}
        className={`${sizeClass} rounded-full bg-green-200 dark:bg-green-300 flex items-center justify-center cursor-default overflow-hidden shadow-md border-2 border-green-400 dark:border-green-500`}
        aria-hidden="true"
      >
        <CardContent card={card} isMatched={true} />
      </motion.div>
    );
  }

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  };

  return (
    <motion.div
      className={`${sizeClass} card-flip ${card.isFlipped ? 'flipped' : ''}`}
      animate={isMismatched ? shakeAnimation : {}}
    >
      <div className="card-flip-inner w-full h-full">
        <motion.button
          onClick={onClick}
          disabled={card.isFlipped || card.isMatched}
          className={`card-flip-front w-full h-full rounded-full bg-gray-900 dark:bg-slate-700 hover:bg-gray-800 dark:hover:bg-slate-600 flex items-center justify-center focus-visible-ring shadow-md relative group overflow-hidden ${isMismatched ? 'bg-red-600 dark:bg-red-500' : ''}`}
          whileHover={!card.isFlipped ? { scale: 1.05 } : {}}
          whileTap={!card.isFlipped ? { scale: 0.95 } : {}}
          aria-label={
            card.isFlipped
              ? `Card showing ${card.name || card.value}`
              : 'Face down card, click to reveal'
          }
          aria-pressed={card.isFlipped}
        >
          {/* Subtle shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0"
            initial={{ x: '-100%', y: '-100%' }}
            whileHover={{ x: '100%', y: '100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.button>
        <div className={`card-flip-back w-full h-full rounded-full flex items-center justify-center overflow-hidden shadow-md ${isMismatched ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white dark:bg-slate-600'}`}>
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full flex items-center justify-center"
            >
              <CardContent card={card} isMatched={false} />
            </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

