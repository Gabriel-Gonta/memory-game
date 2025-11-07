import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue
          dark: '#2563EB',
          light: '#60A5FA',
        },
        secondary: {
          light: '#E5E7EB', // Light grey
          DEFAULT: '#6B7280', // Dark grey
          dark: '#1F2937', // Very dark grey
        },
        accent: {
          blue: '#3B82F6', // Blue
          green: '#10B981', // Green
          purple: '#8B5CF6', // Purple
          pink: '#EC4899', // Pink
          yellow: '#F59E0B', // Yellow
          cyan: '#06B6D4', // Cyan
        },
        dark: {
          bg: '#0F172A', // Slate 900
          card: '#1E293B', // Slate 800
          border: '#334155', // Slate 700
          hover: '#475569', // Slate 600
        },
      },
      borderRadius: {
        'card': '1rem',
        'button': '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;

