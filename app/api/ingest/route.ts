import { NextRequest, NextResponse } from 'next/server';
import { PlacesService } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Verify ingest key
    const ingestKey = request.headers.get('X-Ingest-Key');
    const expectedKey = process.env.INGEST_API_KEY;

    if (!ingestKey || ingestKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'location'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare place data
    const placeData = {
      name: body.name,
      slug: body.slug || generateSlug(body.name),
      address: body.address || null,
      city: body.city || null,
      county: body.county || null,
      state: body.state || 'MI',
      zip: body.zip || null,
      location: {
        type: 'Point' as const,
        coordinates: body.location.coordinates || [body.location.lng, body.location.lat],
      },
      cuisines: body.cuisines || [],
      tags: body.tags || [],
      price_level: body.price_level || 2,
      rating: body.rating || null,
      website: body.website || null,
      menu_url: body.menu_url || null,
      phone: body.phone || null,
      ig_url: body.ig_url || null,
      hours: body.hours || {},
      hero_image_url: body.hero_image_url || null,
      is_featured: body.is_featured || false,
      is_verified: body.is_verified || false,
      status: body.status || 'published',
    };

    const result = await PlacesService.upsertPlace(placeData);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to save place' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Error in ingest endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Real implementation would use MCP client like this:
/*
export async function POST(request: NextRequest) {
  try {
    // Verify ingest key
    const ingestKey = request.headers.get('X-Ingest-Key');
    const expectedKey = process.env.INGEST_API_KEY;

    if (!ingestKey || ingestKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'location'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare place data
    const placeData = {
      name: body.name,
      slug: body.slug || generateSlug(body.name),
      address: body.address || null,
      city: body.city || null,
      county: body.county || null,
      state: body.state || 'MI',
      zip: body.zip || null,
      location: {
        type: 'Point' as const,
        coordinates: body.location.coordinates || [body.location.lng, body.location.lat],
      },
      cuisines: body.cuisines || [],
      tags: body.tags || [],
      price_level: body.price_level || 2,
      rating: body.rating || null,
      website: body.website || null,
      menu_url: body.menu_url || null,
      phone: body.phone || null,
      ig_url: body.ig_url || null,
      hours: body.hours || {},
      hero_image_url: body.hero_image_url || null,
      is_featured: body.is_featured || false,
      is_verified: body.is_verified || false,
      status: body.status || 'published',
    };

    const mcpClient = getSupabaseClient(mcpInstance);
    const result = await mcpClient.upsert('places', placeData);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });

  } catch (error) {
    console.error('Error in ingest endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
*/
