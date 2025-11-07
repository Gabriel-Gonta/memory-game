'use client';

import { GameStats as Stats } from '@/lib/store';
import { motion } from 'framer-motion';

interface GameStatsProps {
  stats: Stats;
  players: Array<{ id: number; name: string; score: number }>;
  currentPlayerIndex: number;
  isMultiplayer: boolean;
}

export function GameStats({
  stats,
  players,
  currentPlayerIndex,
  isMultiplayer,
}: GameStatsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMultiplayer) {
    return (
      <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`rounded-xl px-4 sm:px-6 py-3 min-w-[100px] sm:min-w-[120px] text-center shadow-md transition-all ${
              index === currentPlayerIndex
                ? 'bg-blue-600 dark:bg-blue-500 text-white glow-primary subtle-pulse'
                : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 hover:scale-105'
            }`}
          >
            <div className="text-xs sm:text-sm font-semibold mb-1">
              {player.name}
            </div>
            <div className="text-xl sm:text-2xl font-bold">{player.score}</div>
            {index === currentPlayerIndex && (
              <div className="text-xs mt-1 font-semibold opacity-90">CURRENT TURN</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4 justify-center px-4">
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="bg-blue-600 dark:bg-blue-500 text-white rounded-xl px-4 sm:px-6 py-3 text-center min-w-[100px] sm:min-w-[120px] shadow-md transition-all"
      >
        <div className="text-xs sm:text-sm font-semibold mb-1 opacity-90">
          Time
        </div>
        <div className="text-xl sm:text-2xl font-bold">
          {formatTime(stats.time)}
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="bg-blue-600 dark:bg-blue-500 text-white rounded-xl px-4 sm:px-6 py-3 text-center min-w-[100px] sm:min-w-[120px] shadow-md transition-all"
      >
        <div className="text-xs sm:text-sm font-semibold mb-1 opacity-90">
          Moves
        </div>
        <div className="text-xl sm:text-2xl font-bold">
          {stats.moves}
        </div>
      </motion.div>
    </div>
  );
}

