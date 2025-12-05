# Supabase Edge Functions

This directory contains Supabase Edge Functions for optimized server-side operations.

## Functions

### 1. `search-places`
Optimized search function with caching for place searches.

**Endpoint:** `POST /functions/v1/search-places`

**Request Body:**
```json
{
  "search_text": "optional search term",
  "county_filter": ["Wayne", "Oakland"],
  "cuisine_filter": ["American", "Mexican"],
  "tag_filter": ["Outdoor Seating"],
  "min_price": 1,
  "max_price": 4,
  "min_rating": 4.0,
  "featured_only": false,
  "verified_only": false,
  "limit_count": 50,
  "min_lng": -85.0,
  "min_lat": 41.0,
  "max_lng": -81.0,
  "max_lat": 45.0
}
```

**Response:**
```json
{
  "data": [/* array of places */]
}
```

### 2. `get-filter-options`
Aggregates and returns all available filter options (counties, cuisines, tags).

**Endpoint:** `GET /functions/v1/get-filter-options`

**Response:**
```json
{
  "data": {
    "counties": ["Wayne", "Oakland", ...],
    "cuisines": ["American", "Mexican", ...],
    "tags": ["Outdoor Seating", "Family Friendly", ...]
  }
}
```

## Deployment

### Using Supabase CLI

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy all functions:**
   ```bash
   supabase functions deploy search-places
   supabase functions deploy get-filter-options
   ```

   Or deploy all at once:
   ```bash
   supabase functions deploy
   ```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. For each function:
   - Name: `search-places` or `get-filter-options`
   - Copy the contents from `supabase/functions/[function-name]/index.ts`
   - Paste into the function editor
   - Click **Deploy**

## Environment Variables

Make sure these are set in your Supabase project:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

These are automatically available in edge functions.

## Usage in Next.js

You can optionally use these edge functions instead of direct RPC calls:

```typescript
// Example: Using edge function for search
const response = await fetch(`${supabaseUrl}/functions/v1/search-places`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseAnonKey}`,
  },
  body: JSON.stringify({
    search_text: 'pizza',
    min_rating: 4.0,
    limit_count: 20,
  }),
});

const { data } = await response.json();
```

## Benefits

- **Caching**: Built-in HTTP caching headers
- **Performance**: Server-side processing reduces client load
- **Rate Limiting**: Can be configured at edge function level
- **Scalability**: Edge functions scale automatically

## Notes

- Edge functions have cold start delays (typically < 1 second)
- Consider caching responses on the client side
- Monitor function invocations in Supabase dashboard
- Functions are deployed globally for low latency

