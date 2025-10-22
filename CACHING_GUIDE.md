# 🚀 Caching System Guide

Your DankNDevour site now has a robust caching system to **drastically reduce API calls** and improve performance.

## 📊 Why Caching?

### YouTube API Quotas
- **Default quota**: 10,000 units/day
- **Each episode fetch**: 3 API calls = ~6 units
- **Without caching**: 1,667 requests/day max
- **With caching**: Virtually unlimited!

### Benefits
- ✅ **Reduced API costs** - Stay within free tier limits
- ✅ **Faster page loads** - Serve from database instead of external APIs
- ✅ **Better reliability** - Works even if APIs are temporarily down
- ✅ **Lower latency** - Database queries are faster than external API calls

## 🏗️ System Architecture

### Episodes Cache (YouTube)
- **Cache Duration**: 6 hours
- **Why 6 hours?**: Videos don't change frequently, but view counts update
- **Storage**: Supabase `episodes_cache` table
- **Data Stored**: All video metadata (title, description, thumbnail, duration, views)

### Products Cache (Fourthwall)
- **Cache Duration**: 1 hour  
- **Why 1 hour?**: Products/prices can change more frequently
- **Storage**: Supabase `products_cache` table
- **Data Stored**: Product details, pricing, availability

## 📥 Setup Instructions

### 1. Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Copy the entire contents of EPISODES_CACHE_MIGRATION.sql
```

Or directly:
1. Go to Supabase Dashboard → SQL Editor
2. Open the file `EPISODES_CACHE_MIGRATION.sql`
3. Copy all contents
4. Paste and run in SQL Editor

### 2. Verify Setup

Check your cache status:
```bash
curl https://yourdomain.com/api/cache/clear
```

Expected response:
```json
{
  "success": true,
  "products": {
    "totalCached": 0,
    "expiredCached": 0,
    "oldestCache": null,
    "newestCache": null
  },
  "episodes": {
    "totalCached": 0,
    "episodesCount": 0,
    "cacheAge": null,
    "expiresIn": null
  }
}
```

## 🎯 How It Works

### Automatic Caching Flow

#### First Request (Cache Miss)
```
User Request → API Endpoint → Check Cache → Cache Empty → 
→ Fetch from External API → Store in Cache → Return to User
```

#### Subsequent Requests (Cache Hit)
```
User Request → API Endpoint → Check Cache → Cache Valid → 
→ Return Cached Data (FAST! ⚡)
```

#### After Expiration
```
User Request → API Endpoint → Check Cache → Cache Expired → 
→ Fetch Fresh Data → Update Cache → Return to User
```

### Episodes API Examples

**Normal request** (uses cache if available):
```bash
GET /api/episodes?limit=10
```

**Force refresh** (bypasses cache):
```bash
GET /api/episodes?refresh=true
```

**With limit**:
```bash
GET /api/episodes?limit=3
```

### Products API Examples

**Normal request** (uses cache):
```bash
GET /api/fourthwall/products?limit=20
```

**Force refresh**:
```bash
GET /api/fourthwall/products?refresh=true
```

## 🔧 Cache Management

### Check Cache Status

**GET** `/api/cache/clear`

Returns statistics for both caches:
```json
{
  "success": true,
  "products": {
    "totalCached": 24,
    "expiredCached": 0,
    "oldestCache": "2024-01-15T10:30:00Z",
    "newestCache": "2024-01-15T14:30:00Z"
  },
  "episodes": {
    "totalCached": 1,
    "episodesCount": 45,
    "cacheAge": 120,      // minutes since cached
    "expiresIn": 240      // minutes until expires
  }
}
```

### Clear Cache

**POST** `/api/cache/clear?type=all`

Options for `type` parameter:
- `all` - Clear both products and episodes
- `products` - Clear only products cache
- `episodes` - Clear only episodes cache

Examples:
```bash
# Clear all caches
curl -X POST https://yourdomain.com/api/cache/clear?type=all

# Clear only episodes
curl -X POST https://yourdomain.com/api/cache/clear?type=episodes

# Clear only products
curl -X POST https://yourdomain.com/api/cache/clear?type=products
```

## 📈 Performance Metrics

### Before Caching
```
Homepage load:
- 3 YouTube API calls (channel, playlist, videos)
- 1 Fourthwall API call
- ~2-4 seconds total API time

Daily API usage:
- 1000 visitors × 3 calls = 3000 YouTube API units
- Risk of hitting quota limits
```

### After Caching
```
Homepage load (cached):
- 0 YouTube API calls
- 0 Fourthwall API calls
- ~100-200ms database queries

