import { createClient } from '@supabase/supabase-js';
import { Place } from '@/types';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);

// Helper functions for common operations
export class PlacesService {
  static async getPlacesInBounds(
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number,
    limit: number = 200
  ): Promise<Place[]> {
    const { data, error } = await supabase.rpc('get_places_in_bounds', {
      min_lng: minLng,
      min_lat: minLat,
      max_lng: maxLng,
      max_lat: maxLat,
      limit_count: limit,
    });

    if (error) {
      console.error('Error fetching places in bounds:', error);
      return [];
    }

    return data || [];
  }

  static async getPlaceBySlug(slug: string): Promise<Place | null> {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching place by slug:', error);
      return null;
    }

    return data;
  }

  static async getNearbyPlaces(
    lng: number,
    lat: number,
    radiusMiles: number = 5,
    limit: number = 10
  ): Promise<Place[]> {
    const { data, error } = await supabase.rpc('get_nearby_places', {
      lng,
      lat,
      radius_miles: radiusMiles,
      limit_count: limit,
    });

    if (error) {
      console.error('Error fetching nearby places:', error);
      return [];
    }

    return data || [];
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
    let query = supabase
      .from('places')
      .select('*')
      .eq('status', 'published');

    // Search term
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,county.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
    }

    // County filter
    if (filters.counties?.length) {
      query = query.in('county', filters.counties);
    }

    // Cuisine filter
    if (filters.cuisines?.length) {
      query = query.overlaps('cuisines', filters.cuisines);
    }

    // Tags filter
    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags);
    }

    // Price range filter
    if (filters.priceRange) {
      query = query
        .gte('price_level', filters.priceRange[0])
        .lte('price_level', filters.priceRange[1]);
    }

    // Rating filter
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    // Featured filter
    if (filters.featured) {
      query = query.eq('is_featured', true);
    }

    // Verified filter
    if (filters.verified) {
      query = query.eq('is_verified', true);
    }

    // Ordering and limit
    query = query
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error searching places:', error);
      return [];
    }

    return data || [];
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
