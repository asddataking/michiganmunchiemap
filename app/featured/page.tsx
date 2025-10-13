'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlaceCard from '@/components/places/PlaceCard';
import { Place } from '@/types';
import { PlacesService } from '@/lib/supabase';

export default function FeaturedPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPlaces = async () => {
      try {
        const featuredPlaces = await PlacesService.searchPlaces('', {
          featured: true,
        }, 50);
        setPlaces(featuredPlaces);
      } catch (error) {
        console.error('Error loading featured places:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPlaces();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Featured Places</h1>
            <p className="text-lg text-muted-foreground">
              Discover our hand-picked selection of exceptional Michigan eateries that offer something truly special.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onClick={() => window.location.href = `/place/${place.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No featured places available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
