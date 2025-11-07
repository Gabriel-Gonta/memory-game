'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { GameGrid } from '@/components/GameGrid';
import { GameStats } from '@/components/GameStats';
import { Menu } from '@/components/Menu';
import { VictoryAnimation } from '@/components/VictoryAnimation';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { RotateCcw, Play, X, Sparkles } from 'lucide-react';

export default function GamePage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslation();
  const {
    cards,
    players,
    currentPlayerIndex,
    gameState,
    stats,
    settings,
    flippedCards,
    isChecking,
    mismatchedCards,
    flipCard,
    checkMatch,
    resetGame,
    startNewGame,
    updateTime,
    initializeGame,
  } = useGameStore();

  // Wait for Zustand persist to hydrate from localStorage
  useEffect(() => {
    // Zustand persist hydrates synchronously, but we need to wait one render cycle
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Fix hydration mismatch by only rendering i18n content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize game if not already initialized
  // But preserve saved game from localStorage
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    // Only initialize if truly no cards AND no saved game state
    // Don't initialize if we have a saved game (gameState will be 'playing' or 'finished')
    if (cards.length === 0 && gameState === 'idle') {
      initializeGame();
    }
    // If we have a saved game in 'playing' state, restore it
    // The cards are already loaded from localStorage via Zustand persist
  }, [isHydrated, cards.length, gameState, initializeGame]);

  // Timer effect - restore elapsed time for saved games
  useEffect(() => {
    if (gameState !== 'playing') return;

    // If game was restored from localStorage and we have a saved time but no valid startTime
    // Adjust startTime to continue from where we left off
    const currentStats = useGameStore.getState().stats;
    if (!currentStats.startTime) {
      if (currentStats.time > 0) {
        // Game was restored - calculate startTime to continue from saved time
        const adjustedStartTime = Date.now() - currentStats.time * 1000;
        useGameStore.setState({
          stats: {
            ...currentStats,
            startTime: adjustedStartTime,
          },
        });
      } else {
        // New game - set startTime now
        useGameStore.setState({
          stats: {
            ...currentStats,
            startTime: Date.now(),
          },
        });
      }
    }

    // Start or resume timer
    const interval = setInterval(() => {
      const currentStats = useGameStore.getState().stats;
      if (currentStats.startTime) {
        const elapsed = Math.floor(
          (Date.now() - currentStats.startTime) / 1000
        );
        updateTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, stats.startTime, stats.time, updateTime]);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2 && !isChecking) {
      const timer = setTimeout(() => {
        checkMatch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flippedCards, checkMatch, isChecking]);

  // Redirect to results when game is finished (after animation)
  useEffect(() => {
    if (gameState === 'finished') {
      // Show animation for 3 seconds before redirecting
      const timer = setTimeout(() => {
        router.push('/results');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, router]);

  // Redirect if no game initialized (but wait for localStorage to hydrate)
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    // Only redirect if truly no game (not just loading from localStorage)
    if (gameState === 'idle' && cards.length === 0) {
      router.push('/home');
    }
  }, [isHydrated, gameState, cards.length, router]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (gameState !== 'playing' || flippedCards.length >= 2) return;
      flipCard(cardId);
    },
    [gameState, flippedCards.length, flipCard]
  );

  const handleRestart = () => {
    resetGame();
  };

  const handleNewGame = () => {
    startNewGame();
    router.push('/home');
  };

  // Wait for hydration before showing anything
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  // Don't show loading state - let Zustand persist restore first
  // Only show nothing if truly no game after hydration
  if (gameState === 'idle' && cards.length === 0) {
    return null;
  }

  const winner =
    players.length > 1
      ? players.reduce((max, player) =>
          player.score > max.score ? player : max
        )
      : null;

  return (
    <>
      {/* Victory Animation */}
      {gameState === 'finished' && (
        <VictoryAnimation
          isMultiplayer={players.length > 1}
          winnerName={winner?.name}
        />
      )}

      <div className="min-h-screen bg-gray-50 p-4 dark:bg-slate-900 sm:p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between gap-4 sm:mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="rounded-xl bg-blue-600 p-2 dark:bg-blue-500"
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                Memory Game
              </h1>
            </div>
            {/* Desktop buttons */}
            <div className="hidden flex-shrink-0 gap-2 sm:flex sm:gap-3">
              <motion.button
                onClick={handleRestart}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="focus-visible-ring flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 sm:px-6 sm:py-3 sm:text-base"
              >
                <RotateCcw className="h-4 w-4" />
                {mounted ? t('restart') : 'Restart'}
              </motion.button>
              <motion.button
                onClick={handleNewGame}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="focus-visible-ring flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 sm:px-6 sm:py-3 sm:text-base"
              >
                <Play className="h-4 w-4" />
                {mounted ? t('newGame') : 'New Game'}
              </motion.button>
              <motion.button
                onClick={() => router.push('/home')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="focus-visible-ring flex items-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 sm:px-6 sm:py-3 sm:text-base"
              >
                <X className="h-4 w-4" />
                {mounted ? t('quit') : 'Quit'}
              </motion.button>
            </div>
            {/* Mobile menu */}
            <div className="flex-shrink-0 sm:hidden">
              <Menu onRestart={handleRestart} onNewGame={handleNewGame} />
            </div>
          </motion.header>

          {/* Game Grid */}
          <div className="mb-6 mt-8 flex justify-center px-4 sm:mb-8 sm:mt-12">
            <div className="w-full max-w-fit">
              <GameGrid
                cards={cards}
                gridSize={settings.gridSize}
                onCardClick={handleCardClick}
                mismatchedCards={mismatchedCards}
              />
            </div>
          </div>

          {/* Stats */}
          <GameStats
            stats={stats}
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            isMultiplayer={players.length > 1}
          />
        </div>
      </div>
    </>
  );
}
