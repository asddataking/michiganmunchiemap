import { supabaseAdmin } from './supabase';

export type CachedEpisode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  duration?: string;
  viewCount?: number;
};

export class EpisodesCacheService {
  private static readonly CACHE_DURATION_HOURS = 6; // Cache for 6 hours (videos don't change often)
  private static readonly CACHE_KEY = 'youtube_episodes';

  /**
   * Get cached episodes if they exist and are not expired
   */
  static async getCachedEpisodes(): Promise<CachedEpisode[] | null> {
    try {
      console.log('🔍 Checking for cached episodes...');
      
      const { data, error } = await supabaseAdmin
        .from('episodes_cache')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Error fetching cached episodes:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.log('📭 No valid cached episodes found');
        return null;
      }

      console.log(`✅ Found cached episodes (${data[0].episodes_data?.length || 0} episodes)`);
      
      // Return the episodes from the raw_data field
      return data[0].episodes_data || null;
    } catch (error) {
      console.error('❌ Error in getCachedEpisodes:', error);
      return null;
    }
  }

  /**
   * Cache episodes from YouTube API
   */
  static async cacheEpisodes(episodes: CachedEpisode[]): Promise<void> {
    try {
      console.log(`💾 Caching ${episodes.length} episodes...`);
      
      // First, clear all old cache (we only keep one cache entry with all episodes)
      await this.clearAllCache();
      
      // Prepare data for insertion
      const cacheData = {
        cache_key: this.CACHE_KEY,
        episodes_data: episodes,
        episodes_count: episodes.length,
        expires_at: new Date(Date.now() + this.CACHE_DURATION_HOURS * 60 * 60 * 1000).toISOString()
      };

      // Insert new cache
      const { error } = await supabaseAdmin
        .from('episodes_cache')
        .insert(cacheData);

      if (error) {
        console.error('❌ Error caching episodes:', error);
        throw error;
      }

      console.log(`✅ Successfully cached ${episodes.length} episodes (expires in ${this.CACHE_DURATION_HOURS} hours)`);
    } catch (error) {
      console.error('❌ Error in cacheEpisodes:', error);
      throw error;
    }
  }

  /**
   * Clear all cache entries
   */
  static async clearAllCache(): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('episodes_cache')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('❌ Error clearing cache:', error);
      } else {
        console.log('🧹 Cleared all episode cache entries');
      }
    } catch (error) {
      console.error('❌ Error in clearAllCache:', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('episodes_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('❌ Error clearing expired cache:', error);
      } else {
        console.log('🧹 Cleared expired episode cache entries');
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
    episodesCount: number;
    cacheAge: number | null; // in minutes
    expiresIn: number | null; // in minutes
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('episodes_cache')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return {
          totalCached: 0,
          episodesCount: 0,
          cacheAge: null,
          expiresIn: null
        };
      }

      const now = Date.now();
      const createdAt = new Date(data.created_at).getTime();
      const expiresAt = new Date(data.expires_at).getTime();

      return {
        totalCached: 1,
        episodesCount: data.episodes_count || 0,
        cacheAge: Math.floor((now - createdAt) / 1000 / 60), // minutes
        expiresIn: Math.floor((expiresAt - now) / 1000 / 60) // minutes
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return {
        totalCached: 0,
        episodesCount: 0,
        cacheAge: null,
        expiresIn: null
      };
    }
  }

  /**
   * Force refresh cache (clear all and fetch new data)
   */
  static async forceRefreshCache(fetchFunction: () => Promise<CachedEpisode[]>): Promise<CachedEpisode[]> {
    try {
      console.log('🔄 Force refreshing episodes cache...');
      
      // Clear all cache
      await this.clearAllCache();

      // Fetch fresh data
      const episodes = await fetchFunction();
      
      // Cache the new data
      await this.cacheEpisodes(episodes);
      
      console.log('✅ Cache force refresh completed');
      return episodes;
    } catch (error) {
      console.error('❌ Error in forceRefreshCache:', error);
      throw error;
    }
  }
}

