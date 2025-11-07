import type { Metadata } from 'next';
import './globals.css';
import { QueryClientProvider } from '@/components/QueryClientProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Memory Game - Clic Campus',
  description: 'Jeu de mémoire moderne et accessible',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Language will be set client-side via ThemeProvider
  return (
    <html lang="fr" suppressHydrationWarning className={quicksand.variable}>
      <body>
        <ThemeProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
