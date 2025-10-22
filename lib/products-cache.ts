import { supabaseAdmin } from './supabase';

export type CachedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  inStock: boolean;
  checkoutUrl: string;
};

export class ProductsCacheService {
  private static readonly CACHE_DURATION_HOURS = 1; // Cache for 1 hour
  private static readonly CACHE_KEY = 'fourthwall_products';

  /**
   * Get cached products if they exist and are not expired
   */
  static async getCachedProducts(): Promise<CachedProduct[] | null> {
    try {
      console.log('🔍 Checking for cached products...');
      console.log('🔍 Supabase URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing');
      console.log('🔍 Service Role Key:', (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY) ? 'Set' : 'Missing');
      
      const { data, error } = await supabaseAdmin
        .from('products_cache')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      console.log('🔍 Cache query result:', { data: data?.length || 0, error });

      if (error) {
        console.error('❌ Error fetching cached products:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('📭 No valid cached products found');
        return null;
      }

      console.log(`✅ Found ${data.length} cached products`);
      
      // Convert cached data to our product format
      const products: CachedProduct[] = data.map(item => ({
        id: item.product_id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price),
        currency: item.currency,
        image: item.image_url || '',
        category: item.category,
        inStock: item.in_stock,
        checkoutUrl: item.checkout_url
      }));

      return products;
    } catch (error) {
      console.error('❌ Error in getCachedProducts:', error);
      return null;
    }
  }

  /**
   * Cache products from Fourthwall API
   */
  static async cacheProducts(products: CachedProduct[]): Promise<void> {
    try {
      console.log(`💾 Caching ${products.length} products...`);
      
      // First, clear expired cache
      await this.clearExpiredCache();
      
      // Prepare data for insertion
      const cacheData = products.map(product => ({
        product_id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        currency: product.currency,
        image_url: product.image,
        category: product.category,
        in_stock: product.inStock,
        checkout_url: product.checkoutUrl,
        raw_data: product, // Store the full product data
        expires_at: new Date(Date.now() + this.CACHE_DURATION_HOURS * 60 * 60 * 1000).toISOString()
      }));

      // Upsert products (update if exists, insert if not)
      console.log('💾 Attempting to upsert cache data...');
      const { error } = await supabaseAdmin
        .from('products_cache')
        .upsert(cacheData, { 
          onConflict: 'product_id',
          ignoreDuplicates: false 
        });

      console.log('💾 Upsert result:', { error });

      if (error) {
        console.error('❌ Error caching products:', error);
        throw error;
      }

      console.log(`✅ Successfully cached ${products.length} products`);
    } catch (error) {
      console.error('❌ Error in cacheProducts:', error);
      throw error;
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('products_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('❌ Error clearing expired cache:', error);
      } else {
        console.log('🧹 Cleared expired cache entries');
      }
    } catch (error) {
      console.error('❌ Error in clearExpiredCache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalCached: number;
    expiredCached: number;
    oldestCache: Date | null;
    newestCache: Date | null;
  }> {
    try {
      const [
        { count: totalCached },
        { count: expiredCached },
        { data: oldestCache },
        { data: newestCache }
      ] = await Promise.all([
        supabaseAdmin.from('products_cache').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('products_cache').select('*', { count: 'exact', head: true }).lt('expires_at', new Date().toISOString()),
        supabaseAdmin.from('products_cache').select('created_at').order('created_at', { ascending: true }).limit(1).single(),
        supabaseAdmin.from('products_cache').select('created_at').order('created_at', { ascending: false }).limit(1).single()
      ]);

      return {
        totalCached: totalCached || 0,
        expiredCached: expiredCached || 0,
        oldestCache: oldestCache?.created_at ? new Date(oldestCache.created_at) : null,
        newestCache: newestCache?.created_at ? new Date(newestCache.created_at) : null
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return {
        totalCached: 0,
        expiredCached: 0,
        oldestCache: null,
        newestCache: null
      };
    }
  }

  /**
   * Force refresh cache (clear all and fetch new data)
   */
  static async forceRefreshCache(fetchFunction: () => Promise<CachedProduct[]>): Promise<CachedProduct[]> {
    try {
      console.log('🔄 Force refreshing product cache...');
      
      // Clear all cache
      const { error: clearError } = await supabaseAdmin
        .from('products_cache')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (clearError) {
        console.error('❌ Error clearing cache:', clearError);
      }

      // Fetch fresh data
      const products = await fetchFunction();
      
      // Cache the new data
      await this.cacheProducts(products);
      
      console.log('✅ Cache force refresh completed');
      return products;
    } catch (error) {
      console.error('❌ Error in forceRefreshCache:', error);
      throw error;
    }
  }
}
