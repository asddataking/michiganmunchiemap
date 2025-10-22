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
  compact?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  userLocation,
  onClick,
  className,
  compact = false,
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
      <CardHeader className={compact ? "pb-2 p-3 lg:pb-3 lg:p-6" : "pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold leading-tight ${compact ? 'text-sm lg:text-lg' : 'text-lg'}`}>
                {place.name}
              </h3>
              {place.is_featured && (
                <Star className={`text-yellow-500 fill-current ${compact ? 'h-3 w-3 lg:h-4 lg:w-4' : 'h-4 w-4'}`} />
              )}
              {place.is_verified && (
                <div className={`bg-blue-500 rounded-full ${compact ? 'w-1.5 h-1.5 lg:w-2 lg:h-2' : 'w-2 h-2'}`} title="Verified" />
              )}
            </div>
            
            <div className={`flex items-center gap-1 text-muted-foreground ${compact ? 'text-xs lg:text-sm mb-1 lg:mb-2' : 'text-sm mb-2'}`}>
              <MapPin className={compact ? "h-2.5 w-2.5 lg:h-3 lg:w-3" : "h-3 w-3"} />
              <span>
                {place.city && place.county 
                  ? `${place.city}, ${place.county}`
                  : place.address || 'Location not specified'
                }
              </span>
            </div>

            {distance && (
              <div className={`text-muted-foreground ${compact ? 'text-xs lg:text-sm mb-1 lg:mb-2' : 'text-sm mb-2'}`}>
                {distance.toFixed(1)} miles away
              </div>
            )}
          </div>

          {place.hero_image_url && (
            <div className={`ml-2 lg:ml-4 rounded-lg overflow-hidden flex-shrink-0 ${compact ? 'w-12 h-12 lg:w-16 lg:h-16' : 'w-16 h-16'}`}>
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

      <CardContent className={compact ? "pt-0 p-3 lg:pt-0 lg:p-6" : "pt-0"}>
        <div className={compact ? "space-y-1.5 lg:space-y-3" : "space-y-3"}>
          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {place.rating && (
                <div className="flex items-center gap-1">
                  <Star className={`text-yellow-500 fill-current ${compact ? 'h-3 w-3 lg:h-4 lg:w-4' : 'h-4 w-4'}`} />
                  <span className={`font-medium ${compact ? 'text-xs lg:text-sm' : 'text-sm'}`}>
                    {place.rating.toFixed(1)}
                  </span>
                </div>
              )}
              <span className={`font-medium ${compact ? 'text-xs lg:text-sm' : 'text-sm'}`}>
                {formatPriceLevel(place.price_level)}
              </span>
            </div>
          </div>

          {/* Cuisines and Tags */}
          <div className={`flex flex-wrap ${compact ? 'gap-0.5 lg:gap-1' : 'gap-1'}`}>
            {place.cuisines.slice(0, compact ? 2 : 3).map((cuisine) => (
              <span
                key={cuisine}
                className={`bg-primary/10 text-primary rounded-full ${compact ? 'px-1.5 py-0.5 text-[10px] lg:px-2 lg:py-1 lg:text-xs' : 'px-2 py-1 text-xs'}`}
              >
                {cuisine}
              </span>
            ))}
            {place.cuisines.length > (compact ? 2 : 3) && (
              <span className={`bg-muted text-muted-foreground rounded-full ${compact ? 'px-1.5 py-0.5 text-[10px] lg:px-2 lg:py-1 lg:text-xs' : 'px-2 py-1 text-xs'}`}>
                +{place.cuisines.length - (compact ? 2 : 3)} more
              </span>
            )}
          </div>

          {!compact && place.tags.length > 0 && (
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
          <div className={`flex items-center gap-1 lg:gap-2 ${compact ? 'pt-1 lg:pt-2' : 'pt-2'} border-t`}>
            {place.phone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePhoneClick}
                className={compact ? "h-6 px-1.5 lg:h-8 lg:px-2" : "h-8 px-2"}
              >
                <Phone className={compact ? "h-2.5 w-2.5 lg:h-3 lg:w-3 mr-0.5 lg:mr-1" : "h-3 w-3 mr-1"} />
                <span className={compact ? "text-[10px] lg:text-xs hidden sm:inline" : "text-xs"}>
                  {compact ? 'Call' : formatPhoneNumber(place.phone)}
                </span>
              </Button>
            )}
            
            {place.website && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWebsiteClick}
                className={compact ? "h-6 px-1.5 lg:h-8 lg:px-2" : "h-8 px-2"}
              >
                <Globe className={compact ? "h-2.5 w-2.5 lg:h-3 lg:w-3" : "h-3 w-3"} />
              </Button>
            )}
            
            {place.ig_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInstagramClick}
                className={compact ? "h-6 px-1.5 lg:h-8 lg:px-2" : "h-8 px-2"}
              >
                <Instagram className={compact ? "h-2.5 w-2.5 lg:h-3 lg:w-3" : "h-3 w-3"} />
              </Button>
            )}
          </div>

          {/* Hours - Hide in compact mode on mobile */}
          {!compact && place.hours && Object.keys(place.hours).length > 0 && (
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
