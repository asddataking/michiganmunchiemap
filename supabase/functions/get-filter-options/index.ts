import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all published places
    const { data: places, error } = await supabase
      .from('places')
      .select('county, cuisines, tags')
      .eq('status', 'published');

    if (error) {
      console.error('Filter options error:', error);
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

    // Aggregate unique values
    const counties = new Set<string>();
    const cuisines = new Set<string>();
    const tags = new Set<string>();

    places?.forEach((place) => {
      if (place.county) counties.add(place.county);
      if (place.cuisines && Array.isArray(place.cuisines)) {
        place.cuisines.forEach((c: string) => cuisines.add(c));
      }
      if (place.tags && Array.isArray(place.tags)) {
        place.tags.forEach((t: string) => tags.add(t));
      }
    });

    const result = {
      counties: Array.from(counties).sort(),
      cuisines: Array.from(cuisines).sort(),
      tags: Array.from(tags).sort(),
    };

    return new Response(
      JSON.stringify({ data: result }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
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

