import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Michigan Munchies - Discover the Best Food in Michigan',
  description: 'Explore Michigan\'s best restaurants, food trucks, and local eats with our interactive map and curated directory.',
  keywords: 'Michigan food, restaurants, food trucks, local eats, dining, Michigan cuisine',
  authors: [{ name: 'Michigan Munchies' }],
  creator: 'Michigan Munchies',
  publisher: 'Michigan Munchies',
  robots: 'index, follow',
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
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
