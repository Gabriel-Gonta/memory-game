'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { SettingsMenu } from '@/components/SettingsMenu';
import { useTranslation } from '@/lib/i18n';
import { gameApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CustomGridModal } from '@/components/CustomGridModal';
import { Modal } from '@/components/Modal';
import { Users, Palette, Grid3x3, Play, Trophy, User, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { settings, setSettings, initializeGame } = useGameStore();
  const [localSettings, setLocalSettings] = useState({
    ...settings,
    playerNames: settings.playerNames || [''],
    iconTheme: settings.iconTheme || 'icons',
  });
  const [mounted, setMounted] = useState(false);
  const [showCustomGridModal, setShowCustomGridModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const t = useTranslation(); // Use the hook that subscribes to language changes
  
  // Fix hydration mismatch by only rendering i18n content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update player names array when number of players changes
  const numberOfPlayers = localSettings.numberOfPlayers;

  useEffect(() => {
    setLocalSettings((prev) => {
      const currentNames = prev.playerNames || [];
      const newNames = Array.from({ length: numberOfPlayers }, (_, i) => {
        if (currentNames[i]) return currentNames[i];
        if (i < currentNames.length) return currentNames[i];
        return '';
      });
      return { ...prev, playerNames: newNames };
    });
  }, [numberOfPlayers]);

  // Fetch theme data for dynamic icon themes
  const isDynamicIconTheme = localSettings.theme === 'icons' && localSettings.iconTheme && ['pokemon', 'dogs', 'movies', 'flags', 'fruits'].includes(localSettings.iconTheme);
  const gridSize = localSettings.gridSize;
  
  // Calculate limit based on grid size (number of pairs needed)
  let limit: number;
  if (gridSize === 'custom' && localSettings.customWidth && localSettings.customHeight) {
    limit = Math.ceil((localSettings.customWidth * localSettings.customHeight) / 2);
  } else {
    limit = gridSize === '4x4' ? 8 : 18;
  }

  const { data: themeData, isLoading: isLoadingTheme, error: themeError } = useQuery({
    queryKey: ['theme', localSettings.iconTheme, limit],
    queryFn: () => gameApi.getTheme(localSettings.iconTheme!, limit),
    enabled: isDynamicIconTheme,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    retry: 2, // Retry 2 times on error
  });

  const handleStartGame = async () => {
    // Don't allow starting with 'custom' grid size if dimensions not set
    if (localSettings.gridSize === 'custom' && (!localSettings.customWidth || !localSettings.customHeight)) {
      setErrorMessage(mounted ? 'Veuillez configurer la taille personnalisée de la grille.' : 'Please configure the custom grid size.');
      setShowErrorModal(true);
      return;
    }

    const finalPlayerNames = localSettings.playerNames.map((name, index) =>
      name.trim() || (mounted ? `${t('player')} ${index + 1}` : `Player ${index + 1}`)
    );
    const finalSettings = { ...localSettings, playerNames: finalPlayerNames };
    setSettings(finalSettings);

    // For dynamic icon themes, wait for theme data to load
    if (isDynamicIconTheme) {
      if (isLoadingTheme || !themeData) {
        return; // Wait for theme data
      }
      if (themeError) {
        console.error('Error loading theme:', themeError);
        setErrorMessage(mounted ? 'Erreur lors du chargement du thème. Veuillez réessayer.' : 'Error loading theme. Please try again.');
        setShowErrorModal(true);
        return;
      }
      console.log('🎬 Starting game with theme data:', themeData);
      console.log('🎬 Theme data structure:', themeData.data?.length || 0, 'items');
      if (themeData.data && themeData.data.length > 0) {
        console.log('🎬 First theme item:', themeData.data[0]);
      }
      initializeGame(themeData.data);
    } else {
      initializeGame();
    }
    router.push('/game');
  };

  const handleCustomGridConfirm = (width: number, height: number) => {
    setLocalSettings({
      ...localSettings,
      gridSize: 'custom',
      customWidth: width,
      customHeight: height,
    });
  };

  const handleGridSizeClick = (size: '4x4' | '6x6' | 'custom') => {
    if (size === 'custom') {
      setShowCustomGridModal(true);
    } else {
      updateSetting('gridSize', size);
      // Clear custom dimensions when selecting standard size
      setLocalSettings({
        ...localSettings,
        gridSize: size,
        customWidth: undefined,
        customHeight: undefined,
      });
    }
  };

  const updateSetting = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    if (key === 'theme' && value === 'numbers') {
      // Reset iconTheme when switching to numbers
      setLocalSettings({ ...localSettings, [key]: value, iconTheme: 'icons' });
    } else {
      setLocalSettings({ ...localSettings, [key]: value });
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...(localSettings.playerNames || [])];
    newNames[index] = name;
    setLocalSettings({ ...localSettings, playerNames: newNames });
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h1
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              Memory Game
            </motion.h1>
          </div>
          <SettingsMenu />
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-6">
          {/* Player Names - First in the form */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mounted ? t('playerName') : 'Player Name'}
                {localSettings.numberOfPlayers > 1 && 's'}
              </label>
            </div>
            <div className="space-y-3">
              {Array.from({ length: localSettings.numberOfPlayers }, (_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <label
                    htmlFor={`player-name-${i}`}
                    className="block text-xs text-gray-600 dark:text-gray-400 mb-1.5"
                  >
                    {mounted
                      ? `${t('player')} ${i + 1}`
                      : `Player ${i + 1}`}
                  </label>
                  <input
                    id={`player-name-${i}`}
                    type="text"
                    value={localSettings.playerNames[i] || ''}
                    onChange={(e) => updatePlayerName(i, e.target.value)}
                    placeholder={
                      mounted
                        ? `${t('player')} ${i + 1}`
                        : `Player ${i + 1}`
                    }
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all"
                    maxLength={20}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Select Theme */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mounted ? t('selectTheme') : 'Select Theme'}
              </label>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => {
                  updateSetting('theme', 'numbers');
                  setLocalSettings((prev) => ({ ...prev, iconTheme: 'icons' }));
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                  localSettings.theme === 'numbers'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                aria-pressed={localSettings.theme === 'numbers'}
              >
                {mounted ? t('numbers') : 'Numbers'}
              </motion.button>
              <motion.button
                onClick={() => updateSetting('theme', 'icons')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                  localSettings.theme === 'icons'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                aria-pressed={localSettings.theme === 'icons'}
              >
                {mounted ? t('icons') : 'Icons'}
              </motion.button>
            </div>
          </motion.div>

          {/* Icon Theme Selection (only shown when icons theme is selected) */}
          {localSettings.theme === 'icons' && (
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {mounted ? t('chooseCategory') : 'Choose a category'}
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { key: 'icons', label: mounted ? t('icons') : 'Icons', color: 'accent-cyan' },
                  { key: 'pokemon', label: mounted ? t('pokemon') : 'Pokémon', color: 'accent-yellow' },
                  { key: 'dogs', label: mounted ? t('dogs') : 'Dogs', color: 'accent-green' },
                  { key: 'movies', label: mounted ? t('movies') : 'Movies', color: 'accent-pink' },
                  { key: 'flags', label: mounted ? t('flags') : 'Flags', color: 'accent-blue' },
                  { key: 'fruits', label: mounted ? t('fruits') : 'Fruits', color: 'accent-purple' },
                ].map(({ key, label }) => (
                  <motion.button
                    key={key}
                    onClick={() => updateSetting('iconTheme', key as 'icons' | 'pokemon' | 'dogs' | 'movies' | 'flags' | 'fruits')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold text-sm sm:text-base focus-visible-ring transition-all ${
                      localSettings.iconTheme === key
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                    aria-pressed={localSettings.iconTheme === key}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Number of Players */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mounted ? t('numberOfPlayers') : 'Number of Players'}
              </label>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((num) => (
                <motion.button
                  key={num}
                  onClick={() => updateSetting('numberOfPlayers', num)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                    localSettings.numberOfPlayers === num
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                  aria-pressed={localSettings.numberOfPlayers === num}
                >
                  {num}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Grid Size */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {mounted ? t('gridSize') : 'Grid Size'}
              </label>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => handleGridSizeClick('4x4')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                  localSettings.gridSize === '4x4'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                aria-pressed={localSettings.gridSize === '4x4'}
              >
                4x4
              </motion.button>
              <motion.button
                onClick={() => handleGridSizeClick('6x6')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                  localSettings.gridSize === '6x6'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                aria-pressed={localSettings.gridSize === '6x6'}
              >
                6x6
              </motion.button>
              <motion.button
                onClick={() => handleGridSizeClick('custom')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold focus-visible-ring transition-all ${
                  localSettings.gridSize === 'custom'
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                aria-pressed={localSettings.gridSize === 'custom'}
              >
                {mounted ? t('custom') : 'Custom'}
                {localSettings.gridSize === 'custom' && localSettings.customWidth && localSettings.customHeight && (
                  <span className="block text-xs mt-1 opacity-90">
                    {localSettings.customWidth}x{localSettings.customHeight}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Start Game Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleStartGame}
              disabled={isDynamicIconTheme && (isLoadingTheme || !themeData || !!themeError)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {isDynamicIconTheme && isLoadingTheme
                ? (mounted ? t('loading') : 'Loading...')
                : isDynamicIconTheme && themeError
                ? (mounted ? 'Erreur' : 'Error')
                : mounted
                ? t('startGame')
                : 'Start Game'}
            </motion.button>
            
            {/* Error message for theme loading */}
            {isDynamicIconTheme && themeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 text-center mt-2"
              >
                {mounted ? 'Erreur lors du chargement du thème. Veuillez réessayer.' : 'Error loading theme. Please try again.'}
              </motion.div>
            )}
          </motion.div>

          {/* View Top Scores Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => router.push('/top10')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-700 dark:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-500 focus-visible-ring transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              {mounted ? t('viewTop10') : 'View Top 10'}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Custom Grid Modal */}
      <CustomGridModal
        isOpen={showCustomGridModal}
        onClose={() => setShowCustomGridModal(false)}
        onConfirm={handleCustomGridConfirm}
      />

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={mounted ? 'Erreur' : 'Error'}
      >
        <div className="space-y-4">
          <p className="text-gray-900 dark:text-gray-100">
            {errorMessage}
          </p>
          <motion.button
            onClick={() => setShowErrorModal(false)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible-ring transition-all shadow-md"
          >
            {mounted ? 'OK' : 'OK'}
          </motion.button>
        </div>
      </Modal>
    </div>
  );
}

