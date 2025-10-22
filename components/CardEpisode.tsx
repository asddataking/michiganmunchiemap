"use client";

import Image from "next/image";
import { Play, Clock, Calendar } from "lucide-react";

interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration?: string;
  viewCount?: number;
}

interface CardEpisodeProps {
  episode: Episode;
}

export default function CardEpisode({ episode }: CardEpisodeProps) {
  const handleEpisodeClick = () => {
    window.open(`https://youtube.com/watch?v=${episode.videoId}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div onClick={handleEpisodeClick} className="group cursor-pointer">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-black/20">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          {episode.thumbnail && episode.videoId && !episode.videoId.startsWith('video-') ? (
            <Image
              src={episode.thumbnail}
              alt={episode.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                console.log('❌ Episode thumbnail failed to load:', episode.thumbnail);
                const videoId = episode.videoId;
                const fallbacks = [
                  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                  `https://img.youtube.com/vi/${videoId}/default.jpg`
                ];
                
                let currentSrc = e.currentTarget.src;
                let fallbackIndex = fallbacks.findIndex(fb => currentSrc.includes(fb.split('/').pop()?.split('.')[0] || ''));
                
                if (fallbackIndex < fallbacks.length - 1) {
                  e.currentTarget.src = fallbacks[fallbackIndex + 1];
                } else {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.classList.remove('hidden');
                }
              }}
            />
          ) : null}
          
          {/* Fallback placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] to-[#1A1A1A] hidden">
            <div className="flex items-center justify-center h-full">
              <Play className="h-16 w-16 text-[#FF6A00]" />
            </div>
          </div>
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Play className="h-16 w-16 text-white group-hover:text-[#FF6A00] group-hover:scale-110 transition-all" />
          </div>
          
          {/* Duration badge */}
          {episode.duration && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {episode.duration}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#F3F3F3] mb-3 group-hover:text-[#FF6A00] transition-colors line-clamp-2">
            {episode.title}
          </h3>
          
          <div className="flex items-center text-[#F3F3F3]/70 text-sm">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
