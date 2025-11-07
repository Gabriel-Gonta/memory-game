'use client';

import { useThemeStore, ThemeMode } from '@/lib/theme';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  const modes: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun size={18} />, label: 'Light' },
    { value: 'dark', icon: <Moon size={18} />, label: 'Dark' },
    { value: 'system', icon: <Monitor size={18} />, label: 'System' },
  ];

  return (
    <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-slate-600 dark:bg-slate-700">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={`focus-visible-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
            mode === m.value
              ? 'scale-105 bg-blue-600 text-white shadow-md dark:bg-blue-500'
              : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-600'
          }`}
          aria-label={`Switch to ${m.label} mode`}
          aria-pressed={mode === m.value}
        >
          {m.icon}
          <span className="hidden text-xs font-semibold sm:inline">
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}
