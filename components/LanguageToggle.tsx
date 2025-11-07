'use client';

import { useI18nStore, Language } from '@/lib/i18n';

export function LanguageToggle() {
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'fr', label: 'FR', flag: '🇫🇷' },
    { value: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1 border border-gray-200 dark:border-slate-600">
      {languages.map((lang) => (
        <button
          key={lang.value}
          onClick={() => handleLanguageChange(lang.value)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg focus-visible-ring transition-all ${
            language === lang.value
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md scale-105'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
          aria-label={`Switch to ${lang.label}`}
          aria-pressed={language === lang.value}
        >
          <span className="text-sm">{lang.flag}</span>
          <span className="text-xs font-semibold">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

