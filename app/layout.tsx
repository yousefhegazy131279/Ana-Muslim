import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { ThemeProvider } from '@/components/theme-provider';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import { FavoritesProvider } from '@/lib/favorites-context';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'أنا مسلم | القرآن والذكر والسكينة',
    template: '%s | أنا مسلم',
  },
  description: 'اقرأ القرآن الكريم وتفسيره، وتابع أذكارك اليومية، وتصفح أدعية من الكتاب والسنة وأحاديث وقصص الأنبياء.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsTracker />
          <FavoritesProvider>
            <Shell>{children}</Shell>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}