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

// Mock episodes as fallback
const mockEpisodes: Episode[] = [
  {
    id: "1",
    title: "Detroit's Hidden Pizza Gems",
    description: "Exploring the best pizza spots in Detroit that locals don't want you to know about. From deep dish to thin crust, we uncover the city's most authentic pizza experiences.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2024-01-15T00:00:00Z",
    videoId: "demo1",
    duration: "12:34",
    viewCount: 15420
  },
  {
    id: "2", 
    title: "Cannabis Culture in Ann Arbor",
    description: "A deep dive into Ann Arbor's thriving cannabis community and culture. We explore dispensaries, consumption lounges, and the local scene.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2024-01-10T00:00:00Z",
    videoId: "demo2",
    duration: "18:45",
    viewCount: 22150
  },
  {
    id: "3",
    title: "Food Truck Friday Adventures",
    description: "Hunting down the best food trucks across Michigan's major cities. From tacos to BBQ, we find the mobile kitchens serving up incredible flavors.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2024-01-05T00:00:00Z",
    videoId: "demo3",
    duration: "15:22",
    viewCount: 18930
  }
];

async function fetchYouTubeEpisodes(): Promise<Episode[]> {
  try {
    const rssUrl = process.env.YOUTUBE_RSS_URL;
    
    if (!rssUrl) {
      console.log('No YouTube RSS URL configured, using mock data');
      return mockEpisodes;
    }

    console.log('Fetching YouTube RSS feed:', rssUrl);
    
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
      console.log('No items found in RSS feed, using mock data');
      return mockEpisodes;
    }

    const episodes: Episode[] = feed.items.map((item, index) => {
      // Extract video ID from the link
      const videoId = item.link?.match(/watch\?v=([^&]+)/)?.[1] || 
                     item.link?.match(/youtu\.be\/([^?]+)/)?.[1] || 
                     `video-${index}`;
      
      // Extract thumbnail URL
      const thumbnail = item['media:thumbnail']?.['$']?.url || 
                       `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Clean up description
      const description = item.contentSnippet || item.content || item.description || '';
      
      return {
        id: videoId,
        title: item.title || `Episode ${index + 1}`,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        thumbnail,
        publishedAt: item.pubDate || new Date().toISOString(),
        videoId,
        duration: undefined, // RSS doesn't include duration
        viewCount: undefined // RSS doesn't include view count
      };
    });

    console.log(`Successfully parsed ${episodes.length} episodes from YouTube RSS`);
    return episodes;
    
  } catch (error) {
    console.error('Error fetching YouTube episodes:', error);
    console.log('Falling back to mock data');
    return mockEpisodes;
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
