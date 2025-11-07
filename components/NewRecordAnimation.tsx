'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

interface NewRecordAnimationProps {
  playerName?: string;
}

export function NewRecordAnimation({ playerName }: NewRecordAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const t = useTranslation();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      rotate: [0, 180, 360],
      scale: [1, 1.3, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const trophyVariants = {
    animate: {
      scale: [1, 1.15, 1],
      rotate: [0, -10, 10, -10, 10, 0],
      y: [0, -10, 0],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md"
    >
      {/* Confetti/Particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => {
          const colors = ['#3B82F6', '#60A5FA', '#10B981', '#8B5CF6', '#EC4899'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomX = (Math.random() - 0.5) * 300;
          const randomDelay = Math.random() * 0.8;
          const randomDuration = 2.5 + Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: randomColor,
                boxShadow: `0 0 10px ${randomColor}`,
              }}
              animate={{
                y: [0, 1200],
                x: [0, randomX],
                rotate: [0, 720],
                opacity: [1, 0.8, 0],
                scale: [1, 1.5, 0.5],
              }}
              transition={{
                duration: randomDuration,
                delay: randomDelay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </div>

      {/* Main record card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl border-2 border-amber-500 dark:border-amber-400 max-w-lg w-full mx-2 sm:mx-4 text-center overflow-hidden"
      >
        {/* Sparkles around the card */}
        {[
          { top: '-2rem', right: '-2rem' },
          { top: '-2rem', left: '-2rem' },
          { bottom: '-2rem', right: '-2rem' },
          { bottom: '-2rem', left: '-2rem' },
          { top: '50%', right: '-3rem' },
          { top: '50%', left: '-3rem' },
        ].map((position, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={position}
            variants={sparkleVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 dark:text-amber-400" />
          </motion.div>
        ))}

        {/* Stars decoration */}
        <div className="absolute top-4 left-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          </motion.div>
        </div>
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          </motion.div>
        </div>

        {/* Trophy icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6 relative z-10"
        >
          <motion.div
            animate={trophyVariants.animate}
            transition={trophyVariants.transition}
            className="relative"
          >
            <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl" />
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 dark:text-amber-400 relative z-10" />
          </motion.div>
        </motion.div>

        {/* Record message */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-3 relative z-10"
        >
          🏆 {mounted ? t('newRecord').toUpperCase() : 'NOUVEAU RECORD !'} 🏆
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-semibold mb-2 relative z-10 px-2"
        >
          {mounted 
            ? (playerName ? `${playerName} ${t('newRecordMessage')}` : t('newRecordMessageYou'))
            : (playerName ? `${playerName} est maintenant #1 !` : 'Vous êtes maintenant #1 !')
          }
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 relative z-10 px-2"
        >
          {mounted ? t('congratulations') : 'Félicitations pour ce score exceptionnel !'}
        </motion.p>

        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-amber-500 dark:border-amber-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  );
}





