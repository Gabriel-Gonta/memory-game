'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './Modal';
import { useTranslation } from '@/lib/i18n';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (width: number, height: number) => void;
}

export function CustomGridModal({ isOpen, onClose, onConfirm }: CustomGridModalProps) {
  const [mounted, setMounted] = useState(false);
  const t = useTranslation();
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = () => {
    // Validate: must be even number of cards (pairs)
    const totalCards = width * height;
    if (totalCards % 2 !== 0) {
      return; // Invalid, can't have odd number of cards
    }
    if (width < 2 || height < 2 || width > 10 || height > 10) {
      return; // Invalid dimensions
    }
    onConfirm(width, height);
    onClose();
  };

  const adjustWidth = (delta: number) => {
    const newWidth = Math.max(2, Math.min(10, width + delta));
    setWidth(newWidth);
  };

  const adjustHeight = (delta: number) => {
    const newHeight = Math.max(2, Math.min(10, height + delta));
    setHeight(newHeight);
  };


  const totalCards = width * height;
  const isValid = totalCards % 2 === 0 && width >= 2 && height >= 2 && width <= 10 && height <= 10;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mounted ? t('custom') : 'Custom'}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {mounted ? 'Largeur (colonnes)' : 'Width (columns)'}
          </label>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => adjustWidth(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 focus-visible-ring transition-all"
              aria-label="Decrease width"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div className="flex-1 text-center text-4xl font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-700 rounded-xl py-4">
              {width}
            </div>
            <motion.button
              onClick={() => adjustWidth(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 focus-visible-ring transition-all"
              aria-label="Increase width"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {mounted ? 'Hauteur (lignes)' : 'Height (rows)'}
          </label>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => adjustHeight(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 focus-visible-ring transition-all"
              aria-label="Decrease height"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div className="flex-1 text-center text-4xl font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-700 rounded-xl py-4">
              {height}
            </div>
            <motion.button
              onClick={() => adjustHeight(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600 focus-visible-ring transition-all"
              aria-label="Increase height"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-4 text-center">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
            {mounted ? 'Taille de la grille' : 'Grid Size'}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {width}x{height}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalCards} {mounted ? 'cartes' : 'cards'} ({totalCards / 2} {mounted ? 'paires' : 'pairs'})
          </div>
          {!isValid && (
            <div className="text-sm text-red-600 dark:text-red-400 mt-2">
              {mounted ? 'Le nombre de cartes doit être pair (paires)' : 'Number of cards must be even (pairs)'}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-slate-700 dark:bg-slate-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-500 focus-visible-ring transition-all shadow-md"
          >
            {mounted ? 'Annuler' : 'Cancel'}
          </motion.button>
          <motion.button
            onClick={handleConfirm}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold focus-visible-ring transition-all shadow-md ${
              isValid
                ? 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600'
                : 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
            }`}
          >
            {mounted ? 'Confirmer' : 'Confirm'}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}

