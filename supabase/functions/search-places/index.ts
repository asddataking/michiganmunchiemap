import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface SearchParams {
  search_text?: string;
  county_filter?: string[];
  cuisine_filter?: string[];
  tag_filter?: string[];
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  featured_only?: boolean;
  verified_only?: boolean;
  limit_count?: number;
  min_lng?: number;
  min_lat?: number;
  max_lng?: number;
  max_lat?: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const params: SearchParams = await req.json();

    // Build query
    let query = supabase
      .from('places')
      .select('*')
      .eq('status', 'published');

    // Search text filter
    if (params.search_text) {
      const searchLower = params.search_text.toLowerCase();
      query = query.or(`name.ilike.%${searchLower}%,city.ilike.%${searchLower}%,county.ilike.%${searchLower}%,address.ilike.%${searchLower}%`);
    }

    // County filter
    if (params.county_filter && params.county_filter.length > 0) {
      query = query.in('county', params.county_filter);
    }

    // Cuisine filter
    if (params.cuisine_filter && params.cuisine_filter.length > 0) {
      query = query.overlaps('cuisines', params.cuisine_filter);
    }

    // Tag filter
    if (params.tag_filter && params.tag_filter.length > 0) {
      query = query.overlaps('tags', params.tag_filter);
    }

    // Price range
    if (params.min_price !== undefined) {
      query = query.gte('price_level', params.min_price);
    }
    if (params.max_price !== undefined) {
      query = query.lte('price_level', params.max_price);
    }

    // Rating filter
    if (params.min_rating !== undefined && params.min_rating > 0) {
      query = query.gte('rating', params.min_rating);
    }

    // Featured filter
    if (params.featured_only) {
      query = query.eq('is_featured', true);
    }

    // Verified filter
    if (params.verified_only) {
      query = query.eq('is_verified', true);
    }

    // If bounds are provided, use RPC function for PostGIS filtering
    if (params.min_lng !== undefined && params.min_lat !== undefined && 
        params.max_lng !== undefined && params.max_lat !== undefined) {
      // Use RPC function for proper PostGIS bounds filtering
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_places_in_bounds', {
        min_lng: params.min_lng,
        min_lat: params.min_lat,
        max_lng: params.max_lng,
        max_lat: params.max_lat,
        limit_count: params.limit_count || 200,
      });

      if (rpcError) {
        console.error('RPC bounds error:', rpcError);
        return new Response(
          JSON.stringify({ error: rpcError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      // Apply additional filters to RPC results
      let filtered = rpcData || [];
      
      // Apply other filters
      if (params.county_filter && params.county_filter.length > 0) {
        filtered = filtered.filter((p: any) => params.county_filter!.includes(p.county));
      }
      if (params.cuisine_filter && params.cuisine_filter.length > 0) {
        filtered = filtered.filter((p: any) => 
          params.cuisine_filter!.some((c: string) => p.cuisines?.includes(c))
        );
      }
      if (params.tag_filter && params.tag_filter.length > 0) {
        filtered = filtered.filter((p: any) => 
          params.tag_filter!.some((t: string) => p.tags?.includes(t))
        );
      }
      if (params.min_price !== undefined) {
        filtered = filtered.filter((p: any) => p.price_level >= params.min_price!);
      }
      if (params.max_price !== undefined) {
        filtered = filtered.filter((p: any) => p.price_level <= params.max_price!);
      }
      if (params.min_rating !== undefined && params.min_rating > 0) {
        filtered = filtered.filter((p: any) => p.rating && p.rating >= params.min_rating!);
      }
      if (params.featured_only) {
        filtered = filtered.filter((p: any) => p.is_featured);
      }
      if (params.verified_only) {
        filtered = filtered.filter((p: any) => p.is_verified);
      }
      if (params.search_text) {
        const searchLower = params.search_text.toLowerCase();
        filtered = filtered.filter((p: any) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.city?.toLowerCase().includes(searchLower) ||
          p.county?.toLowerCase().includes(searchLower) ||
          p.address?.toLowerCase().includes(searchLower)
        );
      }

      // Sort results
      filtered.sort((a: any, b: any) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        if (a.rating && b.rating) return b.rating - a.rating;
        return 0;
      });

      // Convert location to GeoJSON
      const places = filtered.map((place: any) => {
        if (place.location && typeof place.location === 'object') {
          if (place.location.coordinates) {
            return {
              ...place,
              location: {
                type: 'Point',
                coordinates: place.location.coordinates,
              },
            };
          }
        }
        return place;
      });

      return new Response(
        JSON.stringify({ data: places }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    }

    // Ordering
    query = query
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false });

    // Limit
    if (params.limit_count) {
      query = query.limit(params.limit_count);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Convert location to GeoJSON format
    const places = data?.map((place: any) => {
      if (place.location && typeof place.location === 'object') {
        // Location is already in correct format or needs conversion
        if (place.location.coordinates) {
          return {
            ...place,
            location: {
              type: 'Point',
              coordinates: place.location.coordinates,
            },
          };
        }
      }
      return place;
    }) || [];

    return new Response(
      JSON.stringify({ data: places }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

