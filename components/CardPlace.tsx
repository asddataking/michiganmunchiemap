"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";

interface Place {
  id: string;
  name: string;
  slug: string;
  city?: string;
  cuisines?: string[];
  image?: string;
  rating?: number;
}

interface CardPlaceProps {
  place: Place;
}

export default function CardPlace({ place }: CardPlaceProps) {
  const cuisine = place.cuisines?.[0] || "Restaurant";
  const city = place.city || "Michigan";
  const rating = place.rating || 4.8;
  const imageUrl = place.image || "/placeholder-place.jpg";

  return (
    <div className="group">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
        {/* Image */}
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={place.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#F3F3F3] mb-3 group-hover:text-[#FF6A00] transition-colors">
            {place.name}
          </h3>
          
          {/* Meta line */}
          <div className="flex items-center text-[#F3F3F3]/70 text-sm mb-4 space-x-4">
            <span className="flex items-center">
              🍔 {cuisine}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {city}
            </span>
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-1 text-yellow-400" />
              {rating}
            </span>
          </div>

          {/* CTA Button */}
          <Link href={`/place/${place.slug}`}>
            <button className="w-full bg-[#FF6A00] hover:bg-[#FF6A00]/90 text-white font-medium px-4 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6A00]/25 flex items-center justify-center group">
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
