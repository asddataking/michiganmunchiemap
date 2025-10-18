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

// Mock YouTube RSS data - replace with actual RSS parsing
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
  },
  {
    id: "4",
    title: "Grand Rapids Craft Beer Scene",
    description: "Exploring Grand Rapids' world-renowned craft beer culture. We visit breweries, taprooms, and discover the stories behind Michigan's beer capital.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2024-01-01T00:00:00Z",
    videoId: "demo4",
    duration: "20:15",
    viewCount: 12750
  },
  {
    id: "5",
    title: "Farm-to-Table Dining in Traverse City",
    description: "Discovering Traverse City's farm-to-table restaurants and local food scene. We meet chefs who source ingredients from nearby farms.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2023-12-28T00:00:00Z",
    videoId: "demo5",
    duration: "16:30",
    viewCount: 9850
  },
  {
    id: "6",
    title: "Michigan's Cannabis Dispensary Tour",
    description: "A comprehensive tour of Michigan's top cannabis dispensaries. We explore different products, strains, and the evolving retail experience.",
    thumbnail: "/api/placeholder/400/225",
    publishedAt: "2023-12-25T00:00:00Z",
    videoId: "demo6",
    duration: "22:45",
    viewCount: 31200
  }
];

async function fetchYouTubeEpisodes(): Promise<Episode[]> {
  try {
    const rssUrl = process.env.YOUTUBE_RSS_URL;
    
    if (!rssUrl) {
      console.log('No YouTube RSS URL configured, using mock data');
      return mockEpisodes;
    }

    // TODO: Implement actual RSS parsing
    // For now, return mock data
    console.log('YouTube RSS integration not yet implemented, using mock data');
    return mockEpisodes;
    
  } catch (error) {
    console.error('Error fetching YouTube episodes:', error);
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
