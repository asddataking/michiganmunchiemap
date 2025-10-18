'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Dynamically import the original map page to preserve all functionality
const OriginalMapPage = dynamic(() => import('@/app/map/page'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon-orange/30 border-t-neon-orange rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Munchie Map...</p>
      </div>
    </div>
  ),
});

export default function MunchieMapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Map Content - Preserve all existing functionality */}
      <div className="flex-1">
        <OriginalMapPage />
      </div>
      
      <Footer />
    </div>
  );
}
