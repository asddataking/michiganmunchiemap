# Google Analytics Setup Guide

Google Analytics has been configured for your DankNDevour project with automatic page view tracking and comprehensive event tracking capabilities.

## 📊 What's Included

1. **Automatic Page View Tracking** - Every route change is automatically tracked
2. **Event Tracking Utilities** - Pre-built functions for common events
3. **React Hook** - Easy-to-use hook for component-level tracking
4. **Type Safety** - TypeScript definitions for all tracking functions

## 🚀 Quick Start

### Using the Hook (Recommended for Components)

```tsx
'use client';

import { useAnalytics } from '@/lib/useAnalytics';

export function MyComponent() {
  const { trackPlaceClick, trackSearch } = useAnalytics();

  const handlePlaceClick = (placeName: string) => {
    trackPlaceClick(placeName, 'featured-list');
    // Your navigation logic
  };

  const handleSearch = (query: string, results: number) => {
    trackSearch(query, results);
  };

  return (
    <div>
      <button onClick={() => handlePlaceClick('Joe\'s Pizza')}>
        View Place
      </button>
    </div>
  );
}
```

### Using Direct Import

```tsx
import { trackPlaceView, trackFilter } from '@/lib/analytics';

// Track a place view
trackPlaceView('Joe\'s Pizza', 'place-123');

// Track filter usage
trackFilter('cuisine', 'Italian');
```

## 📝 Available Tracking Functions

### Search Events

```tsx
import { trackSearch } from '@/lib/analytics';

trackSearch('pizza near me', 15); // searchTerm, resultsCount
```

### Place Events

```tsx
import { 
  trackPlaceView,
  trackPlaceClick,
  trackPlaceDirections,
  trackPlaceWebsite,
  trackPlaceCall
} from '@/lib/analytics';

// When a user views a place detail page
trackPlaceView('Joe\'s Pizza', 'place-123');

// When a user clicks a place card
trackPlaceClick('Joe\'s Pizza', 'map-view');

// When a user clicks "Get Directions"
trackPlaceDirections('Joe\'s Pizza');

// When a user clicks "Visit Website"
trackPlaceWebsite('Joe\'s Pizza');

// When a user clicks the phone number
trackPlaceCall('Joe\'s Pizza');
```

### Filter Events

```tsx
import { trackFilter, trackClearFilters } from '@/lib/analytics';

// Track filter usage
trackFilter('cuisine', 'Italian');
trackFilter('city', 'Detroit');
trackFilter('featured', 'true');

// Track when filters are cleared
trackClearFilters();
```

### Map Events

```tsx
import { trackMapInteraction } from '@/lib/analytics';

trackMapInteraction('zoom_in');
trackMapInteraction('zoom_out');
trackMapInteraction('marker_click', 'Joe\'s Pizza');
trackMapInteraction('cluster_expand', 'Detroit area');
```

### Shop/Product Events

```tsx
import { trackProductView, trackProductClick } from '@/lib/analytics';

// When viewing a product
trackProductView('DankNDevour T-Shirt', 'product-456');

// When clicking to purchase
trackProductClick('DankNDevour T-Shirt', 29.99);
```

### Donation Events

```tsx
import { trackDonationStart, trackDonationComplete } from '@/lib/analytics';

// When donation form is opened
trackDonationStart();

// When donation is completed
trackDonationComplete(50); // amount in dollars
```

### Authentication Events

```tsx
import { trackLogin, trackSignup, trackLogout } from '@/lib/analytics';

trackLogin('email');
trackLogin('google');
trackSignup('email');
trackLogout();
```

### Episode Events

```tsx
import { trackEpisodeView, trackEpisodeClick } from '@/lib/analytics';

trackEpisodeView('Michigan Munchies Ep 1', 'ep-001');
trackEpisodeClick('Michigan Munchies Ep 1');
```

### Navigation Events

```tsx
import { trackNavigation } from '@/lib/analytics';

trackNavigation('/places', 'header-menu');
trackNavigation('/shop', 'cta-button');
```

### Share Events

```tsx
import { trackShare } from '@/lib/analytics';

trackShare('twitter', 'Joe\'s Pizza place page');
trackShare('facebook', 'Episode 5');
trackShare('copy-link', 'Map view');
```

### Engagement Events

```tsx
import { trackCTA, trackOutboundLink, trackFormSubmit } from '@/lib/analytics';

// Call-to-action clicks
trackCTA('Join DankPass', 'hero-section');
trackCTA('Submit Place', 'footer');

// External links
trackOutboundLink('https://fourthwall.com/dankndevour', 'Shop');

// Form submissions
trackFormSubmit('place-submission', true);
trackFormSubmit('contact-form', false);
```

### Custom Events

```tsx
import { trackEvent } from '@/lib/analytics';

trackEvent({
  action: 'custom_action',
  category: 'engagement',
  label: 'Custom event description',
  value: 100,
});
```

## 🎯 Implementation Examples for Your App

### Example 1: Place Card Component