Daily API usage:
- First load: 3 units
- Next 6 hours: 0 units
- Total: ~12 units/day (4 cache refreshes)
- 99.6% reduction in API calls!
```

## 🛠️ Advanced Usage

### Programmatic Cache Management

```typescript
import { EpisodesCacheService } from '@/lib/episodes-cache';
import { ProductsCacheService } from '@/lib/products-cache';

// Get cache stats
const episodesStats = await EpisodesCacheService.getCacheStats();
console.log(`Cache age: ${episodesStats.cacheAge} minutes`);
console.log(`Expires in: ${episodesStats.expiresIn} minutes`);

// Force refresh episodes
await EpisodesCacheService.forceRefreshCache(fetchYouTubeEpisodes);

// Clear all episodes cache
await EpisodesCacheService.clearAllCache();

// Clear expired only
await EpisodesCacheService.clearExpiredCache();
```

### Custom Cache Duration

To change cache duration, edit the service file:

**Episodes** (`lib/episodes-cache.ts`):
```typescript
private static readonly CACHE_DURATION_HOURS = 6; // Change to 12, 24, etc.
```

**Products** (`lib/products-cache.ts`):
```typescript
private static readonly CACHE_DURATION_HOURS = 1; // Change as needed
```

## 🔍 Monitoring

### Check Logs

In production (Vercel):
1. Go to your Vercel deployment
2. Check Functions logs
3. Look for cache-related messages:
   - `✅ Using X cached episodes`
   - `🔄 Fetching fresh episodes from YouTube API...`
   - `💾 Caching X episodes...`

### Cache Hit Rate

Monitor your logs to see cache effectiveness:
- **High hit rate**: Most requests use cache (good!)
- **Low hit rate**: Cache expiring too quickly or not being used

## ⚠️ Important Notes

### Cache Invalidation

The cache does **NOT** automatically update when:
- You upload new YouTube videos
- Products change on Fourthwall
- You manually edit database content

**Solution**: Use force refresh or clear cache:
```bash
# Refresh episodes after uploading new video
curl -X POST https://yourdomain.com/api/cache/clear?type=episodes

# Or use refresh parameter in next request
curl https://yourdomain.com/api/episodes?refresh=true
```

### Database Storage

Each cache entry stores:
- **Episodes**: ~50KB (for 50 videos)
- **Products**: ~5KB per product

Supabase free tier includes 500MB storage - plenty for caching!

### Error Handling

The caching system is **non-blocking**:
- If cache read fails → Falls back to API
- If cache write fails → Logs error but continues
- Your site keeps working even if caching fails

## 🎛️ Configuration Checklist

- [ ] Run `EPISODES_CACHE_MIGRATION.sql` in Supabase
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set in environment
- [ ] Deploy updated code to production
- [ ] Test cache with `/api/cache/clear` endpoint
- [ ] Monitor logs for cache hit rates
- [ ] Adjust cache durations if needed

## 📞 Troubleshooting

### Cache Not Working

1. **Check database table exists**:
   ```sql
   SELECT * FROM episodes_cache LIMIT 1;
   ```

2. **Check service role key**:
   - Verify `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables
   - Make sure it's the **service role** key, not anon key

3. **Check logs**:
   - Look for cache-related errors in Vercel logs
   - Check Supabase logs for failed queries

### Cache Not Clearing

1. **Verify endpoint works**:
   ```bash
   curl -X POST https://yourdomain.com/api/cache/clear?type=all
   ```

2. **Check response**:
   - Should return `success: true`
   - If false, check error message

3. **Manual clear in Supabase**:
   ```sql
   DELETE FROM episodes_cache;
   DELETE FROM products_cache;
   ```

## 📊 Monitoring Dashboard Idea

Want to see cache stats on your admin page? Add this:

```typescript
// In your admin dashboard
const cacheStats = await fetch('/api/cache/clear').then(r => r.json());

return (
  <div>
    <h2>Cache Statistics</h2>
    <div>
      <h3>Episodes</h3>
      <p>Videos cached: {cacheStats.episodes.episodesCount}</p>
      <p>Cache age: {cacheStats.episodes.cacheAge} minutes</p>
      <p>Expires in: {cacheStats.episodes.expiresIn} minutes</p>
    </div>
    <div>
      <h3>Products</h3>
      <p>Products cached: {cacheStats.products.totalCached}</p>
    </div>
    <button onClick={() => clearCache()}>Clear Cache</button>
  </div>
);
```

## 🎉 Success!

Your caching system is now set up! You should see:
- ⚡ Faster page loads
- 📉 Reduced API usage
- 💰 Lower costs
- 🎯 Better user experience

Happy caching! 🚀

