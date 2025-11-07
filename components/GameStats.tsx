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
      <div className="flex flex-wrap justify-center gap-3 px-4 sm:gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`min-w-[100px] rounded-xl px-4 py-3 text-center shadow-md transition-all sm:min-w-[120px] sm:px-6 ${
              index === currentPlayerIndex
                ? 'glow-primary subtle-pulse bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-white text-gray-900 hover:scale-105 dark:bg-slate-800 dark:text-gray-100'
            }`}
          >
            <div className="mb-1 text-xs font-semibold sm:text-sm">
              {player.name}
            </div>
            <div className="text-xl font-bold sm:text-2xl">{player.score}</div>
            {index === currentPlayerIndex && (
              <div className="mt-1 text-xs font-semibold opacity-90">
                CURRENT TURN
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3 px-4 sm:gap-4">
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="min-w-[100px] rounded-xl bg-blue-600 px-4 py-3 text-center text-white shadow-md transition-all dark:bg-blue-500 sm:min-w-[120px] sm:px-6"
      >
        <div className="mb-1 text-xs font-semibold opacity-90 sm:text-sm">
          Time
        </div>
        <div className="text-xl font-bold sm:text-2xl">
          {formatTime(stats.time)}
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="min-w-[100px] rounded-xl bg-blue-600 px-4 py-3 text-center text-white shadow-md transition-all dark:bg-blue-500 sm:min-w-[120px] sm:px-6"
      >
        <div className="mb-1 text-xs font-semibold opacity-90 sm:text-sm">
          Moves
        </div>
        <div className="text-xl font-bold sm:text-2xl">{stats.moves}</div>
      </motion.div>
    </div>
  );
}
