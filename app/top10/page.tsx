'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { gameApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import {
  Trophy,
  Home,
  Users,
  Clock,
  Target,
  TrendingUp,
  Award,
  Medal,
  BarChart3,
  Timer,
  Move,
} from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-slate-900 sm:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="mb-8 text-center sm:mb-10"
        >
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl">
            {t('top10Scores')}
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-blue-600 dark:bg-blue-500"></div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-end">
          <motion.button
            onClick={() => router.push('/home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="focus-visible-ring flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700 sm:px-6 sm:py-3"
          >
            <Home className="h-4 w-4" />
            {t('home')}
          </motion.button>
        </motion.div>

        {/* Statistics Section */}
        {statistics && (
          <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
                Statistiques globales
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('totalGames')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {statistics.total_participations}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('avgPairs')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {statistics.average_score.toFixed(1)}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('totalPlayers')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {statistics.total_players}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('avgTime')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {formatTime(Math.round(statistics.average_time))}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Move className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('avgMoves')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {Math.round(statistics.average_moves)}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    {t('bestTime')}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                  {statistics.best_time > 0
                    ? formatTime(statistics.best_time)
                    : '-'}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center text-gray-600 dark:text-gray-400"
          >
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4">Chargement...</p>
          </motion.div>
        ) : topScores && topScores.length > 0 ? (
          <>
            {/* Podium for top 3 - Always show if we have at least 3 scores */}
            {topScores.length >= 3 && (
              <motion.div variants={itemVariants} className="mb-10 sm:mb-12">
                <div className="mb-6 flex items-center justify-center gap-2">
                  <Medal className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                    Podium
                  </h2>
                </div>
                <div className="flex items-end justify-center gap-3 sm:gap-5">
                  {/* 2nd place (silver) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                    className="flex max-w-[140px] flex-1 flex-col items-center sm:max-w-[160px]"
                  >
                    <div className="mb-3 w-full rounded-2xl border-2 border-gray-300 bg-gray-400 p-4 text-center shadow-lg dark:border-gray-400 dark:bg-gray-500 sm:p-5">
                      <div className="mb-2 text-3xl font-bold text-white sm:text-4xl">
                        2
                      </div>
                      <div className="mb-2 w-full truncate text-sm font-bold text-white sm:text-base">
                        {topScores[1].player_name}
                      </div>
                      <div className="text-xs text-white/90 sm:text-sm">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {formatTime(topScores[1].time)}
                      </div>
                      <div className="mt-1 text-xs text-white/90 sm:text-sm">
                        <Move className="mr-1 inline h-3 w-3" />
                        {topScores[1].moves}{' '}
                        {topScores[1].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Medal className="h-8 w-8 text-gray-400 dark:text-gray-500 sm:h-10 sm:w-10" />
                  </motion.div>

                  {/* 1st place (gold) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="flex max-w-[160px] flex-1 flex-col items-center sm:max-w-[200px]"
                  >
                    <div className="mb-3 w-full rounded-2xl border-2 border-yellow-400 bg-yellow-500 p-5 text-center shadow-xl dark:border-yellow-500 dark:bg-yellow-600 sm:p-6">
                      <div className="mb-2 text-4xl font-bold text-white sm:text-5xl">
                        1
                      </div>
                      <div className="mb-2 w-full truncate text-base font-bold text-white sm:text-lg">
                        {topScores[0].player_name}
                      </div>
                      <div className="text-sm text-white/90 sm:text-base">
                        <Clock className="mr-1 inline h-4 w-4" />
                        {formatTime(topScores[0].time)}
                      </div>
                      <div className="mt-1 text-sm text-white/90 sm:text-base">
                        <Move className="mr-1 inline h-4 w-4" />
                        {topScores[0].moves}{' '}
                        {topScores[0].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Trophy className="h-10 w-10 text-yellow-500 dark:text-yellow-400 sm:h-12 sm:w-12" />
                  </motion.div>

                  {/* 3rd place (bronze) */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                    className="flex max-w-[140px] flex-1 flex-col items-center sm:max-w-[160px]"
                  >
                    <div className="mb-3 w-full rounded-2xl border-2 border-amber-500 bg-amber-600 p-4 text-center shadow-lg dark:border-amber-600 dark:bg-amber-700 sm:p-5">
                      <div className="mb-2 text-3xl font-bold text-white sm:text-4xl">
                        3
                      </div>
                      <div className="mb-2 w-full truncate text-sm font-bold text-white sm:text-base">
                        {topScores[2].player_name}
                      </div>
                      <div className="text-xs text-white/90 sm:text-sm">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {formatTime(topScores[2].time)}
                      </div>
                      <div className="mt-1 text-xs text-white/90 sm:text-sm">
                        <Move className="mr-1 inline h-3 w-3" />
                        {topScores[2].moves}{' '}
                        {topScores[2].moves === 1 ? t('move') : t('moves')}
                      </div>
                    </div>
                    <Award className="h-8 w-8 text-amber-600 dark:text-amber-500 sm:h-10 sm:w-10" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Complete Ranking - Always show all scores with full stats */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
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
                  className={`flex items-center justify-between rounded-2xl border p-4 shadow-md transition-all sm:p-5 ${
                    score.rank === 1
                      ? 'border-yellow-400 bg-yellow-500 text-white dark:border-yellow-500 dark:bg-yellow-600'
                      : score.rank === 2
                        ? 'border-gray-300 bg-gray-400 text-white dark:border-gray-400 dark:bg-gray-500'
                        : score.rank === 3
                          ? 'border-amber-500 bg-amber-600 text-white dark:border-amber-600 dark:bg-amber-700'
                          : 'border-gray-200 bg-white text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <div
                      className={`min-w-[35px] text-xl font-bold sm:min-w-[40px] sm:text-2xl ${
                        score.rank <= 3
                          ? 'text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      #{score.rank}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-base font-semibold sm:text-lg ${
                          score.rank <= 3 ? 'text-white' : ''
                        }`}
                      >
                        {score.player_name}
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${
                          score.rank <= 3 ? 'opacity-90' : 'opacity-80'
                        }`}
                      >
                        {score.grid_size} • {score.theme} •{' '}
                        {formatTime(score.time)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`text-xl font-bold sm:text-2xl ${
                        score.rank <= 3 ? 'text-white' : ''
                      }`}
                    >
                      {score.score} {score.score === 1 ? t('pair') : t('pairs')}
                    </div>
                    <div
                      className={`text-xs sm:text-sm ${
                        score.rank <= 3 ? 'opacity-90' : 'opacity-80'
                      }`}
                    >
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
            className="py-16 text-center"
          >
            <Trophy className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('noScoresYet')}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
