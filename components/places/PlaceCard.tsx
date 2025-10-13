'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Phone, Globe, Instagram, Clock } from 'lucide-react';
import { Place } from '@/types';
import { formatPriceLevel, formatPhoneNumber, calculateDistance } from '@/lib/utils';
import Image from 'next/image';

interface PlaceCardProps {
  place: Place;
  userLocation?: [number, number] | null;
  onClick?: () => void;
  className?: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  userLocation,
  onClick,
  className,
}) => {
  const distance = userLocation && place.location?.coordinates && place.location.coordinates.length >= 2
    ? calculateDistance(
        userLocation[1],
        userLocation[0],
        place.location.coordinates[1],
        place.location.coordinates[0]
      )
    : null;

  const handleCardClick = () => {
    onClick?.();
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.phone) {
      window.open(`tel:${place.phone}`, '_self');
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.website) {
      window.open(place.website, '_blank');
    }
  };

  const handleInstagramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.ig_url) {
      window.open(place.ig_url, '_blank');
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg leading-tight">{place.name}</h3>
              {place.is_featured && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {place.is_verified && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" title="Verified" />
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>
                {place.city && place.county 
                  ? `${place.city}, ${place.county}`
                  : place.address || 'Location not specified'
                }
              </span>
            </div>

            {distance && (
              <div className="text-sm text-muted-foreground mb-2">
                {distance.toFixed(1)} miles away
              </div>
            )}
          </div>

          {place.hero_image_url && (
            <div className="ml-4 w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={place.hero_image_url}
                alt={place.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                </div>
              )}
              <span className="text-sm font-medium">
                {formatPriceLevel(place.price_level)}
              </span>
            </div>
          </div>

          {/* Cuisines and Tags */}
          <div className="flex flex-wrap gap-1">
            {place.cuisines.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {cuisine}
              </span>
            ))}
            {place.cuisines.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                +{place.cuisines.length - 3} more
              </span>
            )}
          </div>

          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {place.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {place.tags.length > 2 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{place.tags.length - 2} tags
                </span>
              )}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex items-center gap-2 pt-2 border-t">
            {place.phone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePhoneClick}
                className="h-8 px-2"
              >
                <Phone className="h-3 w-3 mr-1" />
                <span className="text-xs">{formatPhoneNumber(place.phone)}</span>
              </Button>
            )}
            
            {place.website && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWebsiteClick}
                className="h-8 px-2"
              >
                <Globe className="h-3 w-3" />
              </Button>
            )}
            
            {place.ig_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInstagramClick}
                className="h-8 px-2"
              >
                <Instagram className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Hours */}
          {place.hours && Object.keys(place.hours).length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Hours available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
