import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test basic connectivity
    const testData = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
        serviceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY) ? 'Set' : 'Missing',
        fourthwallToken: process.env.FW_STOREFRONT_TOKEN ? 'Set' : 'Missing',
        youtubeRss: process.env.YOUTUBE_RSS_URL ? 'Set' : 'Missing'
      },
      status: 'OK'
    };

    return NextResponse.json(testData);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Health check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
