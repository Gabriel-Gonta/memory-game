'use client';

import { useState } from 'react';
import { Settings, X, Sun, Moon, Monitor, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, ThemeMode } from '@/lib/theme';
import { useI18nStore, Language } from '@/lib/i18n';

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);

  const modes: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun size={18} />, label: 'Light' },
    { value: 'dark', icon: <Moon size={18} />, label: 'Dark' },
    { value: 'system', icon: <Monitor size={18} />, label: 'System' },
  ];

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'fr', label: 'FR', flag: '🇫🇷' },
    { value: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="focus-visible-ring rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-blue-400"
        aria-label="Settings"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="space-y-4 p-4">
                {/* Language Section */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Languages
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Language
                    </span>
                  </div>
                  <div className="flex gap-2 rounded-xl bg-gray-50 p-1.5 dark:bg-slate-900">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.value}
                        onClick={() => {
                          setLanguage(lang.value);
                          setIsOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                          language === lang.value
                            ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
                            : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Theme Section */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Sun
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Theme
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-1.5 dark:bg-slate-900">
                    {modes.map((m) => (
                      <motion.button
                        key={m.value}
                        onClick={() => {
                          setMode(m.value);
                          setIsOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-xs font-semibold transition-all ${
                          mode === m.value
                            ? 'bg-blue-600 text-white shadow-md dark:bg-blue-500'
                            : 'text-gray-700 hover:bg-white dark:text-gray-300 dark:hover:bg-slate-800'
                        }`}
                        title={m.label}
                      >
                        <span className="flex-shrink-0">{m.icon}</span>
                        <span className="text-[10px] leading-tight">
                          {m.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
