'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { gameApi, Score } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';
import { NewRecordAnimation } from '@/components/NewRecordAnimation';
import { Trophy, Clock, Move, Play, Home, RotateCcw, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslation();
  const [mounted, setMounted] = useState(false);
  const {
    players,
    stats,
    settings,
    startNewGame,
    matchedPairs,
    gameState,
    initializeGame,
  } = useGameStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSavedScore = useRef(false);
  const [isBestScore, setIsBestScore] = useState(false);
  const [showRecordAnimation, setShowRecordAnimation] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useQuery({
    queryKey: ['topScores'],
    queryFn: () => gameApi.getTopScores(1),
  });

  const saveScoreMutation = useMutation({
    mutationFn: gameApi.saveScore,
    onSuccess: async (data) => {
      console.log('Score saved successfully:', data);
      setIsSubmitting(false);
      hasSavedScore.current = true;
      
      // Invalidate and remove from cache, then refetch topScores and statistics to get fresh data
      await queryClient.removeQueries({ queryKey: ['topScores'] });
      await queryClient.removeQueries({ queryKey: ['statistics'] });
      await queryClient.invalidateQueries({ queryKey: ['topScores'] });
      await queryClient.invalidateQueries({ queryKey: ['statistics'] });
      
      // Wait a bit for the database to update, then check if this is the new record
      setTimeout(async () => {
        // Refetch topScores to check if this is the best score (force fresh fetch)
        const freshTopScores = await queryClient.fetchQuery({
          queryKey: ['topScores'],
          queryFn: () => gameApi.getTopScores(1),
          staleTime: 0, // Don't cache this result
        });
        
        // Check if our saved score is now the #1 record
        if (freshTopScores && freshTopScores.length > 0 && data.id) {
          const topScore = freshTopScores[0];
          
          // Check if our score is the first one (by ID - most reliable check)
          if (topScore.id === data.id) {
            setIsBestScore(true);
            setShowRecordAnimation(true);
            // Hide animation after 5 seconds
            setTimeout(() => {
              setShowRecordAnimation(false);
            }, 5000);
          }
        } else if (!freshTopScores || freshTopScores.length === 0) {
          // First score is always best
          setIsBestScore(true);
          setShowRecordAnimation(true);
          setTimeout(() => {
            setShowRecordAnimation(false);
          }, 5000);
        }
      }, 300); // Small delay to ensure database is updated
    },
    onError: (error) => {
      console.error('Error saving score:', error);
      setIsSubmitting(false);
      hasSavedScore.current = false; // Allow retry on error
    },
  });

  useEffect(() => {
    // Save score for solo mode (only once) when gameState is finished
    console.log('Results page - gameState:', gameState, 'matchedPairs:', matchedPairs, 'hasSaved:', hasSavedScore.current);
    
    if (
      settings.numberOfPlayers === 1 &&
      !isSubmitting &&
      !hasSavedScore.current &&
      matchedPairs > 0 &&
      gameState === 'finished'
    ) {
      console.log('Attempting to save score...');
      setIsSubmitting(true);
      hasSavedScore.current = true;
      const score: Score = {
        player_name: players[0]?.name || 'Player 1',
        score: matchedPairs,
        moves: stats.moves,
        time: stats.time,
        grid_size: settings.gridSize,
        theme: settings.theme,
      };
      console.log('Score data:', score);
      saveScoreMutation.mutate(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, matchedPairs, settings.numberOfPlayers, stats.moves, stats.time]);

  const winner = players.length > 1
    ? players.reduce((max, player) =>
        player.score > max.score ? player : max
      )
    : null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAgain = async () => {
    // Check if we need to fetch theme data for dynamic themes
    const isDynamicIconTheme = settings.theme === 'icons' && settings.iconTheme && ['pokemon', 'dogs', 'movies', 'flags', 'fruits'].includes(settings.iconTheme);
    
    if (isDynamicIconTheme) {
      // Calculate limit based on grid size
      let limit: number;
      if (settings.gridSize === 'custom' && settings.customWidth && settings.customHeight) {
        limit = Math.ceil((settings.customWidth * settings.customHeight) / 2);
      } else {
        limit = settings.gridSize === '4x4' ? 8 : 18;
      }
      
      try {
        // Fetch theme data
        const themeResponse = await gameApi.getTheme(settings.iconTheme!, limit);
        // Initialize game with theme data
        initializeGame(themeResponse.data);
      } catch (error) {
        console.error('Error loading theme for play again:', error);
        // Fallback: go to home if theme loading fails
        startNewGame();
        router.push('/home');
        return;
      }
    } else {
      // For numbers or default icons, no need to fetch theme data
      initializeGame();
    }
    
    // Redirect to game page
    router.push('/game');
  };

  const handleNewGame = () => {
    startNewGame();
    router.push('/home');
  };

  return (
    <>
      {/* New Record Animation */}
      {showRecordAnimation && settings.numberOfPlayers === 1 && (
        <NewRecordAnimation playerName={players[0]?.name} />
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-slate-700"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full mb-4"
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {mounted ? (settings.numberOfPlayers === 1 ? t('youDidIt') : t('gameOver')) : (settings.numberOfPlayers === 1 ? 'You did it!' : 'Game Over!')}
            </h1>
            
            {/* Only show badge if we have a best score but animation is not showing (after it closed) */}
            {isBestScore && settings.numberOfPlayers === 1 && !showRecordAnimation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 text-white px-6 py-3 rounded-xl font-bold text-lg sm:text-xl shadow-lg ring-2 ring-amber-300 dark:ring-amber-500">
                  <Award className="w-5 h-5" />
                  <span>{mounted ? t('newRecord') : 'New Record!'}</span>
                </div>
              </motion.div>
            )}
          </div>

        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
              {mounted ? t('winner') : 'Winner'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {winner.name}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {winner.score} {winner.score === 1 ? t('pair') : t('pairs')}
            </div>
          </motion.div>
        )}

        <div className="space-y-4 mb-8">
          {settings.numberOfPlayers === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 text-center border border-gray-200 dark:border-slate-700"
              >
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {mounted ? t('timeElapsed') : 'Time Elapsed'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(stats.time)}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 text-center border border-gray-200 dark:border-slate-700"
              >
                <Move className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {mounted ? t('movesTaken') : 'Moves Taken'}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.moves}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                {mounted ? t('finalScores') : 'Final Scores'}
              </div>
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`rounded-2xl p-4 flex justify-between items-center shadow-md border ${
                    player.id === winner?.id
                      ? 'bg-blue-600 dark:bg-blue-500 text-white border-blue-700 dark:border-blue-600'
                      : 'bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <span className="font-semibold">{player.name}</span>
                  <span className="font-bold text-lg">{player.score} {player.score === 1 ? t('pair') : t('pairs')}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible-ring shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {mounted ? t('playAgain') : 'Play Again'}
          </motion.button>
          <motion.button
            onClick={handleNewGame}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 dark:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-500 focus-visible-ring shadow-md flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            {mounted ? t('newGame') : 'New Game'}
          </motion.button>
          <motion.button
            onClick={() => router.push('/home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 dark:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-500 focus-visible-ring shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            {mounted ? t('returnToMenu') : 'Return to Menu'}
          </motion.button>
          <motion.button
            onClick={() => router.push('/top10')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 dark:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-500 focus-visible-ring shadow-md flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            {mounted ? t('viewTop10') : 'View Top 10'}
          </motion.button>
        </div>
        </motion.div>
      </div>
    </>
  );
}

