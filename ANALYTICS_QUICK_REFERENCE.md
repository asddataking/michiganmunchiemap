# Google Analytics Quick Reference

Quick reference for the most commonly used analytics tracking functions in DankNDevour.

## 🚀 Import in Components

```tsx
import { useAnalytics } from '@/lib/useAnalytics';

const { trackPlaceClick, trackSearch, trackFilter } = useAnalytics();
```

## 📍 Place Tracking (Most Common)

```tsx
// Place card click
trackPlaceClick('Joe\'s Pizza', 'featured-card');
trackPlaceClick('Joe\'s Pizza', 'map-view');
trackPlaceClick('Joe\'s Pizza', 'search-results');

// Place detail page view
trackPlaceView('Joe\'s Pizza', 'place-123');

// Get directions button
trackPlaceDirections('Joe\'s Pizza');

// Visit website link
trackPlaceWebsite('Joe\'s Pizza');

// Call phone number
trackPlaceCall('Joe\'s Pizza');
```

## 🔍 Search Tracking

```tsx
// After search completes
trackSearch(searchQuery, resultsCount);

// Example
trackSearch('pizza near detroit', 15);
```

## 🎛️ Filter Tracking

```tsx
// When a filter is applied
trackFilter('cuisine', 'Italian');
trackFilter('city', 'Detroit');
trackFilter('featured', 'true');

// When filters are cleared
trackClearFilters();
```

## 🗺️ Map Tracking

```tsx
trackMapInteraction('marker_click', 'Joe\'s Pizza');
trackMapInteraction('zoom_in');
trackMapInteraction('cluster_expand', 'Detroit area');
```

## 🛒 Shop Tracking

```tsx
trackProductView('DankNDevour T-Shirt', 'product-456');
trackProductClick('DankNDevour T-Shirt', 29.99);
```

## 💰 Donation Tracking

```tsx
// When form opens
trackDonationStart();

// When donation completes
trackDonationComplete(50); // amount
```

## 🎬 Episode Tracking

```tsx
trackEpisodeView('Michigan Munchies Ep 1', 'ep-001');
trackEpisodeClick('Michigan Munchies Ep 1');
```

## 🔗 Link & Button Tracking

```tsx
// CTA buttons
trackCTA('Join DankPass', 'hero-section');
trackCTA('Submit Place', 'footer');

// External links
trackOutboundLink('https://fourthwall.com/dankndevour', 'Shop');

// Navigation
trackNavigation('/places', 'header-menu');
```

## 🔑 Authentication

```tsx
trackLogin('email');
trackSignup('google');
trackLogout();
```

## 📤 Social Sharing

```tsx
trackShare('twitter', 'Joe\'s Pizza place page');
trackShare('facebook', 'Episode 5');
```

## ✅ Real Implementation Examples

### Place Card Component
```tsx
const { trackPlaceClick } = useAnalytics();

<Link 
  href={`/place/${place.slug}`}
  onClick={() => trackPlaceClick(place.name, 'place-card')}
>
  View Details
</Link>
```

### Search Results
```tsx
const { trackSearch, trackPlaceClick } = useAnalytics();

useEffect(() => {
  const search = async () => {
    const results = await searchPlaces(query);
    trackSearch(query, results.length); // Track search
  };
  search();
}, [query]);

// In results
<PlaceCard
  place={place}
  onClick={() => {
    trackPlaceClick(place.name, 'search-results');
    navigate(`/place/${place.slug}`);
  }}
/>
```

### Map Marker Click
```tsx
const { trackMapInteraction, trackPlaceClick } = useAnalytics();

const handleMarkerClick = (place) => {
  trackMapInteraction('marker_click', place.name);
  trackPlaceClick(place.name, 'map');
  showPlacePopup(place);
};
```

### Filter Selection
```tsx
const { trackFilter } = useAnalytics();

<select onChange={(e) => {
  const cuisine = e.target.value;
  trackFilter('cuisine', cuisine);
  applyFilter('cuisine', cuisine);
}}>
  <option value="italian">Italian</option>
  <option value="mexican">Mexican</option>
</select>
```

### Product Click
```tsx
const { trackProductClick } = useAnalytics();

<a 
  href={product.url}
  onClick={() => trackProductClick(product.name, product.price)}
  target="_blank"
>
  Buy Now
</a>
```

## 📊 What Gets Tracked Automatically

- ✅ **Page Views** - Every route change
- ✅ **Page Paths** - URL paths including query parameters
- ✅ **Session Duration** - How long users stay on site
- ✅ **Device Type** - Desktop, mobile, tablet
- ✅ **Location** - Country, city (approximate)
- ✅ **Traffic Source** - Where users come from

## 🎯 Priority Events to Implement

1. **Place clicks** - Track everywhere places are displayed
2. **Search queries** - Monitor what users search for
3. **Filter usage** - Understand how users browse
4. **Directions/Website clicks** - Track conversion actions
5. **Map interactions** - Monitor map usage patterns
6. **Product clicks** - Track shop engagement
7. **Donations** - Monitor fundraising effectiveness

## 💡 Pro Tips

1. **Be Consistent** - Use the same source names across your app
   - ✅ 'featured-card', 'place-card', 'map', 'search-results'
   - ❌ 'Featured', 'featuredCard', 'featured-list' (inconsistent)

2. **Add Context** - Always include where the action happened
   ```tsx
   // Good
   trackPlaceClick('Joe\'s Pizza', 'homepage-featured');
   
   // Better - includes more context
   trackPlaceClick('Joe\'s Pizza', 'homepage-featured-section');
   ```

3. **Track Failures Too** - Monitor errors and failed actions
   ```tsx
   trackFormSubmit('place-submission', false); // Failed
   ```

4. **Use Meaningful Labels** - Make events easy to understand in GA
   ```tsx
   // Good
   trackFilter('cuisine', 'Italian');
   
   // Less useful
   trackFilter('f1', 'it');
   ```

## 📱 Testing

1. Open your app in a browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Filter by "collect" or "gtag"
5. Perform actions - watch for analytics requests
6. Check Google Analytics Real-time reports

## 🎨 Common Source Values

Use these consistent source identifiers:

- `homepage-hero`
- `homepage-featured`
- `place-card`
- `featured-card`
- `search-results`
- `map-view`
- `map-marker`
- `place-detail`
- `header-menu`
- `footer`
- `cta-button`
- `episode-list`
- `shop-grid`

## 📞 Need Custom Tracking?

For custom events not covered by the utilities:

```tsx
import { trackEvent } from '@/lib/analytics';

trackEvent({
  action: 'custom_action',
  category: 'engagement',
  label: 'Description of what happened',
  value: 100, // Optional number
});
```

## 🔗 Related Files

- `/components/GoogleAnalytics.tsx` - Google Analytics component
- `/lib/analytics.ts` - All tracking functions
- `/lib/useAnalytics.ts` - React hook
- `/ANALYTICS_GUIDE.md` - Full documentation

