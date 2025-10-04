import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'PurniaPulse - Your Ultimate Hub for Tools and Content',
  description: 'PurniaPulse is your all-in-one platform for creative tools like image resizing and file conversion, insightful tech blogs, and community-driven business listings. Explore, create, and connect.',
  keywords: ['web tools', 'image resizer', 'file converter', 'timetable creator', 'tech blog', 'business listings', 'nextjs', 'react'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload hero image for LCP optimization */}
        <link rel="preload" as="image" href="/img/Panchmukhi_Mandir_Purnea.jpg" />
        {/* Preload main font for FCP optimization */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" />
  {/* Favicon */}
  <link rel="icon" href="/favicon%20.ico" type="image/x-icon" />
  {/* Preconnect for Google Analytics, AdSense, and Firebase Auth */}
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://www.google-analytics.com" />
  <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
  <link rel="preconnect" href="https://vibrant-hub-mke8p.firebaseapp.com" />
        {/* Google Analytics (gtag.js) - loaded lazily for performance */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-GMHPLBEM4G" strategy="lazyOnload" />
        <Script id="google-gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GMHPLBEM4G');
          `}
        </Script>
        {/* AdSense - loaded lazily for performance */}
        <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1461507496735569" strategy="lazyOnload" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
