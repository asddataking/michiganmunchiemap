import { NextRequest, NextResponse } from 'next/server';

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
      // Use the highest quality thumbnail available
      const thumbnail = video.snippet.thumbnails.maxres?.url || 
                      video.snippet.thumbnails.standard?.url || 
                      video.snippet.thumbnails.high?.url || 
                      video.snippet.thumbnails.medium?.url || 
                      video.snippet.thumbnails.default?.url;
      
      // Format duration from ISO 8601 to readable format
      const duration = formatDuration(video.contentDetails.duration);
      
      // Format view count
      const viewCount = parseInt(video.statistics.viewCount);
      
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description.substring(0, 200) + (video.snippet.description.length > 200 ? '...' : ''),
        thumbnail,
        publishedAt: video.snippet.publishedAt,
        videoId: video.id,
        duration,
        viewCount
      };
    });

    console.log(`✅ Successfully fetched ${episodes.length} episodes from YouTube Data API`);
    return episodes;
    
  } catch (error) {
    console.error('❌ Error fetching YouTube episodes:', error);
    
    // Fallback to RSS feed if API fails
    console.log('🔄 Falling back to RSS feed...');
    return await fetchYouTubeEpisodesFromRSS();
  }
}

async function fetchYouTubeEpisodesFromRSS(): Promise<Episode[]> {
  try {
    const rssUrl = process.env.YOUTUBE_RSS_URL;
    
    if (!rssUrl) {
      console.log('❌ No YouTube RSS URL configured');
      return [];
    }

    console.log('📺 Fetching YouTube RSS feed:', rssUrl);
    
    const Parser = (await import('rss-parser')).default;
    const parser = new Parser({
      customFields: {
        item: [
          ['media:group', 'mediaGroup'],
          ['yt:videoId', 'videoId'],
        ],
      },
    });

    const feed = await parser.parseURL(rssUrl);
    
    if (!feed.items || feed.items.length === 0) {
      console.log('⚠️ No items found in RSS feed');
      return [];
    }

    const episodes: Episode[] = feed.items.map((item, index) => {
      let videoId = item.link?.match(/watch\?v=([^&]+)/)?.[1] || 
                   item.link?.match(/youtu\.be\/([^?]+)/)?.[1];
      
      console.log(`📺 Processing item ${index}:`, {
        title: item.title,
        link: item.link,
        extractedVideoId: videoId
      });
      
      let thumbnail = '';
      if (!videoId || videoId.length !== 11 || videoId.startsWith('video-')) {
        console.log(`⚠️ Invalid video ID: ${videoId}, skipping thumbnail`);
        videoId = `video-${index}`;
      } else {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
        
      let description = (item as any).contentSnippet || (item as any).content || (item as any).description || '';
      
      if (!description.trim()) {
        description = `Watch ${item.title || 'this episode'} on our YouTube channel!`;
      }
      
      const episode = {
        id: videoId,
        title: item.title || `Episode ${index + 1}`,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        thumbnail,
        publishedAt: (item as any).pubDate || new Date().toISOString(),
        videoId,
        duration: undefined,
        viewCount: undefined
      };
      
      console.log(`✅ Created episode:`, {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail
      });
      
      return episode;
    });

    console.log(`✅ Successfully fetched ${episodes.length} episodes from RSS feed`);
    return episodes;
    
  } catch (error) {
    console.error('❌ Error fetching YouTube episodes from RSS:', error);
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
    
    console.log('📺 Episodes API called with limit:', limit);
    
    const episodes = await fetchYouTubeEpisodes();
    
    // Limit results
    const limitedEpisodes = episodes.slice(0, limit);
    
    console.log(`📺 Returning ${limitedEpisodes.length} episodes`);
    
    return NextResponse.json(limitedEpisodes);
    
  } catch (error) {
    console.error('Error in episodes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}