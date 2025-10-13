import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'Michigan Munchies - Discover the Best Food in Michigan',
  description: 'Explore Michigan\'s best restaurants, food trucks, and local eats with our interactive map and curated directory.',
  keywords: 'Michigan food, restaurants, food trucks, local eats, dining, Michigan cuisine',
  authors: [{ name: 'Michigan Munchies' }],
  creator: 'Michigan Munchies',
  publisher: 'Michigan Munchies',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://michiganmunchies.com',
    siteName: 'Michigan Munchies',
    title: 'Michigan Munchies - Discover the Best Food in Michigan',
    description: 'Explore Michigan\'s best restaurants, food trucks, and local eats with our interactive map and curated directory.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Michigan Munchies - Discover the Best Food in Michigan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michigan Munchies - Discover the Best Food in Michigan',
    description: 'Explore Michigan\'s best restaurants, food trucks, and local eats with our interactive map and curated directory.',
    images: ['/og-image.jpg'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
