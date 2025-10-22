'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlaceCard from '@/components/places/PlaceCard';
import PlaceFilters from '@/components/filters/PlaceFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Map, List, Filter, Star, MapPin, RefreshCw } from 'lucide-react';
import { Place, MapFilters, BoundingBox } from '@/types';
import { PlacesService } from '@/lib/supabase';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MapFilters>({
    counties: [],
    cuisines: [],
    tags: [],
    priceRange: [1, 4],
    rating: 0,
    featured: false,
    verified: false,
  });
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const boundsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBoundsRef = useRef<{west: number, south: number, east: number, north: number} | null>(null);
  const placesCacheRef = useRef<{data: Place[], timestamp: number} | null>(null);
  const hasLoadedRef = useRef<boolean>(false);
  const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Available filter options
  const [availableCounties, setAvailableCounties] = useState<string[]>([]);
  const [availableCuisines, setAvailableCuisines] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutRef = boundsTimeoutRef.current;
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    if (!placesCacheRef.current) return false;
    const now = Date.now();
    return (now - placesCacheRef.current.timestamp) < CACHE_DURATION;
  }, [CACHE_DURATION]);

  // Load all places once and cache them
  const loadAllPlaces = useCallback(async () => {
    // Prevent multiple loads
    if (hasLoadedRef.current) {
      console.log('Already loaded, skipping');
      return;
    }

    if (isCacheValid()) {
      console.log('Using cached places data');
      setPlaces(placesCacheRef.current!.data);
      setLoading(false);
      hasLoadedRef.current = true;
      return;
    }

    console.log('Loading fresh places data from API (ONE TIME ONLY)');
    setLoading(true);
    setError(null);
    hasLoadedRef.current = true;

    try {
      // Load all places with a wide bounds to get everything
      const places = await PlacesService.getPlacesInBounds(-85.0, 41.0, -81.0, 45.0, 1000);
      console.log('Loaded places:', places);
      
      // Cache the data
      placesCacheRef.current = {
        data: places,
        timestamp: Date.now()
      };
      
      setPlaces(places);
    } catch (err) {
      setError('Failed to load places');
      console.error('Error loading places:', err);
    } finally {
      setLoading(false);
    }
  }, [isCacheValid]);

  // Filter places by bounds (client-side filtering)
  const filterPlacesByBounds = (places: Place[], minLng: number, minLat: number, maxLng: number, maxLat: number) => {
    return places.filter(place => {
      if (!place.location?.coordinates) return false;
      const [lng, lat] = place.location.coordinates;
      return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    });
  };

  // Load initial places ONCE only
  useEffect(() => {
    loadAllPlaces();
  }, [loadAllPlaces]);

  // Extract available filter options from places
  useEffect(() => {
    const counties = [...new Set(places.map(p => p.county).filter(Boolean))].sort();
    const cuisines = [...new Set(places.flatMap(p => p.cuisines))].sort();
    const tags = [...new Set(places.flatMap(p => p.tags))].sort();

    setAvailableCounties(counties as string[]);
    setAvailableCuisines(cuisines);
    setAvailableTags(tags);
  }, [places]);

  // Filter places based on search and filters
  useEffect(() => {
    let filtered = places;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchLower) ||
        place.city?.toLowerCase().includes(searchLower) ||
        place.county?.toLowerCase().includes(searchLower) ||
        place.address?.toLowerCase().includes(searchLower) ||
        place.cuisines.some(c => c.toLowerCase().includes(searchLower)) ||
        place.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // County filter
    if (filters.counties.length > 0) {
      filtered = filtered.filter(place =>
        filters.counties.includes(place.county || '')
      );
    }

    // Cuisine filter
    if (filters.cuisines.length > 0) {
      filtered = filtered.filter(place =>
        filters.cuisines.some(cuisine => place.cuisines.includes(cuisine))
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(place =>
        filters.tags.some(tag => place.tags.includes(tag))
      );
    }

    // Price range filter
    filtered = filtered.filter(place =>
      place.price_level >= filters.priceRange[0] &&
      place.price_level <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(place =>
        place.rating && place.rating >= filters.rating
      );
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(place => place.is_featured);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(place => place.is_verified);
    }

    setFilteredPlaces(filtered);
  }, [places, searchTerm, filters]);

  const loadPlacesInBounds = async (minLng: number, minLat: number, maxLng: number, maxLat: number) => {
    console.log('Bounds changed but showing ALL places (no filtering):', { minLng, minLat, maxLng, maxLat });

    // Always show all places from cache - no filtering by bounds
    if (placesCacheRef.current) {
      console.log('Showing all cached places:', placesCacheRef.current.data.length);
      setPlaces(placesCacheRef.current.data);
      return;
    }

    // If no cache, just show empty array - no API calls
    console.log('No cached data available, showing empty array');
    setPlaces([]);
  };

  const handleBoundsChange = useCallback((bounds: any) => {
    // DISABLED: No automatic reloading to prevent API rate limits
    // Data is loaded once and cached for 2 hours
    console.log('Map bounds changed (no auto-reload to prevent API limits)');
  }, []);

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
  };

  const handleRefreshData = () => {
    console.log('Manual refresh requested');
    placesCacheRef.current = null; // Clear cache
    hasLoadedRef.current = false; // Reset load flag
    loadAllPlaces();
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        {/* Filters Sidebar */}
        <div className="hidden lg:block w-80 p-4 border-r bg-background">
          <PlaceFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
            availableCounties={availableCounties}
            availableCuisines={availableCuisines}
            availableTags={availableTags}
            className="h-full"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden p-4 border-b bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {filteredPlaces.length} places found
              </h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'split' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('split')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {filteredPlaces.length} places
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshData}
                  className="h-8 w-8 p-0"
                  title="Refresh data (loads fresh from API)"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex min-h-0">
            {/* Map */}
            <div className={`${viewMode === 'map' ? 'w-full' : viewMode === 'split' ? 'w-1/2' : 'hidden'} ${viewMode === 'split' ? 'border-r' : ''}`}>
              <div className="h-full w-full">
                <MapComponent
                  places={filteredPlaces}
                  onPlaceSelect={handlePlaceSelect}
                  onBoundsChange={handleBoundsChange}
                  selectedPlace={selectedPlace}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Places List */}
            <div className={`${viewMode === 'list' ? 'w-full' : viewMode === 'split' ? 'w-1/2' : 'hidden'} flex flex-col min-h-0`}>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-4">
                            <div className="h-4 bg-muted rounded mb-2"></div>
                            <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <div className="text-destructive mb-2">Error loading places</div>
                        <Button onClick={() => loadPlacesInBounds(-90.418, 41.696, -82.123, 48.238)}>
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  ) : filteredPlaces.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="text-lg font-medium mb-2">No places found</div>
                        <div className="text-muted-foreground">
                          Try adjusting your search or filters
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        userLocation={userLocation}
                        onClick={() => handlePlaceSelect(place)}
                      />
                    ))
                  )}
                </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
