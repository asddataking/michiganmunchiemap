# Deploy Edge Functions to Supabase

This guide shows you how to deploy the optimized edge functions to your Supabase project.

## Prerequisites

1. **Supabase Project ID** - You can find this in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`
2. **Supabase MCP Access** - Make sure you have MCP configured with your Supabase credentials

## Deployment Methods

### Method 1: Using Supabase MCP (Recommended)

You can deploy using the Supabase MCP tools. First, get your project ID:

```bash
# Your project ID is in your Supabase dashboard URL
# Example: https://supabase.com/dashboard/project/abcdefghijklmnop
# Project ID: abcdefghijklmnop
```

Then deploy the functions:

```typescript
// Deploy search-places function
mcp_supabase_deploy_edge_function({
  project_id: "your-project-id",
  name: "search-places",
  files: [
    {
      name: "index.ts",
      content: // Content from supabase/functions/search-places/index.ts
    }
  ]
})

// Deploy get-filter-options function
mcp_supabase_deploy_edge_function({
  project_id: "your-project-id",
  name: "get-filter-options",
  files: [
    {
      name: "index.ts",
      content: // Content from supabase/functions/get-filter-options/index.ts
    }
  ]
})
```

### Method 2: Using Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **"Deploy a new function"** → **"Via Editor"**
5. For each function:
   - **Function Name**: `search-places` or `get-filter-options`
   - **Code**: Copy the contents from `supabase/functions/[function-name]/index.ts`
   - Click **"Deploy function"**

### Method 3: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy functions**:
   ```bash
   supabase functions deploy search-places
   supabase functions deploy get-filter-options
   ```

## Verify Deployment

After deployment, test your functions:

### Test search-places:
```bash
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/search-places \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_text": "pizza",
    "min_rating": 4.0,
    "limit_count": 10
  }'
```

### Test get-filter-options:
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/get-filter-options \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Environment Variables

Edge functions automatically have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

These are automatically set by Supabase - no manual configuration needed!

## Using Edge Functions in Your App

The `PlacesService` has been updated to automatically use edge functions when available. The implementation:

1. **Tries edge function first** (if enabled)
2. **Falls back to RPC** if edge function fails or is unavailable
3. **Works on both client and server** side

To disable edge functions (use RPC only):
```typescript
PlacesService.searchPlaces('pizza', {}, 50, false);
```

## Benefits

✅ **Better Performance** - Server-side processing reduces client load  
✅ **Built-in Caching** - HTTP cache headers for faster responses  
✅ **Global Distribution** - Functions run at edge locations worldwide  
✅ **Automatic Scaling** - Handles traffic spikes automatically  
✅ **Cost Effective** - Pay only for what you use  

## Troubleshooting

### Function not found (404)
- Verify the function name matches exactly
- Check that deployment completed successfully
- Ensure you're using the correct project ID

### Authentication errors (401/403)
- Verify your `SUPABASE_ANON_KEY` is correct
- Check that RLS policies allow access
- Ensure service role key is set in function environment

### CORS errors
- Edge functions include CORS headers automatically
- If issues persist, check browser console for specific errors

### Performance issues
- Check Supabase dashboard for function logs
- Monitor function execution times
- Consider adjusting cache durations

## Next Steps

After deploying, the app will automatically start using edge functions for better performance. Monitor your Supabase dashboard to see function invocations and performance metrics.

