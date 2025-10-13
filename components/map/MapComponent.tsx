'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from '@/components/ui/button';
import MapDebugInfo from '@/components/debug/MapDebugInfo';
import { MapPin, Navigation, Star } from 'lucide-react';
import { Place, ClusterPoint } from '@/types';
import { cn } from '@/lib/utils';

interface MapComponentProps {
  places: Place[];
  onPlaceSelect?: (place: Place) => void;
  onBoundsChange?: (bounds: maplibregl.LngLatBounds) => void;
  selectedPlace?: Place | null;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  places,
  onPlaceSelect,
  onBoundsChange,
  selectedPlace,
  className,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

    // Check if we have at least one map provider
    if (!mapTilerKey && !mapboxToken) {
      console.error('No map provider configured. Please set NEXT_PUBLIC_MAPTILER_KEY or NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN');
      return;
    }

    // Use MapTiler as primary, fallback to Mapbox
    let mapConfig;
    if (mapTilerKey) {
      mapConfig = {
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapTilerKey}`,
        center: [-82.8, 42.8] as [number, number], // Center to include all our places
        zoom: 9,
        maxZoom: 18,
        minZoom: 5,
      };
    } else {
      // For Mapbox with MapLibre, we need to use a different approach
      mapConfig = {
        container: mapContainer.current,
        style: {
          version: 8 as const,
          sources: {
            'raster-tiles': {
              type: 'raster' as const,
              tiles: [
                `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster' as const,
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [-82.8, 42.8] as [number, number], // Center to include all our places
        zoom: 9,
        maxZoom: 18,
        minZoom: 5,
      };
    }

    try {
      map.current = new maplibregl.Map(mapConfig);
    } catch (error) {
      console.error('Failed to initialize map:', error);
      return;
    }

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('moveend', () => {
      if (map.current && onBoundsChange) {
        const bounds = map.current.getBounds();
        onBoundsChange(bounds);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onBoundsChange]);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            duration: 1000,
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  // Add markers for places
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    console.log('MapComponent: Received places:', places.length, places.map(p => p.name));
    
    // If no places, just show the empty map
    if (!places.length) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.place-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Create clusters for better performance
    const clusters = createClusters(places, map.current.getZoom());
    console.log('MapComponent: Created clusters:', clusters.length, clusters.map(c => ({ count: c.count, places: c.places.map(p => p.name) })));

    clusters.forEach((cluster) => {
      if (cluster.count === 1) {
        // Single place marker
        const place = cluster.places[0];
        console.log('MapComponent: Creating marker for:', place.name);
        createPlaceMarker(place);
      } else {
        // Cluster marker
        console.log('MapComponent: Creating cluster marker for:', cluster.places.map(p => p.name));
        createClusterMarker(cluster);
      }
    });
  }, [places, mapLoaded, selectedPlace, createClusters, createPlaceMarker, createClusterMarker]);

  const createPlaceMarker = useCallback((place: Place) => {
    if (!map.current) return;

    console.log('MapComponent: Creating marker for place:', place.name, 'at coordinates:', place.location.coordinates);

    const el = document.createElement('div');
    el.className = 'place-marker';
    el.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${place.is_featured ? '#f59e0b' : '#3b82f6'};
      border: 3px solid white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s ease;
    `;

    el.innerHTML = `
      <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    el.addEventListener('click', () => {
      onPlaceSelect?.(place);
      
      // Fly to place
      if (map.current) {
        map.current.flyTo({
          center: place.location.coordinates,
          zoom: 15,
          duration: 1000,
        });
      }
    });

    const marker = new maplibregl.Marker(el)
      .setLngLat(place.location.coordinates)
      .addTo(map.current);
    
    console.log('MapComponent: Marker added to map for:', place.name);
  }, [onPlaceSelect]);

  const createClusterMarker = useCallback((cluster: ClusterPoint) => {
    if (!map.current) return;

    const el = document.createElement('div');
    el.className = 'place-marker cluster';
    el.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #10b981;
      border: 3px solid white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      color: white;
      font-weight: bold;
      font-size: 14px;
    `;

    el.textContent = cluster.count.toString();

    el.addEventListener('click', () => {
      // Zoom in on cluster
      if (map.current) {
        map.current.flyTo({
          center: cluster.coordinates,
          zoom: Math.min(map.current.getZoom() + 2, 16),
          duration: 1000,
        });
      }
    });

    new maplibregl.Marker(el)
      .setLngLat(cluster.coordinates)
      .addTo(map.current);
  }, []);

  // Create clusters based on zoom level
  const createClusters = useCallback((places: Place[], zoom: number): ClusterPoint[] => {
    // Much smaller clustering distance to prevent over-clustering
    const clusterDistance = zoom < 8 ? 20 : zoom < 12 ? 10 : 5; // km
    const clusters: ClusterPoint[] = [];
    const processed = new Set<string>();

    places.forEach((place) => {
      if (processed.has(place.id)) return;

      const cluster: ClusterPoint = {
        id: place.id,
        coordinates: place.location.coordinates,
        count: 1,
        places: [place],
      };

      // Find nearby places to cluster
      places.forEach((otherPlace) => {
        if (processed.has(otherPlace.id) || place.id === otherPlace.id) return;

        const distance = calculateDistance(
          place.location.coordinates[1],
          place.location.coordinates[0],
          otherPlace.location.coordinates[1],
          otherPlace.location.coordinates[0]
        );

        if (distance < clusterDistance) {
          cluster.count++;
          cluster.places.push(otherPlace);
          processed.add(otherPlace.id);
        }
      });

      clusters.push(cluster);
      processed.add(place.id);
    });

    return clusters;
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className={cn('relative w-full h-full map-container', className)}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Location button */}
      <Button
        onClick={getUserLocation}
        className="absolute top-4 right-4 z-10"
        size="icon"
        variant="secondary"
      >
        <Navigation className="h-4 w-4" />
      </Button>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Regular Places</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Featured Places</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            #
          </div>
          <span>Clustered Places</span>
        </div>
      </div>

      {/* No places indicator */}
      {mapLoaded && places.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-lg p-4 shadow-lg z-10">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">No places found in this area</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or zooming out</p>
          </div>
        </div>
      )}

      {/* Debug info */}
      <MapDebugInfo
        isClient={typeof window !== 'undefined'}
        hasMapTilerKey={!!process.env.NEXT_PUBLIC_MAPTILER_KEY}
        hasMapboxToken={!!process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN}
        mapLoaded={mapLoaded}
      />
    </div>
  );
};

export default MapComponent;
