'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Clock, 
  Star, 
  ArrowLeft,
  Navigation,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Place } from '@/types';
import { formatPriceLevel, formatPhoneNumber, calculateDistance } from '@/lib/utils';
import PlaceCard from './PlaceCard';

interface PlaceDetailPageProps {
  place: Place;
  nearbyPlaces: Array<Place & { distance_miles?: number }>;
}

const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  place,
  nearbyPlaces,
}) => {
  const handlePhoneClick = () => {
    if (place.phone) {
      window.open(`tel:${place.phone}`, '_self');
    }
  };

  const handleWebsiteClick = () => {
    if (place.website) {
      window.open(place.website, '_blank');
    }
  };

  const handleInstagramClick = () => {
    if (place.ig_url) {
      window.open(place.ig_url, '_blank');
    }
  };

  const handleDirectionsClick = () => {
    const [lng, lat] = place.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const formatHours = (hours: Record<string, any>) => {
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return dayOrder.map(day => {
      const dayHours = hours[day];
      if (!dayHours || (!dayHours.open && !dayHours.close)) {
        return { day: day.charAt(0).toUpperCase() + day.slice(1), hours: 'Closed' };
      }
      return {
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: `${dayHours.open} - ${dayHours.close}`,
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/munchie-map" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Map</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleDirectionsClick}>
              <Navigation className="h-4 w-4 mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            {place.hero_image_url && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                <Image
                  src={place.hero_image_url}
                  alt={place.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Place Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{place.name}</CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {place.rating && (
                          <>
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{place.rating.toFixed(1)}</span>
                          </>
                        )}
                        <span className="text-muted-foreground">
                          {formatPriceLevel(place.price_level)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {place.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                        {place.is_verified && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    {place.address && <div>{place.address}</div>}
                    <div>
                      {place.city}, {place.county} County, {place.state} {place.zip}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Cuisines and Tags */}
                <div>
                  <h3 className="font-semibold mb-2">Cuisines</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.cuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                {place.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {place.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hours */}
                {place.hours && Object.keys(place.hours).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hours
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {formatHours(place.hours).map(({ day, hours }) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}</span>
                          <span className="text-muted-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="flex flex-wrap gap-2">
                  {place.phone && (
                    <Button onClick={handlePhoneClick} className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formatPhoneNumber(place.phone)}
                    </Button>
                  )}
                  
                  {place.website && (
                    <Button variant="outline" onClick={handleWebsiteClick} className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {place.ig_url && (
                    <Button variant="outline" onClick={handleInstagramClick} className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Interactive map would be here</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleDirectionsClick}
                    >
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DankPass CTA */}
            <Card className="bg-gradient-to-r from-[#FF6A00]/10 to-orange-600/10 border-[#FF6A00]/20">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A00] to-orange-600 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Earn points. Unlock perks.
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Join DankPass and start earning rewards for every visit and interaction.
                </p>
                
                <Link href="/join">
                  <Button className="bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25">
                    Join DankPass
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            {nearbyPlaces.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nearby Places</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nearbyPlaces.slice(0, 3).map((nearbyPlace) => (
                      <PlaceCard
                        key={nearbyPlace.id}
                        place={nearbyPlace}
                        onClick={() => {
                          // Navigate to place detail page
                          window.location.href = `/place/${nearbyPlace.slug}`;
                        }}
                        className="border-none shadow-none p-0"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
