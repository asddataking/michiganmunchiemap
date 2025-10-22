import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Clearing products cache...');
    
    // Clear all cached products
    const { error } = await supabaseAdmin
      .from('products_cache')
      .delete()
      .neq('id', 0); // Delete all rows (neq means "not equal to")
    
    if (error) {
      console.error('❌ Error clearing cache:', error);
      return NextResponse.json(
        { error: 'Failed to clear cache', details: error.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Successfully cleared products cache');
    
    return NextResponse.json({
      success: true,
      message: 'Products cache cleared successfully'
    });
    
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
    console.log('🔍 Checking products cache...');
    
    // Get cache info
    const { data, error } = await supabaseAdmin
      .from('products_cache')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error checking cache:', error);
      return NextResponse.json(
        { error: 'Failed to check cache', details: error.message },
        { status: 500 }
      );
    }
    
    console.log(`📊 Cache contains ${data?.length || 0} entries`);
    
    return NextResponse.json({
      success: true,
      cacheEntries: data?.length || 0,
      entries: data?.map(entry => ({
        id: entry.product_id,
        name: entry.name,
        cachedAt: entry.created_at,
        expiresAt: entry.expires_at
      })) || []
    });
    
  } catch (error) {
    console.error('❌ Error in cache check API:', error);
    return NextResponse.json(
      { error: 'Failed to check cache' },
      { status: 500 }
    );
  }
}
