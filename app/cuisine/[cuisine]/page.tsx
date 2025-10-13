'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlaceCard from '@/components/places/PlaceCard';
import { Place } from '@/types';
import { PlacesService } from '@/lib/supabase';

export default function CuisinePage() {
  const params = useParams();
  const cuisine = params.cuisine as string;
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCuisinePlaces = async () => {
      try {
        const cuisinePlaces = await PlacesService.searchPlaces('', {
          cuisines: [cuisine],
        }, 100);
        setPlaces(cuisinePlaces);
      } catch (error) {
        console.error('Error loading cuisine places:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cuisine) {
      loadCuisinePlaces();
    }
  }, [cuisine]);

  const formatCuisineName = (cuisine: string) => {
    return cuisine.charAt(0).toUpperCase() + cuisine.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {formatCuisineName(cuisine)} Restaurants in Michigan
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the best {formatCuisineName(cuisine).toLowerCase()} cuisine across the Great Lakes State.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : places.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Found {places.length} {formatCuisineName(cuisine).toLowerCase()} restaurants
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onClick={() => window.location.href = `/place/${place.slug}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No {formatCuisineName(cuisine).toLowerCase()} restaurants found. Check back soon as we're always adding new places!
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