```tsx
'use client';

import { useAnalytics } from '@/lib/useAnalytics';
import { useRouter } from 'next/navigation';

export function PlaceCard({ place }: { place: Place }) {
  const router = useRouter();
  const { trackPlaceClick } = useAnalytics();

  const handleClick = () => {
    trackPlaceClick(place.name, 'place-list');
    router.push(`/place/${place.slug}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <h3>{place.name}</h3>
      <p>{place.description}</p>
    </div>
  );
}
```

### Example 2: Search Component

```tsx
'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const { trackSearch } = useAnalytics();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await searchPlaces(query);
    trackSearch(query, results.length);
    // Display results...
  };

  return (
    <form onSubmit={handleSearch}>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search places..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Example 3: Filter Component

```tsx
'use client';

import { useAnalytics } from '@/lib/useAnalytics';

export function PlaceFilters() {
  const { trackFilter, trackClearFilters } = useAnalytics();

  const handleCuisineChange = (cuisine: string) => {
    trackFilter('cuisine', cuisine);
    // Apply filter...
  };

  const handleClear = () => {
    trackClearFilters();
    // Clear all filters...
  };

  return (
    <div>
      <select onChange={(e) => handleCuisineChange(e.target.value)}>
        <option value="">All Cuisines</option>
        <option value="italian">Italian</option>
        <option value="mexican">Mexican</option>
      </select>
      <button onClick={handleClear}>Clear Filters</button>
    </div>
  );
}
```

### Example 4: Map Component

```tsx
'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';

export function MapComponent() {
  const { trackMapInteraction, trackPlaceClick } = useAnalytics();

  const handleMarkerClick = (place: Place) => {
    trackMapInteraction('marker_click', place.name);
    trackPlaceClick(place.name, 'map');
    // Show place details...
  };

  const handleZoom = (direction: 'in' | 'out') => {
    trackMapInteraction(`zoom_${direction}`);
  };

  return (
    <div>
      {/* Your map implementation */}
    </div>
  );
}
```

### Example 5: Place Detail Page

```tsx
import { trackPlaceView, trackPlaceDirections, trackPlaceWebsite } from '@/lib/analytics';

export default function PlaceDetailPage({ params }: { params: { slug: string } }) {
  const place = await getPlace(params.slug);

  // Track page view (server-side)
  if (place) {
    trackPlaceView(place.name, place.id);
  }

  return (
    <div>
      <h1>{place.name}</h1>
      
      <button onClick={() => {
        trackPlaceDirections(place.name);
        window.open(`https://maps.google.com/?q=${place.address}`);
      }}>
        Get Directions
      </button>

      <a 
        href={place.website}
        target="_blank"
        onClick={() => trackPlaceWebsite(place.name)}
      >
        Visit Website
      </a>
    </div>
  );
}
```

### Example 6: Donation Form

```tsx
'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/useAnalytics';

export function DonationForm() {
  const [amount, setAmount] = useState(10);
  const { trackDonationStart, trackDonationComplete } = useAnalytics();

  useEffect(() => {
    trackDonationStart();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processDonation(amount);
      trackDonationComplete(amount);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button type="submit">Donate ${amount}</button>
    </form>
  );
}
```

## 📊 Viewing Your Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property (G-HTZMW82ZF1)
3. View real-time data in **Reports > Realtime**
4. View events in **Reports > Engagement > Events**
5. View page views in **Reports > Engagement > Pages and screens**

## 🎨 Event Categories

The following event categories are available:

- `engagement` - General user interactions (CTAs, outbound links, forms)
- `navigation` - Navigation between pages
- `search` - Search queries
- `place` - Place-related interactions
- `shop` - Product/shop interactions
- `donation` - Donation actions
- `auth` - Authentication events
- `filter` - Filter usage
- `map` - Map interactions
- `episode` - Episode interactions
- `share` - Social sharing

## 🔍 Best Practices

1. **Track User Intent** - Focus on meaningful actions that indicate user engagement
2. **Be Descriptive** - Use clear labels that explain what the user did
3. **Add Context** - Include source information (where the action originated)
4. **Track Conversions** - Monitor key actions like donations, sign-ups, place submissions
5. **Monitor Performance** - Use analytics to identify popular places, searches, and features

## 🛠️ Troubleshooting

### Events Not Showing Up?

1. Make sure you're viewing the correct property in Google Analytics
2. Check the browser console for errors
3. Verify the GA Measurement ID is correct (G-HTZMW82ZF1)
4. Events can take a few minutes to appear - check Real-time reports first

### Testing Locally

Events will be tracked even on localhost. You can:
1. Open your browser's developer tools
2. Go to the Network tab
3. Filter for "collect" or "gtag"
4. Trigger events and watch for the requests

## 🔐 Privacy Considerations

- Google Analytics respects user privacy settings and GDPR requirements
- Consider adding a cookie consent banner if required by your region
- The current setup tracks page views and custom events but not personal information
- User IP addresses are anonymized by default in GA4

## 📈 Recommended Goals to Set Up in GA

1. **Place View to Directions** - Track conversion rate from viewing to getting directions
2. **Search to Place Click** - Monitor search effectiveness
3. **Shop Page to Purchase** - Track product interest
4. **Donation Funnel** - Monitor donation completion rate
5. **Episode Engagement** - Track episode views and interactions

