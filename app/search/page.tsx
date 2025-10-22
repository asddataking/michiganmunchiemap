'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlaceCard from '@/components/places/PlaceCard';
import { Place } from '@/types';
import { PlacesService } from '@/lib/supabase';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAnalytics } from '@/lib/useAnalytics';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackSearch, trackPlaceClick } = useAnalytics();

  useEffect(() => {
    const searchPlaces = async () => {
      if (!query.trim()) {
        setPlaces([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await PlacesService.searchPlaces(query, {}, 50);
        setPlaces(results);
        // Track the search event with results count
        trackSearch(query, results.length);
      } catch (err) {
        setError('Failed to search places');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
    // trackSearch is a stable function reference, no need to include in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-muted-foreground" />
              <h1 className="text-2xl font-bold">
                {query ? `Search results for "${query}"` : 'Search'}
              </h1>
            </div>
            
            {query && (
              <p className="text-muted-foreground mt-2">
                {loading ? 'Searching...' : `${places.length} places found`}
              </p>
            )}
          </div>

          {/* Results */}
          {!query ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">Enter a search term</h2>
              <p className="text-muted-foreground">
                Search for restaurants, cities, cuisines, or any other terms.
              </p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-2">Error searching places</div>
              <p className="text-muted-foreground">Please try again later.</p>
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try searching for a different term or browse our categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={() => {
                    trackPlaceClick(place.name, 'search-results');
                    window.location.href = `/place/${place.slug}`;
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-zinc-800 rounded mb-6"></div>
              <div className="h-12 bg-zinc-800 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-zinc-800 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
