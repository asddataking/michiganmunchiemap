import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Place } from '@/types';
import { calculateDistance } from '@/lib/utils';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase config:', { 
  url: supabaseUrl ? 'Set' : 'Missing', 
  key: supabaseAnonKey ? 'Set' : 'Missing' 
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'michigan-munchies-auth'
      }
    });
  }
  return supabaseInstance;
})();

// Server-side client with service role key for admin operations
export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return supabaseAdminInstance;
})();

// Helper functions for common operations
export class PlacesService {
  static async getPlacesInBounds(
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number,
    limit: number = 200
  ): Promise<Place[]> {
    try {
      console.log('PlacesService.getPlacesInBounds called with:', { minLng, minLat, maxLng, maxLat, limit });
      
      // Use RPC function that properly converts location to GeoJSON
      const rpcParams = {
        min_lng: minLng,
        min_lat: minLat,
        max_lng: maxLng,
        max_lat: maxLat,
        limit_count: limit,
      };
      
      console.log('Calling RPC with params:', rpcParams);
      
      const result = await supabase.rpc('get_places_in_bounds', rpcParams);
      
      console.log('Raw RPC result:', result);
      console.log('RPC result type:', typeof result);
      console.log('RPC result keys:', Object.keys(result || {}));

      const { data, error } = result;

      console.log('Supabase RPC result:', { data, error });

      if (error) {
        console.error('Error fetching places in bounds:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error type:', typeof error);
        return [];
      }

      console.log('Loaded places from RPC:', data);
      return data || [];
    } catch (err) {
      console.error('Error in getPlacesInBounds:', err);
      console.error('Error type:', typeof err);
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
      
      // Fallback: try direct query without location conversion
      console.log('Trying fallback direct query...');
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('places')
          .select('*')
          .eq('status', 'published')
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(limit);

        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return [];
        }

        console.log('Fallback query succeeded, got', fallbackData?.length, 'places');
        return fallbackData || [];
      } catch (fallbackErr) {
        console.error('Fallback query failed:', fallbackErr);
        return [];
      }
    }
  }

  static async getPlaceBySlug(slug: string): Promise<Place | null> {
    // Use RPC function to get proper GeoJSON location data
    try {
      const { data, error } = await supabase.rpc('get_place_by_slug', {
        place_slug: slug,
      });

      if (error) {
        console.error('Error fetching place by slug:', error);
        return null;
      }

      // The RPC function returns an array, so we need to get the first element
      if (data && Array.isArray(data) && data.length > 0) {
        return data[0];
      }

      return null;
    } catch (err) {
      console.error('Error in getPlaceBySlug:', err);
      return null;
    }
  }

  static async getNearbyPlaces(
    lng: number,
    lat: number,
    radiusMiles: number = 5,
    limit: number = 10
  ): Promise<Place[]> {
    try {
      // Use RPC function that properly converts location to GeoJSON
      const { data, error } = await supabase.rpc('get_nearby_places', {
        center_lng: lng,
        center_lat: lat,
        radius_miles: radiusMiles,
        limit_count: limit,
      });

      if (error) {
        console.error('Error fetching nearby places:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in getNearbyPlaces:', err);
      return [];
    }
  }

  static async searchPlaces(
    searchTerm: string = '',
    filters: {
      counties?: string[];
      cuisines?: string[];
      tags?: string[];
      priceRange?: [number, number];
      minRating?: number;
      featured?: boolean;
      verified?: boolean;
    } = {},
    limit: number = 50
  ): Promise<Place[]> {
    // Use RPC function for search to get proper GeoJSON location data
    try {
      const { data, error } = await supabase.rpc('search_places', {
        search_text: searchTerm || null,
        county_filter: filters.counties?.length ? filters.counties : null,
        cuisine_filter: filters.cuisines?.length ? filters.cuisines : null,
        tag_filter: filters.tags?.length ? filters.tags : null,
        min_price: filters.priceRange?.[0] || 1,
        max_price: filters.priceRange?.[1] || 4,
        min_rating: filters.minRating || 0,
        featured_only: filters.featured || false,
        verified_only: filters.verified || false,
        limit_count: limit,
      });

      if (error) {
        console.error('Error searching places:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error in searchPlaces:', err);
      return [];
    }
  }

  static async upsertPlace(placeData: Partial<Place>): Promise<Place | null> {
    const { data, error } = await supabaseAdmin
      .from('places')
      .upsert(placeData)
      .select()
      .single();

    if (error) {
      console.error('Error upserting place:', error);
      return null;
    }

    return data;
  }

  static async deletePlace(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('places')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting place:', error);
      return false;
    }

    return true;
  }

  static async getDashboardStats() {
    const [
      { count: totalPlaces },
      { count: publishedPlaces },
      { count: draftPlaces },
      { count: featuredPlaces },
    ] = await Promise.all([
      supabaseAdmin.from('places').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('places').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabaseAdmin.from('places').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabaseAdmin.from('places').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    ]);

    return {
      totalPlaces: totalPlaces || 0,
      publishedPlaces: publishedPlaces || 0,
      draftPlaces: draftPlaces || 0,
      featuredPlaces: featuredPlaces || 0,
    };
  }
}
