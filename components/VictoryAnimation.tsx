'use client';

import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface VictoryAnimationProps {
  isMultiplayer: boolean;
  winnerName?: string;
}

export function VictoryAnimation({ isMultiplayer, winnerName }: VictoryAnimationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
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
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
    >
      {/* Confetti/Particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => {
          const colors = ['#3B82F6', '#60A5FA', '#10B981', '#8B5CF6', '#EC4899'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomX = (Math.random() - 0.5) * 200;
          const randomDelay = Math.random() * 0.5;
          const randomDuration = 2 + Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: randomColor,
              }}
              animate={{
                y: [0, 1000],
                x: [0, randomX],
                rotate: [0, 360],
                opacity: [1, 0],
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

      {/* Main victory card */}
      <motion.div
        variants={itemVariants}
        className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full mx-4 text-center"
      >
        {/* Sparkles around trophy */}
        <div className="absolute -top-4 -right-4">
          <motion.div variants={sparkleVariants} animate="animate">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
        <div className="absolute -top-4 -left-4">
          <motion.div variants={sparkleVariants} animate="animate" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
        <div className="absolute -bottom-4 -right-4">
          <motion.div variants={sparkleVariants} animate="animate" style={{ animationDelay: '1s' }}>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>
        <div className="absolute -bottom-4 -left-4">
          <motion.div variants={sparkleVariants} animate="animate" style={{ animationDelay: '1.5s' }}>
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </div>

        {/* Trophy icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-4"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Trophy className="w-20 h-20 text-blue-600 dark:text-blue-400" />
          </motion.div>
        </motion.div>

        {/* Victory message */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          {isMultiplayer ? (winnerName ? `${winnerName} Wins!` : 'Game Over!') : 'You did it!'}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 dark:text-gray-400"
        >
          {isMultiplayer ? 'Congratulations!' : 'Congratulations! All pairs found!'}
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

