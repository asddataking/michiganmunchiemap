import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EpisodesCacheService } from '@/lib/episodes-cache';
import { ProductsCacheService } from '@/lib/products-cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheType = searchParams.get('type') || 'all'; // 'products', 'episodes', or 'all'
    
    console.log(`🗑️ Clearing ${cacheType} cache...`);
    
    const results: { products?: boolean; episodes?: boolean } = {};
    
    // Clear products cache
    if (cacheType === 'products' || cacheType === 'all') {
      try {
        await ProductsCacheService.clearAllCache();
        results.products = true;
        console.log('✅ Products cache cleared');
      } catch (error) {
        console.error('❌ Error clearing products cache:', error);
        results.products = false;
      }
    }
    
    // Clear episodes cache
    if (cacheType === 'episodes' || cacheType === 'all') {
      try {
        await EpisodesCacheService.clearAllCache();
        results.episodes = true;
        console.log('✅ Episodes cache cleared');
      } catch (error) {
        console.error('❌ Error clearing episodes cache:', error);
        results.episodes = false;
      }
    }
    
    const allSuccess = Object.values(results).every(v => v === true);
    
    return NextResponse.json({
      success: allSuccess,
      message: `Cache cleared successfully (${cacheType})`,
      results
    }, { status: allSuccess ? 200 : 500 });
    
  } catch (error) {
    console.error('❌ Error in clear cache API:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking cache stats...');
    
    // Get products cache stats
    const productsStats = await ProductsCacheService.getCacheStats();
    
    // Get episodes cache stats
    const episodesStats = await EpisodesCacheService.getCacheStats();
    
    return NextResponse.json({
      success: true,
      products: {
        totalCached: productsStats.totalCached,
        expiredCached: productsStats.expiredCached,
        oldestCache: productsStats.oldestCache,
        newestCache: productsStats.newestCache
      },
      episodes: {
        totalCached: episodesStats.totalCached,
        episodesCount: episodesStats.episodesCount,
        cacheAge: episodesStats.cacheAge,
        expiresIn: episodesStats.expiresIn
      }
    });
    
  } catch (error) {
    console.error('❌ Error in cache check API:', error);
    return NextResponse.json(
      { error: 'Failed to check cache' },
      { status: 500 }
    );
  }
}
