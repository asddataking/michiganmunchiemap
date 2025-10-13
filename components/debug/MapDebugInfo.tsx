'use client';

import React from 'react';

interface MapDebugInfoProps {
  isClient: boolean;
  hasMapTilerKey: boolean;
  hasMapboxToken: boolean;
  mapLoaded: boolean;
}

export default function MapDebugInfo({ 
  isClient, 
  hasMapTilerKey, 
  hasMapboxToken, 
  mapLoaded 
}: MapDebugInfoProps) {
  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50">
      <div className="font-bold mb-2">Map Debug Info:</div>
      <div>Client: {isClient ? '✅' : '❌'}</div>
      <div>MapTiler Key: {hasMapTilerKey ? '✅' : '❌'}</div>
      <div>Mapbox Token: {hasMapboxToken ? '✅' : '❌'}</div>
      <div>Map Loaded: {mapLoaded ? '✅' : '❌'}</div>
      <div className="mt-2 text-xs">
        Environment: {process.env.NODE_ENV}
      </div>
    </div>
  );
}
