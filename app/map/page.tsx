'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import PlaceCard from '@/components/places/PlaceCard';
import PlaceFilters from '@/components/filters/PlaceFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  const router = useRouter();
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

  const hasActiveFilters = 
    filters.counties.length > 0 ||
    filters.cuisines.length > 0 ||
    filters.tags.length > 0 ||
    filters.priceRange[0] !== 1 ||
    filters.priceRange[1] !== 4 ||
    filters.rating > 0 ||
    filters.featured ||
    filters.verified;

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
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
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

          {/* Sticky Search & Filter Bar */}
          <div className="sticky-header sticky top-0 z-40 p-4 border-b">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search places, cities, counties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/80 backdrop-blur-sm"
                />
              </div>

              {/* View Mode Toggle & Controls */}
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <Button
                    variant={viewMode === 'split' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('split')}
                    className="hidden sm:flex"
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
                    <span className="hidden sm:inline">Map</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-muted-foreground hidden sm:block">
                    {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
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

            {/* Active Filters Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground mr-1">Active:</span>
                {filters.counties.map((county) => (
                  <span
                    key={county}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
                  >
                    {county}
                  </span>
                ))}
                {filters.cuisines.slice(0, 3).map((cuisine) => (
                  <span
                    key={cuisine}
                    className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30"
                  >
                    {cuisine}
                  </span>
                ))}
                {filters.cuisines.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    +{filters.cuisines.length - 3} more
                  </span>
                )}
                {filters.featured && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full border border-yellow-500/30">
                    ⭐ Featured
                  </span>
                )}
                {filters.verified && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full border border-blue-500/30">
                    ✓ Verified
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content Area - Vertical stack on mobile, horizontal split on desktop */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">
            {/* Map - Full width on mobile at top, half width on desktop split */}
            <div className={`
              ${viewMode === 'map' ? 'w-full' : viewMode === 'split' ? 'w-full lg:w-1/2 h-[40vh] lg:h-full' : 'hidden'} 
              ${viewMode === 'split' ? 'lg:border-r' : ''}
            `}>
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

            {/* Places List - Full width on mobile below map, half width on desktop split */}
            <div className={`
              ${viewMode === 'list' ? 'w-full' : viewMode === 'split' ? 'w-full lg:w-1/2' : 'hidden'} 
              flex flex-col min-h-0
            `}>
                <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2 lg:space-y-4">
                  {loading ? (
                    <div className="space-y-2 lg:space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Card key={i} className="skeleton-pulse bg-card/50 backdrop-blur-sm border border-border/50">
                          <CardContent className="p-3 lg:p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 space-y-2">
                                <div className="h-5 bg-muted/50 rounded w-3/4"></div>
                                <div className="h-4 bg-muted/30 rounded w-1/2"></div>
                                <div className="h-3 bg-muted/20 rounded w-2/3"></div>
                              </div>
                              <div className="w-16 h-16 bg-muted/30 rounded-lg"></div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <div className="h-6 bg-muted/30 rounded-full w-20"></div>
                              <div className="h-6 bg-muted/30 rounded-full w-16"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    <Card>
                      <CardContent className="p-6 lg:p-8 text-center">
                        <div className="text-destructive mb-2">Error loading places</div>
                        <Button onClick={() => loadPlacesInBounds(-90.418, 41.696, -82.123, 48.238)}>
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  ) : filteredPlaces.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 lg:p-8 text-center">
                        <Search className="h-8 lg:h-12 w-8 lg:w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="text-base lg:text-lg font-medium mb-2">No places found</div>
                        <div className="text-sm lg:text-base text-muted-foreground">
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
                        onClick={() => router.push(`/place/${place.slug}`)}
                        compact={true}
                      />
                    ))
                  )}
                </div>
            </div>
          </div>
        </div>
    </main>
  );
}
