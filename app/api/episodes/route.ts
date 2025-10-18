import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

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

async function fetchYouTubeEpisodes(): Promise<Episode[]> {
  try {
    const rssUrl = process.env.YOUTUBE_RSS_URL;
    
    if (!rssUrl) {
      console.log('❌ No YouTube RSS URL configured');
      throw new Error('YOUTUBE_RSS_URL environment variable not set');
    }

    console.log('📺 Fetching YouTube RSS feed:', rssUrl);
    
    const parser = new Parser({
      customFields: {
        item: [
          ['media:group', 'mediaGroup'],
          ['yt:videoId', 'videoId'],
          ['yt:channelId', 'channelId'],
          ['media:thumbnail', 'thumbnail'],
          ['media:description', 'description']
        ]
      }
    });

    const feed = await parser.parseURL(rssUrl);
    
    if (!feed.items || feed.items.length === 0) {
      console.log('❌ No items found in RSS feed');
      throw new Error('No videos found in RSS feed');
    }

    const episodes: Episode[] = feed.items.map((item, index) => {
      // Extract video ID from the link with better debugging
      let videoId = item.link?.match(/watch\?v=([^&]+)/)?.[1] || 
                   item.link?.match(/youtu\.be\/([^?]+)/)?.[1];
      
      console.log(`📺 Processing item ${index}:`, {
        title: item.title,
        link: item.link,
        extractedVideoId: videoId,
        rawItem: JSON.stringify(item, null, 2)
      });
      
      if (!videoId) {
        console.log(`⚠️ Could not extract video ID from: ${item.link}`);
        console.log(`⚠️ Full item data:`, item);
        videoId = `video-${index}`;
      }
      
        // Generate YouTube thumbnail URL with fallback
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        // Clean up description
      const description = item.contentSnippet || item.content || item.description || '';
      
      const episode = {
        id: videoId,
        title: item.title || `Episode ${index + 1}`,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        thumbnail,
        publishedAt: item.pubDate || new Date().toISOString(),
        videoId,
        duration: undefined, // RSS doesn't include duration
        viewCount: undefined // RSS doesn't include view count
      };
      
      console.log(`✅ Created episode:`, {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail
      });
      
      return episode;
    });

    console.log(`✅ Successfully parsed ${episodes.length} episodes from YouTube RSS`);
    return episodes;
    
  } catch (error) {
    console.error('❌ Error fetching YouTube episodes:', error);
    throw error; // Re-throw instead of returning mock data
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const episodes = await fetchYouTubeEpisodes();
    
    // Sort by published date (newest first)
    const sortedEpisodes = episodes
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
    
    return NextResponse.json(sortedEpisodes);
    
  } catch (error) {
    console.error('Error in episodes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
}
