import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { ThemeProvider } from '@/components/theme-provider';
import { AnalyticsTracker } from '@/components/analytics-tracker';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SiteStructuredData } from '@/components/structured-data';
import { baseUrl, pageMetadata, siteDescription } from '@/lib/seo';
import { FavoritesProvider } from '@/lib/favorites-context';
import './globals.css';
import './tools.css';

export const metadata: Metadata = {
  ...pageMetadata('أنا مسلم — دليل كل مسلم', siteDescription, '/'),
  metadataBase: new URL(baseUrl),
  title: { default: 'أنا مسلم — دليل كل مسلم', template: '%s | أنا مسلم' },
  verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } : undefined,
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
            <SiteStructuredData />
            <Shell>{children}</Shell>
          </FavoritesProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
