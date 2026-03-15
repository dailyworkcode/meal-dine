import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ChronoThemeProvider } from '@/components/ChronoThemeProvider';
import { ChatBot } from '@/components/ChatBot';
import { PulseAI } from '@/components/PulseAI';
import { InstallPWA } from '@/components/InstallPWA';

export const metadata: Metadata = {
  title: 'DailyDine Plus | Your Holistic Wellness Companion',
  description: 'Precision-engineered Indian meal plans, yoga flows, hydration tracking, and mindful living insights powered by PulseAI.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DailyDine Plus',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF8C00',
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.deferredPrompt = null;
              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('beforeinstallprompt captured early');
                e.preventDefault();
                window.deferredPrompt = e;
                // Dispatch a custom event to notify components that are already mounted
                window.dispatchEvent(new CustomEvent('pwa-prompt-available', { detail: e }));
              });

              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration);
                    },
                    function(err) {
                      console.log('SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen')} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ChronoThemeProvider>
            {children}
            <ChatBot />
            <PulseAI />
            <InstallPWA />
            <Toaster />
          </ChronoThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
