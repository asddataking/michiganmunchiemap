import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B35',
};

export const metadata: Metadata = {
  title: 'DankNDevour - Food, Travel & Cannabis Culture Hub',
  description: 'Discover Michigan\'s best food experiences, travel destinations, and cannabis culture. Your ultimate guide to local discovery and lifestyle.',
  keywords: 'Michigan food, restaurants, travel, cannabis culture, local discovery, lifestyle, DankNDevour',
  authors: [{ name: 'DankNDevour' }],
  creator: 'DankNDevour',
  publisher: 'DankNDevour',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dankndevour.com',
    siteName: 'DankNDevour',
    title: 'DankNDevour - Food, Travel & Cannabis Culture Hub',
    description: 'Discover Michigan\'s best food experiences, travel destinations, and cannabis culture. Your ultimate guide to local discovery and lifestyle.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DankNDevour - Food, Travel & Cannabis Culture Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DankNDevour - Food, Travel & Cannabis Culture Hub',
    description: 'Discover Michigan\'s best food experiences, travel destinations, and cannabis culture. Your ultimate guide to local discovery and lifestyle.',
    images: ['/og-image.jpg'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0B0B0B] text-[#F3F3F3]`}>
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
