import { NextRequest, NextResponse } from 'next/server';
import { EpisodesCacheService } from '@/lib/episodes-cache';

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration?: string;
  viewCount?: number;
};

type YouTubeVideo = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
      standard: { url: string };
      maxres: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
};

async function fetchYouTubeEpisodes(): Promise<Episode[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    
    if (!apiKey) {
      console.log('❌ No YouTube API key configured');
      throw new Error('YOUTUBE_API_KEY environment variable not set');
    }
    
    if (!channelId) {
      console.log('❌ No YouTube Channel ID configured');
      throw new Error('YOUTUBE_CHANNEL_ID environment variable not set');
    }

    console.log('📺 Fetching YouTube videos using Data API...');
    
    // First, get the uploads playlist ID for the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    
    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status}`);
    }
    
    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found or no uploads playlist');
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    console.log('📺 Found uploads playlist:', uploadsPlaylistId);
    
    // Get videos from the uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );
    
    if (!videosResponse.ok) {
      throw new Error(`YouTube API error: ${videosResponse.status}`);
    }
    
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      console.log('⚠️ No videos found in uploads playlist');
      return [];
    }
    
    // Get detailed video information including statistics and duration
    const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
    
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${apiKey}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    const episodes: Episode[] = detailsData.items.map((video: YouTubeVideo) => {
      // Use high quality thumbnail URL format for better reliability
      const thumbnail = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
      
      // Format duration from ISO 8601 to readable format
      const duration = formatDuration(video.contentDetails.duration);
      
      // Format view count
      const viewCount = parseInt(video.statistics.viewCount);
      
      const episode = {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description.substring(0, 200) + (video.snippet.description.length > 200 ? '...' : ''),
        thumbnail,
        publishedAt: video.snippet.publishedAt,
        videoId: video.id,
        duration,
        viewCount
      };
      
      console.log(`📺 Created episode:`, {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        videoId: episode.videoId
      });
      
      return episode;
    });

    console.log(`✅ Successfully fetched ${episodes.length} episodes from YouTube Data API`);
    return episodes;
    
  } catch (error) {
    console.error('❌ Error fetching YouTube episodes:', error);
    return [];
  }
}


function formatDuration(isoDuration: string): string {
  // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    console.log('📺 Episodes API called with params:', { limit, forceRefresh });
    
    let episodes: Episode[] = [];
    
    // Try to get cached episodes first (unless force refresh is requested)
    if (!forceRefresh) {
      try {
        const cachedEpisodes = await EpisodesCacheService.getCachedEpisodes();
        if (cachedEpisodes && cachedEpisodes.length > 0) {
          console.log(`✅ Using ${cachedEpisodes.length} cached episodes`);
          episodes = cachedEpisodes;
        }
      } catch (cacheError) {
        console.error('⚠️ Cache read failed, falling back to YouTube API:', cacheError);
        // Continue to fetch from YouTube
      }
    }
    
    // If no cached episodes or force refresh, fetch from YouTube API
    if (episodes.length === 0 || forceRefresh) {
      console.log('🔄 Fetching fresh episodes from YouTube API...');
      episodes = await fetchYouTubeEpisodes();
      
      // Cache the fresh episodes (non-blocking)
      if (episodes.length > 0) {
        EpisodesCacheService.cacheEpisodes(episodes).catch(cacheError => {
          console.error('⚠️ Failed to cache episodes (non-critical):', cacheError);
        });
      }
    }
    
    // Limit results
    const limitedEpisodes = episodes.slice(0, limit);
    
    console.log(`📺 Returning ${limitedEpisodes.length} episodes (${episodes.length} total in cache)`);
    
    return NextResponse.json(limitedEpisodes);
    
  } catch (error) {
    console.error('Error in episodes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}