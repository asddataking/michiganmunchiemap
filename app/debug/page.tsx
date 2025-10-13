'use client';

import React from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_MAPTILER_KEY: process.env.NEXT_PUBLIC_MAPTILER_KEY ? 'Set' : 'Not Set',
    NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN ? 'Set' : 'Not Set',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
    NEXT_PUBLIC_ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS ? 'Set' : 'Not Set',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`font-mono text-sm ${value === 'Not Set' ? 'text-red-600' : 'text-green-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono text-sm">User Agent:</span>
              <span className="font-mono text-xs text-gray-600">
                {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-sm">Window Object:</span>
              <span className="font-mono text-sm">
                {typeof window !== 'undefined' ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Map Provider Test:</h3>
              {envVars.NEXT_PUBLIC_MAPTILER_KEY === 'Set' ? (
                <div className="text-green-600">✅ MapTiler key is configured</div>
              ) : envVars.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN === 'Set' ? (
                <div className="text-green-600">✅ Mapbox token is configured</div>
              ) : (
                <div className="text-red-600">❌ No map provider configured</div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Supabase Test:</h3>
              {envVars.NEXT_PUBLIC_SUPABASE_URL === 'Set' && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'Set' ? (
                <div className="text-green-600">✅ Supabase is configured</div>
              ) : (
                <div className="text-red-600">❌ Supabase is not properly configured</div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Admin Configuration:</h3>
              {envVars.NEXT_PUBLIC_ADMIN_EMAILS === 'Set' ? (
                <div className="text-green-600">✅ Admin emails are configured</div>
              ) : (
                <div className="text-red-600">❌ Admin emails are not configured</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
