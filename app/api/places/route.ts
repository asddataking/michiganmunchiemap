import { NextRequest, NextResponse } from 'next/server';
import { PlacesService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bbox = searchParams.get('bbox');
    const search = searchParams.get('search');
    const counties = searchParams.get('counties')?.split(',') || [];
    const cuisines = searchParams.get('cuisines')?.split(',') || [];
    const tags = searchParams.get('tags')?.split(',') || [];
    const priceMin = parseInt(searchParams.get('priceMin') || '1');
    const priceMax = parseInt(searchParams.get('priceMax') || '4');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const featured = searchParams.get('featured') === 'true';
    const verified = searchParams.get('verified') === 'true';
    const limit = parseInt(searchParams.get('limit') || '200');

    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
      const places = await PlacesService.getPlacesInBounds(minLng, minLat, maxLng, maxLat, limit);
      return NextResponse.json({ data: places });
    }

    // Search/filter query
    const places = await PlacesService.searchPlaces(
      search || '',
      {
        counties: counties.length ? counties : undefined,
        cuisines: cuisines.length ? cuisines : undefined,
        tags: tags.length ? tags : undefined,
        priceRange: [priceMin, priceMax],
        minRating: minRating || undefined,
        featured,
        verified,
      },
      limit
    );
    
    return NextResponse.json({ data: places });

  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}

// Real implementation would use MCP client like this:
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bbox = searchParams.get('bbox');
    const search = searchParams.get('search');
    const counties = searchParams.get('counties')?.split(',') || [];
    const cuisines = searchParams.get('cuisines')?.split(',') || [];
    const tags = searchParams.get('tags')?.split(',') || [];
    const priceMin = parseInt(searchParams.get('priceMin') || '1');
    const priceMax = parseInt(searchParams.get('priceMax') || '4');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const featured = searchParams.get('featured') === 'true';
    const verified = searchParams.get('verified') === 'true';
    const limit = parseInt(searchParams.get('limit') || '200');

    const mcpClient = getSupabaseClient(mcpInstance);

    let result;
    
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
      result = await mcpClient.getPlacesInBounds(minLng, minLat, maxLng, maxLat, limit);
    } else {
      result = await mcpClient.searchPlaces(
        search || '',
        {
          counties: counties.length ? counties : undefined,
          cuisines: cuisines.length ? cuisines : undefined,
          tags: tags.length ? tags : undefined,
          priceRange: [priceMin, priceMax],
          minRating: minRating || undefined,
          featured,
          verified,
        },
        limit
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });

  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
*/
