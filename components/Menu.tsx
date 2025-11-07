'use client';

import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Home, RotateCcw, RefreshCw, LogOut, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

interface MenuProps {
  onRestart?: () => void;
  onNewGame?: () => void;
  showHome?: boolean;
}

interface MenuItem {
  label: string;
  icon: LucideIcon;
  action: () => void;
  color?: 'blue' | 'gray' | 'red';
}

export function Menu({ onRestart, onNewGame, showHome = false }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const t = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuItem[] = [
    ...(showHome ? [{ label: mounted ? t('home') : 'Home', icon: Home, action: () => router.push('/home') }] : []),
    ...(onRestart ? [{ label: mounted ? t('restart') : 'Restart', icon: RotateCcw, action: onRestart, color: 'blue' as const }] : []),
    ...(onNewGame ? [{ label: mounted ? t('newGame') : 'New Game', icon: RefreshCw, action: onNewGame, color: 'gray' as const }] : []),
    { label: mounted ? t('quit') : 'Quit', icon: LogOut, action: () => router.push('/home'), color: 'red' as const },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 focus-visible-ring transition-all"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              <div className="py-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const colorClass = item.color === 'red' 
                    ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                    : item.color === 'blue'
                    ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700';
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${colorClass}`}
                    >
                      <Icon size={18} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

