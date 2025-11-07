'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { gameApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Trophy, Home, Users, Clock, Target, TrendingUp, Award, Medal, BarChart3, Timer, Move } from 'lucide-react';

export default function Top10Page() {
  const router = useRouter();
  const t = useTranslation();

  const { data: topScores, isLoading } = useQuery({
    queryKey: ['topScores'],
    queryFn: () => gameApi.getTopScores(10),
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const { data: statistics } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => gameApi.getStatistics(),
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {t('top10Scores')}
          </h1>
          <div className="h-1 w-32 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="flex justify-end mb-8">
          <motion.button
            onClick={() => router.push('/home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 focus-visible-ring shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            {t('home')}
          </motion.button>
        </motion.div>

        {/* Statistics Section */}
        {statistics && (
          <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Statistiques globales
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('totalGames')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.total_participations}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('avgPairs')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.average_score.toFixed(1)}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('totalPlayers')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.total_players}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('avgTime')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(Math.round(statistics.average_time))}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Move className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('avgMoves')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(statistics.average_moves)}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {t('bestTime')}
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.best_time > 0 ? formatTime(statistics.best_time) : '-'}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-600 dark:text-gray-400"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4">Chargement...</p>
          </motion.div>
        ) : topScores && topScores.length > 0 ? (
          <>
            {/* Podium for top 3 - Always show if we have at least 3 scores */}
            {topScores.length >= 3 && (
              <motion.div variants={itemVariants} className="mb-10 sm:mb-12">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Medal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Podium
                  </h2>
                </div>
                <div className="flex items-end justify-center gap-3 sm:gap-5">
                  {/* 2nd place (silver) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[160px]"
                  >
                    <div className="w-full bg-gray-400 dark:bg-gray-500 rounded-2xl p-4 sm:p-5 text-center shadow-lg mb-3 border-2 border-gray-300 dark:border-gray-400">
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">2</div>
                      <div className="text-sm sm:text-base font-bold text-white truncate w-full mb-2">
                        {topScores[1].player_name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/90">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(topScores[1].time)}
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 mt-1">
                        <Move className="w-3 h-3 inline mr-1" />
                        {topScores[1].moves} {topScores[1].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                  
                  {/* 1st place (gold) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="flex flex-col items-center flex-1 max-w-[160px] sm:max-w-[200px]"
                  >
                    <div className="w-full bg-yellow-500 dark:bg-yellow-600 rounded-2xl p-5 sm:p-6 text-center shadow-xl mb-3 border-2 border-yellow-400 dark:border-yellow-500">
                      <div className="text-4xl sm:text-5xl font-bold text-white mb-2">1</div>
                      <div className="text-base sm:text-lg font-bold text-white truncate w-full mb-2">
                        {topScores[0].player_name}
                      </div>
                      <div className="text-sm sm:text-base text-white/90">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatTime(topScores[0].time)}
                      </div>
                      <div className="text-sm sm:text-base text-white/90 mt-1">
                        <Move className="w-4 h-4 inline mr-1" />
                        {topScores[0].moves} {topScores[0].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 dark:text-yellow-400" />
                  </motion.div>
                  
                  {/* 3rd place (bronze) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                    className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[160px]"
                  >
                    <div className="w-full bg-amber-600 dark:bg-amber-700 rounded-2xl p-4 sm:p-5 text-center shadow-lg mb-3 border-2 border-amber-500 dark:border-amber-600">
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3</div>
                      <div className="text-sm sm:text-base font-bold text-white truncate w-full mb-2">
                        {topScores[2].player_name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/90">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(topScores[2].time)}
                      </div>
                      <div className="text-xs sm:text-sm text-white/90 mt-1">
                        <Move className="w-3 h-3 inline mr-1" />
                        {topScores[2].moves} {topScores[2].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-500" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Complete Ranking - Always show all scores with full stats */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {topScores.length >= 3 ? 'Classement complet' : 'Classement'}
                </h2>
              </div>
              {topScores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md border transition-all ${
                    score.rank === 1
                      ? 'bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-400 dark:border-yellow-500'
                      : score.rank === 2
                      ? 'bg-gray-400 dark:bg-gray-500 text-white border-gray-300 dark:border-gray-400'
                      : score.rank === 3
                      ? 'bg-amber-600 dark:bg-amber-700 text-white border-amber-500 dark:border-amber-600'
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`text-xl sm:text-2xl font-bold min-w-[35px] sm:min-w-[40px] ${
                      score.rank <= 3 ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      #{score.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-base sm:text-lg truncate ${
                        score.rank <= 3 ? 'text-white' : ''
                      }`}>
                        {score.player_name}
                      </div>
                      <div className={`text-xs sm:text-sm ${
                        score.rank <= 3 ? 'opacity-90' : 'opacity-80'
                      }`}>
                        {score.grid_size} • {score.theme} • {formatTime(score.time)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xl sm:text-2xl font-bold ${
                      score.rank <= 3 ? 'text-white' : ''
                    }`}>
                      {score.score} {score.score === 1 ? t('pair') : t('pairs')}
                    </div>
                    <div className={`text-xs sm:text-sm ${
                      score.rank <= 3 ? 'opacity-90' : 'opacity-80'
                    }`}>
                      {score.moves} {score.moves === 1 ? t('move') : t('moves')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('noScoresYet')}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

