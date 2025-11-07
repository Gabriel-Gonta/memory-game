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
    <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1 border border-gray-200 dark:border-slate-600">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg focus-visible-ring transition-all ${
            mode === m.value
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md scale-105'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
          aria-label={`Switch to ${m.label} mode`}
          aria-pressed={mode === m.value}
        >
          {m.icon}
          <span className="text-xs font-semibold hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

