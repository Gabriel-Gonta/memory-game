'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    const getEffectiveTheme = () => {
      if (mode === 'system') {
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        return 'light';
      }
      return mode;
    };

    const updateTheme = () => {
      const theme = getEffectiveTheme();
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    };

    updateTheme();

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [mode]);

  return <>{children}</>;
}
