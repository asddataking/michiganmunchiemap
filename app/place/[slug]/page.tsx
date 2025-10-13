import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PlaceDetailPage from '@/components/places/PlaceDetailPage';
import { getSupabaseClient } from '@/lib/supabase-mcp';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  
  // For now, return mock metadata since MCP integration needs to be set up
  // In a real implementation, you would fetch the place data first
  const mockPlace = {
    name: 'Example Restaurant',
    city: 'Detroit',
    county: 'Wayne',
    cuisines: ['American', 'Burgers'],
    rating: 4.5,
    price_level: 2,
    hero_image_url: null,
  };

  const title = `${mockPlace.name} - ${mockPlace.city}, MI | Michigan Munchies`;
  const description = `${mockPlace.name} in ${mockPlace.city}, ${mockPlace.county} County. ${mockPlace.cuisines.join(', ')} cuisine. ${mockPlace.rating ? `${mockPlace.rating}/5 stars` : ''} ${'$'.repeat(mockPlace.price_level)}`;

  return {
    title,
    description,
    keywords: `${mockPlace.name}, ${mockPlace.city}, Michigan, ${mockPlace.cuisines.join(', ')}, restaurant, food`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://michiganmunchies.com/place/${slug}`,
      siteName: 'Michigan Munchies',
      images: mockPlace.hero_image_url ? [
        {
          url: mockPlace.hero_image_url,
          width: 1200,
          height: 630,
          alt: mockPlace.name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mockPlace.hero_image_url ? [mockPlace.hero_image_url] : [],
    },
    alternates: {
      canonical: `https://michiganmunchies.com/place/${slug}`,
    },
  };
}

// Generate JSON-LD structured data
function generateJsonLd(place: any) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: place.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: place.city,
      addressRegion: place.state,
      postalCode: place.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.location.coordinates[1],
      longitude: place.location.coordinates[0],
    },
    telephone: place.phone,
    url: place.website,
    priceRange: '$'.repeat(place.price_level),
    servesCuisine: place.cuisines,
    aggregateRating: place.rating ? {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      ratingCount: 1,
    } : undefined,
    image: place.hero_image_url,
    description: `${place.name} in ${place.city}, Michigan`,
    openingHoursSpecification: place.hours ? Object.entries(place.hours).map(([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day,
      opens: hours.open,
      closes: hours.close,
    })) : undefined,
  };

  return JSON.stringify(jsonLd);
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = params;

  // For now, return mock data since MCP integration needs to be set up
  // In a real implementation, you would use:
  // const mcpClient = getSupabaseClient(mcpInstance);
  // const result = await mcpClient.getPlaceBySlug(slug);
  
  const mockPlace = {
    id: '1',
    slug: slug,
    name: 'Example Restaurant',
    address: '123 Main St',
    city: 'Detroit',
    county: 'Wayne',
    state: 'MI',
    zip: '48201',
    location: {
      type: 'Point',
      coordinates: [-83.0458, 42.3314],
    },
    cuisines: ['American', 'Burgers'],
    tags: ['Outdoor Seating', 'Family Friendly'],
    price_level: 2,
    rating: 4.5,
    website: 'https://example.com',
    phone: '313-555-0123',
    ig_url: 'https://instagram.com/example',
    is_featured: true,
    is_verified: true,
    status: 'published',
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' },
    },
    hero_image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Mock nearby places
  const mockNearbyPlaces = [
    {
      ...mockPlace,
      id: '2',
      name: 'Nearby Restaurant',
      distance_miles: 0.5,
    },
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLd(mockPlace),
        }}
      />
      
      <PlaceDetailPage 
        place={mockPlace} 
        nearbyPlaces={mockNearbyPlaces}
      />
    </>
  );
}

// Real implementation would use MCP client like this:
/*
export default async function PlacePage({ params }: PageProps) {
  const { slug } = params;

  try {
    const mcpClient = getSupabaseClient(mcpInstance);
    const result = await mcpClient.getPlaceBySlug(slug);

    if (result.error || !result.data || result.data.length === 0) {
      notFound();
    }

    const place = result.data[0];

    // Get nearby places
    const nearbyResult = await mcpClient.getNearbyPlaces(
      place.location.coordinates[0],
      place.location.coordinates[1],
      5, // 5 mile radius
      10 // limit to 10 places
    );

    const nearbyPlaces = nearbyResult.data || [];

    return (
      <>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateJsonLd(place),
          }}
        />
        
        <PlaceDetailPage 
          place={place} 
          nearbyPlaces={nearbyPlaces}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching place:', error);
    notFound();
  }
}
*/
