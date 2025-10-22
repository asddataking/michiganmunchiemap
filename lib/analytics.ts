/**
 * Google Analytics event tracking utilities
 * Use these functions throughout the app to track user interactions
 */

// Type definitions for event tracking
export type EventCategory = 
  | 'engagement'
  | 'navigation'
  | 'search'
  | 'place'
  | 'shop'
  | 'donation'
  | 'auth'
  | 'filter'
  | 'map'
  | 'episode'
  | 'share';

export interface AnalyticsEvent {
  action: string;
  category: EventCategory;
  label?: string;
  value?: number;
}

/**
 * Main event tracking function
 */
export const trackEvent = ({ action, category, label, value }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track page views
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-HTZMW82ZF1', {
      page_path: url,
      page_title: title,
    });
  }
};

// Common event tracking functions

/**
 * Track search queries
 */
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent({
    action: 'search',
    category: 'search',
    label: searchTerm,
    value: resultsCount,
  });
};

/**
 * Track place interactions
 */
export const trackPlaceView = (placeName: string, placeId?: string) => {
  trackEvent({
    action: 'view_place',
    category: 'place',
    label: `${placeName}${placeId ? ` (${placeId})` : ''}`,
  });
};

export const trackPlaceClick = (placeName: string, source: string) => {
  trackEvent({
    action: 'click_place',
    category: 'place',
    label: `${placeName} from ${source}`,
  });
};

export const trackPlaceDirections = (placeName: string) => {
  trackEvent({
    action: 'get_directions',
    category: 'place',
    label: placeName,
  });
};

export const trackPlaceWebsite = (placeName: string) => {
  trackEvent({
    action: 'visit_website',
    category: 'place',
    label: placeName,
  });
};

export const trackPlaceCall = (placeName: string) => {
  trackEvent({
    action: 'call_place',
    category: 'place',
    label: placeName,
  });
};

/**
 * Track filter usage
 */
export const trackFilter = (filterType: string, filterValue: string) => {
  trackEvent({
    action: 'use_filter',
    category: 'filter',
    label: `${filterType}: ${filterValue}`,
  });
};

export const trackClearFilters = () => {
  trackEvent({
    action: 'clear_filters',
    category: 'filter',
  });
};

/**
 * Track map interactions
 */
export const trackMapInteraction = (action: string, details?: string) => {
  trackEvent({
    action: action,
    category: 'map',
    label: details,
  });
};

/**
 * Track shop interactions
 */
export const trackProductView = (productName: string, productId?: string) => {
  trackEvent({
    action: 'view_product',
    category: 'shop',
    label: `${productName}${productId ? ` (${productId})` : ''}`,
  });
};

export const trackProductClick = (productName: string, price?: number) => {
  trackEvent({
    action: 'click_product',
    category: 'shop',
    label: productName,
    value: price,
  });
};

/**
 * Track donation actions
 */
export const trackDonationStart = () => {
  trackEvent({
    action: 'start_donation',
    category: 'donation',
  });
};

export const trackDonationComplete = (amount: number) => {
  trackEvent({
    action: 'complete_donation',
    category: 'donation',
    value: amount,
  });
};

/**
 * Track authentication events
 */
export const trackLogin = (method: string) => {
  trackEvent({
    action: 'login',
    category: 'auth',
    label: method,
  });
};

export const trackSignup = (method: string) => {
  trackEvent({
    action: 'signup',
    category: 'auth',
    label: method,
  });
};

export const trackLogout = () => {
  trackEvent({
    action: 'logout',
    category: 'auth',
  });
};

/**
 * Track navigation events
 */
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent({
    action: 'navigate',
    category: 'navigation',
    label: `to ${destination}${source ? ` from ${source}` : ''}`,
  });
};

/**
 * Track episode interactions
 */
export const trackEpisodeView = (episodeName: string, episodeId?: string) => {
  trackEvent({
    action: 'view_episode',
    category: 'episode',
    label: `${episodeName}${episodeId ? ` (${episodeId})` : ''}`,
  });
};

export const trackEpisodeClick = (episodeName: string) => {
  trackEvent({
    action: 'click_episode',
    category: 'episode',
    label: episodeName,
  });
};

/**
 * Track social sharing
 */
export const trackShare = (platform: string, content: string) => {
  trackEvent({
    action: 'share',
    category: 'share',
    label: `${platform}: ${content}`,
  });
};

/**
 * Track outbound links
 */
export const trackOutboundLink = (url: string, label?: string) => {
  trackEvent({
    action: 'click_outbound',
    category: 'engagement',
    label: label || url,
  });
};

/**
 * Track CTA (Call to Action) clicks
 */
export const trackCTA = (ctaName: string, location?: string) => {
  trackEvent({
    action: 'click_cta',
    category: 'engagement',
    label: `${ctaName}${location ? ` on ${location}` : ''}`,
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'engagement',
    label: formName,
  });
};

/**
 * Track video plays (for embedded content)
 */
export const trackVideoPlay = (videoTitle: string) => {
  trackEvent({
    action: 'play_video',
    category: 'engagement',
    label: videoTitle,
  });
};

/**
 * Track errors (for monitoring)
 */
export const trackError = (errorType: string, errorMessage?: string) => {
  trackEvent({
    action: 'error',
    category: 'engagement',
    label: `${errorType}${errorMessage ? `: ${errorMessage}` : ''}`,
  });
};

